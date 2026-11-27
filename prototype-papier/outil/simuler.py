"""Simulateur d'Orbit : Studio, version 2.

Des équipes au profil réaliste (elles se trompent, tentent des choses, s'adaptent) jouent des milliers
de parties. Le simulateur mesure les scores, l'impact de la chance et la durée des cycles.
Les cartes sont lues dans docs/jeu/cartes-orbit-studio.md (via generer_kit).

    python prototype-papier/outil/simuler.py            # étude complète
    python prototype-papier/outil/simuler.py --rapide   # moins de parties
"""
import random, statistics as st, sys
from collections import Counter
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import generer_kit as K  # noqa: E402

FEATS = [dict(id=f["id"], blocs=f["blocs"], etoiles=f["etoiles"], must=f["prio"] == "Must",
              resp="P" if f["resp"] == "Prog" else "D") for f in K.feats]
FB = [dict(id=f["id"], type=f["type"], cible=f["cible"] if f["cible"].startswith("F") else None)
      for f in K.feedbacks]
# Cartes Test (GDD 0.21) : 12 OK, 2 Bug bloquants, 3 Bug mineurs, 3 Pas fun.
DECK0 = ["none"] * 12 + ["bugB"] * 2 + ["bugM"] * 3 + ["pasfun"] * 3
BUGS = ("bugB", "bugM")
RANG = {"none": 0, "pasfun": 1, "bugM": 2, "bugB": 3}

# ------------------------------------------------------------------ règles
REGLES = dict(
    cycles=5,             # cycles 0 à 4
    humain_max=1, humain_c0=2, pix_cap=3,
    humain_c4=2,          # GDD 0.21 : « le sprint final », 2 jetons Prod au dernier cycle
    feedback_prod=True,
    review_par_P=True,    # GDD 0.22 : la code review revient au programmeur (garant du code), pas au responsable
    heures=3,             # jetons (heures) par joueur et par cycle
    effort_humain=1,      # piste : heures pour un effort humain (2 = « produire prend 2 heures », sans jeton Prod)
    note_depart=3.0, note_min=1.0, note_max=5.0,
    fb_note=True,         # simplification : tout feedback traité rapporte de la note (au lieu d'étoiles)
    pasfun_moins1=True,   # simplification : un Pas fun publié coûte 1 étoile (au lieu de la moitié)
    file_simple=True,     # simplification : à la release, plus de 4 cartes non triées = −0,5 (sans âge)
    e1_si_gamers=True,    # logique : E1 n'apporte du feedback que si le jeu a des gamers
    idees_gamers=True,    # GDD 0.19 : 12 fonctionnalités au départ, 8 « idées de gamers » révélées par le feedback trié
)

# Les 8 idées de gamers : cachées au départ, elles apparaissent quand une carte Feedback qui les cite est triée.
IDEES_GAMERS = {f["id"] for f in K.feats if f.get("idee_gamer")}

# Durées (minutes) d'une action sur papier, pour des débutants : hypothèses à caler pendant la partie test.
DUREES = dict(vera=2, decouverte_c0=8, planif=4, tri=0.7, brief=1.0, bloc_pix=0.6, bloc_humain=0.3,
              scan=0.5, relecture=0.6, playtest=1.5, correction=0.5, release=2, par_fonct=0.5,
              par_defaut=0.5, comptage=2.5, pioche=0.3, retro=2, erreur=1.0)

