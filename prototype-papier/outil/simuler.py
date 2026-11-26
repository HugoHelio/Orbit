"""Simulateur d'équilibrage d'Orbit : Studio (règles de base + décisions du 26 nov. 2026).

Joue des milliers de parties avec plusieurs stratégies et compare les scores.
Les cartes sont lues dans docs/jeu/cartes-orbit-studio.md (via generer_kit).

    python prototype-papier/outil/simuler.py [nombre_de_parties]
"""
import random, statistics, sys
from collections import Counter
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import generer_kit as K  # noqa: E402  (lecture des cartes uniquement)

FEATS = [dict(id=f["id"], blocs=f["blocs"], etoiles=f["etoiles"], must=f["prio"] == "Must",
              resp="P" if f["resp"] == "Prog" else "D") for f in K.feats]
FB = [dict(id=f["id"], qui=f["qui"], type=f["type"], cible=f["cible"] if f["cible"].startswith("F") else None)
      for f in K.feedbacks]
DECK0 = ["none"] * 12 + ["bug"] * 5 + ["pasfun"] * 3
RANG = {"none": 0, "pasfun": 1, "bug": 2}  # plus petit = meilleur

# Règles en vigueur (variante R7, adoptée le 26 nov. 2026)
REGLES = dict(bonus_propre=False, tailles={1: 1, 2: 2, 3: 3}, cout_humain=1, max_humain=1, pix_c0=5, note_min=1)

STRATS = {
    "A · Étoiles d'abord, tout à PIX, sans vérifier": dict(prio="stars", detail=False, scan=False, review=False, playtest=False, sort=False, hold=False),
    "B · Must d'abord, tout à PIX, sans vérifier":    dict(prio="must", detail=False, scan=False, review=False, playtest=False, sort=False, hold=False),
    "C · Must d'abord, équilibré (SCAN + tri)":       dict(prio="must", detail=False, scan=True, review=False, playtest=True, sort=True, hold=True),
    "D · Must d'abord, prudent (briefs détaillés, relecture, SCAN, tri)": dict(prio="must", detail=True, scan=True, review=True, playtest=True, sort=True, hold=True),
    "E · Étoiles d'abord, équilibré (SCAN + tri)":    dict(prio="stars", detail=False, scan=True, review=False, playtest=True, sort=True, hold=True),
    "F · Must d'abord, sans vérifier, mais tri du feedback": dict(prio="must", detail=False, scan=False, review=False, playtest=False, sort=True, hold=False),
}


