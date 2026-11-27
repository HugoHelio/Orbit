// Le lecteur de la démo : il joue les étapes du script (js/script-demo.js) l'une après l'autre,
// avec la barre de lecture (lecture, pause, pas à pas, vitesse ×1 ou ×2, recommencer).
// Il n'invente rien : chaque étape appelle les mêmes actions que le banc d'essai
// (js/banc.js) et les mêmes briques animées (js/animations.js). Le moteur de règles fera pareil.

(function () {
  let S, t, etat, etapes = [], i = 0;
  let enLecture = false, enCours = null, unPas = false;

  function pause(ms) { return Anim.pause(ms); }

  // --- Ce que fait chaque étape --------------------------------------------------

  const FAIRE = {
    async temps(e) {
      if (e.cycle !== undefined) etat.cycle = e.cycle;
      if (e.temps) etat.temps = e.temps;
      TableauDeBord.afficherTemps(document.getElementById("temps"), etat.cycle, etat.temps);
      TableauDeBord.afficherBoucles(etat.bouclesFaites, etat.cycle);
      if (e.guide) document.getElementById("guide-texte").textContent = t(e.guide);
      if (e.station === null) Plateau.illuminerStation(null);
      else if (e.station) await Actions.station(e.station);
      await pause(700);
    },

    async vera(e) {
      Plateau.bulleVera(e.texte);
      if (e.texte) await pause(400);
    },

    attendre(e) { return pause(e.ms); },

    async station(e) { await Actions.station(e.id); },

    async heure(e) { await Actions.heure(e.role, e.station); },

    async rappel() { await Actions.rappelerHeures(); },

    // Des idées passent dans le Backlog, une par une.
    async auBacklog(e) {
      for (const f of e.f) {
        const rang = etat.backlog.length;
        await Anim.volerTuile(f, "backlog", rang);
        Pioches.deplacer(f, "idees", { zone: "backlog", index: rang });
      }
    },

    // Du Backlog au couloir du cycle (station Prompt), une par une.
    async lancer(e) {
      for (const f of e.f) {
        await Anim.volerTuile(f, "cycle", Plateau.ticketsA("prompt").length);
        Pioches.deplacer(f, "backlog", { zone: "cycle" });
      }
      await pause(300);
    },

    // Plusieurs tickets avancent ensemble, avec un petit décalage au départ.
    async avancer(e) {
      await Promise.all(e.f.map((f, k) => pause(k * 160).then(() => Actions.avancer(f))));
    },

    async effort(e) {
      if (e.qui === "humain") await Actions.effortHumain(e.f);
      else if (e.sansCarte) await Actions.effortPixSansCarte(e.f);
      else await Actions.effortPix(e.f, e.carte);
      await pause(250);
    },

    async evenement(e) { await Pioches.piocher("evenement", e.id); },

    async feedback(e) {
      for (const id of [].concat(e.id)) await Pioches.piocher("feedback", id);
    },

    async trier() { await Pioches.trier(); },

    async scanner(e) { await Actions.scanner(e.f, e.carte); await pause(400); },

    async corriger(e) { await Actions.corriger(e.f, e.carte); },

    async reveler(e) { await Pioches.reveler(e.carte); await pause(400); },

    async file(e) { Actions.file(e.id, e.n); await pause(500); },

    // Les tickets publiés partent vers la communauté et rejoignent les fonctionnalités live.
    async publier(e) {
      await Promise.all(e.f.map((f, k) => pause(k * 180).then(() => Anim.publierTicket(f))));
      etat.publiees = etat.publiees.concat(e.f);
      TableauDeBord.afficherPubliees(etat.publiees);
      await pause(400);
    },

    // Les chiffres du tableau de bord (l'étape 4 les fera défiler et briller).
    async tableau(e) {
      if (e.gamers !== undefined) { etat.gamers = e.gamers; TableauDeBord.afficherGamers(e.gamers); }
      if (e.note !== undefined) { etat.note = e.note; TableauDeBord.afficherNote(e.note); }
      if (e.score !== undefined) { etat.score = e.score; TableauDeBord.afficherScore(e.score); }
      if (e.mvp !== undefined) { etat.mvp = e.mvp; TableauDeBord.afficherMvp(e.mvp); }
      await pause(900);
    },

    async boucle(e) {
      etat.bouclesFaites = e.faites;
      TableauDeBord.afficherBoucles(etat.bouclesFaites, etat.cycle);
      await pause(600);
    }
  };

  // --- La lecture ---------------------------------------------------------------------

  async function jouer() {
    while (enLecture && i < etapes.length) {
      const e = etapes[i];
      const action = FAIRE[e.faire];
      enCours = action ? Promise.resolve(action(e)) : Promise.resolve();
      try { await enCours; } catch (err) { console.error("Étape " + i, e, err); }
      enCours = null;
      i++;
      majBarre();
      if (unPas) { unPas = false; enLecture = false; }
    }
    if (i >= etapes.length) enLecture = false;
    majBarre();
  }

  function lire() {
    if (enLecture || enCours) return;
    if (i >= etapes.length) return recommencer().then(lire);
    enLecture = true;
    majBarre();
    jouer();
  }

  function mettreEnPause() {
    enLecture = false; // l'étape en cours se termine, puis le lecteur s'arrête
    majBarre();
  }

  function pasAPas() {
    if (enLecture || enCours || i >= etapes.length) return;
    unPas = true;
    enLecture = true;
    majBarre();
    jouer();
  }

  async function recommencer() {
    enLecture = false;
    if (enCours) await enCours;
    Demo.redessiner();
  }

  function vitesse(v) {
    Anim.vitesse = v;
    document.querySelectorAll(".vitesses .bouton").forEach((b) => b.classList.toggle("actif", +b.dataset.vitesse === v));
  }

  // --- La barre de lecture ------------------------------------------------------------

  function majBarre() {
    const lireB = document.getElementById("lecture-lire");
    if (!lireB) return;
    const joue = enLecture;
    lireB.dataset.etat = joue ? "lecture" : "pause";
    lireB.title = t(joue ? "lecture.pause" : "lecture.lire");
    lireB.setAttribute("aria-label", lireB.title);
    document.getElementById("lecture-pas").disabled = joue;
    const r = document.getElementById("lecture-piste");
    if (r) r.style.width = (etapes.length ? (100 * i) / etapes.length : 0) + "%";
    // Pendant la lecture, le banc d'essai attend : un seul chef d'orchestre à la fois.
    Banc.verrouiller(joue || !!enCours);
    Pioches.modeAuto(joue);
  }

  let branche = false;
  function brancher() {
    if (branche) return;
    branche = true;
    document.getElementById("lecture-lire").addEventListener("click", () => (enLecture ? mettreEnPause() : lire()));
    document.getElementById("lecture-pas").addEventListener("click", pasAPas);
    document.getElementById("lecture-recommencer").addEventListener("click", () => recommencer());
    document.querySelectorAll(".vitesses .bouton").forEach((b) =>
      b.addEventListener("click", () => vitesse(+b.dataset.vitesse)));
    // Raccourci clavier : la barre d'espace lance ou met en pause.
    document.addEventListener("keydown", (e) => {
      if (e.key === " " && !e.target.closest("button, [role=button], input")) {
        e.preventDefault();
        enLecture ? mettreEnPause() : lire();
      }
    });
  }

  // Appelé à chaque redessin du plateau (début de la démo, recommencer, changement de langue).
  function init(options) {
    S = options.scenario;
    t = options.traduire;
    etat = options.etat;
    etapes = (window.DEMO_SCRIPT && DEMO_SCRIPT.etapes) || [];
    i = 0;
    enLecture = false;
    enCours = null;
    unPas = false;
    brancher();
    vitesse(Anim.vitesse || 1);
    majBarre();
  }

  window.Lecteur = { init, lire, pause: mettreEnPause, pasAPas, recommencer, vitesse };
})();
