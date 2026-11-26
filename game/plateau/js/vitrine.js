// État figé du plateau pour l'étape 1 (« vitrine ») : des données inventées,
// pour juger le plateau tel qu'il sera en pleine partie (cycle 1, temps Build).
// À l'étape 3, le lecteur du script remplacera cet état pas à pas.

window.VITRINE = {
  cycle: 1,
  temps: "build",
  stationActive: "build",

  // Jetons Heure déjà utilisés, par rôle (sur 3).
  heuresUtilisees: { chef: 2, designer: 1, programmeur: 1 },
  // Où ces jetons sont posés (nombre de jetons par station).
  heuresPosees: { prompt: 2, build: 1, backlog: 1 },

  // Les vaisseaux posés sur l'orbite : fonctionnalité, station, efforts faits.
  // cartesTest : les cartes Test cachées sous les efforts faits par PIX.
  vaisseaux: [
    { f: "F14", station: "backlog" },
    { f: "F12", station: "backlog" },
    { f: "F10", station: "backlog" },
    { f: "F18", station: "prompt" },
    { f: "F17", station: "build", effortsFaits: 2, cartesTest: ["cachee", "cachee"] },
    { f: "F15", station: "test", effortsFaits: 1, cartesTest: ["ok"] }
  ],

  // Remplissage des files d'attente.
  files: { "prompt-build": 1, "build-test": 2, "feedback-backlog": 3 },

  // Agents : qui travaille, et sa bulle.
  agents: { pix: { actif: true, bulle: true }, scan: { actif: false, bulle: false } },

  // Le tableau de bord.
  joueurs: 250,
  note: 3,
  score: 750,
  tokensRestants: 17,
  mvp: true,
  bouclesFaites: 1
};
