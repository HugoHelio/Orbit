// Le script de la démo animée : 2 boucles (cycle 0, puis cycle 1), sans règles derrière.
// C'est un fichier de données : on peut changer l'ordre, les durées, les chiffres et les cartes
// sans toucher au code. Les textes affichés sont des clés du fichier du scénario (fr et en).
// Le récit complet, avec les chiffres justifiés par les règles : docs/jeu/spec-prototype-plateau.md, section 4.
//
// Les étapes (champ « faire ») :
//   temps      : change le temps du cycle (et le cycle), allume une station, change le message de K6
//   vera       : la bulle de Vera (texte: null pour la fermer)
//   attendre   : une pause, en millisecondes (à la vitesse ×1)
//   auBacklog  : des idées passent dans le Backlog ; lancer : du Backlog au couloir (station Prompt)
//   station    : allume une station
//   heure      : un jeton Heure vole du pilotage vers une station
//   avancer    : des tickets passent à la station suivante (ensemble)
//   effort     : un effort se remplit (qui: "humain" = 1 heure du responsable, "pix" = 1 token et une carte Test ;
//                sansCarte: true au cycle 0) ; carte : la carte Test tirée (pour que la démo soit toujours la même)
//   evenement, feedback : une carte sort de sa pioche ; trier : la cheffe de projet trie la plus ancienne carte Feedback
//   scanner, corriger, reveler : le travail sur les cartes Test
//   file       : remplit une file d'attente ; publier : des tickets partent vers la communauté
//   tableau    : gamers, note, score, MVP ; boucle : les anneaux de boucles ; rappel : les heures reviennent

window.DEMO_SCRIPT = {
  // L'état du plateau au début de la démo : cycle 0, rien n'est encore fait.
  depart: {
    cycle: 0,
    temps: "brief",
    stationActive: null,
    heuresPosees: {},
    tickets: [],
    publiees: [],
    backlog: [],
    idees: ["F01", "F02", "F03", "F04", "F05", "F06", "F07", "F09", "F10", "F13", "F19", "F20"],
    ideesCachees: ["F08", "F11", "F12", "F14", "F15", "F16", "F17", "F18"],
    fileFeedback: [],
    files: { "prompt-build": 0, "build-test": 0 },
    agents: { pix: { actif: false, bulle: false }, scan: { actif: false, bulle: false } },
    gamers: 0,
    note: 3,
    score: 0,
    tokensRestants: 20,
    mvp: false,
    bouclesFaites: 0
  },

  etapes: [
    // --- Boucle 1 : le cycle 0, « le pitch » -----------------------------------
    { faire: "temps", cycle: 0, temps: "brief", station: null, guide: "guide.c0.brief" },
    { faire: "vera", texte: "vera.V0" },
    { faire: "attendre", ms: 5000 },
    { faire: "vera", texte: null },

    { faire: "temps", temps: "planning", station: "backlog", guide: "guide.c0.planning" },
    { faire: "auBacklog", f: ["F02", "F07", "F09", "F06", "F13"] },
    { faire: "attendre", ms: 600 },
    { faire: "lancer", f: ["F02", "F07", "F09", "F06", "F13"] },

    { faire: "temps", temps: "build", station: "prompt", guide: "guide.c0.build" },
    { faire: "heure", role: "chef", station: "prompt" },
    { faire: "heure", role: "chef", station: "prompt" },
    { faire: "station", id: "build" },
    { faire: "avancer", f: ["F02", "F07", "F09", "F06", "F13"] },
    { faire: "effort", f: "F09", qui: "pix", sansCarte: true },
    { faire: "effort", f: "F13", qui: "pix", sansCarte: true },
    { faire: "effort", f: "F13", qui: "pix", sansCarte: true },
    { faire: "effort", f: "F02", qui: "humain" },
    { faire: "effort", f: "F07", qui: "humain" },
    { faire: "effort", f: "F06", qui: "humain" },

    { faire: "temps", temps: "test", station: "test", guide: "guide.c0.test" },
    { faire: "avancer", f: ["F02", "F07", "F09", "F06", "F13"] },
    { faire: "attendre", ms: 800 },

    { faire: "temps", temps: "release", station: "release", guide: "guide.c0.release" },
    { faire: "avancer", f: ["F02", "F07", "F09", "F06", "F13"] },
    { faire: "publier", f: ["F02", "F07", "F09", "F06", "F13"] },
    { faire: "tableau", mvp: true },

    { faire: "temps", temps: "review", station: "feedback", guide: "guide.c0.review" },
    { faire: "tableau", gamers: 250, note: 3, score: 750 },
    { faire: "boucle", faites: 1 },
    { faire: "attendre", ms: 2500 },
    { faire: "rappel" },

    // --- Boucle 2 : le cycle 1, « l'accès anticipé » ---------------------------
    { faire: "temps", cycle: 1, temps: "brief", station: null, guide: "guide.c1.brief" },
    { faire: "vera", texte: "vera.V1" },
    { faire: "attendre", ms: 2500 },
    { faire: "evenement", id: "E1" },
    { faire: "vera", texte: null },

    { faire: "temps", temps: "planning", station: "backlog", guide: "guide.c1.planning" },
    { faire: "feedback", id: ["FB18", "FB19", "FB07", "FB16"] },
    { faire: "heure", role: "chef", station: "feedback" },
    { faire: "trier" },
    { faire: "trier" },
    { faire: "heure", role: "chef", station: "feedback" },
    { faire: "trier" },
    { faire: "trier" },
    { faire: "auBacklog", f: ["F17", "F18", "F14"] },
    { faire: "lancer", f: ["F17", "F18", "F14"] },

    { faire: "temps", temps: "build", station: "prompt", guide: "guide.c1.build" },
    { faire: "heure", role: "chef", station: "prompt" },
    { faire: "heure", role: "designer", station: "prompt" },
    { faire: "station", id: "build" },
    { faire: "avancer", f: ["F17", "F18"] },
    { faire: "effort", f: "F17", qui: "pix", carte: "T03" },
    { faire: "effort", f: "F17", qui: "pix", carte: "T13" },
    { faire: "effort", f: "F17", qui: "pix", carte: "T05" },
    // PIX a fini sa capacité : le prompt de F14 attend (le goulot Prompt → Build).
    { faire: "file", id: "prompt-build", n: 1 },
    { faire: "effort", f: "F18", qui: "humain" },

    { faire: "temps", temps: "test", station: "test", guide: "guide.c1.test" },
    { faire: "avancer", f: ["F17", "F18"] },
    { faire: "scanner", f: "F17", carte: "T03" },
    { faire: "scanner", f: "F17", carte: "T13" },
    { faire: "corriger", f: "F17", carte: "T13" },

    { faire: "temps", temps: "release", station: "release", guide: "guide.c1.release" },
    { faire: "avancer", f: ["F17", "F18"] },
    { faire: "reveler", carte: "T05" },
    { faire: "publier", f: ["F17", "F18"] },

    { faire: "temps", temps: "review", station: "feedback", guide: "guide.c1.review" },
    { faire: "tableau", gamers: 400, note: 4, score: 1600 },
    { faire: "boucle", faites: 2 },
    { faire: "feedback", id: ["FB12", "FB13"] },
    { faire: "temps", guide: "guide.fin" }
  ]
};
