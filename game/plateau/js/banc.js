// Le banc d'essai de l'étape 2 : un bouton par brique animée.
// Les « actions » enchaînent les briques comme le fera le script de la démo à l'étape 3
// (par exemple : une heure s'envole vers Build, puis un effort se remplit).
// Elles tiennent à jour l'état de la démo et le tableau de bord ; les briques, elles, ne font que dessiner.

(function () {
  let S, t, etat, occupe = false, panneau = null, prochainRole = 0;

  function ordre() { return S.stations.map((s) => s.id); }
  function majHeures() { TableauDeBord.afficherHeures(Plateau.heuresUtilisees()); }
  function majTokens() { TableauDeBord.afficherTokens(etat.tokensRestants); }

  // --- Les actions (réutilisées par le script de l'étape 3) --------------------

  const Actions = {
    // Un jeton Heure de ce rôle vole vers la station (par défaut : la station active).
    async heure(role, stationId) {
      const st = stationId || Plateau.stationActive() || "build";
      const ok = await Anim.envolerHeure(role, st);
      if (!ok) Pioches.avis(t("avis.heures.role").replace("{role}", t("role." + role)));
      majHeures();
      return ok;
    },

    async rappelerHeures() {
      await Anim.rappelerHeures();
      majHeures();
    },

    // La station suivante s'allume (ou celle qu'on donne).
    async station(id) {
      const o = ordre(), avant = Plateau.stationActive();
      const vers = id || (avant ? o[(o.indexOf(avant) + 1) % o.length] : o[0]);
      etat.stationActive = vers;
      await Anim.allumerStation(vers);
    },

    async vaisseau(f, vers) {
      return Anim.voyagerVaisseau(f, vers);
    },

    // Le responsable du ticket passe 1 heure sur Build : son jeton vole, puis un effort se remplit (ambre).
    async effortHumain(f) {
      const role = S.fonctionnalites[f].resp;
      const v = Plateau.ticket(f);
      if (!(await Actions.heure(role, v.station))) return false;
      return Anim.remplirEffort(f, "humain");
    },

    // SCAN teste un effort de PIX (1 token). Il trouve les Bug, jamais les Pas fun,
    // qui restent cachés jusqu'à la Release.
    async scanner(f, idCarte) {
      if (etat.tokensRestants <= 0) { Pioches.avis(t("avis.tokens.vides")); return false; }
      const v = Plateau.ticket(f);
      const carte = v.cartesTest.find((c) => (idCarte ? c.id === idCarte : !c.revelee && !c.testee));
      if (!carte) return false;
      const arreter = Anim.travailler("scan", f);
      Plateau.afficherBulle("scan", false);
      await Anim.pause(1500);
      arreter();
      etat.tokensRestants--;
      majTokens();
      carte.testee = true;
      const def = S.cartes.test.find((c) => c.id === carte.id);
      if (def.type === "pasfun") {
        // SCAN ne voit pas l'ennui : la carte reste cachée.
        Plateau.afficherBulle("scan", true);
      } else {
        await Pioches.reveler(carte.id);
        Plateau.afficherBulle("scan", true, def.type === "bug" ? "agent.scan.bug" : "agent.scan.bulle");
      }
      Plateau.activerAgent("scan", true);
      return true;
    },

    file(id, n) {
      etat.files[id] = Math.max(0, n);
      Anim.changerFile(id, etat.files[id]);
    }
  };

  // --- Les boutons du banc ------------------------------------------------------

  // Les choix faits par le banc (le script, lui, dira exactement quoi faire).
  const BOUTONS = [
    { groupe: "heures", cle: "banc.heure", faire: async () => {
      // Le prochain rôle qui a encore une heure, à tour de rôle.
      const u = Plateau.heuresUtilisees();
      for (let k = 0; k < S.roles.length; k++) {
        const role = S.roles[(prochainRole + k) % S.roles.length];
        if ((u[role] || 0) < S.heuresParRole) {
          prochainRole = (S.roles.indexOf(role) + 1) % S.roles.length;
          return Actions.heure(role);
        }
      }
      Pioches.avis(t("avis.heures.vides"));
    } },
    { groupe: "heures", cle: "banc.rappel", faire: () => Actions.rappelerHeures() },

    { groupe: "flux", cle: "banc.station", faire: () => Actions.station() },
    { groupe: "flux", cle: "banc.vaisseau", faire: () => {
      // Le ticket le moins avancé qui n'est pas encore à Release.
      const o = ordre(), fin = o.indexOf("release");
      const candidats = o.slice(0, fin).flatMap((st) => Plateau.ticketsA(st));
      if (!candidats.length) return Pioches.avis(t("avis.vaisseau.aucun"));
      return Actions.vaisseau(candidats[0].f);
    } },

    { groupe: "travail", cle: "banc.effort", faire: () => {
      const v = Plateau.ticketsA("build").find((x) => (x.efforts || []).length < S.fonctionnalites[x.f].efforts);
      if (!v) return Pioches.avis(t("avis.build.plein"));
      return Actions.effortHumain(v.f);
    } },
    { groupe: "travail", cle: "banc.pix", faire: () => Pioches.piocher("test") },
    { groupe: "travail", cle: "banc.scan", faire: () => {
      const v = Plateau.ticketsA("test").find((x) => (x.cartesTest || []).some((c) => !c.revelee && !c.testee));
      if (!v) return Pioches.avis(t("avis.test.rien"));
      return Actions.scanner(v.f);
    } },

    { groupe: "files", cle: "banc.file.prompt-build", faire: () => Actions.file("prompt-build", Plateau.niveauFile("prompt-build") + 1) },
    { groupe: "files", cle: "banc.file.build-test", faire: () => Actions.file("build-test", Plateau.niveauFile("build-test") + 1) },
    { groupe: "files", cle: "banc.file.feedback", faire: () => Pioches.piocher("feedback") },
    { groupe: "files", cle: "banc.files.vider", faire: () => { Actions.file("prompt-build", 0); Actions.file("build-test", 0); } },

    { groupe: "plateau", cle: "banc.vitrine", faire: () => window.Demo && Demo.redessiner() }
  ];

  async function lancer(bouton) {
    if (occupe) return;
    occupe = true;
    panneau.classList.add("occupe");
    try {
      await bouton.faire();
    } finally {
      occupe = false;
      if (panneau) panneau.classList.remove("occupe");
    }
  }

  function h(tag, classe, texte, parent) {
    const e = document.createElement(tag);
    if (classe) e.className = classe;
    if (texte !== undefined) e.textContent = texte;
    if (parent) parent.appendChild(e);
    return e;
  }

  const MEMOIRE = "helioso-orbit-banc";

  function init(options) {
    S = options.scenario;
    t = options.traduire;
    etat = options.etat;
    occupe = false;
    if (panneau) panneau.remove();

    panneau = h("section", "banc");
    if (localStorage.getItem(MEMOIRE) === "ferme") panneau.classList.add("ferme");
    const entete = h("button", "banc-entete", undefined, panneau);
    h("span", "", t("banc.titre"), entete);
    h("span", "banc-chevron", "▾", entete);
    entete.addEventListener("click", () => {
      panneau.classList.toggle("ferme");
      localStorage.setItem(MEMOIRE, panneau.classList.contains("ferme") ? "ferme" : "ouvert");
    });

    entete.title = t("banc.aide");
    // Un bloc compact, deux boutons par ligne : le banc ne doit pas cacher les zones du plateau.
    const corps = h("div", "banc-corps", undefined, panneau);
    BOUTONS.forEach((b) => {
      const bouton = h("button", "banc-bouton banc-" + b.groupe, t(b.cle), corps);
      bouton.title = t("banc.groupe." + b.groupe);
      bouton.addEventListener("click", () => lancer(b));
    });

    // Sous la couche des cartes qui volent : une grande carte passe par-dessus le banc.
    const cadre = options.cadre;
    cadre.insertBefore(panneau, cadre.querySelector(".couche-cartes"));
  }

  window.Actions = Actions;
  window.Banc = { init };
})();
