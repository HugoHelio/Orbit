// Le banc d'essai de l'étape 2 : un bouton par brique animée.
// On choisit d'abord une fonctionnalité en cliquant sur son ticket dans le couloir ;
// les boutons « avance », « effort », « PIX » et « SCAN » agissent sur elle.
// Les « actions » enchaînent les briques comme le fera le script de la démo à l'étape 3
// (par exemple : une heure s'envole vers Build, puis un effort se remplit).
// Elles tiennent à jour l'état de la démo et le tableau de bord ; les briques, elles, ne font que dessiner.

(function () {
  let S, t, etat, occupe = false, verrou = false, panneau = null, ligneChoix = null, prochainRole = 0;

  function ordre() { return S.stations.map((s) => s.id); }
  function majHeures() { TableauDeBord.afficherHeures(Plateau.jetons()); }
  function majTokens() { TableauDeBord.afficherTokens(etat.tokensRestants); }
  function avis(cle, f) { Pioches.avis(t(cle).replace("{f}", f || "")); }
  function libre(f) { return (Plateau.ticket(f).efforts || []).filter(Boolean).length < Plateau.def(f).efforts; }
  function carteDe(id) { return S.cartes.test.find((c) => c.id === id); }

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

    // L'aiguillage à la sortie du Backlog : le ticket entre dans le cycle.
    // par "pix" : il s'arrête au Prompt (il attend un prompt, puis PIX).
    // par "humain" : il saute le Prompt et file au Build (il attend son responsable : 2 heures par effort).
    async lancer(f, par) {
      await Anim.volerTuile(f, "cycle", Plateau.ticketsA("prompt").length);
      Pioches.deplacer(f, "backlog", { zone: "cycle", par });
      if (par !== "pix") {
        await Anim.pause(250);
        await Anim.avancerTicket(f, "build");
      }
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

    // Le responsable du ticket code 1 effort sur Build : 2 heures (GDD 0.23). Ses 2 jetons volent,
    // puis un effort se remplit (ambre).
    async effortHumain(f) {
      const role = Plateau.def(f).resp, cout = S.effortHumain || 1;
      if (Plateau.jetonsLibres(role) < cout) {
        Pioches.avis(t("avis.heures.effort").replace("{role}", t("role." + role)).replace("{n}", cout));
        return false;
      }
      for (let k = 0; k < cout; k++) await Actions.heure(role, "build");
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

    // « Corriger » (la petite boucle, GDD 0.21) : le ticket recule au Build (flèche rouge), la carte Test
    // est défaussée, l'effort fautif se vide, le responsable le refait (1 heure, jamais PIX),
    // puis le ticket revient au Test.
    async corriger(f, idCarte) {
      const role = Plateau.def(f).resp;
      if (!Plateau.jetonsLibres(role)) {
        Pioches.avis(t("avis.heures.role").replace("{role}", t("role." + role)));
        return false;
      }
      const v = Plateau.ticket(f);
      const retour = v.station;
      const effortsPix = (v.efforts || []).map((q, i) => (q === "pix" ? i : -1)).filter((i) => i >= 0);
      const k = (v.cartesTest || []).findIndex((c) => c.id === idCarte);
      const i = effortsPix[k] !== undefined ? effortsPix[k] : k;
      Plateau.majTicket(f, (x) => { x.enCorrection = true; });
      const fleche = await Anim.reculerTicket(f, "build");
      // La carte fautive part à la défausse, l'effort se vide.
      const mini = Plateau.elementCarteTest(idCarte);
      if (mini) {
        mini.classList.add("defaussee");
        await Anim.pause(600);
      }
      Plateau.majTicket(f, (x) => {
        x.cartesTest = (x.cartesTest || []).filter((c) => c.id !== idCarte);
        x.efforts = (x.efforts || []).map((q, j) => (j === i ? null : q));
      });
      await Anim.pause(500);
      if (!(await Actions.heure(role, "build"))) return false;
      Plateau.majTicket(f, (x) => { delete x.enCorrection; });
      Anim.remplirEffort(f, "humain", i);
      Plateau.afficherBulle("pix", false);
      await Anim.pause(700);
      await Anim.avancerTicket(f, retour);
      if (fleche) fleche.remove();
      return true;
    },

    // La code review (GDD 0.22) : le programmeur, garant du code, relit 1 effort de PIX (1 heure).
    // Elle trouve tout : la carte Test se retourne.
    async codeReview(f, idCarte) {
      Plateau.montrerVerifications("review");
      if (!(await Actions.heure("programmeur", "test"))) return false;
      const arreter = Anim.examiner(f, "review");
      await Anim.pause(1300);
      arreter();
      await Pioches.reveler(idCarte);
      return true;
    },

    // Le playtest : le designer, garant du fun, joue à la fonctionnalité (1 heure). Il trouve les Pas fun.
    async playtest(f, idCarte) {
      Plateau.montrerVerifications("playtest");
      if (!(await Actions.heure("designer", "test"))) return false;
      const arreter = Anim.examiner(f, "playtest");
      await Anim.pause(1500);
      arreter();
      await Pioches.reveler(idCarte);
      return true;
    },

    // SCAN teste un effort de PIX (1 token). Il trouve les Bug, jamais les Pas fun,
    // qui restent cachés jusqu'à la Release.
    async scanner(f, idCarte) {
      if (etat.tokensRestants <= 0) { avis("avis.tokens.vides"); return false; }
      const v = Plateau.ticket(f);
      const carte = (v.cartesTest || []).find((c) => (idCarte ? c.id === idCarte : !c.revelee && !c.testee));
      if (!carte) return false;
      Plateau.montrerVerifications("scan");
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
    },

    // Les actions servent au banc d'essai et au lecteur de la démo : on les branche sur l'état à chaque redessin.
    init(options) {
      S = options.scenario;
      t = options.traduire;
      etat = options.etat;
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
