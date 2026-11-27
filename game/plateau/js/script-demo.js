// Le script de la démo animée (v2, règles du GDD 0.23) : 2 boucles (cycle 0, puis cycle 1), sans règles derrière.
// C'est un fichier de données : on peut changer l'ordre, les durées, les chiffres et les cartes
// sans toucher au code. Les textes affichés sont des clés du fichier du scénario (fr et en).
// Le récit complet, avec les chiffres justifiés par les règles : docs/jeu/spec-prototype-plateau.md, section 4.
//
// Les étapes (champ « faire ») :
//   temps      : change le temps du cycle (et le cycle : les jetons changent), allume une station, change le message de K6
//   guide      : K6 explique un geste (texte : la clé ; ms : le temps de lire, à la vitesse ×1)
//   vera       : la bulle de Vera (texte: null pour la fermer)
//   attendre   : une pause, en millisecondes (à la vitesse ×1)
//   auBacklog  : des idées passent dans le Backlog
//   aiguiller  : le panneau de décision. sortie "backlog" : choix "pix" (arrêt au Prompt) ou "resp" (droit au Build),
//                sans choix le ticket attend au Backlog ; sortie "test" : choix "corriger" ou "publier".
//                grises : les choix impossibles, avec la clé de leur raison ; detail : une ligne sous le ticket
//   station    : allume une station
//   heure      : un jeton Heure vole du pilotage vers une station
//   avancer    : des tickets passent à la station suivante (ensemble)
//   effort     : un effort se remplit (qui: "humain" = 2 heures du responsable, "pix" = 1 token et une carte Test ;
//                sansCarte: true au cycle 0) ; carte : la carte Test tirée (pour que la démo soit toujours la même)
//   evenement, feedback : une carte sort de sa pioche ; trier : la cheffe de projet trie la plus ancienne carte Feedback
//   verifs     : le panneau des trois vérifications du Test (actif: false pour le cacher)
//   scanner, codeReview, playtest : les trois vérifications ; corriger : la petite boucle (retour au Build)
//   file       : remplit une file d'attente ; publier : des tickets partent vers la communauté
//   tableau    : gamers, note, score, MVP ; boucle : les anneaux de boucles ; rappel : les jetons reviennent

