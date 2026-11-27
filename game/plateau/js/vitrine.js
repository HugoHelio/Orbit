// État figé du plateau pour l'étape 1 (« vitrine ») : des données inventées,
// pour juger le plateau tel qu'il sera en pleine partie (cycle 1, temps Build).
// À l'étape 3, le lecteur du script remplacera cet état pas à pas.

window.VITRINE = {
  cycle: 1,
  temps: "build",
  stationActive: "build",

  // Les jetons Heure posés sur les stations, et à qui ils appartiennent (un nom par heure).
  // Les heures restantes au pilotage s'en déduisent (3 par personne).
  heuresPosees: { prompt: ["chef", "designer"], feedback: ["chef"], build: ["programmeur"] },

  // Les tickets posés sur l'orbite : fonctionnalité, station, efforts faits et par qui
  // ("pix" = payé 1 token, "humain" = payé 1 heure).
  // cartesTest : les cartes Test cachées sous les efforts faits par PIX.
  vaisseaux: [
    { f: "F18", station: "prompt", efforts: [] },
    { f: "F17", station: "build", efforts: ["pix", "pix"], cartesTest: ["cachee", "cachee"] },
    { f: "F14", station: "test", efforts: ["pix", "humain"], cartesTest: ["ok"] },
    { f: "F10", station: "release", efforts: ["humain", "humain"] }
  ],

  // Les fonctionnalités hors du cycle (GDD 0.19) :
  // publiées au cycle 0 (le MVP), choisies dans le Backlog, encore à choisir dans les Idées,
  // et les idées de gamers encore cachées (elles apparaissent quand un feedback trié les cite).
  publiees: ["F02", "F06", "F07", "F09", "F13"],
  backlog: ["F05", "F12", "F03"],
  idees: ["F01", "F04", "F16", "F19", "F20"],
  ideesCachees: ["F08", "F11", "F15"],

  // Les cartes Feedback qui attendent d'être triées (file Feedback → Backlog), la plus ancienne d'abord.
  fileFeedback: ["FB15", "FB05", "FB09"],

  // Remplissage des files d'attente.
  files: { "prompt-build": 1, "build-test": 2 },

  // Agents : qui travaille, et sa bulle.
  agents: { pix: { actif: true, bulle: true }, scan: { actif: false, bulle: false } },

  // Le tableau de bord.
  gamers: 250,
  note: 3,
  score: 750,
  tokensRestants: 17,
  mvp: true,
  bouclesFaites: 1
};
