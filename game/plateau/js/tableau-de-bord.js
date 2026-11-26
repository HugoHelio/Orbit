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

  function bloc(titre, classe) {
    const b = h("section", "bloc " + (classe || ""), undefined, racine);
    h("h3", "bloc-titre", titre, b);
    return b;
  }

  function init(element, scenario, traduire) {
    racine = element;
    S = scenario;
    t = traduire;
    racine.innerHTML = "";

    const entete = h("header", "tableau-entete", undefined, racine);
    h("div", "tableau-studio", t("studio.nom"), entete);
    h("div", "tableau-projet", t("studio.projet"), entete);

    const joueurs = bloc(t("tableau.joueurs"), "bloc-joueurs");
    h("div", "grand-chiffre", "0", joueurs).id = "valeur-joueurs";

    const note = bloc(t("tableau.note"), "bloc-note");
    const ligne = h("div", "note-ligne", undefined, note);
    const etoiles = h("div", "note-etoiles", undefined, ligne);
    etoiles.id = "note-etoiles";
    for (let i = 0; i < 5; i++) {
      const e = h("span", "note-etoile", undefined, etoiles);
      h("span", "note-etoile-pleine", undefined, e);
    }
    h("div", "note-valeur", "3", ligne).id = "valeur-note";

    const score = bloc(t("tableau.score"), "bloc-score");
    h("div", "grand-chiffre score", "0", score).id = "valeur-score";
    h("div", "bloc-aide", t("tableau.score.aide"), score);

    const tokens = bloc(t("tableau.tokens"), "bloc-tokens");
    const grille = h("div", "tokens-grille", undefined, tokens);
    grille.id = "tokens-grille";
    for (let i = 0; i < S.tokensIA; i++) h("span", "token", undefined, grille);
    h("div", "bloc-aide", "", tokens).id = "valeur-tokens";

    const mvp = bloc(t("tableau.mvp"), "bloc-mvp");
    mvp.id = "bloc-mvp";
    h("div", "mvp-texte", "", mvp).id = "texte-mvp";

    const boucles = bloc(t("tableau.boucles"), "bloc-boucles");
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

  function afficherJoueurs(n) { document.getElementById("valeur-joueurs").textContent = formater(n); }
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
    document.getElementById("valeur-tokens").textContent = `${restants} / ${S.tokensIA}`;
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
    init, afficherJoueurs, afficherScore, afficherNote, afficherTokens,
    afficherMvp, afficherBoucles, afficherTemps
  };
})();
