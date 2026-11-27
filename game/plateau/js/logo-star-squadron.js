// Le logo de « Star Squadron », le jeu vidéo que développe Orbital Studio.
// D'après le logo de référence (assets/logos/star-squadron-reference.png), simplifié :
// la fusée à gauche (image découpée du logo de référence), le titre en lettres pixel à droite (STAR en blanc, SQUADRON en ambre),
// tout cerné de bleu nuit. Les couleurs passent par les classes CSS (.logo-…), jamais en dur.

(function () {
  const NS = "http://www.w3.org/2000/svg";

  // Les lettres en pixels (5 × 7).
  const LETTRES = {
    S: [".####", "#....", "#....", ".###.", "....#", "....#", "####."],
    T: ["#####", "..#..", "..#..", "..#..", "..#..", "..#..", "..#.."],
    A: [".###.", "#...#", "#...#", "#####", "#...#", "#...#", "#...#"],
    R: ["####.", "#...#", "#...#", "####.", "#.#..", "#..#.", "#...#"],
    Q: [".###.", "#...#", "#...#", "#...#", "#.#.#", "#..#.", ".##.#"],
    U: ["#...#", "#...#", "#...#", "#...#", "#...#", "#...#", ".###."],
    D: ["####.", "#...#", "#...#", "#...#", "#...#", "#...#", "####."],
    O: [".###.", "#...#", "#...#", "#...#", "#...#", "#...#", ".###."],
    N: ["#...#", "##..#", "#.#.#", "#.#.#", "#..##", "#...#", "#...#"]
  };

  function el(tag, attrs, parent) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }

  // Dessine une grille de pixels : le contour (chaque pixel agrandi, en bleu nuit), puis les couleurs.
  // Chaque couleur est un seul tracé : pas de jointure visible entre deux pixels voisins.
  function pixels(parent, liste, px, bord) {
    const carre = (x, y, d) => `M${(x * px - d).toFixed(2)},${(y * px - d).toFixed(2)}h${(px + 2 * d).toFixed(2)}v${(px + 2 * d).toFixed(2)}h${(-px - 2 * d).toFixed(2)}z`;
    el("path", { d: liste.map(([x, y]) => carre(x, y, bord)).join(""), class: "logo-contour" }, parent);
    const parClasse = {};
    liste.forEach(([x, y, classe]) => (parClasse[classe] = parClasse[classe] || []).push(carre(x, y, 0.15)));
    Object.keys(parClasse).forEach((classe) => el("path", { d: parClasse[classe].join(""), class: classe }, parent));
  }

  // Les lettres sont épaissies (chaque pixel est doublé vers la droite), comme sur le logo de référence.
  function mot(texte, x0, y0) {
    const vus = new Set(), liste = [];
    const ajouter = (x, y) => { const k = x + "," + y; if (!vus.has(k)) { vus.add(k); liste.push([x, y]); } };
    [...texte].forEach((lettre, i) => {
      (LETTRES[lettre] || []).forEach((ligne, y) => {
        [...ligne].forEach((c, x) => { if (c === "#") { ajouter(x0 + i * 7 + x, y0 + y); ajouter(x0 + i * 7 + x + 1, y0 + y); } });
      });
    });
    return liste;
  }

  // ligne1, ligne2 : le titre sur deux lignes (« STAR » et « SQUADRON »).
  window.logoStarSquadron = function (ligne1, ligne2) {
    const svg = el("svg", { viewBox: "0 0 262 76", class: "logo-jeu", role: "img", "aria-label": `${ligne1} ${ligne2}` });

    // La fusée, à gauche : l'image découpée du logo de référence (assets/logos/star-squadron-fusee.png).
    el("image", { href: "../../assets/logos/star-squadron-fusee.png", x: 2, y: 4, width: 78, height: 66, preserveAspectRatio: "xMidYMid meet" }, svg);

    // Le titre, à droite : STAR en blanc, SQUADRON en ambre, en pixels cernés de bleu nuit.
    // Le bandeau bleu nuit sous le titre, comme sur le logo de référence : le blanc et l'ambre ressortent.
    el("rect", { x: 88, y: 9, width: 170, height: 58, rx: 5, class: "logo-bandeau" }, svg);
    const t = el("g", { transform: "translate(95,15)" }, svg);
    const p1 = mot(ligne1.toUpperCase(), 0, 0).map(([x, y]) => [x, y, "logo-lettre-1"]);
    const p2 = mot(ligne2.toUpperCase(), 0, 9).map(([x, y]) => [x, y, "logo-lettre-2"]);
    pixels(t, p1.concat(p2), 2.8, 0.7);
    return svg;
  };
})();
