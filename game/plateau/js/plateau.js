// Le dessin du plateau en SVG.
// Ces fonctions ne savent pas d'où viennent les ordres : aujourd'hui l'état « vitrine »,
// demain le script de la démo, plus tard le vrai moteur de règles.

(function () {
  const NS = "http://www.w3.org/2000/svg";
  const PORTRAITS = "../../assets/personnages/";

  // La géométrie du plateau (unités du viewBox).
  const G = {
    largeur: 1400, hauteur: 1040,
    cx: 700, cy: 500,          // centre : le soleil
    rx: 400, ry: 320,          // l'ellipse de l'orbite
    rSoleil: 140,
    rStation: 60
  };

  let svg, calques, S, t;

  // --- Petits outils ---------------------------------------------------------

  function el(tag, attrs, parent) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs || {}) {
      if (k === "texte") e.textContent = attrs[k];
      else if (k === "href") e.setAttribute("href", attrs[k]);
      else e.setAttribute(k, attrs[k]);
    }
    if (parent) parent.appendChild(e);
    return e;
  }

  function surOrbite(angle, decalage) {
    const a = (angle * Math.PI) / 180;
    const d = decalage || 0;
    return { x: G.cx + (G.rx + d) * Math.cos(a), y: G.cy + (G.ry + d) * Math.sin(a) };
  }

  // Point entre une station et le soleil (là où se garent les tickets).
  function versLeCentre(p, distance) {
    const dx = G.cx - p.x, dy = G.cy - p.y;
    const n = Math.hypot(dx, dy);
    return { x: p.x + (dx / n) * distance, y: p.y + (dy / n) * distance };
  }

  function station(id) { return S.stations.find((s) => s.id === id); }
  function posStation(id) { return surOrbite(station(id).angle); }

  function abreger(texte, max) {
    return texte.length > max ? texte.slice(0, max - 1).trimEnd() + "…" : texte;
  }

  // Générateur pseudo-aléatoire fixe : le ciel étoilé est le même à chaque ouverture.
  function aleatoire(graine) {
    let s = graine;
    return () => ((s = (s * 16807) % 2147483647) / 2147483647);
  }

  // --- Les icônes des stations (dessinées au trait, centrées sur 0,0) -------

  const ICONES = {
    backlog: "M-13,-10 H13 M-13,0 H13 M-13,10 H5",
    prompt: "M-14,-11 H14 V7 H-2 L-9,14 V7 H-14 Z",
    build: "M-6,-11 L-15,0 L-6,11 M6,-11 L15,0 L6,11",
    test: "M-3,-3 m-9,0 a9,9 0 1,0 18,0 a9,9 0 1,0 -18,0 M4,4 L14,14",
    release: "M0,-15 C8,-8 8,4 5,9 H-5 C-8,4 -8,-8 0,-15 Z M-5,9 L-10,15 M5,9 L10,15 M0,-5 v0.1",
    feedback: "M0,-14 L4,-4 L14,-4 L6,3 L9,13 L0,7 L-9,13 L-6,3 L-14,-4 L-4,-4 Z"
  };

  // --- Les calques -----------------------------------------------------------

  function init(svgElement, scenario, traduire) {
    svg = svgElement;
    S = scenario;
    t = traduire;
    cadrer();
    svg.innerHTML = "";
    vu.station = null; vu.posees = {}; vu.utilisees = {}; vu.files = {}; vu.choisi = null;
    for (const f in tickets) delete tickets[f];

    definitions();
    calques = {};
    ["ciel", "orbite", "liens", "zones", "pioches", "evenement", "files", "stations", "soleil", "planetes",
     "satellites", "jetons", "idees", "tickets", "bulles", "loupe", "glisse"].forEach((nom) => {
      calques[nom] = el("g", { class: "calque-" + nom }, svg);
    });

    dessinerCiel();
    dessinerOrbite();
    dessinerFiles();
    dessinerStations();
    dessinerSoleil();
    dessinerPlanetes();
    dessinerSatellites();
    dessinerLegende();
    dessinerPioches();
    dessinerZones();
  }

  // Le Backlog est un zoom : ouvert, on voit les Idées et le Backlog à gauche ; fermé, le plateau seul.
  let zonesOuvertes = true;
  function cadrer() {
    svg.setAttribute("viewBox", zonesOuvertes ? `-345 48 ${G.largeur + 325} ${G.hauteur - 58}` : `40 48 ${G.largeur - 60} ${G.hauteur - 58}`);
    svg.classList.toggle("zones-fermees", !zonesOuvertes);
  }
  function basculerZones(ouvrir) {
    zonesOuvertes = ouvrir === undefined ? !zonesOuvertes : ouvrir;
    cadrer();
    return zonesOuvertes;
  }

  // --- Les pioches (paquets de cartes à tirer) -------------------------------

  // Les dispositions possibles des pioches (essais) : index.html?pioches=droite, gauche, eclatees ou bas.
  // titre : où écrire « Pioches » (null = pas de titre commun).
  const DISPOSITIONS = {
    bas: { titre: { x: 860, y: 874 }, pioches: { evenement: [778, 930], feedback: [860, 930], test: [942, 930] } },
    droite: { titre: null, etiquette: "gauche", pioches: { evenement: [1332, 506], feedback: [1332, 604], test: [1332, 702] } },
    gauche: { titre: { x: 150, y: 490 }, pioches: { evenement: [68, 546], feedback: [150, 546], test: [232, 546] } },
    // Chaque pioche près de sa source : Vera, la communauté, SCAN.
    eclatees: { titre: null, pioches: { evenement: [70, 246], feedback: [440, 905], test: [1330, 560] } }
  };
  const DOS = { l: 56, h: 78 };
  let disposition = "droite";

  function dessinerPioches() {
    const choix = new URLSearchParams(location.search).get("pioches");
    if (choix && DISPOSITIONS[choix]) disposition = choix;
    const D = DISPOSITIONS[disposition];
    if (D.titre) el("text", { x: D.titre.x, y: D.titre.y, class: "pioches-titre", "text-anchor": "middle", texte: t("pioche.titre") }, calques.pioches);
    ["evenement", "feedback", "test"].forEach((type) => {
      const [x, y] = D.pioches[type];
      const g = el("g", { class: "pioche pioche-" + type, "data-pioche": type, transform: `translate(${x},${y})`, tabindex: 0, role: "button" }, calques.pioches);
      // Trois dos décalés : on voit l'épaisseur du paquet.
      [3, 0].forEach((d, i) => {
        el("rect", { x: -DOS.l / 2 + d, y: -DOS.h / 2 + d, width: DOS.l, height: DOS.h, rx: 7, class: "dos-carte" + (i ? " dessus" : " dessous") }, g);
      });
      const dessus = el("g", { class: "dos-motif" }, g);
      dessinerMotifDos(dessus, type, 0.55);
      // Le nom et le compteur : sous le paquet, ou à sa gauche quand les pioches sont en colonne.
      if (D.etiquette === "gauche") {
        el("text", { x: -DOS.l / 2 - 12, y: -2, class: "pioche-nom", "text-anchor": "end", texte: t("pioche." + type) }, g);
        el("text", { x: -DOS.l / 2 - 12, y: 15, class: "pioche-compte", "text-anchor": "end", texte: "" }, g);
      } else {
        el("text", { x: 0, y: DOS.h / 2 + 20, class: "pioche-nom", "text-anchor": "middle", texte: t("pioche." + type) }, g);
        el("text", { x: 0, y: DOS.h / 2 + 37, class: "pioche-compte", "text-anchor": "middle", texte: "" }, g);
      }
    });
  }

  // Le motif au dos d'une carte (aussi utilisé pour la grande carte qui vole).
  function dessinerMotifDos(g, type, echelle) {
    const m = el("g", { transform: `scale(${echelle})` }, g);
    if (type === "test") {
      el("text", { x: 0, y: 18, class: "dos-lettre", "text-anchor": "middle", texte: "?" }, m);
    } else if (type === "feedback") {
      el("path", { d: "M-26,-22 H26 Q34,-22 34,-14 V10 Q34,18 26,18 H-4 L-18,32 V18 H-26 Q-34,18 -34,10 V-14 Q-34,-22 -26,-22 Z", class: "dos-icone" }, m);
    } else {
      el("path", { d: "M0,-34 L10,-10 L34,-10 L14,4 L22,30 L0,14 L-22,30 L-14,4 L-34,-10 L-10,-10 Z", class: "dos-icone" }, m);
    }
  }

  function majPioche(type, n) {
    const g = svg.querySelector(`.pioche[data-pioche="${type}"]`);
    g.querySelector(".pioche-compte").textContent = n > 0 ? String(n) : t("pioche.vide");
    g.classList.toggle("vide", n <= 0);
  }

  // L'événement du cycle : une petite carte posée à côté de Vera.
  function poserEvenement(id) {
    calques.evenement.innerHTML = "";
    if (!id) return;
    const g = el("g", { class: "evenement-pose", transform: "translate(445,104)" }, calques.evenement);
    el("rect", { x: -17, y: -23, width: 34, height: 46, rx: 4, class: "dos-carte evenement-mini" }, g);
    el("text", { x: 0, y: 6, class: "evenement-mini-id", "text-anchor": "middle", texte: id }, g);
    el("text", { x: 26, y: -6, class: "evenement-titre" , texte: t("evenement.du.cycle") }, g);
    el("text", { x: 26, y: 12, class: "evenement-texte", texte: abreger(t("carte." + id + ".titre"), 22) }, g);
  }

  // La légende de l'effort : relie les tickets aux heures et aux tokens du tableau de bord.
  function dessinerLegende() {
    const g = el("g", { class: "legende", transform: "translate(850,940)" }, calques.liens);
    el("rect", { x: -16, y: -30, width: 500, height: 100, rx: 14, class: "legende-fond" }, g);
    el("text", { x: 0, y: -6, class: "legende-titre", texte: t("legende.titre") }, g);
    [["humain", "legende.humain"], ["agent", "legende.agent"], ["", "legende.afaire"]].forEach(([qui, cle], i) => {
      const y = 18 + i * 21;
      el("rect", { x: 0, y: y - 9, width: 26, height: 8, rx: 4, class: "case-effort" + (qui ? " faite par-" + qui : "") }, g);
      el("text", { x: 38, y: y, class: "legende-texte", texte: t(cle) }, g);
    });
    // Les petites cartes Test sous les efforts de PIX : ce qu'elles veulent dire.
    const x2 = 268;
    el("text", { x: x2, y: -6, class: "legende-titre", texte: t("legende.test.titre") }, g);
    ["cachee", "ok", "bug"].forEach((etat, i) => {
      const y = 18 + i * 21;
      const c = el("g", { class: "carte-test " + etat, transform: `translate(${x2 + 8},${y - 4}) scale(0.8)` }, g);
      miniCarteTest(c, etat);
      el("text", { x: x2 + 24, y: y, class: "legende-texte", texte: t("legende.test." + etat) }, g);
    });
  }

  function definitions() {
    const defs = el("defs", {}, svg);
    const m = el("marker", {
      id: "pointe", viewBox: "0 0 10 10", refX: 8, refY: 5,
      markerWidth: 7, markerHeight: 7, orient: "auto-start-reverse"
    }, defs);
    el("path", { d: "M0,0 L10,5 L0,10 Z", class: "pointe" }, m);
    const m2 = el("marker", {
      id: "pointe-equipe", viewBox: "0 0 10 10", refX: 8, refY: 5,
      markerWidth: 6, markerHeight: 6, orient: "auto-start-reverse"
    }, defs);
    el("path", { d: "M0,0 L10,5 L0,10 Z", class: "pointe-equipe" }, m2);

    // Un cercle de découpe pour les portraits.
    const clip = el("clipPath", { id: "rond", clipPathUnits: "objectBoundingBox" }, defs);
    el("circle", { cx: 0.5, cy: 0.5, r: 0.5 }, clip);

    // Le halo doux du soleil.
    const halo = el("radialGradient", { id: "halo-soleil" }, defs);
    el("stop", { offset: "55%", class: "halo-soleil-centre" }, halo);
    el("stop", { offset: "100%", class: "halo-soleil-bord" }, halo);
  }

  function dessinerCiel() {
    const r = aleatoire(42);
    for (let i = 0; i < 170; i++) {
      const x = -345 + r() * (G.largeur + 345), y = r() * G.hauteur;
      const taille = r() < 0.12 ? 2.4 : r() * 1.3 + 0.5;
      el("circle", {
        cx: x.toFixed(1), cy: y.toFixed(1), r: taille.toFixed(2),
        class: "etoile" + (r() < 0.25 ? " scintille" : ""),
        style: `animation-delay:${(r() * 6).toFixed(2)}s`
      }, calques.ciel);
    }
  }

  function dessinerOrbite() {
    const g = calques.orbite;
    el("ellipse", { cx: G.cx, cy: G.cy, rx: G.rx + 26, ry: G.ry + 26, class: "orbite-anneau" }, g);
    el("ellipse", { cx: G.cx, cy: G.cy, rx: G.rx, ry: G.ry, class: "orbite-trace" }, g);
    el("ellipse", { cx: G.cx, cy: G.cy, rx: G.rx, ry: G.ry, class: "orbite-flux" }, g);
    el("ellipse", { cx: G.cx, cy: G.cy, rx: COULOIR.rx, ry: COULOIR.ry, class: "couloir" }, g);

    // Des chevrons qui indiquent le sens du flux, entre les stations sans file.
    [-120, 60, 120].forEach((angle) => {
      const p = surOrbite(angle);
      const a = (angle * Math.PI) / 180;
      const dir = (Math.atan2(G.ry * Math.cos(a), -G.rx * Math.sin(a)) * 180) / Math.PI;
      el("path", {
        d: "M-7,-9 L4,0 L-7,9", class: "chevron",
        transform: `translate(${p.x},${p.y}) rotate(${dir})`
      }, g);
    });
  }

  function dessinerFiles() {
    S.files.forEach((file) => {
      const p = surOrbite(file.angle);
      const g = el("g", { class: "file" + (file.principale ? " file-principale" : ""), "data-file": file.id }, calques.files);
      const h = 17, ecart = 6, l = 54;
      const total = file.places * h + (file.places - 1) * ecart;
      el("rect", {
        x: p.x - l / 2 - 8, y: p.y - total / 2 - 8, width: l + 16, height: total + 16,
        rx: 10, class: "file-fond"
      }, g);
      for (let i = 0; i < file.places; i++) {
        // On remplit par le bas : la file « monte » quand le travail s'entasse.
        const y = p.y + total / 2 - h - i * (h + ecart);
        el("rect", { x: p.x - l / 2, y, width: l, height: h, rx: 4, class: "case-file", "data-index": i }, g);
      }
      if (file.principale) {
        const tx = p.x + l / 2 + 20;
        el("text", { x: tx, y: p.y - 14, class: "etiquette-file forte", texte: t("file.titre") }, g);
        el("text", { x: tx, y: p.y + 4, class: "etiquette-file", texte: t("file.principale") }, g);
        el("text", { x: tx, y: p.y + 21, class: "etiquette-file aide", texte: t("file.trier") }, g);
      }
    });
  }

  function dessinerStations() {
    S.stations.forEach((s) => {
      const p = surOrbite(s.angle);
      const g = el("g", { class: "station", "data-station": s.id, transform: `translate(${p.x},${p.y})` }, calques.stations);
      el("circle", { r: G.rStation + 16, class: "station-halo" }, g);
      el("circle", { r: G.rStation, class: "station-planete" }, g);
      el("circle", { r: G.rStation - 12, class: "station-interieur" }, g);
      el("path", { d: ICONES[s.icone], class: "station-icone", transform: "scale(1.35)" }, g);

      // L'étiquette va à l'extérieur de l'orbite : au-dessus en haut, en dessous en bas.
      const enHaut = p.y < G.cy;
      const y0 = enHaut ? -G.rStation - 40 : G.rStation + 32;
      el("text", { x: 0, y: y0, class: "station-nom", "text-anchor": "middle", texte: t("station." + s.id) }, g);
      el("text", { x: 0, y: y0 + 20, class: "station-aide", "text-anchor": "middle", texte: t("station." + s.id + ".aide") }, g);
    });
  }

  function dessinerSoleil() {
    const g = el("g", { class: "soleil", transform: `translate(${G.cx},${G.cy})` }, calques.soleil);
    el("circle", { r: G.rSoleil + 46, fill: "url(#halo-soleil)", class: "soleil-halo" }, g);
    el("circle", { r: G.rSoleil, class: "soleil-disque" }, g);
    el("text", { x: 0, y: -92, class: "soleil-titre", "text-anchor": "middle", texte: t("pilotage.titre") }, g);

    S.roles.forEach((role, i) => {
      const y = -50 + i * 52;
      const ligne = el("g", { class: "role", "data-role": role, transform: `translate(0,${y})` }, g);
      if (S.portraitsRoles && S.portraitsRoles[role]) portrait(ligne, S.portraitsRoles[role], -98, 0, 22, "equipe");
      el("text", { x: -68, y: -1, class: "role-nom", texte: t("role." + role) }, ligne);
      if (S.equipe && S.equipe[role]) el("text", { x: -68, y: 15, class: "role-personne", texte: t("nom." + S.equipe[role]) }, ligne);
      for (let j = 0; j < S.heuresParRole; j++) {
        // Un jeton Heure qui reste au pilotage : la même pastille ambre que sur les stations.
        badgeRole(ligne, role, 52 + j * 30, 0, 14, "jeton-soleil").dataset.index = j;
      }
    });
  }

  function portrait(parent, fichier, x, y, r, classe) {
    el("circle", { cx: x, cy: y, r: r + 3, class: "portrait-cadre " + (classe || "") }, parent);
    el("circle", { cx: x, cy: y, r, class: "portrait-fond" }, parent);
    el("image", {
      href: PORTRAITS + fichier, x: x - r, y: y - r, width: 2 * r, height: 2 * r,
      "clip-path": "url(#rond)", class: "pixel", preserveAspectRatio: "xMidYMid slice"
    }, parent);
  }

  // Le badge d'un rôle : une pastille avec sa lettre (CP, D, P). Plus lisible qu'un petit visage.
  function badgeRole(parent, role, x, y, r, classe) {
    const g = el("g", { class: "badge-role " + (classe || ""), "data-role": role, transform: `translate(${x},${y})` }, parent);
    el("circle", { r, class: "badge-role-fond" }, g);
    el("text", {
      x: 0, y: r * 0.36, class: "badge-role-lettre", "text-anchor": "middle",
      style: `font-size:${(r * (t("role." + role + ".court").length > 1 ? 0.85 : 1.1)).toFixed(1)}px`,
      texte: t("role." + role + ".court")
    }, g);
    return g;
  }

  function fleche(d, libelle, lx, ly, ancre, classe, parent) {
    const p = parent || calques.liens;
    el("path", { d, class: "fleche " + (classe || ""), "marker-end": `url(#${classe ? "pointe-equipe" : "pointe"})` }, p);
    if (libelle) el("text", { x: lx, y: ly, class: "fleche-libelle " + (classe || ""), "text-anchor": ancre || "middle", texte: libelle }, p);
  }

  function dessinerPlanetes() {
    // Nebulous Publishing, l'éditeur, en haut à gauche : il donne la mission, le brief
    // et le cadre, qui arrivent au Backlog. Les idées de l'équipe y arrivent aussi.
    const neb = el("g", { class: "planete planete-editeur", "data-planete": "nebulous" }, calques.planetes);
    const n = { x: 150, y: 112 };
    el("ellipse", { cx: n.x, cy: n.y, rx: 70, ry: 15, class: "planete-anneau", transform: `rotate(-14 ${n.x} ${n.y})` }, neb);
    el("circle", { cx: n.x, cy: n.y, r: 44, class: "planete-disque" }, neb);
    portrait(neb, S.personnages.vera, n.x, n.y, 28);
    el("text", { x: n.x + 66, y: n.y - 10, class: "planete-nom", "text-anchor": "start", texte: t("planete.nebulous") }, neb);
    el("text", { x: n.x + 66, y: n.y + 10, class: "planete-aide", "text-anchor": "start", texte: t("planete.nebulous.aide") }, neb);
    el("text", { x: n.x + 66, y: n.y + 30, class: "planete-personne", "text-anchor": "start", texte: t("nom.vera") }, neb);
    // Vera commande un jeu pour le festival : elle ne choisit ni le jeu ni ses fonctionnalités.
    // Les idées viennent de l'équipe (pas de flèche vers les Idées).
    // L'équipe choisit dans les Idées et range dans le Backlog.
    const zi = ZONES.idees, zb = ZONES.backlog;
    const lz = el("g", { class: "liens-zones" }, calques.liens);
    fleche(`M${zi.x + zi.l + 4},${zb.y + 86} H${zb.x - 6}`, "", 0, 0, "middle", "fleche-equipe", lz);
    t("fleche.choix").split(" / ").forEach((ligne, i) =>
      el("text", { x: (zi.x + zi.l + zb.x) / 2, y: zb.y + 56 + i * 15, class: "fleche-libelle fleche-equipe", "text-anchor": "middle", texte: ligne }, lz));
    // Les idées de gamers arrivent par le feedback trié.
    const ff = surOrbite(180);
    fleche(`M${ff.x - 36},${ff.y + 96} Q${ff.x - 120},${ZONES.cachees.y + 30} ${zi.x + zi.l + 4},${ZONES.cachees.y + 20}`, t("fleche.idees.gamers"), 150, ZONES.cachees.y - 6, "middle", "fleche-equipe", lz);

    // La communauté, en bas à gauche : reçoit les releases, renvoie le feedback.
    const com = el("g", { class: "planete planete-communaute", "data-planete": "communaute" }, calques.planetes);
    const c = { x: 205, y: 905 };
    el("circle", { cx: c.x, cy: c.y, r: 58, class: "planete-disque" }, com);
    el("path", { d: "M-22,10 a22,22 0 0,1 44,0 M-11,-12 a11,11 0 1,0 22,0 a11,11 0 1,0 -22,0", class: "planete-icone", transform: `translate(${c.x},${c.y + 4})` }, com);
    el("text", { x: c.x, y: c.y + 88, class: "planete-nom", "text-anchor": "middle", texte: t("planete.communaute") }, com);
    const r = posStation("release"), f = posStation("feedback");
    fleche(`M${r.x - 64},${r.y + 22} Q${r.x - 170},${c.y + 10} ${c.x + 80},${c.y + 4}`, t("fleche.release"), 560, 935);
    fleche(`M${c.x + 6},${c.y - 66} Q${c.x + 20},${f.y + 40} ${f.x - 58},${f.y + 26}`, t("fleche.retours"), 186, 780);
  }

  function dessinerSatellites() {
    const places = {
      pix:  { x: 1205, y: 225, r: 36 },
      arty: { x: 1290, y: 385, r: 28 },
      scan: { x: 1205, y: 785, r: 36 }
    };
    S.agents.forEach((a) => {
      const p = places[a.id];
      const s = posStation(a.station);
      const verrou = a.verrouJusquAuCycle !== undefined;
      el("line", { x1: s.x, y1: s.y, x2: p.x, y2: p.y, class: "attache" + (verrou ? " verrou" : "") }, calques.liens);

      const g = el("g", { class: "satellite" + (verrou ? " verrouille" : ""), "data-agent": a.id }, calques.satellites);
      el("circle", { cx: p.x, cy: p.y, r: p.r + 12, class: "satellite-anneau" }, g);
      if (a.image) {
        portrait(g, a.image, p.x, p.y, p.r, "agent");
      } else {
        el("circle", { cx: p.x, cy: p.y, r: p.r, class: "satellite-vide" }, g);
        el("path", { d: "M-9,-2 V-8 a9,9 0 0,1 18,0 V-2 M-13,-2 H13 V14 H-13 Z", class: "cadenas", transform: `translate(${p.x},${p.y - 2})` }, g);
      }
      el("text", { x: p.x, y: p.y + p.r + 32, class: "satellite-nom", "text-anchor": "middle", texte: t("agent." + a.id) }, g);
      el("text", {
        x: p.x, y: p.y + p.r + 50, class: "satellite-role", "text-anchor": "middle",
        texte: verrou ? t("agent.verrou").replace("{n}", a.verrouJusquAuCycle) : t("agent." + a.id + ".role")
      }, g);
    });
    G.places = places;
  }

  // --- Les fonctions d'état (appelées par la vitrine, puis par le script) ----

  // Ce que le plateau montre en ce moment (pour que les animations partent du bon endroit).
  const vu = { station: null, posees: {}, utilisees: {}, files: {} };

  function illuminerStation(id) {
    vu.station = id;
    svg.querySelectorAll(".station").forEach((g) => g.classList.toggle("active", g.dataset.station === id));
  }

  // n peut dépasser la taille de la file : elle déborde (elle tremble et rougit).
  function remplirFile(id, n) {
    const g = svg.querySelector(`.file[data-file="${id}"]`);
    const avant = vu.files[id] || 0;
    vu.files[id] = n;
    const cases = g.querySelectorAll(".case-file");
    cases.forEach((c) => {
      const i = +c.dataset.index;
      c.classList.toggle("pleine", i < n);
      // Une case qui vient de se remplir « arrive » (petit rebond).
      c.classList.remove("arrive");
      if (i < n && i >= avant) {
        void c.getBoundingClientRect();
        c.classList.add("arrive");
      }
    });
    g.classList.toggle("saturee", n >= cases.length);
    if (n > cases.length && n > avant) {
      g.classList.remove("deborde");
      void g.getBoundingClientRect();
      g.classList.add("deborde");
    }
  }

  function utiliserHeures(role, n) {
    vu.utilisees[role] = n;
    const g = svg.querySelector(`.role[data-role="${role}"]`);
    // Les jetons partent de la droite : ceux qui restent sont à gauche.
    // Un jeton parti laisse une place vide : il est posé sur une station.
    g.querySelectorAll(".jeton-soleil").forEach((c) => c.classList.toggle("utilise", +c.dataset.index >= S.heuresParRole - n));
  }

  // Où se trouve un jeton Heure au pilotage (index 0 à 2, de gauche à droite).
  function posJetonSoleil(role, index) {
    return { x: G.cx + 52 + index * 30, y: G.cy - 50 + S.roles.indexOf(role) * 52 };
  }

  // Où se pose le i-ème jeton Heure sur une station : comme une petite lune sur le bord de la planète.
  // En haut, l'étiquette est au-dessus de la planète : les jetons vont sur sa droite.
  // Sur Build, ils vont à gauche, pour ne pas croiser le lien de PIX.
  const DEPART_JETONS = { build: 195 };
  function posHeurePosee(stationId, i) {
    const p = surOrbite(station(stationId).angle);
    const depart = DEPART_JETONS[stationId] !== undefined ? DEPART_JETONS[stationId] : p.y < G.cy ? -30 : -130;
    const a = ((depart + i * 34) * Math.PI) / 180;
    const r = G.rStation + 4;
    return { x: p.x + r * Math.cos(a), y: p.y + r * Math.sin(a) };
  }

  // Les jetons Heure posés sur une station. roles : la liste des propriétaires,
  // par exemple ["chef", "designer"] (un jeton par heure), avec la lettre de chacun.
  function poserHeures(stationId, roles) {
    vu.posees[stationId] = (roles || []).slice();
    calques.jetons.querySelectorAll(`[data-station="${stationId}"]`).forEach((e) => e.remove());
    if (!roles || !roles.length) return;
    const g = el("g", { class: "jetons-poses", "data-station": stationId }, calques.jetons);
    roles.forEach((role, i) => {
      const p = posHeurePosee(stationId, i);
      badgeRole(g, role, p.x, p.y, 16, "heure-posee").dataset.index = i;
    });
  }
  function elementHeurePosee(stationId, i) {
    return calques.jetons.querySelector(`.jetons-poses[data-station="${stationId}"] .heure-posee[data-index="${i}"]`);
  }

  function activerAgent(id, actif) {
    const g = svg.querySelector(`.satellite[data-agent="${id}"]`);
    if (g) g.classList.toggle("actif", actif);
  }

  function afficherBulle(id, visible, cleTexte) {
    calques.bulles.querySelectorAll(`[data-agent="${id}"]`).forEach((e) => e.remove());
    if (!visible) return;
    const p = G.places[id];
    const texte = t(cleTexte || "agent." + id + ".bulle");
    const l = Math.round(texte.length * 8.8) + 40, h = 50;
    // Au-dessus de PIX, sous les étiquettes de SCAN : la bulle ne cache ni les files ni les pioches.
    const dessous = id === "scan";
    const x = Math.min(1372 - l, Math.max(p.x - l / 2, 880));
    const y = dessous ? p.y + p.r + 66 : p.y - p.r - 30 - h;
    const tx = Math.max(x + 24, Math.min(x + l - 24, p.x));
    const g = el("g", { class: "bulle", "data-agent": id }, calques.bulles);
    const queue = dessous
      ? `M${x + 12},${y} H${tx - 10} L${tx},${y - 16} L${tx + 10},${y} H${x + l - 12}`
      : `M${x + 12},${y} H${x + l - 12}`;
    const basQ = dessous ? `H${x + 12}` : `H${tx + 10} L${tx},${y + h + 16} L${tx - 10},${y + h} H${x + 12}`;
    el("path", {
      d: `${queue} Q${x + l},${y} ${x + l},${y + 12} V${y + h - 12} Q${x + l},${y + h} ${x + l - 12},${y + h}
          ${basQ} Q${x},${y + h} ${x},${y + h - 12} V${y + 12} Q${x},${y} ${x + 12},${y} Z`,
      class: "bulle-fond"
    }, g);
    el("text", { x: x + l / 2, y: y + 31, class: "bulle-texte", "text-anchor": "middle", texte: texte }, g);
  }

  // --- Les trois zones des fonctionnalités -----------------------------------
  // Idées (pas encore choisies) → Backlog (choisies, par priorité) → couloir du cycle (autour du soleil).

  const ZONES = {
    idees: { x: -332, y: 232, l: 292, h: 470 },
    cachees: { y: 622 },
    backlog: { x: 48, y: 232, l: 176, places: 5 }
  };
  const TUILE = { l: 133, h: 40, pas: 46 };

  function dessinerZones() {
    const zi = ZONES.idees, zb = ZONES.backlog;
    const g = calques.zones;
    el("rect", { x: zi.x, y: zi.y, width: zi.l, height: zi.h, rx: 16, class: "zone-fond" }, g);
    el("text", { x: zi.x + 14, y: zi.y + 26, class: "zone-titre", texte: t("zone.idees.titre") }, g);
    el("text", { x: zi.x + 14, y: zi.y + 44, class: "zone-aide", texte: t("zone.idees.aide") }, g);
    // La légende du talon ambre : une idée de gamer, venue du feedback.
    el("rect", { x: zi.x + 14, y: zi.y + 52, width: 10, height: 13, rx: 3, class: "tuile-talon gamer" }, g);
    el("text", { x: zi.x + 30, y: zi.y + 62, class: "zone-aide", texte: t("zone.legende.gamer") }, g);
    // La pile des idées de gamers, encore cachées.
    const p = el("g", { class: "pile-cachees", transform: `translate(${zi.x + 40},${ZONES.cachees.y + 22})` }, g);
    [4, 2, 0].forEach((d) => el("rect", { x: -24 + d, y: -30 + d, width: 48, height: 64, rx: 6, class: "dos-idee" }, p));
    el("path", { d: "M-11,-10 H11 Q15,-10 15,-6 V4 Q15,8 11,8 H-2 L-8,14 V8 H-11 Q-15,8 -15,4 V-6 Q-15,-10 -11,-10 Z", class: "dos-idee-icone" }, p);
    el("text", { x: 38, y: -8, class: "zone-titre petit", texte: t("zone.cachees") }, p);
    el("text", { x: 38, y: 12, class: "zone-aide compte-cachees", texte: "" }, p);

    const hb = 46 + zb.places * TUILE.pas;
    const pb = posStation("backlog"), r = G.rStation;
    const haut = { x: pb.x + r * Math.cos((232 * Math.PI) / 180), y: pb.y + r * Math.sin((232 * Math.PI) / 180) };
    const bas = { x: pb.x + r * Math.cos((136 * Math.PI) / 180), y: pb.y + r * Math.sin((136 * Math.PI) / 180) };
    const coin1 = { x: zb.x + zb.l, y: zb.y + 8 }, coin2 = { x: zb.x + zb.l, y: zb.y + hb - 90 };
    el("path", { d: `M${haut.x},${haut.y} L${coin1.x},${coin1.y} L${coin2.x},${coin2.y} L${bas.x},${bas.y} Z`, class: "zoom-cone" }, g);
    el("path", { d: `M${haut.x},${haut.y} L${coin1.x},${coin1.y} M${bas.x},${bas.y} L${coin2.x},${coin2.y}`, class: "zoom-trait" }, g);
    el("rect", { x: zb.x, y: zb.y, width: zb.l, height: hb, rx: 14, class: "zone-fond backlog" }, g);
    el("text", { x: zb.x + 12, y: zb.y + 24, class: "zone-titre", texte: t("zone.backlog.titre") }, g);
    el("text", { x: zb.x + 12, y: zb.y + 40, class: "zone-aide", texte: t("zone.backlog.aide") }, g);
    for (let i = 0; i < zb.places; i++) {
      const y = zb.y + 50 + i * TUILE.pas;
      el("rect", { x: zb.x + 26, y, width: zb.l - 34, height: TUILE.h, rx: 8, class: "place-vide" }, g);
      el("text", { x: zb.x + 14, y: y + 25, class: "place-rang", "text-anchor": "middle", texte: String(i + 1) }, g);
    }
  }

  // Une tuile : une fonctionnalité pas encore lancée (dans les Idées ou le Backlog).
  function tuile(parent, f, x, y, l, classe) {
    const def = S.fonctionnalites[f];
    const g = el("g", { class: "tuile " + classe + (def.ideeGamer ? " idee-gamer" : ""), "data-f": f, transform: `translate(${x},${y})`, tabindex: 0, role: "button" }, parent);
    el("rect", { x: 0, y: 0, width: l, height: TUILE.h, rx: 8, class: "tuile-fond" }, g);
    el("path", { d: `M8,0 H32 V${TUILE.h} H8 Q0,${TUILE.h} 0,${TUILE.h - 8} V8 Q0,0 8,0 Z`, class: "tuile-talon" + (def.ideeGamer ? " gamer" : "") }, g);
    el("text", { x: 16, y: 17, class: "tuile-id", "text-anchor": "middle", texte: f }, g);
    el("text", { x: 16, y: 32, class: "tuile-lettre", "text-anchor": "middle", texte: t("role." + def.resp + ".court") }, g);
    el("text", { x: 39, y: 17, class: "tuile-nom", texte: abreger(t("f." + f), l > 150 ? 17 : 15) }, g);
    for (let i = 0; i < def.etoiles; i++) {
      el("path", { d: "M0,-5 L1.5,-1.6 L5,-1.6 L2.2,0.7 L3.2,4.2 L0,2.1 L-3.2,4.2 L-2.2,0.7 L-5,-1.6 L-1.5,-1.6 Z", class: "ticket-etoile", transform: `translate(${44 + i * 11},29)` }, g);
    }
    for (let i = 0; i < def.efforts; i++) {
      el("rect", { x: l - 12 - (def.efforts - i) * 15, y: 25, width: 12, height: 6, rx: 3, class: "case-effort" }, g);
    }
    return g;
  }

  // idees : les fonctionnalités visibles pas encore choisies ; cachees : combien d'idées de gamers restent cachées.
  function poserIdees(idees, cachees, nouvelle) {
    calques.idees.querySelectorAll(".tuile-idee").forEach((e) => e.remove());
    const zi = ZONES.idees;
    idees.forEach((f, i) => {
      const x = zi.x + 9 + (i % 2) * (TUILE.l + 8), y = zi.y + 74 + Math.floor(i / 2) * TUILE.pas;
      const g = tuile(calques.idees, f, x, y, TUILE.l, "tuile-idee");
      if (f === nouvelle) g.classList.add("nouvelle");
    });
    const c = svg.querySelector(".compte-cachees");
    if (c) c.textContent = t("zone.cachees.compte").replace("{n}", cachees);
  }

  function poserBacklog(liste) {
    calques.idees.querySelectorAll(".tuile-backlog").forEach((e) => e.remove());
    const zb = ZONES.backlog;
    liste.slice(0, zb.places).forEach((f, i) => tuile(calques.idees, f, zb.x + 26, zb.y + 50 + i * TUILE.pas, zb.l - 34, "tuile-backlog"));
  }

  // Le couloir du cycle : chaque station a sa place sur un anneau entre l'orbite et le soleil.
  const COULOIR = { rx: 255, ry: 205 };
  const DECALAGES = [0, 54, -54, 108];
  function placeCouloir(stationId, index) {
    const a = (station(stationId).angle * Math.PI) / 180;
    return { x: G.cx + COULOIR.rx * Math.cos(a), y: G.cy + COULOIR.ry * Math.sin(a) + (DECALAGES[index] || index * 54) };
  }

  // Une carte Fonctionnalité = un ticket qui voyage sur l'orbite.
  // À gauche le talon (son numéro), puis son nom, sa valeur (les étoiles)
  // et sa barre d'effort (le travail à faire : une case = un effort).
  const TICKET = { g: -92, d: 92, h: 30, talon: -50 };
  const EFFORT = { largeur: 26, ecart: 4, compact: 15 };
  const tickets = {};

  // Dans le couloir, le ticket est compact : numéro, lettre du responsable, nom court, barre d'effort.
  // Au survol, la loupe montre le ticket complet (avec les étoiles).
  const COMPACT = { l: 132, h: 36, talon: 30 };
  function poserTicket(v, index) {
    tickets[v.f] = { v, index };
    const def = S.fonctionnalites[v.f];
    const p = placeCouloir(v.station, index);
    const g = el("g", {
      class: "ticket compact" + (vu.choisi === v.f ? " choisi" : ""), "data-f": v.f,
      transform: `translate(${p.x},${p.y})`, tabindex: 0, role: "button"
    }, calques.tickets);
    const L = -COMPACT.l / 2, R = COMPACT.l / 2, H = COMPACT.h / 2, T = L + COMPACT.talon;
    el("rect", { x: L, y: -H, width: COMPACT.l, height: COMPACT.h, rx: 8, class: "ticket-fond" }, g);
    el("path", { d: `M${L + 8},${-H} H${T} V${H} H${L + 8} Q${L},${H} ${L},${H - 8} V${-H + 8} Q${L},${-H} ${L + 8},${-H} Z`, class: "ticket-talon" + (def.ideeGamer ? " gamer" : "") }, g);
    el("rect", { x: L, y: -H, width: COMPACT.l, height: COMPACT.h, rx: 8, class: "ticket-contour" }, g);
    el("text", { x: (L + T) / 2, y: -2, class: "ticket-id compact", "text-anchor": "middle", texte: v.f }, g);
    el("text", { x: (L + T) / 2, y: 13, class: "tuile-lettre", "text-anchor": "middle", texte: t("role." + def.resp + ".court") }, g);
    const x0 = T + 7;
    el("text", { x: x0, y: -3, class: "ticket-nom compact", texte: abreger(t("f." + v.f), 14) }, g);
    const lc = EFFORT.compact, ecart = 3;
    for (let i = 0; i < def.efforts; i++) {
      const qui = (v.efforts || [])[i];
      el("rect", {
        x: x0 + i * (lc + ecart), y: 5, width: lc, height: 7, rx: 3.5,
        class: "case-effort" + (qui ? " faite par-" + (qui === "pix" ? "agent" : "humain") : ""), "data-index": i
      }, g);
    }
    poserCartesTest(g, v, x0, lc, ecart, H);
    return g;
  }

  // La loupe : le ticket complet, dessiné par-dessus le ticket compact survolé.
  function montrerLoupe(f) {
    calques.loupe.innerHTML = "";
    const memo = tickets[f];
    if (!memo) return;
    const p = placeCouloir(memo.v.station, memo.index);
    const g = el("g", { class: "loupe" + (vu.choisi === f ? " choisi" : ""), transform: `translate(${p.x},${p.y - 4})` }, calques.loupe);
    dessinerTicketComplet(g, memo.v);
  }
  function cacherLoupe() { calques.loupe.innerHTML = ""; }

  function dessinerTicketComplet(g, v) {
    const def = S.fonctionnalites[v.f];
    g.classList.add("ticket");
    const { g: L, d: R, h: H, talon: T } = TICKET;

    // La forme du ticket, avec deux encoches à la ligne de découpe.
    const forme = `M${L + 8},${-H} H${T - 6} A6,6 0 0,0 ${T + 6},${-H} H${R - 8} Q${R},${-H} ${R},${-H + 8}
      V${H - 8} Q${R},${H} ${R - 8},${H} H${T + 6} A6,6 0 0,0 ${T - 6},${H} H${L + 8} Q${L},${H} ${L},${H - 8}
      V${-H + 8} Q${L},${-H} ${L + 8},${-H} Z`;
    el("path", { d: forme, class: "ticket-fond" }, g);
    el("path", {
      d: `M${L + 8},${-H} H${T - 6} A6,6 0 0,0 ${T},${-H + 6} V${H - 6} A6,6 0 0,0 ${T - 6},${H} H${L + 8}
        Q${L},${H} ${L},${H - 8} V${-H + 8} Q${L},${-H} ${L + 8},${-H} Z`,
      class: "ticket-talon" + (def.ideeGamer ? " gamer" : "")
    }, g);
    el("line", { x1: T, y1: -H + 8, x2: T, y2: H - 8, class: "ticket-decoupe" }, g);
    el("path", { d: forme, class: "ticket-contour" }, g);
    el("text", { x: (L + T) / 2, y: -9, class: "ticket-id", "text-anchor": "middle", texte: v.f }, g);
    // La lettre du responsable : c'est lui qui la produit, relit le travail de PIX et corrige.
    if (def.resp) badgeRole(g, def.resp, (L + T) / 2, 12, 11, "ticket");

    const x0 = T + 9;
    el("text", { x: x0, y: -11, class: "ticket-nom", texte: abreger(t("f." + v.f), 17) }, g);
    for (let i = 0; i < def.etoiles; i++) {
      el("path", {
        d: "M0,-6 L1.8,-1.9 L6,-1.9 L2.6,0.8 L3.8,5 L0,2.5 L-3.8,5 L-2.6,0.8 L-6,-1.9 L-1.8,-1.9 Z",
        class: "ticket-etoile", transform: `translate(${x0 + 6 + i * 14},6)`
      }, g);
    }
    const faits = (v.efforts || []).length;
    el("text", {
      x: R - 9, y: 10, class: "ticket-effort", "text-anchor": "end",
      texte: t("ticket.effort").replace("{n}", faits).replace("{total}", def.efforts)
    }, g);

    // La barre d'effort : une case de taille fixe par effort (1 effort = 1 heure ou 1 token).
    // Faite par l'équipe : ambre, comme les heures. Faite par PIX : cyan, comme les tokens.
    const lc = EFFORT.largeur, ecart = EFFORT.ecart;
    for (let i = 0; i < def.efforts; i++) {
      const qui = (v.efforts || [])[i];
      el("rect", {
        x: x0 + i * (lc + ecart), y: 15, width: lc, height: 8, rx: 4,
        class: "case-effort" + (qui ? " faite par-" + (qui === "pix" ? "agent" : "humain") : ""), "data-index": i
      }, g);
    }

    poserCartesTest(g, v, x0, lc, ecart, H);
    return g;
  }

  // Les cartes Test, cachées sous les efforts faits par PIX.
  function poserCartesTest(g, v, x0, lc, ecart, H) {
    const effortsPix = (v.efforts || []).map((q, i) => (q === "pix" ? i : -1)).filter((i) => i >= 0);
    // Une carte Test vaut { id, revelee } : son type vient du paquet du scénario.
    (v.cartesTest || []).forEach((carte, k) => {
      const i = effortsPix[k] !== undefined ? effortsPix[k] : k;
      const def = S.cartes.test.find((c) => c.id === carte.id);
      const etat = carte.revelee && def ? def.type : "cachee";
      const c = el("g", {
        class: "carte-test " + etat + (etat === "cachee" ? " cliquable" : ""), "data-carte": carte.id || "", "data-f": v.f,
        transform: `translate(${x0 + i * (lc + ecart) + lc / 2},${H + 14})`
      }, g);
      miniCarteTest(c, etat);
      // L'infobulle dit ce qu'est cette petite carte (et ce qu'on peut en faire).
      el("title", { texte: t("carte.test.aide." + etat) }, c);
    });
  }

  // Une petite carte Test : « ? » cachée, « ✓ » OK, « ! » Bug ou Pas fun.
  function miniCarteTest(c, etat) {
    el("rect", { x: -8, y: -10, width: 16, height: 21, rx: 3, class: "carte-test-fond" }, c);
    const lettre = etat === "cachee" ? t("carte.test.cachee") : etat === "ok" ? "✓" : "!";
    el("text", { x: 0, y: 4.5, class: "carte-test-texte", "text-anchor": "middle", texte: lettre }, c);
  }

  // La fonctionnalité choisie (clic sur son ticket) : le banc d'essai, puis le joueur, agissent sur elle.
  function choisir(f) {
    vu.choisi = vu.choisi === f ? null : f;
    calques.tickets.querySelectorAll(".ticket").forEach((e) => e.classList.toggle("choisi", e.dataset.f === vu.choisi));
    document.dispatchEvent(new CustomEvent("plateau:choix", { detail: vu.choisi }));
  }

  // Retirer un ticket du couloir (quand il est publié, par exemple).
  function retirerTicket(f) {
    const e = calques.tickets.querySelector(`.ticket[data-f="${f}"]`);
    if (e) e.remove();
    delete tickets[f];
  }

  function viderTickets() { calques.tickets.innerHTML = ""; }

  // Redessiner un ticket après un changement (un effort fait, une carte Test ajoutée ou retournée).
  function majTicket(f, changer) {
    const memo = tickets[f];
    if (!memo) return;
    changer(memo.v);
    const ancien = calques.tickets.querySelector(`.ticket[data-f="${f}"]`);
    const suivant = ancien ? ancien.nextSibling : null;
    if (ancien) ancien.remove();
    const g = poserTicket(memo.v, memo.index);
    if (suivant) calques.tickets.insertBefore(g, suivant);
  }

  function ticket(f) { return tickets[f] && tickets[f].v; }
  function ticketsA(stationId) { return Object.values(tickets).map((m) => m.v).filter((v) => v.station === stationId); }

  // Déplacer un ticket (pendant un voyage) : x, y en coordonnées du plateau.
  function placerTicket(f, x, y) {
    const e = elementTicket(f);
    if (e) e.setAttribute("transform", `translate(${x},${y})`);
  }
  // Changer la place d'un ticket une fois le voyage fini (station et rang dans la station).
  function rangerTicket(f, stationId, index) {
    const memo = tickets[f];
    if (!memo) return;
    memo.v.station = stationId;
    memo.index = index;
    const p = placeCouloir(stationId, index);
    placerTicket(f, p.x, p.y);
  }
  function rangTicket(f) { return tickets[f] ? tickets[f].index : -1; }

  // Faire briller une case d'effort qui vient d'être faite.
  function animerCase(f, index) {
    const c = svg.querySelector(`.ticket[data-f="${f}"] .case-effort[data-index="${index}"]`);
    if (c) c.classList.add("se-remplit");
  }

  // Les éléments à l'écran (pour faire voler une carte depuis ou vers eux).
  function elementPioche(type) { return svg.querySelector(`.pioche[data-pioche="${type}"] .dos-carte.dessus`); }
  function elementCarteTest(id) { return svg.querySelector(`.carte-test[data-carte="${id}"]`); }
  function elementTicket(f) { return svg.querySelector(`.ticket[data-f="${f}"]`); }
  function elementFile(id) { return svg.querySelector(`.file[data-file="${id}"] .file-fond`); }
  function elementEvenement() { return svg.querySelector(".evenement-pose rect") || svg.querySelector('.planete[data-planete="nebulous"] .planete-disque'); }
  function elementPlanete(id) { return svg.querySelector(`.planete[data-planete="${id}"] .planete-disque`); }
  function elementSvg() { return svg; }

  function zoneSous(x, y) {
    const zi = ZONES.idees, zb = ZONES.backlog;
    if (x >= zi.x && x <= zi.x + zi.l && y >= zi.y && y <= zi.y + zi.h) return { zone: "idees" };
    const hb = 46 + zb.places * TUILE.pas;
    if (x >= zb.x && x <= zb.x + zb.l && y >= zb.y && y <= zb.y + hb) {
      return { zone: "backlog", index: Math.max(0, Math.min(zb.places - 1, Math.floor((y - zb.y - 50) / TUILE.pas))) };
    }
    if (((x - G.cx) / G.rx) ** 2 + ((y - G.cy) / G.ry) ** 2 < 1) return { zone: "cycle" };
    return null;
  }

  // Les coordonnées du plateau sous le pointeur.
  function pointPlateau(evt) {
    const p = svg.createSVGPoint();
    p.x = evt.clientX; p.y = evt.clientY;
    return p.matrixTransform(svg.getScreenCTM().inverse());
  }

  // Le fantôme d'une tuile qu'on glisse.
  function creerFantome(tuileEl) {
    calques.glisse.innerHTML = "";
    const c = tuileEl.cloneNode(true);
    c.classList.add("fantome");
    calques.glisse.appendChild(c);
    return c;
  }
  function viderFantome() { calques.glisse.innerHTML = ""; }
  function montrerCibles(depuis, oui) {
    svg.classList.toggle("glisse-en-cours", oui);
    svg.classList.toggle("depuis-backlog", oui && depuis === "backlog");
  }
  function elementTuile(f) { return svg.querySelector(`.tuile[data-f="${f}"]`); }
  function elementPileCachees() { return svg.querySelector(".pile-cachees rect:last-of-type"); }
  function placeBacklogLibre(n) {
    const zb = ZONES.backlog;
    return n < zb.places;
  }

  window.Plateau = {
    init, illuminerStation, remplirFile, utiliserHeures, poserHeures,
    activerAgent, afficherBulle, poserTicket, viderTickets, majTicket, ticket, ticketsA,
    majPioche, poserEvenement, dessinerMotifDos, poserIdees, poserBacklog, retirerTicket, montrerLoupe, cacherLoupe,
    placeBacklogLibre, basculerZones, zoneSous, pointPlateau, creerFantome, viderFantome, montrerCibles,
    elementPioche, elementCarteTest, elementTicket, elementFile, elementEvenement, elementPlanete, elementSvg,
    elementTuile, elementPileCachees,
    // Pour les animations (js/animations.js) : l'état visible et la géométrie.
    placerTicket, rangerTicket, rangTicket, animerCase, elementHeurePosee,
    stationActive: () => vu.station,
    choisir, choisi: () => vu.choisi,
    heuresPosees: (st) => (vu.posees[st] || []).slice(),
    toutesHeuresPosees: () => JSON.parse(JSON.stringify(vu.posees)),
    heuresUtilisees: () => Object.assign({}, vu.utilisees),
    niveauFile: (id) => vu.files[id] || 0,
    outils: {
      el, badgeRole, posJetonSoleil, posHeurePosee, placeCouloir, posStation,
      angleStation: (id) => station(id).angle,
      surOrbite, G, COULOIR, DECALAGES, places: () => G.places, calque: (nom) => calques[nom]
    }
  };
})();