# ------------------------------------------------------------------ profils d'équipes
PROFILS = {
    "Les fonceurs": dict(must=0.6, pix=0.95, detail=0.05, scan=0.1, relire=0.05, playtest=0.1, tri=0.4,
                         garder_bug=0.3, apprend=0.5, erreur=0.12, avidite=0.8,
                         desc="Tout à PIX, peu de vérification, apprennent un peu après un échec"),
    "Les élèves sérieux": dict(must=0.85, pix=0.7, detail=0.4, scan=0.6, relire=0.4, playtest=0.5, tri=0.9,
                               garder_bug=0.9, apprend=0.8, erreur=0.06, avidite=0.4,
                               desc="Font les choses bien, sans tout optimiser"),
    "Les perfectionnistes": dict(must=0.95, pix=0.5, detail=0.9, scan=0.9, relire=0.9, playtest=0.9, tri=1.0,
                                 garder_bug=1.0, apprend=0.2, erreur=0.04, avidite=0.2,
                                 desc="Vérifient tout, briefs détaillés, lents"),
    "Le chef de projet débordé": dict(must=0.8, pix=0.85, detail=0.15, scan=0.5, relire=0.2, playtest=0.3,
                                      tri=0.25, garder_bug=0.7, apprend=0.4, erreur=0.1, avidite=0.6,
                                      desc="Produit beaucoup, trie peu le feedback"),
    "Les artistes": dict(must=0.7, pix=0.6, detail=0.3, scan=0.3, relire=0.2, playtest=1.0, tri=0.7,
                         garder_bug=0.6, apprend=0.6, erreur=0.08, avidite=0.9,
                         desc="Visent les étoiles et le fun, playtestent tout, vérifient peu le code"),
    "L'équipe experte": dict(must=1.0, pix=0.8, detail=0.25, scan=0.85, relire=0.3, playtest=0.6, tri=1.0,
                             garder_bug=1.0, apprend=0.5, erreur=0.0, avidite=0.5,
                             desc="Joue bien : Must d'abord, PIX vérifié par SCAN, feedback trié"),
}