window.DEMO_SCRIPT = {
  // L'état du plateau au début de la démo : cycle 0, rien n'est encore fait.
  depart: {
    cycle: 0,
    temps: "brief",
    stationActive: null,
    heuresPosees: {},
    tickets: [],
    publiees: [],
    signalees: {},
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
    // --- Boucle 1 : le cycle 0, « le pitch » (4 heures chacun) ---------------------------------
    { faire: "temps", cycle: 0, temps: "brief", station: null, guide: "guide.c0.brief" },
    { faire: "vera", texte: "vera.V0" },
    { faire: "attendre", ms: 4500 },
    { faire: "vera", texte: null },
    { faire: "guide", texte: "guide.c0.jetons", ms: 6000 },

    { faire: "temps", temps: "planning", station: "backlog", guide: "guide.c0.planning" },
    { faire: "auBacklog", f: ["F02", "F07", "F09", "F06", "F13"] },
    { faire: "guide", texte: "guide.c0.aiguillage", ms: 3500 },
    { faire: "aiguiller", sortie: "backlog", lignes: [
      { f: "F02", choix: "resp" },
      { f: "F07", choix: "resp" },
      { f: "F09", choix: "pix" },
      { f: "F06", choix: "resp" },
      { f: "F13", choix: "pix" }
    ] },
    { faire: "guide", texte: "guide.c0.voies", ms: 5000 },

    { faire: "temps", temps: "build", station: "prompt", guide: "guide.c0.build" },
    { faire: "heure", role: "chef", station: "prompt" },
    { faire: "heure", role: "chef", station: "prompt" },
    { faire: "station", id: "build" },
    { faire: "avancer", f: ["F09", "F13"] },
    { faire: "guide", texte: "guide.c0.pix", ms: 1500 },
    { faire: "effort", f: "F09", qui: "pix", sansCarte: true },
    { faire: "effort", f: "F13", qui: "pix", sansCarte: true },
    { faire: "effort", f: "F13", qui: "pix", sansCarte: true },
    { faire: "guide", texte: "guide.c0.prod", ms: 1500 },
    { faire: "effort", f: "F02", qui: "humain" },
    { faire: "effort", f: "F07", qui: "humain" },
    { faire: "effort", f: "F06", qui: "humain" },

    { faire: "temps", temps: "test", station: "test", guide: "guide.c0.test" },
    { faire: "avancer", f: ["F02", "F07", "F06", "F09", "F13"] },
    { faire: "attendre", ms: 800 },

    { faire: "temps", temps: "release", station: "release", guide: "guide.c0.release" },
    { faire: "avancer", f: ["F02", "F07", "F06", "F09", "F13"] },
    { faire: "publier", f: ["F02", "F07", "F06", "F09", "F13"] },
    { faire: "tableau", mvp: true },

    { faire: "temps", temps: "review", station: "feedback", guide: "guide.c0.review" },
    { faire: "tableau", gamers: 250, note: 3, score: 750 },
    { faire: "boucle", faites: 1 },
    { faire: "attendre", ms: 2500 },
    { faire: "rappel" },

    // --- Boucle 2 : le cycle 1, « l'accès anticipé » (4 heures chacun) ------------------------
    { faire: "temps", cycle: 1, temps: "brief", station: null, guide: "guide.c1.brief" },
    { faire: "attendre", ms: 2500 },
    { faire: "vera", texte: "vera.V1" },
    { faire: "attendre", ms: 2500 },
    { faire: "evenement", id: "E1" },
    { faire: "vera", texte: null },

    { faire: "temps", temps: "planning", station: "backlog", guide: "guide.c1.planning" },
    { faire: "feedback", id: ["FB18", "FB19", "FB02", "FB16"] },
    { faire: "heure", role: "chef", station: "feedback" },
    { faire: "trier" },
    { faire: "trier" },
    { faire: "heure", role: "chef", station: "feedback" },
    { faire: "trier" },
    { faire: "guide", texte: "guide.c1.correctif", ms: 6000 },
    { faire: "trier" },
    { faire: "auBacklog", f: ["F17", "F18", "F10"] },
    { faire: "guide", texte: "guide.c1.aiguillage", ms: 3500 },
    { faire: "aiguiller", sortie: "backlog", lignes: [
      { f: "F17", choix: "pix" },
      { f: "F18", choix: "resp" },
      { f: "F10", choix: "resp" },
      { f: "F06-c", choix: null, detail: "aig.detail.garde", grises: { pix: "aig.raison.pixplein" } }
    ] },
    { faire: "guide", texte: "guide.c1.attente", ms: 4500 },

    { faire: "temps", temps: "build", station: "prompt", guide: "guide.c1.build" },
    { faire: "heure", role: "chef", station: "prompt" },
    { faire: "station", id: "build" },
    { faire: "avancer", f: ["F17"] },
    { faire: "effort", f: "F17", qui: "pix", carte: "T03" },
    { faire: "effort", f: "F17", qui: "pix", carte: "T13" },
    { faire: "effort", f: "F17", qui: "pix", carte: "T18" },
    { faire: "effort", f: "F18", qui: "humain" },
    { faire: "effort", f: "F10", qui: "humain" },
    { faire: "guide", texte: "guide.c1.lent", ms: 4500 },

    { faire: "temps", temps: "test", station: "test", guide: "guide.c1.test" },
    { faire: "avancer", f: ["F17", "F18"] },
    { faire: "verifs", ms: 3500 },
    { faire: "guide", texte: "guide.c1.scan", ms: 1200 },
    { faire: "scanner", f: "F17", carte: "T03" },
    { faire: "guide", texte: "guide.c1.codereview", ms: 1500 },
    { faire: "codeReview", f: "F17", carte: "T13" },
    { faire: "guide", texte: "guide.c1.playtest", ms: 2000 },
    { faire: "playtest", f: "F17", carte: "T18" },
    { faire: "verifs", actif: null },
    { faire: "guide", texte: "guide.c1.sortie", ms: 2500 },
    { faire: "aiguiller", sortie: "test", lignes: [
      { f: "F17", detail: "aig.detail.bloquant", choix: "corriger" }
    ] },
    { faire: "guide", texte: "guide.c1.corriger", ms: 500 },
    { faire: "corriger", f: "F17", carte: "T13" },
    { faire: "guide", texte: "guide.c1.publier", ms: 2500 },
    { faire: "aiguiller", sortie: "test", lignes: [
      { f: "F17", detail: "aig.detail.pasfun", choix: "publier", grises: { corriger: "aig.raison.heure" } }
    ] },
    { faire: "verifs", actif: false },

    { faire: "temps", temps: "release", station: "release", guide: "guide.c1.release" },
    { faire: "avancer", f: ["F17", "F18"] },
    { faire: "publier", f: ["F17", "F18"] },

    { faire: "temps", temps: "review", station: "feedback", guide: "guide.c1.review" },
    { faire: "tableau", gamers: 375, note: 4, score: 1500 },
    { faire: "boucle", faites: 2 },
    { faire: "attendre", ms: 3000 },
    { faire: "feedback", id: ["FB12"] },
    { faire: "temps", guide: "guide.fin" }
  ]
};
