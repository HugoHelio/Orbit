# Plan de sprints, décembre 2026 – juin 2027

*Document vivant : mis à jour à chaque fin de sprint. Version 4, 26 novembre 2026. Scénarios du jeu : voir `docs/offre/scenarios-business-game.md`. Design du jeu : `docs/jeu/gdd-orbit-studio.md`.*

## Cadre

- **Capacité :** 10 heures par semaine à partir de janvier 2027, à augmenter si les signaux sont bons.
- **Rythme :** des sprints de 2 semaines, soit **20 heures par sprint**.
- **Répartition type d'un sprint :** environ 12 h de production (jeu, kit), 6 h de prospection, 2 h de pilotage (revue de sprint, mise à jour de ce plan).
- **Rituel :** à la fin de chaque sprint, une revue de 30 minutes avec Claude : ce qui est fait, ce qui bloque, ce qu'on ajuste.
- **Rituel de sauvegarde :** à la fin de chaque session de travail, mise à jour des documents, export du whiteboard, puis commit et push sur GitHub.

## Ce que change le passage à 10 heures

Sur janvier – juin, on dispose d'environ **260 heures** au lieu de 500. On garde l'essentiel, c'est-à-dire **un jeu qui marche et des écoles qui disent oui**, et on décale le reste :

- **Gardé :** les règles du jeu, le prototype sur le scénario « Studio de jeu », la prospection dès janvier, **un** pilote au printemps, un kit D réduit (3 activités).
- **Décalé à l'été 2027 :** le scénario 2 « Média local », le guide d'animation complet, la marque définitive.
- **Décalé à 2028 :** la brique C, les business schools et le scénario 3 « Industrie ».
- **Ajouté :** un **prototype papier** avant le code. On teste les règles avec des cartes et une feuille, c'est 10 fois moins cher que de coder une mauvaise idée.

## Sprint 0 : l'outillage (décembre 2026)

| Tâche | Statut |
|---|---|
| Dossier local `VS-Projects/Orbit` avec la structure du projet | Fait (26 nov.) |
| Documents du projet copiés dans le dossier ; whiteboard exporté en JSON | Fait (26 nov.) |
| `README.md`, `CLAUDE.md` et `.gitignore` | Fait (26 nov.) |
| Nom du jeu choisi : **Helioso Orbit** | Fait (26 nov.) |
| Licence Helioso rédigée et complétée (`LICENSE.md`) | Fait (26 nov.) ; relecture par un juriste à faire avant la première vente |
| Dossier renommé `Orbit` (avant le premier commit) | Fait (26 nov.) |
| Vérifier la disponibilité du nom (web, marques) | Fait (26 nov.) : aucun « Helioso Orbit » en ligne ; la marque Helioso a déjà été vérifiée |
| Adresse du jeu : **orbit.helioso.com** (sous-domaine de helioso.com, déjà détenu) | Décidé (26 nov.) ; à configurer au moment de la mise en ligne |
| Dépôt Git initialisé et premier commit (VS Code) | Fait (26 nov.) |
| Dépôt publié sur GitHub, **public** : https://github.com/HugoHelio/Orbit | Fait (26 nov.) |
| Ouvrir le dossier dans VS Code avec Claude Code et vérifier qu'il lit `CLAUDE.md` | Fait (26 nov.) |

**Sprint 0 terminé le 26 novembre 2026.** Reste hors sprint : la relecture juridique de la licence.

## Les sprints

