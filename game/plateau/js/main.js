// Le démarrage de la démo : langue, thème, son, puis le dessin de l'état « vitrine ».

(function () {
  const S = window.SCENARIO;
  const MEMOIRE = "helioso-orbit-plateau";

  // --- Préférences gardées en local (thème, son, langue) ---
  const prefs = Object.assign({ theme: "clair", son: false, langue: "fr" },
    JSON.parse(localStorage.getItem(MEMOIRE) || "{}"));
  // Raccourci de test : index.html?theme=sombre ou ?langue=en
  const url = new URLSearchParams(location.search);
  if (url.get("theme")) prefs.theme = url.get("theme");
  if (url.get("langue")) prefs.langue = url.get("langue");
  function sauver() { localStorage.setItem(MEMOIRE, JSON.stringify(prefs)); }

  // --- Les textes : une clé, une version par langue ---
  function t(cle) {
    const txt = (S.textes[prefs.langue] || {})[cle];
    if (txt !== undefined) return txt;
    const fr = S.textes.fr[cle];
    return fr !== undefined ? fr : "";
  }

  // Les textes de la page HTML : attribut data-texte="cle" (et data-titre pour les infobulles).
  function traduirePage() {
    document.documentElement.lang = prefs.langue;
    document.title = `${t("jeu.titre")} · ${t("jeu.scenario")}`;
    document.querySelectorAll("[data-texte]").forEach((e) => (e.textContent = t(e.dataset.texte)));
    document.querySelectorAll("[data-titre]").forEach((e) => {
      e.title = t(e.dataset.titre);
      e.setAttribute("aria-label", e.title);
    });
  }

  function appliquerTheme() {
    document.documentElement.dataset.theme = prefs.theme;
    const b = document.getElementById("bouton-theme");
    // Le bouton annonce le thème vers lequel on bascule.
    const cle = prefs.theme === "clair" ? "bouton.theme.sombre" : "bouton.theme.clair";
    b.title = t(cle);
    b.setAttribute("aria-label", b.title);
    b.dataset.etat = prefs.theme;
  }

  function appliquerSon() {
    const b = document.getElementById("bouton-son");
    b.dataset.etat = prefs.son ? "on" : "off";
    b.title = t(prefs.son ? "bouton.son.on" : "bouton.son.off");
    b.setAttribute("aria-label", b.title);
  }

  // --- Dessiner l'état de départ ---
  // Par défaut : le début de la démo (cycle 0, js/script-demo.js).
  // index.html?etat=vitrine : un plateau en pleine partie (cycle 1, Build), pratique pour le banc d'essai.
  const modeVitrine = url.get("etat") === "vitrine" || !window.DEMO_SCRIPT;
  function dessiner() {
    // Une copie fraîche : les pioches et le lecteur la font évoluer pendant la démo.
    const V = JSON.parse(JSON.stringify(modeVitrine ? window.VITRINE : window.DEMO_SCRIPT.depart));
    Plateau.init(document.getElementById("plateau"), S, t);
    TableauDeBord.init(document.getElementById("tableau"), S, t);

    // Les pioches : on mélange, puis on donne une vraie carte à chaque carte Test de la vitrine.
    Pioches.init({
      scenario: S, traduire: t, etat: V,
      cadre: document.querySelector(".plateau-cadre"), couche: document.getElementById("couche-cartes")
    });
    // Les cartes Feedback de la file sont de vraies cartes : on les retire de la pioche.
    V.fileFeedback.forEach((id) => Pioches.tirerSilencieux("feedback", null, id));
    V.files["feedback-backlog"] = V.fileFeedback.length;
    Plateau.poserIdees(V.idees, V.ideesCachees.length);
    Plateau.poserBacklog(V.backlog);
    V.tickets.forEach((v) => {
      v.cartesTest = (v.cartesTest || []).map((etatCarte) =>
        etatCarte === "cachee"
          ? { id: Pioches.tirerSilencieux("test"), revelee: false }
          : { id: Pioches.tirerSilencieux("test", etatCarte), revelee: true });
    });

    Plateau.illuminerStation(V.stationActive);
    for (const id in V.files) Plateau.remplirFile(id, V.files[id]);
    // Les heures utilisées se comptent à partir des jetons posés : le pilotage,
    // les stations et le tableau de bord disent toujours la même chose.
    const heuresUtilisees = {};
    S.roles.forEach((r) => (heuresUtilisees[r] = 0));
    for (const st in V.heuresPosees) V.heuresPosees[st].forEach((r) => heuresUtilisees[r]++);
    for (const role in heuresUtilisees) Plateau.utiliserHeures(role, heuresUtilisees[role]);
    for (const st in V.heuresPosees) Plateau.poserHeures(st, V.heuresPosees[st]);

    const parStation = {};
    V.tickets.forEach((v) => {
      const i = (parStation[v.station] = (parStation[v.station] || 0) + 1) - 1;
      Plateau.poserTicket(v, i);
    });
    for (const id in V.agents) {
      Plateau.activerAgent(id, V.agents[id].actif);
      Plateau.afficherBulle(id, V.agents[id].bulle);
    }

    TableauDeBord.afficherTemps(document.getElementById("temps"), V.cycle, V.temps);
    // K6, le maître de jeu, explique le temps en cours.
    document.getElementById("guide-texte").textContent = t("guide." + V.temps);
    TableauDeBord.afficherGamers(V.gamers);
    TableauDeBord.afficherNote(V.note);
    TableauDeBord.afficherScore(V.score);
    TableauDeBord.afficherHeures(heuresUtilisees);
    TableauDeBord.afficherTokens(V.tokensRestants);
    TableauDeBord.afficherMvp(V.mvp);
    TableauDeBord.afficherPubliees(V.publiees);
    TableauDeBord.afficherBoucles(V.bouclesFaites, V.cycle);

    // Le banc d'essai de l'étape 2 : un bouton par brique animée.
    // Le banc d'essai : avec la vitrine, ou sur demande (index.html?banc=1). La démo reste propre.
    if (modeVitrine || url.get("banc") === "1") Banc.init({ scenario: S, traduire: t, etat: V, cadre: document.querySelector(".plateau-cadre") });
    // Le lecteur de la démo et sa barre de lecture.
    if (!modeVitrine) Lecteur.init({ scenario: S, traduire: t, etat: V });
    else document.querySelectorAll(".lecture-controles button").forEach((b) => (b.disabled = true));
  }

  function toutAfficher() {
    traduirePage();
    appliquerTheme();
    appliquerSon();
    dessiner();
  }

  document.getElementById("bouton-theme").addEventListener("click", () => {
    prefs.theme = prefs.theme === "clair" ? "sombre" : "clair";
    sauver();
    appliquerTheme();
  });
  document.getElementById("bouton-son").addEventListener("click", () => {
    prefs.son = !prefs.son;
    sauver();
    appliquerSon();
  });
  document.getElementById("bouton-langue").addEventListener("click", () => {
    prefs.langue = prefs.langue === "fr" ? "en" : "fr";
    sauver();
    toutAfficher();
  });

  // Pour le banc d'essai (bouton « Remettre le plateau ») et, plus tard, le lecteur de la démo.
  window.Demo = { redessiner: dessiner };

  toutAfficher();
})();
