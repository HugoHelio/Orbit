// Le banc d'essai de l'étape 2 : un bouton par brique animée.
// On choisit d'abord une fonctionnalité en cliquant sur son ticket dans le couloir ;
// les boutons « avance », « effort », « PIX » et « SCAN » agissent sur elle.
// Les « actions » enchaînent les briques comme le fera le script de la démo à l'étape 3
// (par exemple : une heure s'envole vers Build, puis un effort se remplit).
// Elles tiennent à jour l'état de la démo et le tableau de bord ; les briques, elles, ne font que dessiner.

(function () {
  let S, t, etat, occupe = false, verrou = false, panneau = null, ligneChoix = null, prochainRole = 0;

  function ordre() { return S.stations.map((s) => s.id); }
  function majHeures() { TableauDeBord.afficherHeures(Plateau.heuresUtilisees()); }
  function majTokens() { TableauDeBord.afficherTokens(etat.tokensRestants); }
  function avis(cle, f) { Pioches.avis(t(cle).replace("{f}", f || "")); }
  function libre(f) { return (Plateau.ticket(f).efforts || []).length < S.fonctionnalites[f].efforts; }

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

    // La fonctionnalité passe à la station suivante (ou à celle qu'on donne).
    async avancer(f, vers) {
      return Anim.avancerTicket(f, vers);
    },

    // Le responsable du ticket passe 1 heure sur Build : son jeton vole, puis un effort se remplit (ambre).
    async effortHumain(f) {
      const role = S.fonctionnalites[f].resp;
      if (!(await Actions.heure(role, "build"))) return false;
      return Anim.remplirEffort(f, "humain");
    },

    // PIX fait 1 effort (1 token) : une carte Test est tirée et se glisse dessous, face cachée.
    async effortPix(f, idCarte) {
      return Pioches.piocher("test", idCarte, f);
    },

    // Au cycle 0, PIX travaille sans carte Test ni token.
    async effortPixSansCarte(f) {
      Plateau.activerAgent("pix", true);
      Plateau.afficherBulle("pix", false);
      const arreter = Anim.travailler("pix", f);
      await Anim.pause(900);
      Anim.remplirEffort(f, "pix");
      arreter();
      Plateau.afficherBulle("pix", true);
      return true;
    },

    // Le responsable corrige un problème trouvé (1 heure, sur la station Test) : la carte Test est défaussée.
    async corriger(f, idCarte) {
      const role = S.fonctionnalites[f].resp;
      if (!(await Actions.heure(role, Plateau.ticket(f).station))) return false;
      Plateau.majTicket(f, (v) => { v.cartesTest = (v.cartesTest || []).filter((c) => c.id !== idCarte); });
      const e = Plateau.elementTicket(f);
      if (e) { e.classList.remove("complet"); void e.getBoundingClientRect(); e.classList.add("complet"); }
      Plateau.afficherBulle("pix", false);
      return true;
    },

    // SCAN teste un effort de PIX (1 token). Il trouve les Bug, jamais les Pas fun,
    // qui restent cachés jusqu'à la Release.
    async scanner(f, idCarte) {
      if (etat.tokensRestants <= 0) { avis("avis.tokens.vides"); return false; }
      const v = Plateau.ticket(f);
      const carte = (v.cartesTest || []).find((c) => (idCarte ? c.id === idCarte : !c.revelee && !c.testee));
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
        avis("avis.scan.pasfun", f);
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

  // La fonctionnalité choisie (clic sur son ticket), ou un avis qui dit quoi faire.
  function choisie() {
    const f = Plateau.choisi();
    if (!f || !Plateau.ticket(f)) { avis("avis.choisir"); return null; }
    return f;
  }

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
      avis("avis.heures.vides");
    } },
    { groupe: "heures", cle: "banc.rappel", faire: () => Actions.rappelerHeures() },

    { groupe: "flux", cle: "banc.station", faire: () => Actions.station() },
    { groupe: "flux", cle: "banc.avancer", faire: () => {
      const f = choisie();
      if (!f) return;
      if (Plateau.ticket(f).station === "release") return avis("avis.release", f);
      return Actions.avancer(f);
    } },

    { groupe: "travail", cle: "banc.effort", faire: () => {
      const f = choisie();
      if (!f) return;
      if (Plateau.ticket(f).station !== "build") return avis("avis.pas.build", f);
      if (!libre(f)) return avis("avis.complete", f);
      return Actions.effortHumain(f);
    } },
    { groupe: "travail", cle: "banc.pix", faire: () => {
      const f = choisie();
      if (!f) return;
      if (Plateau.ticket(f).station !== "build") return avis("avis.pas.build", f);
      if (!libre(f)) return avis("avis.complete", f);
      return Actions.effortPix(f);
    } },
    { groupe: "travail", cle: "banc.scan", faire: () => {
      const f = choisie();
      if (!f) return;
      const v = Plateau.ticket(f);
      if (v.station !== "test") return avis("avis.pas.test", f);
      if (!(v.cartesTest || []).length) return avis("avis.sans.carte", f);
      if (!v.cartesTest.some((c) => !c.revelee && !c.testee)) return avis("avis.deja.teste", f);
      return Actions.scanner(f);
    } },

    { groupe: "files", cle: "banc.file.prompt-build", faire: () => Actions.file("prompt-build", Plateau.niveauFile("prompt-build") + 1) },
    { groupe: "files", cle: "banc.file.build-test", faire: () => Actions.file("build-test", Plateau.niveauFile("build-test") + 1) },
    { groupe: "files", cle: "banc.file.feedback", faire: () => Pioches.piocher("feedback") },
    { groupe: "files", cle: "banc.files.vider", faire: () => { Actions.file("prompt-build", 0); Actions.file("build-test", 0); } },

    { groupe: "plateau", cle: "banc.vitrine", faire: () => window.Demo && Demo.redessiner() }
  ];

  // Pendant la lecture de la démo, le banc attend.
  function verrouiller(oui) {
    verrou = oui;
    if (panneau) panneau.classList.toggle("verrouille", oui);
  }

  async function lancer(bouton) {
    if (occupe || verrou) return;
    occupe = true;
    panneau.classList.add("occupe");
    try {
      await bouton.faire();
    } finally {
      occupe = false;
      if (panneau) panneau.classList.remove("occupe");
      majChoix();
    }
  }

  // La ligne du haut : quelle fonctionnalité est choisie, et où elle est.
  function majChoix() {
    if (!ligneChoix) return;
    const f = Plateau.choisi();
    const v = f && Plateau.ticket(f);
    ligneChoix.classList.toggle("vide", !v);
    ligneChoix.textContent = v
      ? t("banc.choix").replace("{f}", f).replace("{nom}", t("f." + f)).replace("{station}", t("station." + v.station))
      : t("banc.choix.aucune");
  }

  function h(tag, classe, texte, parent) {
    const e = document.createElement(tag);
    if (classe) e.className = classe;
    if (texte !== undefined) e.textContent = texte;
    if (parent) parent.appendChild(e);
    return e;
  }

  const MEMOIRE = "helioso-orbit-banc";
  let ecoute = false;

  function init(options) {
    S = options.scenario;
    t = options.traduire;
    etat = options.etat;
    occupe = false;
    verrou = false;
    if (panneau) panneau.remove();

    panneau = h("section", "banc");
    if (localStorage.getItem(MEMOIRE) === "ferme") panneau.classList.add("ferme");
    const entete = h("button", "banc-entete", undefined, panneau);
    h("span", "", t("banc.titre"), entete);
    h("span", "banc-chevron", "▾", entete);
    entete.title = t("banc.aide");
    entete.addEventListener("click", () => {
      panneau.classList.toggle("ferme");
      localStorage.setItem(MEMOIRE, panneau.classList.contains("ferme") ? "ferme" : "ouvert");
    });

    // Un bloc compact, deux boutons par ligne : le banc ne doit pas cacher les zones du plateau.
    const corps = h("div", "banc-corps", undefined, panneau);
    ligneChoix = h("div", "banc-choix", "", corps);
    BOUTONS.forEach((b) => {
      const bouton = h("button", "banc-bouton banc-" + b.groupe, t(b.cle), corps);
      bouton.title = t("banc.groupe." + b.groupe);
      bouton.addEventListener("click", () => lancer(b));
    });
    majChoix();
    if (!ecoute) {
      ecoute = true;
      document.addEventListener("plateau:choix", majChoix);
    }

    // Sous la couche des cartes qui volent : une grande carte passe par-dessus le banc.
    const cadre = options.cadre;
    cadre.insertBefore(panneau, cadre.querySelector(".couche-cartes"));
  }

  window.Actions = Actions;
  window.Banc = { init, verrouiller };
})();