class Partie:
    def __init__(self, prof, rng, regles=REGLES):
        self.p, self.r, self.R = dict(prof), rng, regles
        self.f = {x["id"]: dict(x, blocks=[], rel=False, bonus=0, attente_note=0.0, travail=0,
                                visible=not (regles["idees_gamers"] and x["id"] in IDEES_GAMERS))
                  for x in FEATS}
        self.deck = DECK0[:]; rng.shuffle(self.deck); self.disc = []
        self.fbdeck = FB[:]; rng.shuffle(self.fbdeck)
        self.file, self.pix_file = [], []
        self.credits, self.note, self.pioches, self.maxj, self.bonus_e1 = 20, regles["note_depart"], 0, 0, 0
        self.t, self.mauvais, self.tires = [], 0, 0
        self.log = Counter()
        # les fonctionnalités que l'équipe croit être les Must au cycle 0
        self.cru_must = set()
        autres = [x["id"] for x in FEATS if not x["must"] and self.f[x["id"]]["visible"]]
        for x in FEATS:
            if x["must"]:
                self.cru_must.add(x["id"] if rng.random() < self.p["must"] else rng.choice(autres))

    def draw(self):
        if not self.deck:
            self.deck, self.disc = self.disc, []
            self.r.shuffle(self.deck)
        return self.deck.pop() if self.deck else "none"

    def defaut(self, detail):
        a = self.draw()
        if detail:
            b = self.draw()
            a, autre = (a, b) if RANG[a] <= RANG[b] else (b, a)
            self.deck.insert(0, autre)
        self.tires += 1; self.mauvais += a != "none"
        return a

    def done(self, f):
        return len(f["blocks"]) >= f["blocs"]

    def etoiles(self, f):
        if any(b["c"] == "bugB" for b in f["blocks"]):
            return 0
        s = f["etoiles"]
        if any(b["c"] == "pasfun" for b in f["blocks"]):
            s = s - 1 if self.R["pasfun_moins1"] else s // 2
        return s + f["bonus"]

    def jouable(self):
        return all(f["rel"] and not any(b["c"] == "bugB" for b in f["blocks"]) for f in self.f.values() if f["must"])

    def gamers(self):
        return 25 * sum(self.etoiles(f) for f in self.f.values() if f["rel"]) if self.jouable() else 0

    def ordre(self):
        fs = [f for f in self.f.values() if f["visible"] and not f["rel"] and not self.done(f)]
        jou = self.jouable()

        def cle(f):
            prio = 0 if (jou or f["id"] in self.cru_must) else 1
            valeur = f["etoiles"] / f["blocs"] * (1 + self.p["avidite"]) + self.r.random() * 0.8
            return (prio, -valeur)
        return sorted(fs, key=cle)

    def agit(self, pa, qui, n=1):
        """Dépense n PA ; parfois l'action est perdue (hésitation, erreur de règle)."""
        if pa[qui] < n:
            return False
        pa[qui] -= n
        if self.r.random() < self.p["erreur"]:
            self.temps += DUREES["erreur"]; self.log["erreurs"] += 1
            return False
        return True

    def corriger(self, pa, f):
        for b in f["blocks"]:
            if b["c"] != "none" and b["k"] and pa[f["resp"]] > 0:
                if self.agit(pa, f["resp"]):
                    self.disc.append(b["c"]); b["c"] = "none"
                    self.temps += DUREES["correction"]; self.log["corrections"] += 1

    def cycle(self, c):
        p, R, D = self.p, self.R, DUREES
        self.temps = D["vera"] + D["planif"] + (D["decouverte_c0"] if c == 0 else 0) + D["retro"]
        pa = {"CP": R["heures"], "D": R["heures"], "P": R["heures"]}
        pixcap = 4 if c == 2 else R["pix_cap"]
        hmax = R["humain_c0"] if c == 0 else (R["humain_c4"] if c == 4 else R["humain_max"])
        faits = {"D": 0, "P": 0}
        cout = 0 if c == 0 else 1
        # 1. tri du feedback
        while self.file and pa["CP"] > (1 if len(self.file) <= 2 else 0) and self.r.random() < p["tri"]:
            ok = self.agit(pa, "CP")
            for _ in range(2):
                if not self.file:
                    break
                carte = self.file.pop(0); self.temps += D["tri"]
                if not ok:
                    self.file.append(carte); continue
                f = self.f.get(carte["cible"]) if carte["cible"] else None
                if f and not f["visible"]:
                    # Une idée de gamer : la carte triée la fait entrer dans les idées de l'équipe.
                    f["visible"] = True; self.log["idees_revelees"] += 1
                if f and carte["type"] in ("Bug", "Idée", "Pas fun"):
                    if R["fb_note"]:
                        f["travail"] += 1 if f["rel"] else 0
                        f["attente_note"] += 0.5
                    elif carte["type"] == "Bug":
                        f["travail"] += 1; f["attente_note"] += 0.5
                    elif f["rel"]:
                        f["travail"] += 1; f["bonus_att"] = f.get("bonus_att", 0) + 1
                    else:
                        f["bonus"] += 1
                self.log["cartes_triees"] += 1
        # 2. corrections connues et travail demandé par les gamers
        for f in self.f.values():
            self.corriger(pa, f)
            while f["travail"] and pa[f["resp"]] >= R["effort_humain"] and (not R["feedback_prod"] or faits[f["resp"]] < hmax):
                faits[f["resp"]] += 1
                if self.agit(pa, f["resp"], R["effort_humain"]):
                    f["travail"] -= 1; self.temps += D["bloc_humain"]
                    if f.get("bonus_att"):
                        f["bonus"] += f["bonus_att"]; f["bonus_att"] = 0
        res = {"P": 1 if p["relire"] > 0.5 and c > 0 else 0, "D": 1 if p["playtest"] > 0.5 and c > 0 else 0}
        ordre = self.ordre()
        en_pix = {x["id"] for x in self.pix_file}
        # 3a. les humains produisent (1 bloc, 2 au cycle 0) sur leurs fonctionnalités
        for f in ordre:
            while (not self.done(f) and f["id"] not in en_pix and faits[f["resp"]] < hmax
                   and pa[f["resp"]] - res[f["resp"]] >= R["effort_humain"]):
                faits[f["resp"]] += 1
                if self.agit(pa, f["resp"], R["effort_humain"]):
                    f["blocks"].append(dict(by="H", c="none", k=True, s=True))
                    self.temps += D["bloc_humain"]; self.log["blocs_humains"] += 1
        # 3b. briefs pour PIX
        a_produire = sum(x["blocs"] - len(x["blocks"]) for x in self.pix_file)
        for f in ordre:
            if a_produire >= pixcap + 1:
                break
            vise_must = not self.jouable() and f["id"] in self.cru_must
            if f["id"] in en_pix or self.done(f) or (not vise_must and self.r.random() > p["pix"]):
                continue
            detail = c > 0 and self.r.random() < p["detail"]
            cb = 2 if detail else 1
            qui = "CP" if pa["CP"] >= cb else ("D" if pa["D"] - res["D"] >= cb else None)
            if not qui:
                break
            if self.agit(pa, qui, cb):
                f["detail"] = detail; self.pix_file.append(f); en_pix.add(f["id"])
                self.temps += D["brief"]; a_produire += f["blocs"] - len(f["blocks"]); self.log["briefs"] += 1
        # 3c. PIX produit (les blocs en trop attendent)
        prod = 0
        for f in list(self.pix_file):
            while not self.done(f) and prod < pixcap and self.credits >= cout:
                carte = "none" if c == 0 else self.defaut(f.get("detail"))
                f["blocks"].append(dict(by="PIX", c=carte, k=False, s=False))
                self.credits -= cout; prod += 1; self.temps += D["bloc_pix"]; self.log["blocs_pix"] += 1
            if self.done(f):
                self.pix_file.remove(f)
        # 4. vérification
        if c > 0:
            prets = [f for f in self.f.values() if not f["rel"] and self.done(f)]
            tests = 0
            for f in prets:
                for b in f["blocks"]:
                    if b["by"] == "PIX" and not b["s"] and tests < 4 and self.credits > 1 and self.r.random() < p["scan"]:
                        b["s"] = True; tests += 1; self.credits -= 1; self.temps += D["scan"]; self.log["tests_scan"] += 1
                        if b["c"] in BUGS:
                            b["k"] = True
            for f in prets:
                for b in f["blocks"]:
                    rev = "P" if R["review_par_P"] else f["resp"]
                    if b["by"] == "PIX" and not b["k"] and pa[rev] > 0 and self.r.random() < p["relire"]:
                        if self.agit(pa, rev):
                            b["k"] = True; self.temps += D["relecture"]; self.log["relectures"] += 1
            for f in prets:
                if pa["D"] > 0 and any(b["by"] == "PIX" and not b["k"] for b in f["blocks"]) and self.r.random() < p["playtest"]:
                    if self.agit(pa, "D"):
                        self.temps += D["playtest"]; self.log["playtests"] += 1
                        for b in f["blocks"]:
                            if b["c"] == "pasfun":
                                b["k"] = True
            for f in prets:
                self.corriger(pa, f)
        # 5. release
        sortis, reveles, bugs = 0, 0, 0
        for f in self.f.values():
            if f["rel"] or not self.done(f):
                continue
            if any(b["c"] in BUGS and b["k"] for b in f["blocks"]) and self.r.random() < p["garder_bug"]:
                continue
            f["rel"] = True; sortis += 1
            for b in f["blocks"]:
                if b["c"] != "none" and not b["k"]:
                    b["k"] = True; reveles += 1
                if b["c"] in BUGS:
                    bugs += 1
                    self.note -= 1.0 if c == 4 else 0.5
                    if c == 3 and f["must"]:
                        self.note -= 0.5
        self.temps += D["release"] + D["par_fonct"] * sortis + D["par_defaut"] * reveles + D["comptage"]
        self.log["bugs_publies"] += bugs
        for f in self.f.values():  # le feedback livré fait monter la note
            if f["rel"] and f["attente_note"] and not f["travail"]:
                self.note += f["attente_note"]; f["attente_note"] = 0
        restantes = len(self.file)
        if R["file_simple"] and restantes > 4:
            self.note -= 0.5; self.log["communaute_ignoree"] += 1
        self.note = max(R["note_min"], min(R["note_max"], self.note))
        j = self.gamers()
        if c == 0:
            self.log["jouable_c0"] += int(self.jouable())
        # l'équipe apprend de ses erreurs
        if j == 0 and self.r.random() < 0.85:
            self.cru_must = {x["id"] for x in FEATS if x["must"]}
        if bugs and self.r.random() < p["apprend"]:
            p["scan"] = min(1, p["scan"] + 0.3); p["garder_bug"] = 1
        if restantes > 4 and self.r.random() < p["apprend"]:
            p["tri"] = min(1, p["tri"] + 0.4)
        # feedback pour le cycle suivant (E1 : +2 cartes au cycle 1, si le jeu a des gamers)
        self.maxj = max(self.maxj, j)
        if c == 0 and (j > 0 or not R["e1_si_gamers"]):
            self.bonus_e1 = 2
        while self.pioches < self.maxj // 100 + self.bonus_e1 and self.fbdeck:
            self.file.append(self.fbdeck.pop()); self.pioches += 1; self.temps += D["pioche"]
        self.t.append(self.temps)
        return j

    def jouer(self):
        j = 0
        for c in range(self.R["cycles"]):
            j = self.cycle(c)
        return dict(score=round(j * self.note), gamers=j, note=self.note, credits=self.credits,
                    chance=(self.mauvais / self.tires) if self.tires else 0.0, temps=self.t, log=self.log)