class Partie:
    def __init__(self, st, rng):
        self.st, self.r = st, rng
        self.f = {x["id"]: dict(x, blocs=REGLES["tailles"][x["blocs"]], blocks=[], rel=False, bonus=0, pend_bonus=0, improve=0, fixtask=0) for x in FEATS}
        self.deck = DECK0[:]; rng.shuffle(self.deck); self.disc = []
        self.fbdeck = FB[:]; rng.shuffle(self.fbdeck)
        self.queue = []  # [carte, âge]
        self.credits, self.note, self.drawn, self.maxj = 20, 3.0, 0, 0
        self.log = Counter()

    # -- cartes Défaut
    def draw(self):
        if not self.deck:
            self.deck, self.disc = self.disc, []
            self.r.shuffle(self.deck)
        return self.deck.pop() if self.deck else "none"

    def defect(self, detail):
        a = self.draw()
        if not detail:
            return a
        b = self.draw()
        best, other = (a, b) if RANG[a] <= RANG[b] else (b, a)
        self.deck.insert(0, other)
        return best

    def done(self, f):
        return len(f["blocks"]) >= f["blocs"]

    def known(self, f, kind):
        return any(b["card"] == kind and b["known"] for b in f["blocks"])

    def eff_stars(self, f):
        if any(b["card"] == "bug" for b in f["blocks"]):
            return 0
        s = f["etoiles"] // 2 if any(b["card"] == "pasfun" for b in f["blocks"]) else f["etoiles"]
        return s + f["bonus"]

    def jouable(self):
        return all(f["rel"] and not any(b["card"] == "bug" for b in f["blocks"]) for f in self.f.values() if f["must"])

    def joueurs(self):
        if not self.jouable():
            return 0
        return 25 * sum(self.eff_stars(f) for f in self.f.values() if f["rel"])

    def order(self):
        fs = [f for f in self.f.values() if not f["rel"] and not self.done(f)]
        if self.st["prio"] == "must":
            return sorted(fs, key=lambda f: (not f["must"], -f["etoiles"] / f["blocs"], f["blocs"]))
        return sorted(fs, key=lambda f: (-f["etoiles"], f["blocs"]))

    def fix(self, pa, f):
        for b in f["blocks"]:
            if b["card"] in ("bug", "pasfun") and b["known"] and pa[f["resp"]] > 0:
                pa[f["resp"]] -= 1
                self.disc.append(b["card"]); b["card"] = "none"; b["known"] = True
                self.log["corrections"] += 1

    def cycle(self, c):
        st, pa = self.st, {"CP": 3, "D": 3, "P": 3}
        pixcap = REGLES["pix_c0"] if c == 0 else (4 if c == 2 else 3)
        cost = 0 if c == 0 else 1
        cycles_left = max(1, 5 - c)
        # 1. tri du feedback
        if st["sort"] and self.queue:
            n_pa = 1 if len(self.queue) <= 2 else 2
            for _ in range(n_pa):
                for _ in range(2):
                    if not self.queue:
                        break
                    card, _age = self.queue.pop(0)
                    f = self.f.get(card["cible"]) if card["cible"] else None
                    if card["type"] == "Bug" and f:
                        f["fixtask"] += 1
                    elif card["type"] in ("Idée", "Pas fun") and f:
                        gain = 2 if card["qui"] == "Nova" else 1
                        if f["rel"]:
                            f["improve"] += 1; f["pend_bonus"] += gain
                        else:
                            f["bonus"] += gain
                    self.log["tri"] += 1
                pa["CP"] -= 1
        # 2. corrections connues et tâches issues du feedback
        for f in self.f.values():
            self.fix(pa, f)
            while f["fixtask"] and pa[f["resp"]] > 0:
                pa[f["resp"]] -= 1; f["fixtask"] -= 1; f.setdefault("fixdone", 0); f["fixdone"] = f.get("fixdone", 0) + 1
            while f["improve"] and pa[f["resp"]] > 0:
                pa[f["resp"]] -= 1; f["improve"] -= 1; f["bonus"] += f["pend_bonus"]; f["pend_bonus"] = 0
        # réserve de PA pour la vérification
        reserve = {"P": 1 if st["review"] and c > 0 else 0, "D": 1 if st["playtest"] and c > 0 else 0}
        budget = self.credits if (c == 0 or not st["scan"]) else max(0, self.credits // cycles_left - (2 if st["scan"] else 0))
        # 3a. si les humains sont limités, ils produisent d'abord
        faits = {"D": 0, "P": 0}
        if REGLES["max_humain"] < 9:
            for f in self.order():
                ch = REGLES["cout_humain"]
                while (not self.done(f) and faits[f["resp"]] < REGLES["max_humain"]
                       and pa[f["resp"]] - reserve[f["resp"]] >= ch):
                    pa[f["resp"]] -= ch; faits[f["resp"]] += 1
                    f["blocks"].append(dict(by="H", card="none", known=True, scanned=True))
                    self.log["blocs_humains"] += 1
        # 3. PIX
        pix = 0
        for f in self.order():
            if pix >= pixcap:
                break
            rest = f["blocs"] - len(f["blocks"])
            bcost = 2 if (st["detail"] and c > 0) else 1
            writer = "CP" if pa["CP"] >= bcost else ("D" if pa["D"] - reserve["D"] >= bcost else None)
            if not writer:
                break
            k = min(rest, pixcap - pix)
            if c > 0:
                k = min(k, self.credits if not st["scan"] else budget)
            if k <= 0:
                break
            pa[writer] -= bcost
            for _ in range(k):
                card = "none" if c == 0 else self.defect(st["detail"])
                f["blocks"].append(dict(by="PIX", card=card, known=False, scanned=False))
                self.credits -= cost; budget -= cost; pix += 1
                self.log["blocs_pix"] += 1
        # 4. les humains produisent
        for f in self.order():
            ch = REGLES["cout_humain"]
            while (not self.done(f) and pa[f["resp"]] - reserve[f["resp"]] >= ch
                   and faits[f["resp"]] < REGLES["max_humain"]):
                pa[f["resp"]] -= ch; faits[f["resp"]] += 1
                f["blocks"].append(dict(by="H", card="none", known=True, scanned=True))
                self.log["blocs_humains"] += 1
        # 5. vérification
        if c > 0:
            ready = [f for f in self.f.values() if not f["rel"] and self.done(f)]
            ready.sort(key=lambda f: not f["must"])
            if st["scan"]:
                tests = 0
                for f in ready:
                    for b in f["blocks"]:
                        if b["by"] == "PIX" and not b["scanned"] and tests < 4 and self.credits > 0:
                            b["scanned"] = True; tests += 1; self.credits -= 1; self.log["tests_scan"] += 1
                            if b["card"] == "bug":
                                b["known"] = True
            if st["review"]:
                for f in ready:
                    for b in f["blocks"]:
                        if b["by"] == "PIX" and not b["known"] and pa[f["resp"]] > 0:
                            pa[f["resp"]] -= 1; b["known"] = True; self.log["relectures"] += 1
            if st["playtest"]:
                for f in ready:
                    if pa["D"] > 0 and any(b["by"] == "PIX" and not b["known"] for b in f["blocks"]):
                        pa["D"] -= 1; self.log["playtests"] += 1
                        for b in f["blocks"]:
                            if b["card"] == "pasfun":
                                b["known"] = True
            for f in ready:
                self.fix(pa, f)
        # 6. release
        released_now, revealed = 0, 0
        bugs_pub = 0
        for f in self.f.values():
            if f["rel"] or not self.done(f):
                continue
            if st["hold"] and self.known(f, "bug"):
                continue
            f["rel"] = True; released_now += 1
            for b in f["blocks"]:
                if b["card"] in ("bug", "pasfun") and not b["known"]:
                    b["known"] = True; revealed += 1
                if b["card"] == "bug":
                    bugs_pub += 1
                    self.note -= 1.0 if c == 4 else 0.5
                    if c == 3 and f["must"]:
                        self.note -= 0.5
        self.log["bugs_publies"] += bugs_pub
        for f in self.f.values():
            if f["rel"] and f.get("fixdone"):
                self.note += 0.5 * f["fixdone"]; f["fixdone"] = 0
        if REGLES["bonus_propre"] and c > 0 and released_now and not revealed:
            self.note += 0.5
        old = sum(2 if q[0]["qui"] == "Nova" else 1 for q in self.queue if q[1] >= 1)
        if old > 4:
            self.note -= 0.5; self.log["communaute_ignoree"] += 1
        self.note = max(REGLES["note_min"], min(5.0, self.note))
        j = self.joueurs()
        self.maxj = max(self.maxj, j)
        if c == 0:
            self.log["jouable_c0"] += int(self.jouable())
        # feedback pour le cycle suivant
        for q in self.queue:
            q[1] += 1
        target = self.maxj // 100 + 2  # E1 (cycle 1) : 2 cartes de plus
        while self.drawn < target and self.fbdeck:
            self.queue.append([self.fbdeck.pop(), 0]); self.drawn += 1
        self.log["file_max"] = max(self.log["file_max"], len(self.queue))
        return j

    def jouer(self):
        for c in range(5):
            j = self.cycle(c)
        self.log["credits_restants"] = self.credits
        self.log["jouable_fin"] = int(self.jouable())
        return round(j * self.note), j, self.note


def simuler(n=2000, graine=2026):
    res = {}
    for nom, st in STRATS.items():
        rng = random.Random(graine)
        scores, js, notes, logs = [], [], [], Counter()
        for _ in range(n):
            p = Partie(st, rng)
            s, j, no = p.jouer()
            scores.append(s); js.append(j); notes.append(no); logs.update(p.log)
        res[nom] = dict(scores=scores, joueurs=js, notes=notes, log={k: v / n for k, v in logs.items()})
    return res


def rapport(res):
    lignes = ["| Stratégie | Score moyen | Médiane | 10 % pires | Joueurs | Note | Bugs publiés | Crédits restants | Jouable au cycle 0 | Blocs humains / PIX |",
              "|---|---|---|---|---|---|---|---|---|---|"]
    for nom, r in res.items():
        s = sorted(r["scores"])
        lignes.append(f"| {nom} | {statistics.mean(s):.0f} | {statistics.median(s):.0f} | {s[len(s) // 10]:.0f} | "
                      f"{statistics.mean(r['joueurs']):.0f} | {statistics.mean(r['notes']):.2f} | {r['log'].get('bugs_publies', 0):.1f} | "
                      f"{r['log'].get('credits_restants', 0):.1f} | {100 * r['log'].get('jouable_c0', 0):.0f} % | {r['log'].get('blocs_humains', 0):.0f} / {r['log'].get('blocs_pix', 0):.0f} |")
    return "\n".join(lignes)


VARIANTES = {
    "R0 · règles actuelles": dict(bonus_propre=True, tailles={1: 1, 2: 2, 3: 3}, cout_humain=1, max_humain=9, pix_c0=3, note_min=0),
    "R1 · sans le bonus « release sans défaut »": dict(bonus_propre=False, tailles={1: 1, 2: 2, 3: 3}, cout_humain=1, max_humain=9, pix_c0=3, note_min=0),
    "R5 · R1 + un humain produit 1 bloc max par cycle ; PIX jusqu'à 5 blocs au cycle 0": dict(bonus_propre=False, tailles={1: 1, 2: 2, 3: 3}, cout_humain=1, max_humain=1, pix_c0=5, note_min=0),
    "R6 · R5 avec le bonus « release sans défaut »": dict(bonus_propre=True, tailles={1: 1, 2: 2, 3: 3}, cout_humain=1, max_humain=1, pix_c0=5, note_min=0),
    "R7 · R5 + la note ne descend pas sous 1 (règles adoptées)": dict(bonus_propre=False, tailles={1: 1, 2: 2, 3: 3}, cout_humain=1, max_humain=1, pix_c0=5, note_min=1),
}

if __name__ == "__main__":
    n = int(sys.argv[1]) if len(sys.argv) > 1 else 2000
    for nv, v in VARIANTES.items():
        REGLES.update(v)
        res = simuler(n)
        print("\n### " + nv + "\n")
        print(rapport(res))
        if "-v" in sys.argv:
            for nom, r in res.items():
                print(nom, {k: round(v, 2) for k, v in sorted(r["log"].items())})
