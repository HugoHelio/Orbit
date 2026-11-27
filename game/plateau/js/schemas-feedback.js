// Les petits schémas des cartes Feedback, dans le style des prototypes de SpacePlan :
// un écran de jeu sombre, le vaisseau en triangle, les aliens en cercles, les tirs en points,
// les boîtes de collision en carrés. Un schéma explique mieux qu'une phrase, surtout sur une petite carte.
// Toutes les couleurs passent par les classes CSS (.sch-…).

(function () {
  const NS = "http://www.w3.org/2000/svg";
  const LARGEUR = 200, HAUTEUR = 110;

  function el(tag, attrs, parent) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) {
      if (k === "texte") e.textContent = attrs[k];
      else e.setAttribute(k, attrs[k]);
    }
    if (parent) parent.appendChild(e);
    return e;
  }

  // --- Les briques de dessin ----------------------------------------------------
  function outils(g) {
    const o = {
      vaisseau: (x, y, s = 1, classe = "") => el("polygon", { points: `${x},${y - 13 * s} ${x - 11 * s},${y + 9 * s} ${x + 11 * s},${y + 9 * s}`, class: "sch-vaisseau " + classe }, g),
      alien: (x, y, r = 9, classe = "") => el("circle", { cx: x, cy: y, r, class: "sch-alien " + classe }, g),
      alienCarre: (x, y, c = 16) => el("rect", { x: x - c / 2, y: y - c / 2, width: c, height: c, class: "sch-alien" }, g),
      alienLosange: (x, y, c = 11) => el("polygon", { points: `${x},${y - c} ${x + c},${y} ${x},${y + c} ${x - c},${y}`, class: "sch-alien" }, g),
      tir: (x, y, classe = "") => el("circle", { cx: x, cy: y, r: 3.2, class: "sch-tir " + classe }, g),
      tirAlien: (x, y) => el("circle", { cx: x, cy: y, r: 3.2, class: "sch-tir-alien" }, g),
      boite: (x, y, w, h) => el("rect", { x, y, width: w, height: h, class: "sch-boite" }, g),
      texte: (x, y, t, taille = 12, classe = "", ancre = "middle") => el("text", { x, y, "font-size": taille, "text-anchor": ancre, class: "sch-texte " + classe, texte: t }, g),
      trait: (d, classe = "") => el("path", { d, class: "sch-trait " + classe }, g),
      fleche: (x1, y1, x2, y2, classe = "") => {
        const a = Math.atan2(y2 - y1, x2 - x1), p = 6;
        el("path", { d: `M${x1},${y1} L${x2},${y2}`, class: "sch-trait " + classe }, g);
        el("path", {
          d: `M${x2},${y2} L${x2 - p * Math.cos(a - 0.5)},${y2 - p * Math.sin(a - 0.5)} L${x2 - p * Math.cos(a + 0.5)},${y2 - p * Math.sin(a + 0.5)} Z`,
          class: "sch-pointe " + classe
        }, g);
      },
      croix: (x, y, c = 6) => el("path", { d: `M${x - c},${y - c} L${x + c},${y + c} M${x + c},${y - c} L${x - c},${y + c}`, class: "sch-alerte-trait" }, g),
      alerte: (x, y) => { el("circle", { cx: x, cy: y, r: 8, class: "sch-alerte" }, g); o.texte(x, y + 4, "!", 11, "sch-sur-alerte"); },
      ok: (x, y) => { el("circle", { cx: x, cy: y, r: 9, class: "sch-ok" }, g); el("path", { d: `M${x - 4},${y} L${x - 1},${y + 3} L${x + 4},${y - 3}`, class: "sch-sur-ok" }, g); },
      explosion: (x, y, r = 14, classe = "") => {
        const pts = [];
        for (let i = 0; i < 16; i++) {
          const rr = i % 2 ? r * 0.45 : r, a = (i * Math.PI) / 8;
          pts.push(`${(x + rr * Math.cos(a)).toFixed(1)},${(y + rr * Math.sin(a)).toFixed(1)}`);
        }
        el("polygon", { points: pts.join(" "), class: "sch-explosion " + classe }, g);
      },
      etoiles: (n, graine = 3) => {
        let s = graine;
        for (let i = 0; i < n; i++) {
          s = (s * 16807) % 2147483647; const x = 8 + (s % 184);
          s = (s * 16807) % 2147483647; const y = 8 + (s % 94);
          el("circle", { cx: x, cy: y, r: 1.1, class: "sch-etoile" }, g);
        }
      },
      grille: (x0, y0, cols, rangs, pas = 18, r = 6, sauf) => {
        for (let i = 0; i < cols; i++) for (let j = 0; j < rangs; j++) {
          if (!sauf || !sauf(i, j)) o.alien(x0 + i * pas, y0 + j * pas, r);
        }
      }
    };
    return o;
  }

  // --- Les 24 schémas -------------------------------------------------------------
  const SCHEMAS = {
    // La boîte de collision du vaisseau est trop large : le tir passe à côté, mais touche la boîte.
    FB01: (o) => { o.vaisseau(100, 70, 1.6); o.boite(64, 34, 72, 64); o.tirAlien(132, 40); o.fleche(150, 18, 136, 36, "sch-alien-trait"); o.alerte(150, 72); },
    // Le tir touche l'alien, mais il ne disparaît pas : la boîte est plus petite que l'alien.
    FB02: (o) => { o.alien(100, 52, 32); o.boite(80, 32, 40, 40); o.tir(128, 76); o.fleche(146, 100, 131, 80); o.alerte(56, 22); },
    // Appuyer sans arrêt sur espace : un mur de tirs.
    FB03: (o) => { o.grille(46, 18, 7, 1, 18, 6); for (let y = 34; y < 82; y += 8) o.tir(100, y); o.vaisseau(100, 92); o.boite(130, 80, 44, 18); o.texte(152, 93, "SPACE ×∞", 9); },
    // Moins d'aliens et plus gros → plus d'aliens et plus petits.
    FB04: (o) => { o.alien(36, 40, 14); o.alien(70, 40, 14); o.fleche(92, 45, 112, 45); o.grille(124, 22, 5, 3, 14, 4.5); o.vaisseau(100, 94, 0.8); },
    // On détruit les côtés : les aliens restants devraient aller jusqu'aux bords.
    FB05: (o) => { o.grille(64, 22, 5, 3, 18, 6, (i) => i === 0 || i === 4); for (let j = 0; j < 3; j++) { o.croix(64, 22 + j * 18, 4); o.croix(136, 22 + j * 18, 4); } o.fleche(58, 76, 16, 76, "sch-souhait"); o.fleche(142, 76, 184, 76, "sch-souhait"); o.vaisseau(100, 96, 0.8); },
    // Mon missile pourrait détruire celui de l'alien.
    FB06: (o) => { o.alien(100, 18, 10); o.vaisseau(100, 96); o.fleche(100, 82, 100, 62); o.fleche(100, 30, 100, 48, "sch-alien-trait"); o.explosion(100, 56, 13, "sch-souhait"); },
    // Le meilleur score est plafonné : tout le monde a le même.
    FB07: (o) => { o.trait("M28,26 H172", "sch-plafond"); [40, 70, 100, 130, 160].forEach((x) => el("rect", { x: x - 9, y: 26, width: 18, height: 70, class: "sch-barre" }, o.g)); o.texte(100, 20, "MAX 9999", 11); },
    // Plus de canons ET plus de boucliers ? Ce n'est pas logique.
    FB08: (o) => { o.vaisseau(70, 66, 1.3); o.tir(56, 46); o.tir(70, 40); o.tir(84, 46); o.texte(70, 100, "×3", 12); o.texte(102, 66, "+", 20); el("path", { d: "M136,46 L156,52 V68 Q156,82 136,90 Q116,82 116,68 V52 Z", class: "sch-bouclier" }, o.g); o.texte(136, 74, "×3", 12); o.texte(178, 70, "?", 26, "sch-question"); },
    // Le jeu est stable, rien n'a planté.
    FB09: (o) => { o.etoiles(18); o.grille(64, 22, 5, 2, 18, 6); o.vaisseau(100, 90); o.ok(160, 80); },
    // Rapide et facile : 13 secondes, plus d'aliens ?
    FB10: (o) => { o.alien(60, 30, 8); o.alien(90, 30, 8); o.vaisseau(75, 90); el("circle", { cx: 150, cy: 52, r: 26, class: "sch-horloge" }, o.g); o.trait("M150,52 L150,34 M150,52 L162,58"); o.texte(150, 96, "0:13", 13); },
    // Gagner ou perdre : la fin est décevante.
    FB11: (o) => { el("rect", { x: 14, y: 30, width: 78, height: 44, rx: 6, class: "sch-panneau" }, o.g); o.texte(53, 58, "YOU WIN", 12); el("rect", { x: 108, y: 30, width: 78, height: 44, rx: 6, class: "sch-panneau" }, o.g); o.texte(147, 58, "GAME OVER", 11); o.texte(100, 96, "…", 22); },
    // Je confonds mes missiles et ceux des aliens : ils ont la même couleur.
    FB12: (o) => { o.alien(64, 18, 9); o.alien(136, 18, 9); o.vaisseau(100, 96); o.tir(80, 46); o.tir(120, 40); o.tir(92, 66); o.tir(110, 70); o.texte(100, 52, "?", 20, "sch-question"); },
    // Un bouton pause.
    FB13: (o) => { o.grille(46, 20, 7, 1, 18, 6); o.vaisseau(100, 92); el("circle", { cx: 100, cy: 56, r: 22, class: "sch-souhait-fond" }, o.g); el("rect", { x: 91, y: 45, width: 6, height: 22, class: "sch-pause" }, o.g); el("rect", { x: 103, y: 45, width: 6, height: 22, class: "sch-pause" }, o.g); },
    // L'icône « Shield S » ressemble à un 5.
    FB14: (o) => { el("path", { d: "M70,26 L94,34 V58 Q94,80 70,90 Q46,80 46,58 V34 Z", class: "sch-bouclier" }, o.g); o.texte(70, 68, "S", 26); o.texte(110, 66, "=", 22); o.texte(146, 72, "5", 40, "sch-question"); },
    // Dur au début, puis trop facile : la courbe de difficulté monte puis retombe.
    FB15: (o) => { o.trait("M24,92 H180 M24,92 V14", "sch-axe"); o.trait("M24,88 C50,20 70,18 90,40 S140,86 178,84", "sch-courbe"); o.fleche(60, 98, 170, 30, "sch-souhait"); },
    // Les graphismes sont vraiment cool.
    FB16: (o) => { o.etoiles(26, 7); o.grille(46, 22, 7, 2, 18, 6); o.vaisseau(100, 90); o.explosion(160, 70, 9); o.ok(30, 84); },
    // Différents types d'aliens.
    FB17: (o) => { o.alien(50, 50, 13); o.fleche(70, 50, 86, 50); o.alien(110, 34, 9); o.alienCarre(140, 34); o.alienLosange(170, 34); o.alienCarre(110, 72, 14); o.alienLosange(140, 72); o.alien(170, 72, 9); },
    // Toucher ou être touché : il ne se passe rien. Il faut des explosions.
    FB18: (o) => { o.alien(64, 34, 12); o.tir(64, 52); o.texte(64, 86, "…", 20); o.fleche(90, 50, 112, 50); o.explosion(146, 42, 22, "sch-souhait"); o.vaisseau(146, 92, 0.8); },
    // L'espace paraît statique : des étoiles qui défilent.
    FB19: (o) => { o.etoiles(14, 5); o.vaisseau(100, 90); for (let i = 0; i < 6; i++) o.trait(`M${30 + i * 28},${16 + (i % 3) * 18} v16`, "sch-defile"); },
    // Pas de son.
    FB20: (o) => { el("path", { d: "M70,44 H84 L102,30 V82 L84,68 H70 Z", class: "sch-hautparleur" }, o.g); o.croix(128, 56, 10); },
    // La sensation de puissance du vaisseau est géniale.
    FB21: (o) => { o.vaisseau(100, 80, 1.5); for (let y = 14; y < 56; y += 9) { o.tir(92, y); o.tir(108, y); } o.trait("M66,92 L54,102 M134,92 L146,102 M74,60 L60,56 M126,60 L140,56", "sch-puissance"); o.ok(168, 24); },
    // Finir le jeu avec le meilleur vaisseau n'est pas gratifiant.
    FB22: (o) => { o.vaisseau(70, 70, 1.6); o.trait("M54,40 L60,30 L70,38 L80,30 L86,40 Z", "sch-couronne"); o.texte(124, 66, "→", 20); o.texte(162, 70, "…", 26); },
    // Un classement en ligne, et je fais un live.
    FB23: (o) => { el("rect", { x: 40, y: 50, width: 32, height: 44, class: "sch-podium" }, o.g); el("rect", { x: 74, y: 34, width: 32, height: 60, class: "sch-podium" }, o.g); el("rect", { x: 108, y: 62, width: 32, height: 32, class: "sch-podium" }, o.g); o.texte(90, 28, "1", 13); o.texte(56, 44, "2", 13); o.texte(124, 56, "3", 13); el("circle", { cx: 160, cy: 24, r: 5, class: "sch-live" }, o.g); o.texte(176, 28, "LIVE", 10, "", "middle"); },
    // Un combat de boss pour finir en beauté.
    FB24: (o) => { o.alien(100, 34, 26, "sch-boss"); o.tirAlien(84, 66); o.tirAlien(116, 66); o.vaisseau(100, 96, 0.9); o.texte(160, 20, "BOSS", 11); }
  };

  // Dessine le schéma d'une carte Feedback dans un nouvel élément SVG.
  function dessiner(id) {
    const svg = el("svg", { viewBox: `0 0 ${LARGEUR} ${HAUTEUR}`, class: "schema-feedback", "aria-hidden": "true" });
    el("rect", { x: 0, y: 0, width: LARGEUR, height: HAUTEUR, rx: 10, class: "sch-ecran" }, svg);
    const g = el("g", {}, svg);
    const o = outils(g);
    o.g = g;
    if (SCHEMAS[id]) SCHEMAS[id](o);
    return svg;
  }

  window.SchemasFeedback = { dessiner, ids: Object.keys(SCHEMAS) };
})();
