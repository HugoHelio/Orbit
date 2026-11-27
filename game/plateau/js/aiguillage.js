// Les aiguillages (GDD 0.21) : les moments où l'équipe décide, rendus visibles.
// - À la sortie du Backlog : qui produit chaque ticket ? PIX (par le Prompt) ou son responsable (jeton ⚒ Prod).
// - À la sortie du Test : un problème est trouvé. Corriger, ou publier quand même ?
// Un panneau s'ouvre au-dessus du plateau : une ligne par ticket, une colonne par choix,
// avec ce que coûte chaque choix. Un choix impossible est grisé, avec sa raison.
// Dans la démo, le choix vient du script ; le moteur de règles laissera cliquer les joueurs.

(function () {
  let S, t, couche;

  function h(tag, classe, texte, parent) {
    const e = document.createElement(tag);
    if (classe) e.className = classe;
    if (texte !== undefined) e.textContent = texte;
    if (parent) parent.appendChild(e);
    return e;
  }

  const COLONNES = { backlog: ["pix", "resp"], test: ["corriger", "publier"] };

  function init(options) {
    S = options.scenario;
    t = options.traduire;
    couche = options.couche;
  }

  // Le texte d'un bouton de choix pour un ticket.
  function libelle(col, f) {
    const resp = Plateau.def(f).resp;
    const lettre = t("role." + resp + ".court"), nom = t("nom." + S.equipe[resp]);
    return t("aig.bouton." + col).replace("{lettre}", lettre).replace("{nom}", nom);
  }

  function raison(cle, f) {
    const resp = Plateau.def(f).resp;
    return t(cle).replace("{nom}", t("nom." + S.equipe[resp]));
  }

  // o : { sortie: "backlog" | "test", lignes: [{ f, choix, grises: { colonne: cléDeLaRaison }, detail: clé }] }
  // Renvoie une promesse, résolue quand le panneau se ferme.
  async function montrer(o) {
    const cols = COLONNES[o.sortie];
    Plateau.activerAiguillage(o.sortie, true);

    const fond = h("div", "couche-fond aig-fond");
    couche.insertBefore(fond, couche.firstChild);
    const panneau = h("div", "aiguillage aig-" + o.sortie, undefined, fond);
    const entete = h("div", "aig-entete", undefined, panneau);
    h("span", "aig-icone", "⑂", entete);
    h("span", "aig-titre", t("aig." + o.sortie + ".titre"), entete);
    h("div", "aig-question", t("aig." + o.sortie + ".question"), panneau);

    const grille = h("div", "aig-grille", undefined, panneau);
    h("div", "aig-coin", "", grille);
    cols.forEach((c) => {
      const col = h("div", "aig-col aig-col-" + c, undefined, grille);
      h("strong", "", t("aig.col." + c), col);
      h("small", "", t("aig.col." + c + ".aide"), col);
    });

    const rangs = o.lignes.map((l) => {
      const def = Plateau.def(l.f);
      const ticket = h("div", "aig-ticket" + (def.correctif ? " correctif" : ""), undefined, grille);
      const haut = h("div", "aig-ticket-haut", undefined, ticket);
      h("span", "aig-ticket-id", Plateau.idBase(l.f), haut);
      h("span", "aig-ticket-nom", Plateau.nomF(l.f), haut);
      if (l.detail) h("div", "aig-ticket-detail", t(l.detail), ticket);
      const boutons = {};
      cols.forEach((c) => {
        const cell = h("div", "aig-cellule", undefined, grille);
        const b = h("button", "aig-choix aig-choix-" + c, libelle(c, l.f), cell);
        b.tabIndex = -1;
        const grise = l.grises && l.grises[c];
        if (grise) {
          b.disabled = true;
          b.classList.add("grise");
          h("small", "aig-raison", raison(grise, l.f), cell);
        }
        boutons[c] = b;
      });
      return { l, ticket, boutons };
    });

    const aide = h("div", "couche-aide", t(Pioches.estAuto() ? "pioche.continuer.auto" : "pioche.continuer"), fond);
    aide.classList.add("aig-aide");
    requestAnimationFrame(() => fond.classList.add("visible"));

    // Le choix se fait ligne par ligne : on voit l'équipe décider.
    let presse = false;
    fond.addEventListener("click", () => (presse = true), { once: true });
    await Anim.pause(900);
    for (const r of rangs) {
      r.ticket.classList.add("en-cours");
      await Anim.pause(presse ? 80 : 500);
      if (r.l.choix) r.boutons[r.l.choix].classList.add("choisi");
      else {
        r.ticket.classList.add("attend");
        h("div", "aig-attend", t("aig.attend"), r.ticket);
      }
      await Anim.pause(presse ? 80 : 700);
      r.ticket.classList.remove("en-cours");
    }

    // On laisse le temps de lire, puis le panneau se ferme (un clic le ferme plus tôt).
    await new Promise((ok) => {
      let fini = false;
      const finir = () => { if (!fini) { fini = true; ok(); } };
      if (presse && Pioches.estAuto()) return finir();
      fond.addEventListener("click", finir, { once: true });
      if (Pioches.estAuto()) Anim.pause(2600).then(finir);
    });
    fond.classList.remove("visible");
    await Anim.pause(250);
    fond.remove();
    Plateau.activerAiguillage(o.sortie, false);
  }

  window.Aiguillage = { init, montrer };
})();
