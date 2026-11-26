// Scénario « Orbit : Studio » : les données du plateau et tous les textes affichés.
// Aucun texte n'est écrit en dur ailleurs : chaque texte a une clé, en fr puis en en.
// Pour un autre scénario, on écrit un autre fichier comme celui-ci, sans toucher au dessin.

window.SCENARIO = {
  id: "studio",

  // Les 6 stations de l'orbite, dans l'ordre du flux. L'angle (en degrés) place la planète
  // sur l'ellipse : 0 = à droite, 90 = en bas, -90 = en haut.
  stations: [
    { id: "backlog",  angle: -150, icone: "backlog"  },
    { id: "prompt",   angle: -90,  icone: "prompt"   },
    { id: "build",    angle: -30,  icone: "build"    },
    { id: "test",     angle: 30,   icone: "test"     },
    { id: "release",  angle: 90,   icone: "release"  },
    { id: "feedback", angle: 150,  icone: "feedback" }
  ],

  // Les 3 files d'attente orange (les goulots), de taille croissante.
  files: [
    { id: "prompt-build",     angle: -60, places: 3 },
    { id: "build-test",       angle: 0,   places: 4 },
    { id: "feedback-backlog", angle: 180, places: 6, principale: true }
  ],

  // Les 6 temps d'un cycle.
  temps: ["brief", "planning", "build", "test", "release", "review"],

  // Le pilotage : 3 rôles, 3 jetons Heure chacun.
  roles: ["chef", "designer", "programmeur"],
  heuresParRole: 3,

  // Les agents IA (satellites). ARTY est verrouillé jusqu'au cycle 2.
  agents: [
    { id: "pix",  station: "build", image: "pix-portrait.png",  couleur: "sun"   },
    { id: "arty", station: "build", image: null,                couleur: "agent", verrouJusquAuCycle: 2 },
    { id: "scan", station: "test",  image: "scan-portrait.png", couleur: "agent" }
  ],

  // Les planètes extérieures.
  planetes: [
    { id: "nebuleuse",  personnages: ["vera"],              versStation: "backlog" },
    { id: "communaute", personnages: ["max", "sam", "nora"], depuisStation: "release", versStation: "feedback" }
  ],

  personnages: {
    vera: "vera-portrait.png",
    max:  "max-portrait.png",
    sam:  "sam-portrait.png",
    nora: "nora-portrait.png"
  },

  tokensIA: 20,
  cycles: [0, 1, 2, 3, 4],

  // Les 20 fonctionnalités (docs/jeu/cartes-orbit-studio.md). La priorité n'est pas affichée.
  fonctionnalites: {
    F01: { efforts: 1, etoiles: 2 }, F02: { efforts: 1, etoiles: 2 },
    F03: { efforts: 2, etoiles: 2 }, F04: { efforts: 2, etoiles: 2 },
    F05: { efforts: 3, etoiles: 3 }, F06: { efforts: 1, etoiles: 2 },
    F07: { efforts: 1, etoiles: 2 }, F08: { efforts: 2, etoiles: 3 },
    F09: { efforts: 1, etoiles: 2 }, F10: { efforts: 2, etoiles: 3 },
    F11: { efforts: 1, etoiles: 3 }, F12: { efforts: 2, etoiles: 3 },
    F13: { efforts: 2, etoiles: 2 }, F14: { efforts: 2, etoiles: 3 },
    F15: { efforts: 1, etoiles: 3 }, F16: { efforts: 3, etoiles: 3 },
    F17: { efforts: 3, etoiles: 3 }, F18: { efforts: 1, etoiles: 3 },
    F19: { efforts: 3, etoiles: 2 }, F20: { efforts: 3, etoiles: 3 }
  },

  textes: {
    fr: {
      "jeu.titre": "Helioso Orbit",
      "jeu.scenario": "Studio",
      "studio.nom": "Orbital Studio",
      "studio.projet": "Star Squadron",

      "station.backlog": "Backlog",
      "station.prompt": "Prompt",
      "station.build": "Build",
      "station.test": "Test",
      "station.release": "Release",
      "station.feedback": "Feedback",
      "station.backlog.aide": "Idées et demandes",
      "station.prompt.aide": "On explique à l'agent",
      "station.build.aide": "Agents et humains codent",
      "station.test.aide": "On trouve les défauts",
      "station.release.aide": "Le jeu sort",
      "station.feedback.aide": "Retours des joueurs",

      "temps.brief": "Brief",
      "temps.planning": "Planning",
      "temps.build": "Build",
      "temps.test": "Test",
      "temps.release": "Release",
      "temps.review": "Review",

      "file.titre": "File d'attente",
      "file.principale": "Goulot principal : trier le feedback",

      "pilotage.titre": "Pilotage",
      "role.chef": "Chef de projet",
      "role.designer": "Designer",
      "role.programmeur": "Programmeur",
      "role.chef.court": "CP",
      "role.designer.court": "DS",
      "role.programmeur.court": "PG",

      "agent.pix": "PIX",
      "agent.scan": "SCAN",
      "agent.arty": "ARTY",
      "agent.pix.role": "Agent codeur",
      "agent.scan.role": "Agent testeur",
      "agent.arty.role": "Agent artiste",
      "agent.verrou": "Cycle {n}",
      "agent.pix.bulle": "Terminé ! Tout fonctionne parfaitement.",
      "agent.scan.bulle": "Aucun défaut détecté.",

      "planete.nebuleuse": "Nébuleuse Games",
      "planete.nebuleuse.aide": "L'éditeur",
      "planete.communaute": "Communauté",
      "planete.communaute.aide": "Les joueurs",
      "fleche.missions": "Missions",
      "fleche.release": "Nouvelle version",
      "fleche.retours": "Retours",

      "carte.test.cachee": "?",
      "carte.test.ok": "OK",
      "carte.test.bug": "Bug",

      "f.F01": "3 types de vaisseaux",
      "f.F02": "Apparition du vaisseau",
      "f.F03": "Boucliers (vies)",
      "f.F04": "Puissance de feu",
      "f.F05": "Collision alien / vaisseau",
      "f.F06": "Collision missile",
      "f.F07": "Contrôles",
      "f.F08": "Réglage de la difficulté",
      "f.F09": "Grille d'aliens",
      "f.F10": "Grille qui descend",
      "f.F11": "Grille jusqu'aux bords",
      "f.F12": "Nouvelles vagues",
      "f.F13": "Défaite et redémarrage",
      "f.F14": "Système de score",
      "f.F15": "Types de missiles",
      "f.F16": "Victoire et récompense",
      "f.F17": "Explosions",
      "f.F18": "Fond spatial",
      "f.F19": "Rencontrer SpaceTron",
      "f.F20": "Visuels, univers et ton",

      "tableau.titre": "Le studio",
      "tableau.cycle": "Cycle {n}",
      "tableau.joueurs": "Joueurs",
      "tableau.note": "Note du jeu",
      "tableau.score": "Score",
      "tableau.score.aide": "joueurs × note",
      "tableau.tokens": "Tokens IA",
      "tableau.mvp": "MVP",
      "tableau.mvp.oui": "Publié : le jeu a des joueurs",
      "tableau.mvp.non": "Pas encore de jeu jouable",
      "tableau.boucles": "Boucles",
      "tableau.festival": "Festival",

      "cycle.0.titre": "Le pitch",
      "cycle.1.titre": "L'accès anticipé",

      "lecture.recommencer": "Recommencer",
      "lecture.lire": "Lecture",
      "lecture.pas": "Pas à pas",
      "lecture.bientot": "La lecture de la démo arrive à l'étape 3",

      "bouton.theme.clair": "Thème clair",
      "bouton.theme.sombre": "Thème sombre",
      "bouton.son.off": "Son coupé",
      "bouton.son.on": "Son activé",
      "bouton.langue": "English"
    },

    en: {
      "jeu.titre": "Helioso Orbit",
      "jeu.scenario": "Studio",
      "studio.nom": "Orbital Studio",
      "studio.projet": "Star Squadron",

      "station.backlog": "Backlog",
      "station.prompt": "Prompt",
      "station.build": "Build",
      "station.test": "Test",
      "station.release": "Release",
      "station.feedback": "Feedback",
      "station.backlog.aide": "Ideas and requests",
      "station.prompt.aide": "Explaining to the agent",
      "station.build.aide": "Agents and humans code",
      "station.test.aide": "Finding defects",
      "station.release.aide": "The game ships",
      "station.feedback.aide": "Player feedback",

      "temps.brief": "Brief",
      "temps.planning": "Planning",
      "temps.build": "Build",
      "temps.test": "Test",
      "temps.release": "Release",
      "temps.review": "Review",

      "file.titre": "Queue",
      "file.principale": "Main bottleneck: sorting feedback",

      "pilotage.titre": "Steering",
      "role.chef": "Project lead",
      "role.designer": "Designer",
      "role.programmeur": "Programmer",
      "role.chef.court": "PL",
      "role.designer.court": "DS",
      "role.programmeur.court": "PG",

      "agent.pix": "PIX",
      "agent.scan": "SCAN",
      "agent.arty": "ARTY",
      "agent.pix.role": "Coding agent",
      "agent.scan.role": "Testing agent",
      "agent.arty.role": "Art agent",
      "agent.verrou": "Cycle {n}",
      "agent.pix.bulle": "Done! Everything works perfectly.",
      "agent.scan.bulle": "No defect detected.",

      "planete.nebuleuse": "Nébuleuse Games",
      "planete.nebuleuse.aide": "The publisher",
      "planete.communaute": "Community",
      "planete.communaute.aide": "The players",
      "fleche.missions": "Missions",
      "fleche.release": "New version",
      "fleche.retours": "Feedback",

      "carte.test.cachee": "?",
      "carte.test.ok": "OK",
      "carte.test.bug": "Bug",

      "f.F01": "3 ship types",
      "f.F02": "Ship spawn",
      "f.F03": "Shields (lives)",
      "f.F04": "Firepower",
      "f.F05": "Alien / ship collision",
      "f.F06": "Missile collision",
      "f.F07": "Controls",
      "f.F08": "Difficulty tuning",
      "f.F09": "Alien grid",
      "f.F10": "Descending grid",
      "f.F11": "Grid to the edges",
      "f.F12": "New waves",
      "f.F13": "Game over and restart",
      "f.F14": "Score system",
      "f.F15": "Missile types",
      "f.F16": "Victory and reward",
      "f.F17": "Explosions",
      "f.F18": "Space background",
      "f.F19": "Meet SpaceTron",
      "f.F20": "Visuals, world and tone",

      "tableau.titre": "The studio",
      "tableau.cycle": "Cycle {n}",
      "tableau.joueurs": "Players",
      "tableau.note": "Game rating",
      "tableau.score": "Score",
      "tableau.score.aide": "players × rating",
      "tableau.tokens": "AI tokens",
      "tableau.mvp": "MVP",
      "tableau.mvp.oui": "Shipped: the game has players",
      "tableau.mvp.non": "No playable game yet",
      "tableau.boucles": "Loops",
      "tableau.festival": "Festival",

      "cycle.0.titre": "The pitch",
      "cycle.1.titre": "Early access",

      "lecture.recommencer": "Restart",
      "lecture.lire": "Play",
      "lecture.pas": "Step",
      "lecture.bientot": "Demo playback comes in step 3",

      "bouton.theme.clair": "Light theme",
      "bouton.theme.sombre": "Dark theme",
      "bouton.son.off": "Sound off",
      "bouton.son.on": "Sound on",
      "bouton.langue": "Français"
    }
  }
};