def pct(v, q):
    v = sorted(v); return v[min(len(v) - 1, int(q * len(v)))]


def etude(n=3000, graine=1):
    out = {}
    for nom, prof in PROFILS.items():
        rng = random.Random(graine)
        res = [Partie(prof, rng).jouer() for _ in range(n)]
        sc = [r["score"] for r in res]
        out[nom] = dict(
            moyen=st.mean(sc), p10=pct(sc, .1), med=st.median(sc), p90=pct(sc, .9), mini=min(sc), maxi=max(sc),
            zero=sum(s == 0 for s in sc) / n, gamers=st.mean(r["gamers"] for r in res),
            note=st.mean(r["note"] for r in res), jouable_c0=sum(r["log"]["jouable_c0"] for r in res) / n,
            bugs=st.mean(r["log"]["bugs_publies"] for r in res), credits=st.mean(r["credits"] for r in res),
            temps=[st.mean(r["temps"][c] for r in res) for c in range(REGLES["cycles"])], res=res)
    return out


def chance(res):
    """Parties chanceuses / malchanceuses : part de cartes Défaut défavorables tirées (10 % extrêmes)."""
    res = sorted([r for r in res if r["log"]["blocs_pix"] > 3], key=lambda r: r["chance"])
    k = max(1, len(res) // 10)
    bon, mal = res[:k], res[-k:]
    return dict(taux_chanceux=st.mean(r["chance"] for r in bon), taux_malchanceux=st.mean(r["chance"] for r in mal),
                score_chanceux=st.mean(r["score"] for r in bon), score_malchanceux=st.mean(r["score"] for r in mal),
                score_moyen=st.mean(r["score"] for r in res))


def temps_classe(n_equipes=6, n=500, graine=7):
    """Une classe mélange les profils ; l'animateur attend l'équipe la plus lente à chaque cycle."""
    rng = random.Random(graine)
    noms = list(PROFILS)
    totaux, par_cycle = [], [[] for _ in range(REGLES["cycles"])]
    for _ in range(n):
        eq = [Partie(PROFILS[rng.choice(noms)], rng).jouer() for _ in range(n_equipes)]
        tc = [max(e["temps"][c] for e in eq) for c in range(REGLES["cycles"])]
        for c, v in enumerate(tc):
            par_cycle[c].append(v)
        totaux.append(sum(tc))
    return dict(par_cycle=[st.mean(v) for v in par_cycle], total=st.mean(totaux), p90=pct(totaux, .9))


def meilleur_score(n=20000, graine=3):
    """Cherche le meilleur score atteignable : beaucoup de stratégies tirées au hasard, sans erreur."""
    rng = random.Random(graine)
    best = 0
    for _ in range(n):
        prof = dict(must=1, pix=rng.random(), detail=rng.random() * .6, scan=rng.random(), relire=rng.random(),
                    playtest=rng.random(), tri=1, garder_bug=1, apprend=1, erreur=0, avidite=rng.random())
        best = max(best, Partie(prof, rng).jouer()["score"])
    return best


if __name__ == "__main__":
    rapide = "--rapide" in sys.argv
    etu = etude(600 if rapide else 3000)
    print("| Profil | Score moyen | 10 % pires | Médiane | 10 % meilleurs | Min | Max | Parties à 0 | Gamers | Note | Jouable au cycle 0 | Bugs publiés | Crédits restants |")
    print("|---|---|---|---|---|---|---|---|---|---|---|---|---|")
    for nom, e in etu.items():
        print(f"| {nom} | {e['moyen']:.0f} | {e['p10']} | {e['med']:.0f} | {e['p90']} | {e['mini']} | {e['maxi']} | "
              f"{100 * e['zero']:.0f} % | {e['gamers']:.0f} | {e['note']:.2f} | {100 * e['jouable_c0']:.0f} % | {e['bugs']:.1f} | {e['credits']:.1f} |")
    print("\nCHANCE")
    for nom in PROFILS:
        print(nom, {k: round(v, 2) for k, v in chance(etu[nom]["res"]).items()})
    print("\nTEMPS par cycle (min)")
    for nom, e in etu.items():
        print(nom, [round(x, 1) for x in e["temps"]], "total", round(sum(e["temps"]), 1))
    tc = temps_classe(n=150 if rapide else 500)
    print("CLASSE de 6 équipes (on attend la plus lente):", [round(x, 1) for x in tc["par_cycle"]],
          "total", round(tc["total"], 1), "p90", round(tc["p90"], 1))
    print("\nMEILLEUR score trouvé:", meilleur_score(3000 if rapide else 20000),
          "| plafond théorique:", 25 * sum(f["etoiles"] for f in FEATS) * REGLES["note_max"])