| Sprint | Dates | Objectif | Production (≈ 12 h) | Prospection (≈ 6 h) |
|---|---|---|---|---|
| **S1** | 4 – 17 janv. | Poser le jeu | Règles en une page ; cartes « humain » et « agent IA » ; détail du scénario « Studio de jeu » ; analyse rapide du Jeu de l'IA (AI4Better) pour en tirer des idées | Cartographie du réseau : qui enseigne, qui connaît qui |
| **S2** | 18 – 31 janv. | Tester sur papier | Prototype papier + 1 partie test avec 3 ou 4 proches | Premier message à l'ancienne école et à l'IUT proche |
| **S3** | 1er – 14 févr. | Passer au numérique | Prototype web v0 (Claude Code) : carte 2D, tâches qui circulent, goulots | Guide d'entretien ; 2 messages vers le réseau indirect |
| **S4** | 15 – 28 févr. | Montrer | Corrections après test ; vidéo de démo de 2 min | 2 ou 3 rendez-vous découverte, prototype en main |
| **S5** | 1er – 14 mars | Porte d'entrée | Kit D v0 : 3 activités pour les profs | 2 rendez-vous de plus ; repérer l'école la plus chaude |
| **S6** | 15 – 28 mars | Préparer le pilote | Déroulé de la séance pilote ; supports ; **choix du scénario du pilote** (« Média local » à avancer si le pilote est en GEA, TC ou MMI) | Caler la date du pilote (gratuit ou petit prix) |
| **S7** | 29 mars – 11 avr. | **Pilote** | Séance pilote (jeu B ou formation D) | Recueillir les retours ; demander une recommandation |
| **S8** | 12 – 25 avr. | Apprendre | Prototype v1 à partir des retours du pilote | Relancer les autres établissements avec le retour du pilote |
| **S9** | 26 avr. – 9 mai | Construire l'offre | Offre écrite : contenu, formats, prix | Proposition chiffrée à 2 ou 3 établissements |
| **S10** | 10 – 23 mai | Être visible | Page de présentation simple + vidéo ; pistes de nom de marque | Premiers contenus LinkedIn ; relances |
| **S11** | 24 mai – 6 juin | Signer | Ajustements selon les demandes | Obtenir des engagements pour la rentrée |
| **S12** | 7 – 20 juin | **Bilan go / no-go** | Bilan des 6 mois ; plan de l'été | Point avec chaque établissement en discussion |

*Les vacances scolaires et de fin d'année peuvent décaler un sprint. On ajuste lors des revues.*

## Backlog (à placer dans les sprints)

| Élément | Quand | Statut |
|---|---|---|
| Kit papier v1 (plateau, cartes, fiches de rôle, livret), généré depuis les documents | S2, en avance | Fait (26 nov.) ; partie test à organiser |
| **Retouche des portraits en pixel art** (Vera, Max, Sam, Nova, et la réserve Bill) pour qu'ils soient uniques et issus de nos propres générations d'IA | Avant toute diffusion publique (S4, vidéo de démo) | À faire |
| Feuille de score gamifiée du jeu numérique : score global, XP, niveau du studio, badges | S3 (prototype web) | Idée notée dans le GDD |
| Rendre jouables seules les versions de SpacePlan (`game/spaceplan-builds/`) | S3 | À faire |
| Relecture de la licence par un juriste | Avant la première vente | À faire |

## Critères de décision, fin juin 2027

| Signal | Décision |
|---|---|
| **2 établissements ou plus engagés** pour la rentrée | Passer à 20 h par semaine, préparer la rentrée pendant l'été |
| **1 établissement engagé** ou plusieurs intéressés sans engagement | Rester à 10 h, viser une rentrée décalée (janvier 2028) |
| **Aucun intérêt concret** malgré 10 rendez-vous | Revoir l'offre ou la cible avant d'investir plus |

## Été 2027 (si go)

- Le scénario 2 « Média local » (inspiré de Fontainebleau Live), s'il n'a pas été avancé pour le pilote
- Le guide d'animation
- Le nom de marque définitif et le site
- La préparation des séances de rentrée

## Indicateurs à suivre à chaque revue

- Nombre de contacts écrits, de rendez-vous obtenus et de pilotes ou d'engagements
- Nombre de parties test jouées et score moyen « je recommanderais »
- Heures réellement passées comparées aux 20 h prévues
