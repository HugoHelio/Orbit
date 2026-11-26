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
    rSoleil: 128,
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

  // Point entre une station et le soleil (là où se garent les vaisseaux).
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
    svg.setAttribute("viewBox", `20 48 ${G.largeur - 40} ${G.hauteur - 58}`);
    svg.innerHTML = "";

    definitions();
    calques = {};
    ["ciel", "orbite", "liens", "files", "stations", "soleil", "planetes",
     "satellites", "jetons", "vaisseaux", "bulles"].forEach((nom) => {
      calques[nom] = el("g", { class: "calque-" + nom }, svg);
    });

    dessinerCiel();
    dessinerOrbite();
    dessinerFiles();
    dessinerStations();
    dessinerSoleil();
    dessinerPlanetes();
    dessinerSatellites();
  }

  function definitions() {
    const defs = el("defs", {}, svg);
    const m = el("marker", {
      id: "pointe", viewBox: "0 0 10 10", refX: 8, refY: 5,
      markerWidth: 7, markerHeight: 7, orient: "auto-start-reverse"
    }, defs);
    el("path", { d: "M0,0 L10,5 L0,10 Z", class: "pointe" }, m);

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
      const x = r() * G.largeur, y = r() * G.hauteur;
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
        const tx = p.x - l / 2 - 22;
        el("text", { x: tx, y: p.y - 8, class: "etiquette-file forte", "text-anchor": "end", texte: t("file.titre") }, g);
        el("text", { x: tx, y: p.y + 12, class: "etiquette-file", "text-anchor": "end", texte: t("file.principale") }, g);
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
    el("text", { x: 0, y: -66, class: "soleil-titre", "text-anchor": "middle", texte: t("pilotage.titre") }, g);

    S.roles.forEach((role, i) => {
      const y = -28 + i * 40;
      const ligne = el("g", { class: "role", "data-role": role, transform: `translate(0,${y})` }, g);
      el("text", { x: -96, y: 5, class: "role-nom", texte: t("role." + role) }, ligne);
      for (let j = 0; j < S.heuresParRole; j++) {
        el("circle", { cx: 40 + j * 24, cy: 0, r: 9, class: "jeton-heure", "data-index": j }, ligne);
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

  function fleche(d, libelle, lx, ly) {
    el("path", { d, class: "fleche", "marker-end": "url(#pointe)" }, calques.liens);
    if (libelle) el("text", { x: lx, y: ly, class: "fleche-libelle", "text-anchor": "middle", texte: libelle }, calques.liens);
  }

  function dessinerPlanetes() {
    // Nébuleuse Games, en haut à gauche, envoie les missions vers le Backlog.
    const neb = el("g", { class: "planete planete-editeur", "data-planete": "nebuleuse" }, calques.planetes);
    const n = { x: 135, y: 150 };
    el("ellipse", { cx: n.x, cy: n.y, rx: 92, ry: 20, class: "planete-anneau", transform: `rotate(-14 ${n.x} ${n.y})` }, neb);
    el("circle", { cx: n.x, cy: n.y, r: 62, class: "planete-disque" }, neb);
    portrait(neb, S.personnages.vera, n.x, n.y, 38);
    el("text", { x: n.x, y: n.y + 96, class: "planete-nom", "text-anchor": "middle", texte: t("planete.nebuleuse") }, neb);
    el("text", { x: n.x, y: n.y + 116, class: "planete-aide", "text-anchor": "middle", texte: t("planete.nebuleuse.aide") }, neb);
    const b = posStation("backlog");
    fleche(`M${n.x + 70},${n.y + 30} Q${b.x - 90},${n.y + 40} ${b.x - 52},${b.y - 42}`, t("fleche.missions"), 318, 186);

    // La communauté, en bas à gauche : reçoit les releases, renvoie le feedback.
    const com = el("g", { class: "planete planete-communaute", "data-planete": "communaute" }, calques.planetes);
    const c = { x: 205, y: 905 };
    el("circle", { cx: c.x, cy: c.y, r: 58, class: "planete-disque" }, com);
    el("path", { d: "M-22,10 a22,22 0 0,1 44,0 M-11,-12 a11,11 0 1,0 22,0 a11,11 0 1,0 -22,0", class: "planete-icone", transform: `translate(${c.x},${c.y + 4})` }, com);
    el("text", { x: c.x, y: c.y + 88, class: "planete-nom", "text-anchor": "middle", texte: t("planete.communaute") }, com);
    S.planetes.find((p) => p.id === "communaute").personnages.forEach((nom, i) => {
      portrait(com, S.personnages[nom], c.x + 100 + i * 62, c.y + 6, 25, "petit");
    });
    const r = posStation("release"), f = posStation("feedback");
    fleche(`M${r.x - 64},${r.y + 22} Q${r.x - 150},${c.y + 10} ${c.x + 300},${c.y + 6}`, t("fleche.release"), 600, 940);
    fleche(`M${c.x + 6},${c.y - 66} Q${c.x + 20},${f.y + 40} ${f.x - 58},${f.y + 26}`, t("fleche.retours"), 186, 780);
  }

  function dessinerSatellites() {
    const places = {
      pix:  { x: 1222, y: 218, r: 50 },
      arty: { x: 1300, y: 390, r: 34 },
      scan: { x: 1222, y: 792, r: 50 }
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

  function illuminerStation(id) {
    svg.querySelectorAll(".station").forEach((g) => g.classList.toggle("active", g.dataset.station === id));
  }

  function remplirFile(id, n) {
    const g = svg.querySelector(`.file[data-file="${id}"]`);
    g.querySelectorAll(".case-file").forEach((c) => c.classList.toggle("pleine", +c.dataset.index < n));
  }

  function utiliserHeures(role, n) {
    const g = svg.querySelector(`.role[data-role="${role}"]`);
    // Les jetons partent de la droite : ceux qui restent sont à gauche.
    g.querySelectorAll(".jeton-heure").forEach((c) => c.classList.toggle("utilise", +c.dataset.index >= S.heuresParRole - n));
  }

  // Les jetons Heure posés sur une station.
  function poserHeures(stationId, n) {
    calques.jetons.querySelectorAll(`[data-station="${stationId}"]`).forEach((e) => e.remove());
    if (!n) return;
    const p = surOrbite(station(stationId).angle);
    const g = el("g", { class: "jetons-poses", "data-station": stationId }, calques.jetons);
    // Les jetons se posent comme de petites lunes sur le bord de la planète.
    for (let i = 0; i < n; i++) {
      const a = ((-128 + i * 24) * Math.PI) / 180;
      const r = G.rStation + 2;
      el("circle", { cx: p.x + r * Math.cos(a), cy: p.y + r * Math.sin(a), r: 9, class: "jeton-heure pose" }, g);
    }
  }

  function activerAgent(id, actif) {
    const g = svg.querySelector(`.satellite[data-agent="${id}"]`);
    if (g) g.classList.toggle("actif", actif);
  }

  function afficherBulle(id, visible) {
    calques.bulles.querySelectorAll(`[data-agent="${id}"]`).forEach((e) => e.remove());
    if (!visible) return;
    const p = G.places[id];
    const texte = t("agent." + id + ".bulle");
    const l = Math.round(texte.length * 7.6) + 32, h = 40;
    // La bulle se place à gauche du satellite.
    const x = p.x - p.r - 18 - l;
    const y = id === "scan" ? p.y + 26 : p.y - p.r - 30;
    const g = el("g", { class: "bulle", "data-agent": id }, calques.bulles);
    el("path", {
      d: `M${x + 10},${y} H${x + l - 10} Q${x + l},${y} ${x + l},${y + 10} V${y + h - 10} Q${x + l},${y + h} ${x + l - 10},${y + h}
          H${x + l - 30} L${x + l + 6},${y + h + 16} L${x + l - 48},${y + h} H${x + 10} Q${x},${y + h} ${x},${y + h - 10}
          V${y + 10} Q${x},${y} ${x + 10},${y} Z`,
      class: "bulle-fond"
    }, g);
    el("text", { x: x + l / 2, y: y + 26, class: "bulle-texte", "text-anchor": "middle", texte: texte }, g);
  }

  // Un vaisseau = une carte Fonctionnalité. index : sa place dans la pile de la station.
  function poserVaisseau(v, index) {
    const def = S.fonctionnalites[v.f];
    // Les vaisseaux se garent entre la station et le soleil ; une pile se décale vers le haut.
    const distance = v.station === "backlog" ? 165 : 150;
    const p = versLeCentre(posStation(v.station), distance);
    const x = p.x + index * 6, y = p.y - index * 11;
    const g = el("g", { class: "vaisseau", "data-f": v.f, transform: `translate(${x},${y}) scale(1.15)` }, calques.vaisseaux);

    el("path", { d: "M-82,-9 L-96,0 L-82,9 Z", class: "flamme" }, g);
    el("path", { d: "M-70,-25 H50 L80,0 L50,25 H-70 Q-80,25 -80,15 V-15 Q-80,-25 -70,-25 Z", class: "vaisseau-coque" }, g);
    el("path", { d: "M-70,-25 H-62 V25 H-70 Q-80,25 -80,15 V-15 Q-80,-25 -70,-25 Z", class: "vaisseau-bande" }, g);
    el("circle", { cx: 58, cy: 0, r: 6, class: "vaisseau-hublot" }, g);
    el("text", { x: -52, y: -5, class: "vaisseau-nom", texte: abreger(t("f." + v.f), 20) }, g);

    for (let i = 0; i < def.etoiles; i++) {
      el("path", {
        d: "M0,-6 L1.8,-1.9 L6,-1.9 L2.6,0.8 L3.8,5 L0,2.5 L-3.8,5 L-2.6,0.8 L-6,-1.9 L-1.8,-1.9 Z",
        class: "vaisseau-etoile", transform: `translate(${-45 + i * 15},12)`
      }, g);
    }
    const faits = v.effortsFaits || 0;
    for (let i = 0; i < def.efforts; i++) {
      el("rect", {
        x: 4 + i * 15, y: 5, width: 12, height: 12, rx: 2.5,
        class: "case-effort" + (i < faits ? " faite" : ""), "data-index": i
      }, g);
    }

    // Les cartes Test, cachées sous les efforts faits par PIX.
    (v.cartesTest || []).forEach((etat, i) => {
      const c = el("g", { class: "carte-test " + etat, transform: `translate(${10 + i * 15},40)` }, g);
      el("rect", { x: -7, y: -9, width: 14, height: 19, rx: 2.5, class: "carte-test-fond" }, c);
      const lettre = etat === "cachee" ? t("carte.test.cachee") : etat === "ok" ? "✓" : "!";
      el("text", { x: 0, y: 4.5, class: "carte-test-texte", "text-anchor": "middle", texte: lettre }, c);
    });
    return g;
  }

  function viderVaisseaux() { calques.vaisseaux.innerHTML = ""; }

  window.Plateau = {
    init, illuminerStation, remplirFile, utiliserHeures, poserHeures,
    activerAgent, afficherBulle, poserVaisseau, viderVaisseaux
  };
})();
