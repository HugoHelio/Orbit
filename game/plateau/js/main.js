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

  // --- Dessiner l'état vitrine ---
  function dessiner() {
    const V = window.VITRINE;
    Plateau.init(document.getElementById("plateau"), S, t);
    TableauDeBord.init(document.getElementById("tableau"), S, t);

    Plateau.illuminerStation(V.stationActive);
    for (const id in V.files) Plateau.remplirFile(id, V.files[id]);
    for (const role in V.heuresUtilisees) Plateau.utiliserHeures(role, V.heuresUtilisees[role]);
    for (const st in V.heuresPosees) Plateau.poserHeures(st, V.heuresPosees[st]);

    const parStation = {};
    V.vaisseaux.forEach((v) => {
      const i = (parStation[v.station] = (parStation[v.station] || 0) + 1) - 1;
      Plateau.poserVaisseau(v, i);
    });
    for (const id in V.agents) {
      Plateau.activerAgent(id, V.agents[id].actif);
      Plateau.afficherBulle(id, V.agents[id].bulle);
    }

    TableauDeBord.afficherTemps(document.getElementById("temps"), V.cycle, V.temps);
    TableauDeBord.afficherJoueurs(V.joueurs);
    TableauDeBord.afficherNote(V.note);
    TableauDeBord.afficherScore(V.score);
    TableauDeBord.afficherTokens(V.tokensRestants);
    TableauDeBord.afficherMvp(V.mvp);
    TableauDeBord.afficherBoucles(V.bouclesFaites, V.cycle);
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

  toutAfficher();
})();
