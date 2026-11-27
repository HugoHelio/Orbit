// Le tableau de bord du studio (à droite du plateau) et le bandeau du temps en cours.
// Comme le plateau, il ne sait pas d'où viennent les chiffres.

(function () {
  let S, t, racine;

  function h(tag, classe, texte, parent) {
    const e = document.createElement(tag);
    if (classe) e.className = classe;
    if (texte !== undefined) e.textContent = texte;
    if (parent) parent.appendChild(e);
    return e;
  }

  function bloc(titre, classe, parent) {
    const b = h("section", "bloc " + (classe || ""), undefined, parent || racine);
    h("h3", "bloc-titre", titre, b);
    return b;
  }

  function init(element, scenario, traduire) {
    racine = element;
    S = scenario;
    t = traduire;
    racine.innerHTML = "";

    // Le studio (en petit), puis le jeu vidéo qu'il développe (en grand), avec son MVP.
    const entete = h("header", "tableau-entete", undefined, racine);
    h("span", "tableau-studio", t("studio.nom"), entete);

    const jeu = h("section", "bloc bloc-jeu", undefined, racine);
    jeu.appendChild(window.logoStarSquadron(t("jeu.video.ligne1"), t("jeu.video.ligne2")));
    const mvp = h("div", "bloc-mvp", undefined, jeu);
    mvp.id = "bloc-mvp";
    h("div", "mvp-texte", "", mvp).id = "texte-mvp";

    // Les fonctionnalités live : celles qui sont publiées dans le jeu.
    const live = bloc(t("tableau.live"), "bloc-live");
    h("div", "publiees-liste", "", live).id = "liste-publiees";
    h("div", "bloc-aide", "", live).id = "aide-publiees";

    // Gamers et score côte à côte : le score = gamers × note.
    const rangee = h("div", "rangee", undefined, racine);
    const gamers = bloc(t("tableau.gamers"), "bloc-gamers", rangee);
    h("div", "grand-chiffre", "0", gamers).id = "valeur-gamers";

    const score = bloc(t("tableau.score"), "bloc-score", rangee);
    h("div", "grand-chiffre score", "0", score).id = "valeur-score";
    h("div", "bloc-aide", t("tableau.score.aide"), score);

    const note = bloc(t("tableau.note"), "bloc-note");
    const ligne = h("div", "note-ligne", undefined, note);
    const etoiles = h("div", "note-etoiles", undefined, ligne);
    etoiles.id = "note-etoiles";
    for (let i = 0; i < 5; i++) {
      const e = h("span", "note-etoile", undefined, etoiles);
      h("span", "note-etoile-pleine", undefined, e);
    }
    h("div", "note-valeur", "3", ligne).id = "valeur-note";


    // Les jetons de l'équipe : 3 par personne et par cycle, dont le jeton ⚒ Prod (GDD 0.21).
    const heures = bloc(t("tableau.heures"), "bloc-heures");
    S.roles.forEach((role) => {
      const ligne = h("div", "heures-ligne", undefined, heures);
      ligne.dataset.role = role;
      if (S.portraitsRoles && S.portraitsRoles[role]) {
        const img = h("img", "heures-visage pixel", undefined, ligne);
        img.src = "../../assets/personnages/" + S.portraitsRoles[role];
        img.alt = "";
      }
      h("span", "badge-role-html", t("role." + role + ".court"), ligne);
      const qui = h("span", "heures-role", t("role." + role), ligne);
      if (S.equipe && S.equipe[role]) h("small", "heures-personne", t("nom." + S.equipe[role]), qui);
      const jetons = h("span", "heures-jetons", undefined, ligne);
      for (let i = 0; i < S.heuresParRole; i++) h("span", "heure", undefined, jetons);
    });
    h("div", "bloc-aide", "", heures).id = "valeur-heures";

    const tokens = bloc(t("tableau.tokens"), "bloc-tokens");
    const grille = h("div", "tokens-grille", undefined, tokens);
    grille.id = "tokens-grille";
    for (let i = 0; i < S.tokensIA; i++) h("span", "token", undefined, grille);
    h("div", "bloc-aide", "", tokens).id = "valeur-tokens";

    // Les boucles s'affichent dans la barre du haut, bien en vue.
    const boucles = document.getElementById("boucles-entete");
    boucles.innerHTML = "";
    h("span", "boucles-titre", t("tableau.boucles"), boucles);
    const anneaux = h("div", "anneaux", undefined, boucles);
    anneaux.id = "anneaux";
    S.cycles.forEach((c) => {
      const a = h("div", "anneau", undefined, anneaux);
      h("span", "anneau-rond", undefined, a);
      h("span", "anneau-nom", String(c), a);
    });
    const fest = h("div", "anneau festival", undefined, anneaux);
    h("span", "anneau-rond", "★", fest);
    h("span", "anneau-nom", t("tableau.festival"), fest);
  }

  function formater(n) {
    return Math.round(n).toLocaleString(document.documentElement.lang || "fr");
  }

  function afficherGamers(n) { document.getElementById("valeur-gamers").textContent = formater(n); }
  function afficherScore(n) { document.getElementById("valeur-score").textContent = formater(n); }

  function afficherNote(note) {
    document.getElementById("valeur-note").textContent =
      note.toLocaleString(document.documentElement.lang || "fr", { maximumFractionDigits: 1 });
    document.querySelectorAll("#note-etoiles .note-etoile-pleine").forEach((e, i) => {
      const remplissage = Math.max(0, Math.min(1, note - i));
      e.style.width = remplissage * 100 + "%";
    });
  }

  function afficherTokens(restants) {
    document.querySelectorAll("#tokens-grille .token").forEach((e, i) => e.classList.toggle("depense", i >= restants));
    document.getElementById("valeur-tokens").textContent =
      t("tableau.tokens.aide").replace("{n}", restants).replace("{total}", S.tokensIA);
  }

  // jetons : { chef: { sortes: ["heure", "heure", "prod"], pris: [false, false, true] }, … } (Plateau.jetons())
  function afficherHeures(jetons) {
    let reste = 0;
    S.roles.forEach((role) => {
      const j = jetons[role] || { sortes: [], pris: [] };
      document.querySelectorAll(`.heures-ligne[data-role="${role}"] .heure`).forEach((e, i) => {
        const prod = j.sortes[i] === "prod";
        e.classList.toggle("prod", prod);
        e.classList.toggle("depensee", !!j.pris[i]);
        e.textContent = prod ? "⚒" : "";
        if (!j.pris[i]) reste++;
      });
    });
    const total = S.roles.length * S.heuresParRole;
    document.getElementById("valeur-heures").textContent =
      t("tableau.heures.aide").replace("{n}", reste).replace("{total}", total);
  }

  // Les fonctionnalités publiées de Star Squadron (leurs numéros).
  // signalees : { F06: "bug" } : une fonctionnalité live qui a un ticket correctif en route (la grande boucle).
  function afficherPubliees(liste, signalees) {
    const l = document.getElementById("liste-publiees");
    l.innerHTML = "";
    liste.forEach((f) => {
      const marque = signalees && signalees[f];
      const p = h("span", "puce-publiee" + (marque ? " signalee" : ""), f, l);
      p.title = marque ? t("tableau.signale." + marque).replace("{f}", f + " · " + t("f." + f)) : t("f." + f);
      if (marque) h("span", "puce-marque", "!", p);
    });
    document.getElementById("aide-publiees").textContent =
      t("tableau.live.aide").replace("{n}", liste.length).replace("{total}", Object.keys(S.fonctionnalites).length);
  }

  function afficherMvp(publie) {
    document.getElementById("bloc-mvp").classList.toggle("publie", publie);
    document.getElementById("texte-mvp").textContent = t(publie ? "tableau.mvp.oui" : "tableau.mvp.non");
  }

  function afficherBoucles(faites, enCours) {
    document.querySelectorAll("#anneaux .anneau").forEach((a, i) => {
      a.classList.toggle("allume", i < faites);
      a.classList.toggle("en-cours", i === enCours);
    });
  }

  // Le bandeau du haut : le cycle, et le temps en cours en grand.
  function afficherTemps(element, cycle, tempsActif) {
    element.innerHTML = "";
    const cyc = h("div", "temps-cycle", undefined, element);
    h("span", "temps-cycle-num", t("tableau.cycle").replace("{n}", cycle), cyc);
    const titre = t("cycle." + cycle + ".titre");
    if (titre) h("span", "temps-cycle-titre", titre, cyc);

    h("div", "temps-grand", t("temps." + tempsActif), element);

    const frise = h("ol", "temps-frise", undefined, element);
    const iActif = S.temps.indexOf(tempsActif);
    S.temps.forEach((tp, i) => {
      const li = h("li", i < iActif ? "fait" : i === iActif ? "actif" : "", t("temps." + tp), frise);
      li.dataset.temps = tp;
    });
  }

  window.TableauDeBord = {
    init, afficherGamers, afficherScore, afficherNote, afficherTokens, afficherHeures,
    afficherMvp, afficherPubliees, afficherBoucles, afficherTemps
  };
})();
