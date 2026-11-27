// Les pioches de cartes virtuelles : Événements, Feedback et Test.
// On clique sur une pioche : la carte du dessus vole au centre du plateau, se retourne
// (sauf une carte Test, qui reste cachée), puis part à sa place.
// On clique sur une carte Test cachée sous un ticket : elle se retourne.
// Plus tard, le script de la démo (puis le moteur de règles) appellera les mêmes fonctions :
// Pioches.piocher("feedback", "FB04"), Pioches.reveler("T13")…

(function () {
  const L = 240, H = 336; // taille de la grande carte, en pixels (format 63 × 88 mm)
  let S, t, etat, couche, cadre, occupe = false, auto = false, pixExplique = false;
  // La vitesse de la démo (×1, ×2) : la même que celle des briques animées.
  function d(ms) { return ms / (window.Anim ? Anim.vitesse : 1); }
  const piles = {};

  // --- Les paquets ------------------------------------------------------------

  function melanger(liste) {
    const l = liste.slice();
    for (let i = l.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [l[i], l[j]] = [l[j], l[i]];
    }
    return l;
  }

  function init(options) {
    S = options.scenario;
    t = options.traduire;
    etat = options.etat;
    cadre = options.cadre;
    couche = options.couche;
    couche.innerHTML = "";
    occupe = false;
    pixExplique = false;
    ["evenement", "feedback", "test"].forEach((type) => {
      // Les événements restent dans l'ordre (E1 à E4 pour les premières parties), les autres sont mélangés.
      piles[type] = type === "evenement" ? S.cartes[type].slice() : melanger(S.cartes[type]);
    });
    majCompteurs();
    brancherClics();
  }

  function majCompteurs() {
    Object.keys(piles).forEach((type) => Plateau.majPioche(type, piles[type].length));
  }

  // Tirer une carte sans animation (pour préparer l'état de départ).
  // filtreType : par exemple "ok" pour tirer une carte Test OK.
  function tirerSilencieux(type, filtreType, id) {
    const pile = piles[type];
    const i = id ? pile.findIndex((c) => c.id === id) : filtreType ? pile.findIndex((c) => c.type === filtreType) : 0;
    if (i < 0) return null;
    const carte = pile.splice(i, 1)[0];
    majCompteurs();
    return carte.id;
  }

  function sortir(type, id) {
    const pile = piles[type];
    const i = id ? pile.findIndex((c) => c.id === id) : 0;
    if (i < 0 || !pile.length) return null;
    return pile.splice(i, 1)[0];
  }

  // --- Les animations ---------------------------------------------------------

  function centreDe(element) {
    const r = element.getBoundingClientRect(), c = cadre.getBoundingClientRect();
    return { x: r.left - c.left + r.width / 2, y: r.top - c.top + r.height / 2, l: r.width };
  }

  function voler(carteEl, de, vers, duree, opacite) {
    const a = carteEl.animate([
      { transform: `translate(${de.x}px, ${de.y}px) scale(${de.l / L})`, opacity: 1 },
      { transform: `translate(${vers.x}px, ${vers.y}px) scale(${vers.l / L})`, opacity: opacite === undefined ? 1 : opacite }
    ], { duration: d(duree), easing: "cubic-bezier(.2,.8,.2,1)", fill: "forwards" });
    return a.finished;
  }

  function retourner(carteEl, versLeRecto) {
    const interieur = carteEl.querySelector(".carte-interieur");
    const a = interieur.animate([
      { transform: `rotateY(${versLeRecto ? 0 : 180}deg)` },
      { transform: `rotateY(${versLeRecto ? 180 : 0}deg)` }
    ], { duration: d(650), easing: "cubic-bezier(.4,0,.2,1)", fill: "forwards" });
    return a.finished;
  }

  // En mode automatique (la démo qui se joue toute seule), la carte reste un moment, puis repart ;
  // un clic la fait repartir plus tôt.
  function attendreClic() {
    return new Promise((ok) => {
      let fini = false;
      const finir = () => {
        if (fini) return;
        fini = true;
        fond.classList.remove("visible");
        setTimeout(() => fond.remove(), 250);
        ok();
      };
      const fond = document.createElement("div");
      fond.className = "couche-fond";
      const aide = document.createElement("div");
      aide.className = "couche-aide";
      aide.textContent = t(auto ? "pioche.continuer.auto" : "pioche.continuer");
      fond.appendChild(aide);
      couche.insertBefore(fond, couche.firstChild);
      requestAnimationFrame(() => fond.classList.add("visible"));
      fond.addEventListener("click", finir, { once: true });
      if (auto) setTimeout(finir, d(2200));
    });
  }

  function centreCadre() {
    const c = cadre.getBoundingClientRect();
    return { x: c.width / 2, y: c.height / 2, l: Math.min(L, c.height * 0.62 * L / H) };
  }

  function pause(ms) { return new Promise((ok) => setTimeout(ok, ms)); }

  // Un avis neutre (une règle du jeu, pas un personnage) : il s'affiche en haut du plateau, puis disparaît.
  function avis(texte) {
    couche.querySelectorAll(".avis").forEach((e) => e.remove());
    const a = document.createElement("div");
    a.className = "avis";
    a.textContent = texte;
    couche.appendChild(a);
    // Un avis long reste plus longtemps : le temps de le lire.
    const duree = Math.max(2600, texte.length * 55);
    setTimeout(() => a.classList.add("sortie"), duree);
    setTimeout(() => a.remove(), duree + 500);
  }

  // --- La grande carte (HTML) -----------------------------------------------

  function h(tag, classe, texte, parent) {
    const e = document.createElement(tag);
    if (classe) e.className = classe;
    if (texte !== undefined) e.textContent = texte;
    if (parent) parent.appendChild(e);
    return e;
  }

  function creerCarte(type, carte) {
    const el = h("div", "carte-volante carte-" + type, undefined, couche);
    el.style.width = L + "px";
    el.style.height = H + "px";
    const interieur = h("div", "carte-interieur", undefined, el);

    // Le dos
    const dos = h("div", "carte-face carte-dos", undefined, interieur);
    const NS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "-60 -60 120 120");
    svg.setAttribute("class", "carte-dos-motif");
    Plateau.dessinerMotifDos(svg, type, 1.2);
    dos.appendChild(svg);
    h("div", "carte-dos-nom", t("carte.dos." + type), dos);
    h("div", "carte-dos-marque", t("jeu.titre"), dos);

    // Le recto
    const recto = h("div", "carte-face carte-recto", undefined, interieur);
    if (type === "feedback") rectoFeedback(recto, carte);
    else if (type === "evenement") rectoEvenement(recto, carte);
    else rectoTest(recto, carte);
    return el;
  }

  function bande(parent, gauche, droite, classe) {
    const b = h("div", "carte-bande " + (classe || ""), undefined, parent);
    h("span", "", gauche, b);
    h("span", "", droite, b);
  }

  function rectoFeedback(recto, c) {
    recto.classList.add("recto-feedback");
    bande(recto, t("carte.dos.feedback"), c.id);
    const corps = h("div", "carte-corps", undefined, recto);
    const haut = h("div", "carte-haut", undefined, corps);
    h("span", "carte-auteur", t("carte.fb.auteur"), haut);
    h("span", "carte-pastille fb-" + c.type, t("carte.fb." + c.type), haut);
    // Le petit schéma : ce que le gamer essaie de dire, en image.
    if (window.SchemasFeedback) corps.appendChild(SchemasFeedback.dessiner(c.id));
    h("div", "carte-citation", "« " + t("carte." + c.id) + " »", corps);
    const bas = h("div", "carte-bas", undefined, corps);
    h("div", "carte-etiquette", t("carte.fb.cible"), bas);
    const cible = c.cible.startsWith("F") ? `${c.cible} · ${t("f." + c.cible)}` : t("carte.fb." + c.cible);
    h("div", "carte-cible", cible, bas);
  }

  function rectoEvenement(recto, c) {
    recto.classList.add("recto-evenement");
    bande(recto, t("carte.ev." + c.type), c.id, "bande-encre");
    const corps = h("div", "carte-corps", undefined, recto);
    h("div", "carte-etiquette", c.cycle ? t("carte.ev.cycle").replace("{n}", c.cycle) : t("carte.ev.rechange"), corps);
    h("div", "carte-titre", t("carte." + c.id + ".titre"), corps);
    const bas = h("div", "carte-bas", undefined, corps);
    h("div", "carte-etiquette", t("carte.ev.effet"), bas);
    h("div", "carte-effet", t("carte." + c.id + ".effet"), bas);
  }

  function rectoTest(recto, c) {
    recto.classList.add("recto-test", "test-" + c.type);
    bande(recto, t("pioche.test"), c.id, "bande-" + c.type);
    const corps = h("div", "carte-corps", undefined, recto);
    // Un bug est bloquant ou mineur (GDD 0.21) : son titre et son effet le disent.
    const k = c.gravite ? c.type + "." + c.gravite : c.type;
    h("div", "carte-verdict", t("carte.type." + k), corps);
    h("div", "carte-citation", t("carte.phrase." + c.type + "." + c.phrase), corps);
    const bas = h("div", "carte-bas", undefined, corps);
    h("div", "carte-effet", t("carte.test.effet." + k), bas);
  }

  // --- Piocher ---------------------------------------------------------------

  // type : "evenement", "feedback" ou "test". id (facultatif) : une carte précise (pour le script).
  // f (carte Test seulement) : la fonctionnalité sur laquelle PIX travaille.
  async function piocher(type, id, f) {
    if (occupe) return;
    if (type === "test") return piocherTest(id, f);
    const carte = sortir(type, id);
    if (!carte) return;
    occupe = true;
    majCompteurs();

    const el = creerCarte(type, carte);
    const depart = centreDe(Plateau.elementPioche(type));
    await voler(el, depart, centreCadre(), 600);
    await retourner(el, true);
    await attendreClic();

    if (type === "feedback") {
      // La carte rejoint la file Feedback → Backlog, qui grossit.
      const file = S.files.find((f) => f.id === "feedback-backlog");
      await voler(el, centreCadre(), Object.assign(centreDe(Plateau.elementFile(file.id)), { l: 40 }), 650, 0.2);
      etat.fileFeedback.push(carte.id);
      // Au-delà de ses places, la file déborde : elle tremble (le goulot se voit).
      etat.files[file.id] = etat.fileFeedback.length;
      Plateau.remplirFile(file.id, etat.files[file.id]);
    } else {
      // L'événement va se poser à côté de Vera.
      await voler(el, centreCadre(), Object.assign(centreDe(Plateau.elementPlanete("nebulous")), { l: 34 }), 650, 0.2);
      Plateau.poserEvenement(carte.id);
    }
    el.remove();
    occupe = false;
  }

  // Une carte Test se pioche quand PIX fait un effort : elle reste face cachée sous le ticket.
  // PIX travaille sur la fonctionnalité donnée, sinon sur celle qu'on a choisie (si elle est en Build),
  // sinon sur la première de Build qui a encore un effort à faire.
  async function piocherTest(id, f) {
    const libre = (v) => v && v.station === "build" && (v.efforts || []).length < S.fonctionnalites[v.f].efforts;
    const choisie = Plateau.ticket(f || Plateau.choisi());
    const cible = libre(choisie) ? choisie : f ? null : Plateau.ticketsA("build").find(libre);
    if (!cible) {
      avis(t("avis.build.plein"));
      return;
    }
    const carte = sortir("test", id);
    if (!carte) return;
    occupe = true;
    majCompteurs();
    Plateau.activerAgent("pix", true);
    Plateau.afficherBulle("pix", false);
    // PIX se met au travail : un rayon vers le ticket, des petits </> qui volent.
    const arreter = window.Anim ? Anim.travailler("pix", cible.f) : () => {};

    const el = creerCarte("test", carte);
    const depart = centreDe(Plateau.elementPioche("test"));
    await voler(el, depart, Object.assign({}, depart, { y: depart.y - 120, l: depart.l * 1.6 }), 380);
    await voler(el, Object.assign({}, depart, { y: depart.y - 120, l: depart.l * 1.6 }),
      Object.assign(centreDe(Plateau.elementTicket(cible.f)), { l: 26 }), 600, 0.3);
    el.remove();

    // PIX fait l'effort (1 token) et la carte Test se glisse dessous, face cachée.
    Plateau.majTicket(cible.f, (v) => {
      v.efforts = (v.efforts || []).concat("pix");
      v.cartesTest = (v.cartesTest || []).concat({ id: carte.id, revelee: false });
    });
    Plateau.animerCase(cible.f, cible.efforts.length - 1);
    arreter();
    etat.tokensRestants = Math.max(0, etat.tokensRestants - 1);
    TableauDeBord.afficherTokens(etat.tokensRestants);
    Plateau.afficherBulle("pix", true);
    // Dire ce qui vient de se passer (une fois suffit) : la carte tirée, c'est le risque caché du travail de PIX.
    if (!pixExplique) avis(t("avis.pix.carte").replace("{f}", cible.f));
    pixExplique = true;
    occupe = false;
  }

  // --- Révéler une carte Test cachée sous un ticket ---------------------------

  async function reveler(id) {
    if (occupe) return;
    const mini = Plateau.elementCarteTest(id);
    const carte = S.cartes.test.find((c) => c.id === id);
    if (!mini || !carte) return;
    occupe = true;
    const f = mini.dataset.f;

    const el = creerCarte("test", carte);
    const depart = centreDe(mini);
    depart.l = Math.max(depart.l, 20);
    await voler(el, depart, centreCadre(), 550);
    await retourner(el, true);
    if (carte.type === "bug") Plateau.afficherBulle("pix", true, "agent.pix.bug");
    await attendreClic();
    await voler(el, centreCadre(), Object.assign(centreDe(Plateau.elementCarteTest(id)), { l: 20 }), 550, 0.3);
    el.remove();

    Plateau.majTicket(f, (v) => {
      v.cartesTest = v.cartesTest.map((c) => (c.id === id ? Object.assign({}, c, { revelee: true }) : c));
    });
    occupe = false;
  }

  // --- Le flux des fonctionnalités : Idées → Backlog → cycle -----------------

  function petitVol(depart, arrivee) {
    // Une tuile fantôme glisse d'une zone à l'autre.
    const el = h("div", "tuile-volante", undefined, couche);
    const a = el.animate([
      { transform: `translate(${depart.x}px, ${depart.y}px)`, opacity: 1 },
      { transform: `translate(${arrivee.x}px, ${arrivee.y}px)`, opacity: 0.4 }
    ], { duration: 450, easing: "cubic-bezier(.2,.8,.2,1)", fill: "forwards" });
    return a.finished.then(() => el.remove());
  }

  // Glisser-déposer : Idées ↔ Backlog (on peut changer d'avis, et réordonner le Backlog),
  // puis Backlog → cycle (là, on ne revient plus en arrière).
  function deplacer(f, depuis, cible) {
    if (!cible) return false;
    if (cible.zone === "backlog") {
      const reste = etat.backlog.filter((x) => x !== f);
      if (depuis === "idees" && !Plateau.placeBacklogLibre(reste.length)) {
        avis(t("avis.backlog.plein"));
        return false;
      }
      reste.splice(Math.min(cible.index, reste.length), 0, f);
      etat.backlog = reste;
      etat.idees = etat.idees.filter((x) => x !== f);
    } else if (cible.zone === "idees" && depuis === "backlog") {
      etat.backlog = etat.backlog.filter((x) => x !== f);
      etat.idees.push(f);
    } else if (cible.zone === "cycle" && depuis === "backlog") {
      etat.backlog = etat.backlog.filter((x) => x !== f);
      const v = { f, station: "prompt", efforts: [] };
      etat.tickets.push(v);
      Plateau.poserTicket(v, Plateau.ticketsA("prompt").length).classList.add("nouveau");
    } else {
      return false;
    }
    Plateau.poserIdees(etat.idees, etat.ideesCachees.length);
    Plateau.poserBacklog(etat.backlog);
    return true;
  }

  let glisse = null;
  function brancherGlisser(svg) {
    svg.addEventListener("pointerdown", (e) => {
      const tuile = e.target.closest(".tuile");
      if (!tuile || occupe) return;
      const p = Plateau.pointPlateau(e);
      const m = tuile.transform.baseVal.consolidate().matrix;
      glisse = { tuile, f: tuile.dataset.f, depuis: tuile.classList.contains("tuile-backlog") ? "backlog" : "idees",
        dx: p.x - m.e, dy: p.y - m.f, x0: p.x, y0: p.y, fantome: null };
      svg.setPointerCapture(e.pointerId);
      e.preventDefault();
    });
    svg.addEventListener("pointermove", (e) => {
      if (!glisse) return;
      const p = Plateau.pointPlateau(e);
      if (!glisse.fantome) {
        if (Math.hypot(p.x - glisse.x0, p.y - glisse.y0) < 5) return;
        glisse.fantome = Plateau.creerFantome(glisse.tuile);
        glisse.tuile.classList.add("en-deplacement");
        Plateau.montrerCibles(glisse.depuis, true);
      }
      glisse.fantome.setAttribute("transform", `translate(${p.x - glisse.dx},${p.y - glisse.dy})`);
    });
    const finir = (e) => {
      if (!glisse) return;
      const g = glisse;
      glisse = null;
      Plateau.montrerCibles(g.depuis, false);
      Plateau.viderFantome();
      g.tuile.classList.remove("en-deplacement");
      if (!g.fantome || e.type === "pointercancel") return;
      const p = Plateau.pointPlateau(e);
      deplacer(g.f, g.depuis, Plateau.zoneSous(p.x, p.y));
    };
    svg.addEventListener("pointerup", finir);
    svg.addEventListener("pointercancel", finir);
  }

  // Le chef de projet trie la plus ancienne carte Feedback de la file.
  async function trier() {
    if (occupe || !etat.fileFeedback.length) return;
    occupe = true;
    const id = etat.fileFeedback.shift();
    const carte = S.cartes.feedback.find((c) => c.id === id);
    const fileId = "feedback-backlog";
    etat.files[fileId] = etat.fileFeedback.length;
    Plateau.remplirFile(fileId, etat.files[fileId]);

    const el = creerCarte("feedback", carte);
    await voler(el, Object.assign(centreDe(Plateau.elementFile(fileId)), { l: 40 }), centreCadre(), 550);
    await retourner(el, true);
    await attendreClic();

    const cible = carte.cible;
    if (cible.startsWith("F") && etat.ideesCachees.includes(cible)) {
      // Une idée de gamer : elle sort de la pile cachée et rejoint les Idées.
      await voler(el, centreCadre(), Object.assign(centreDe(Plateau.elementPileCachees()), { l: 40 }), 600, 0.2);
      etat.ideesCachees = etat.ideesCachees.filter((x) => x !== cible);
      etat.idees.push(cible);
      Plateau.poserIdees(etat.idees, etat.ideesCachees.length, cible);
    } else if (cible.startsWith("F") && Plateau.elementTuile(cible)) {
      // La carte se pose sur la fonctionnalité citée (Idées ou Backlog).
      await voler(el, centreCadre(), Object.assign(centreDe(Plateau.elementTuile(cible)), { l: 40 }), 600, 0.2);
    } else if (cible.startsWith("F") && Plateau.elementTicket(cible)) {
      await voler(el, centreCadre(), Object.assign(centreDe(Plateau.elementTicket(cible)), { l: 40 }), 600, 0.2);
    } else {
      // Hors liste, compliment, ou fonctionnalité déjà publiée : la carte s'écarte.
      await voler(el, centreCadre(), Object.assign(centreCadre(), { y: centreCadre().y + 260, l: 60 }), 500, 0);
    }
    el.remove();
    occupe = false;
  }

  // --- Les clics sur le plateau ---------------------------------------------

  let branche = false;
  function brancherClics() {
    if (branche) return;
    branche = true;
    const svg = Plateau.elementSvg();
    const agir = (e) => {
      const pioche = e.target.closest(".pioche");
      if (pioche) return piocher(pioche.dataset.pioche);
      const carte = e.target.closest(".carte-test.cliquable");
      if (carte && carte.dataset.carte) return reveler(carte.dataset.carte);
      // Un clic sur un ticket du couloir choisit cette fonctionnalité (un autre clic la libère).
      const tk = e.target.closest(".ticket.compact");
      if (tk) return Plateau.choisir(tk.dataset.f);
      if (e.target.closest('.file[data-file="feedback-backlog"]')) return trier();
      if (e.target.closest('.station[data-station="backlog"]')) return Plateau.basculerZones();
    };
    svg.addEventListener("click", agir);
    brancherGlisser(svg);
    // La loupe : le ticket complet au survol d'un ticket compact.
    svg.addEventListener("mouseover", (e) => {
      const tk = e.target.closest(".ticket.compact");
      if (tk) Plateau.montrerLoupe(tk.dataset.f);
    });
    svg.addEventListener("mouseout", (e) => {
      const tk = e.target.closest(".ticket.compact");
      if (tk && !tk.contains(e.relatedTarget)) Plateau.cacherLoupe();
    });
    svg.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); agir(e); }
    });
  }

  // Le mode automatique : la démo se joue toute seule, les cartes n'attendent pas de clic.
  function modeAuto(oui) { auto = oui; }

  window.Pioches = { avis, init, modeAuto, tirerSilencieux, piocher, reveler, deplacer, trier };
})();
