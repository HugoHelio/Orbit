// Les briques animées du plateau (étape 2 de la démo).
// Comme le dessin, elles ne savent pas d'où viennent les ordres : aujourd'hui le banc d'essai,
// à l'étape 3 le script de la démo, plus tard le moteur de règles.
// Chaque brique renvoie une promesse, résolue quand l'animation est finie :
// on peut les enchaîner (await) ou les lancer ensemble.

(function () {
  const S = () => window.SCENARIO;
  const reduit = window.matchMedia("(prefers-reduced-motion: reduce)");

  // vitesse : 1 ou 2 (la barre de lecture de l'étape 3 la changera).
  const Anim = { vitesse: 1 };

  function duree(ms) { return reduit.matches ? 0 : ms / Anim.vitesse; }

  // --- Petits outils -----------------------------------------------------------

  const douce = (p) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);

  // Faire varier une valeur de 0 à 1 pendant ms millisecondes.
  function tween(ms, chaque, courbe) {
    const d = duree(ms);
    return new Promise((ok) => {
      if (!d) { chaque(1); ok(); return; }
      const t0 = performance.now();
      function image(maintenant) {
        const p = Math.min(1, (maintenant - t0) / d);
        chaque((courbe || douce)(p));
        if (p < 1) requestAnimationFrame(image); else ok();
      }
      requestAnimationFrame(image);
    });
  }

  function pause(ms) { return new Promise((ok) => setTimeout(ok, duree(ms))); }

  // Une courbe douce entre deux points : le point de contrôle est décalé sur le côté.
  function controle(a, b, courbure) {
    const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
    return { x: mx - (b.y - a.y) * courbure, y: my + (b.x - a.x) * courbure };
  }
  function bezier(a, c, b, p) {
    const q = 1 - p;
    return { x: q * q * a.x + 2 * q * p * c.x + p * p * b.x, y: q * q * a.y + 2 * q * p * c.y + p * p * b.y };
  }

  // Rejouer une animation CSS (retirer la classe, puis la remettre).
  function rejouer(e, classe) {
    if (!e) return;
    e.classList.remove(classe);
    void e.getBoundingClientRect();
    e.classList.add(classe);
  }

  // Le point d'un ticket dans le couloir, pour une station et un rang (angle en degrés).
  // d : le décalage { x, y } du rang dans la station.
  function pointCouloir(angle, d) {
    const O = Plateau.outils, a = (angle * Math.PI) / 180;
    return { x: O.G.cx + O.COULOIR.rx * Math.cos(a) + d.x, y: O.G.cy + O.COULOIR.ry * Math.sin(a) + d.y };
  }
  // Mélanger deux décalages (p de 0 à 1).
  function entre(d1, d2, p) { return { x: d1.x + (d2.x - d1.x) * p, y: d1.y + (d2.y - d1.y) * p }; }

  // --- 1. Un jeton vole du pilotage vers une station ---------------------------
  // sorte : "heure" (par défaut) ou "prod" (le jeton ⚒ Prod, le seul qui produit un effort).
  // Le jeton part de sa place au pilotage et la laisse vide.
  // Renvoie false si la personne n'a plus de jeton de cette sorte.

  async function envolerHeure(role, stationId, sorte) {
    const O = Plateau.outils;
    const pris = Plateau.prendreJeton(role, sorte || "heure");
    if (!pris) return false;
    const depart = O.posJetonSoleil(role, pris.index);
    const posees = Plateau.heuresPosees(stationId);
    const arrivee = O.posHeurePosee(stationId, posees.length);
    const c = controle(depart, arrivee, 0.22);

    const glisse = O.calque("glisse");
    const trace = O.el("path", { d: `M${depart.x},${depart.y} Q${c.x},${c.y} ${arrivee.x},${arrivee.y}`, class: "trace-vol" + (pris.prod ? " prod" : "") }, glisse);
    const vol = O.jeton(glisse, role, depart.x, depart.y, 14, "heure-posee en-vol", pris.prod);
    await tween(800, (p) => {
      const q = bezier(depart, c, arrivee, p);
      const echelle = (1 + 0.45 * Math.sin(Math.PI * p)) * (1 + p / 7);
      vol.setAttribute("transform", `translate(${q.x},${q.y}) scale(${echelle})`);
    });
    vol.remove();
    setTimeout(() => trace.remove(), duree(900));

    Plateau.poserHeures(stationId, posees.concat({ role, prod: pris.prod, depuis: pris.index }));
    rejouer(Plateau.elementHeurePosee(stationId, posees.length), "atterrit");
    return true;
  }

  // Fin du cycle : tous les jetons posés reviennent au pilotage, en même temps.
  async function rappelerHeures() {
    const O = Plateau.outils;
    const posees = Plateau.toutesHeuresPosees();
    const utilisees = Plateau.heuresUtilisees();
    const glisse = O.calque("glisse");
    const retour = {};
    const vols = [];
    for (const st in posees) {
      posees[st].forEach((j, i) => {
        const role = j.role;
        const n = utilisees[role] || 0;
        retour[role] = (retour[role] || 0) + 1;
        // Chaque jeton revient à sa place ; sans place connue, dans les places vides, de gauche à droite.
        const depart = O.posHeurePosee(st, i);
        const arrivee = O.posJetonSoleil(role, j.depuis !== null && j.depuis !== undefined ? j.depuis : S().heuresParRole - n + retour[role] - 1);
        const c = controle(depart, arrivee, -0.18);
        const vol = O.jeton(glisse, role, depart.x, depart.y, 16, "heure-posee en-vol", j.prod);
        vols.push(tween(900, (p) => {
          const q = bezier(depart, c, arrivee, p);
          vol.setAttribute("transform", `translate(${q.x},${q.y}) scale(${1 - p * 0.12})`);
        }).then(() => vol.remove()));
      });
      Plateau.poserHeures(st, []);
    }
    await Promise.all(vols);
    Plateau.libererJetons();
  }

  // --- 2. Une station s'illumine -----------------------------------------------
  // Une comète part de la station active et file sur l'orbite, dans le sens du flux,
  // jusqu'à la nouvelle station, qui s'allume avec une onde.

  async function allumerStation(id) {
    const O = Plateau.outils;
    const avant = Plateau.stationActive();
    if (avant && avant !== id) {
      const a1 = O.angleStation(avant);
      let a2 = O.angleStation(id);
      while (a2 <= a1) a2 += 360;
      Plateau.illuminerStation(null);
      const g = O.el("g", { class: "comete" }, O.calque("glisse"));
      const points = [0, 1, 2, 3, 4, 5].map((k) =>
        O.el("circle", { r: 9 - k * 1.3, class: "comete-point", opacity: (1 - k * 0.16).toFixed(2) }, g));
      await tween(Math.max(500, ((a2 - a1) / 60) * 420), (p) => {
        points.forEach((pt, k) => {
          const q = O.surOrbite(a1 + (a2 - a1) * p - k * 2.5 * Math.sin(Math.PI * Math.min(1, p * 1.4)));
          pt.setAttribute("cx", q.x.toFixed(1));
          pt.setAttribute("cy", q.y.toFixed(1));
        });
      });
      g.remove();
    }
    Plateau.illuminerStation(id);
    rejouer(document.querySelector(`.station[data-station="${id}"]`), "allumage");
    await pause(500);
  }

  // --- 3. Un ticket (une fonctionnalité) avance dans le couloir -------------
  // Il glisse le long du couloir jusqu'à la station suivante (ou celle qu'on donne) ;
  // les tickets restés derrière se resserrent.

  async function avancerTicket(f, vers) {
    const O = Plateau.outils;
    const v = Plateau.ticket(f);
    if (!v) return false;
    const ordre = S().stations.map((s) => s.id);
    const de = v.station;
    vers = vers || ordre[(ordre.indexOf(de) + 1) % ordre.length];
    const i1 = Plateau.rangTicket(f), i2 = Plateau.ticketsA(vers).length;
    const a1 = O.angleStation(de);
    let a2 = O.angleStation(vers);
    while (a2 <= a1) a2 += 360;
    const d1 = O.decalageCouloir(de, i1), d2 = O.decalageCouloir(vers, i2);
    // La place d'arrivée est réservée tout de suite : plusieurs tickets peuvent partir ensemble.
    Plateau.reserverTicket(f, vers, i2);

    Plateau.cacherLoupe();
    const e = Plateau.elementTicket(f);
    e.parentNode.appendChild(e); // au premier plan pendant le voyage
    e.classList.add("en-voyage");
    await tween(Math.max(900, ((a2 - a1) / 60) * 900), (p) => {
      const q = pointCouloir(a1 + (a2 - a1) * p, entre(d1, d2, p));
      Plateau.placerTicket(f, q.x, q.y);
    });
    e.classList.remove("en-voyage");
    Plateau.rangerTicket(f, vers, i2);
    rejouer(e, "arrive");
    await resserrer(de);
    return true;
  }

  // La petite boucle : un problème trouvé au Test, et le ticket recule (au Build) dans le couloir.
  // Une flèche rouge montre le retour ; elle reste jusqu'à ce que le ticket revienne (on la renvoie).
  async function reculerTicket(f, vers) {
    const O = Plateau.outils;
    const v = Plateau.ticket(f);
    if (!v) return null;
    const de = v.station;
    const i1 = Plateau.rangTicket(f), i2 = Plateau.ticketsA(vers).length;
    const a1 = O.angleStation(de), a2 = O.angleStation(vers);
    const d1 = O.decalageCouloir(de, i1), d2 = O.decalageCouloir(vers, i2);
    const fleche = Plateau.flecheRetour(de, vers);
    rejouer(fleche, "apparait");
    Plateau.reserverTicket(f, vers, i2);
    Plateau.cacherLoupe();
    const e = Plateau.elementTicket(f);
    e.parentNode.appendChild(e);
    e.classList.add("en-voyage", "recule");
    await tween(1100, (p) => {
      const q = pointCouloir(a1 + (a2 - a1) * p, entre(d1, d2, p));
      Plateau.placerTicket(f, q.x, q.y);
    });
    e.classList.remove("en-voyage", "recule");
    Plateau.rangerTicket(f, vers, i2);
    Plateau.majTicket(f, () => {});
    rejouer(Plateau.elementTicket(f), "arrive");
    await resserrer(de);
    return fleche;
  }

  // Les tickets restés à une station reprennent les premières places (ils glissent).
  function resserrer(stationId) {
    const O = Plateau.outils, a = O.angleStation(stationId);
    const restants = Plateau.ticketsA(stationId).sort((x, y) => Plateau.rangTicket(x.f) - Plateau.rangTicket(y.f));
    return Promise.all(restants.map((x, k) => {
      const r = Plateau.rangTicket(x.f);
      if (r === k) return null;
      Plateau.reserverTicket(x.f, stationId, k);
      return tween(350, (p) => {
        const q = pointCouloir(a, entre(O.decalageCouloir(stationId, r), O.decalageCouloir(stationId, k), p));
        Plateau.placerTicket(x.f, q.x, q.y);
      }).then(() => Plateau.rangerTicket(x.f, stationId, k));
    }));
  }

  // Une fonctionnalité publiée part vers la communauté (la planète des gamers), puis quitte le couloir.
  async function publierTicket(f) {
    const v = Plateau.ticket(f);
    if (!v) return false;
    const de = v.station;
    const e = Plateau.elementTicket(f);
    const p0 = Plateau.outils.placeCouloir(de, Plateau.rangTicket(f));
    const p1 = { x: 205, y: 905 }; // la planète Communauté
    const c = controle(p0, p1, -0.25);
    Plateau.cacherLoupe();
    e.parentNode.appendChild(e);
    e.classList.add("en-voyage");
    await tween(1000, (p) => {
      const q = bezier(p0, c, p1, p);
      e.setAttribute("transform", `translate(${q.x},${q.y}) scale(${1 - p * 0.75})`);
      e.setAttribute("opacity", (1 - p * p).toFixed(2));
    });
    Plateau.retirerTicket(f);
    rejouer(document.querySelector('.planete[data-planete="communaute"]'), "recoit");
    await resserrer(de);
    return true;
  }

  // Une tuile vole des Idées au Backlog, ou du Backlog au couloir. La règle du déplacement
  // (et le redessin des zones) reste dans Pioches.deplacer : ici, on ne fait que le vol.
  async function volerTuile(f, zone, index, stationId) {
    const O = Plateau.outils;
    const tuile = Plateau.elementTuile(f);
    if (!tuile) return;
    const m = tuile.transform.baseVal.consolidate().matrix;
    const de = { x: m.e, y: m.f }, vers = Plateau.cibleTuile(zone, index, stationId);
    const fantome = Plateau.creerFantome(tuile);
    tuile.classList.add("en-deplacement");
    const c = controle(de, vers, 0.12);
    await tween(650, (p) => {
      const q = bezier(de, c, vers, p);
      fantome.setAttribute("transform", `translate(${q.x},${q.y})`);
    });
    Plateau.viderFantome();
  }

  // Une tuile qui vient d'arriver dans les zones (déjà dessinée à sa place) vole depuis un point du plateau :
  // le ticket correctif part de la Communauté vers le Backlog (la grande boucle).
  async function arriverTuile(f, de) {
    const tuile = Plateau.elementTuile(f);
    if (!tuile) return;
    const m = tuile.transform.baseVal.consolidate().matrix;
    const vers = { x: m.e, y: m.f };
    const fantome = Plateau.creerFantome(tuile);
    tuile.classList.add("en-deplacement");
    const c = controle(de, vers, -0.2);
    await tween(1100, (p) => {
      const q = bezier(de, c, vers, p);
      fantome.setAttribute("transform", `translate(${q.x},${q.y}) scale(${0.5 + p / 2})`);
    });
    Plateau.viderFantome();
    tuile.classList.remove("en-deplacement");
    rejouer(tuile, "nouvelle");
  }

  // --- 4. Un effort se remplit sur un ticket ------------------------------------
  // qui : "humain" (case ambre, 1 heure) ou "pix" (case cyan, 1 token).

  // i (facultatif) : la case à remplir (une case vidée par une correction) ; sinon la première libre.
  function remplirEffort(f, qui, i) {
    const v = Plateau.ticket(f);
    const def = Plateau.def(f);
    if (!v) return false;
    const efforts = (v.efforts || []).slice();
    if (i === undefined) {
      i = efforts.findIndex((x) => !x);
      if (i < 0) i = efforts.length;
    }
    if (i >= def.efforts) return false;
    efforts[i] = qui;
    Plateau.majTicket(f, (x) => { x.efforts = efforts; });
    Plateau.animerCase(f, i);
    // Le ticket est complet : son contour brille.
    if (efforts.filter(Boolean).length === def.efforts) rejouer(Plateau.elementTicket(f), "complet");
    return true;
  }

  // Une vérification humaine : une loupe (code review) ou une manette (playtest) au-dessus du ticket.
  // Renvoie une fonction pour arrêter.
  function examiner(f, sorte) {
    const O = Plateau.outils;
    const v = Plateau.ticket(f);
    if (!v) return () => {};
    const p = O.placeCouloir(v.station, Plateau.rangTicket(f));
    const g = O.el("g", { class: "examen examen-" + sorte, transform: `translate(${p.x + 6},${p.y - 44})` }, O.calque("bulles"));
    O.el("circle", { r: 19, class: "examen-fond" }, g);
    if (sorte === "review") {
      O.el("path", { d: "M-3,-3 m-8,0 a8,8 0 1,0 16,0 a8,8 0 1,0 -16,0 M3,3 L11,11", class: "examen-icone" }, g);
    } else {
      O.el("path", { d: "M-13,-6 H13 Q17,-6 17,-2 V6 Q17,10 13,10 H8 L5,6 H-5 L-8,10 H-13 Q-17,10 -17,6 V-2 Q-17,-6 -13,-6 Z", class: "examen-icone" }, g);
      O.el("path", { d: "M-10,2 H-4 M-7,-1 V5", class: "examen-trait" }, g);
      O.el("circle", { cx: 7, cy: 0, r: 1.8, class: "examen-point" }, g);
      O.el("circle", { cx: 11, cy: 4, r: 1.8, class: "examen-point" }, g);
    }
    Plateau.elementTicket(f).classList.add("examine");
    return () => {
      g.remove();
      const e = Plateau.elementTicket(f);
      if (e) e.classList.remove("examine");
    };
  }

  // --- 5. Un agent au travail ---------------------------------------------------
  // Le satellite s'agite, un rayon le relie au ticket. PIX envoie des petits </>,
  // SCAN fait passer une barre de scan sur le ticket. Renvoie une fonction pour arrêter.

  function travailler(id, f) {
    const O = Plateau.outils;
    const P = O.places()[id];
    const sat = document.querySelector(`.satellite[data-agent="${id}"]`);
    if (!P || !sat) return () => {};
    sat.classList.add("actif", "travaille");
    const g = O.el("g", { class: "travail travail-" + id }, O.calque("bulles"));
    const v = f && Plateau.ticket(f);
    const cible = v ? O.placeCouloir(v.station, Plateau.rangTicket(f)) : O.posStation(id === "scan" ? "test" : "build");
    O.el("line", { x1: P.x, y1: P.y, x2: cible.x, y2: cible.y, class: "rayon" }, g);
    let fini = false;

    if (!reduit.matches && id === "pix") {
      (async () => {
        while (!fini) {
          const s = O.el("text", { class: "code-volant", "text-anchor": "middle", texte: "</>" }, g);
          tween(650, (p) => {
            s.setAttribute("x", (P.x + (cible.x - P.x) * p).toFixed(1));
            s.setAttribute("y", (P.y + (cible.y - P.y) * p - 18 * Math.sin(Math.PI * p)).toFixed(1));
            s.setAttribute("opacity", (1 - p * 0.6).toFixed(2));
          }, (p) => p).then(() => s.remove());
          await pause(230);
        }
      })();
    }
    if (!reduit.matches && id === "scan") {
      const barre = O.el("rect", { class: "barre-scan", y: cible.y - 24, width: 4, height: 48, rx: 2 }, g);
      (async () => {
        let sens = 1;
        while (!fini) {
          const x0 = cible.x - 68 * sens, x1 = cible.x + 66 * sens;
          await tween(520, (p) => barre.setAttribute("x", (x0 + (x1 - x0) * p).toFixed(1)));
          sens = -sens;
        }
      })();
    }
    return () => {
      fini = true;
      g.remove();
      sat.classList.remove("travaille");
    };
  }

  // --- 6. Une file d'attente grossit --------------------------------------------
  // Plateau.remplirFile anime déjà les cases qui arrivent et la file qui déborde :
  // on garde ici une entrée au même nom que les autres briques.

  function changerFile(id, n) {
    Plateau.remplirFile(id, Math.max(0, n));
  }

  Object.assign(Anim, {
    tween, pause, envolerHeure, rappelerHeures, allumerStation, avancerTicket, reculerTicket, publierTicket, volerTuile,
    arriverTuile, remplirEffort, examiner, travailler, changerFile, rejouer
  });
  window.Anim = Anim;
})();
