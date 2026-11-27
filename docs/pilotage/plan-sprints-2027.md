# Plan de sprints, décembre 2026 – juin 2027

*Document vivant : mis à jour à chaque fin de sprint. Version 8, 27 novembre 2026. Scénarios du jeu : voir `docs/offre/scenarios-business-game.md`. Design du jeu : `docs/jeu/gdd-orbit-studio.md`. Prochaine étape : `docs/jeu/spec-prototype-plateau.md`. Builds de SpacePlan : `docs/jeu/builds-spaceplan.md`.*

## Où on en est (pour reprendre une session, y compris avec Claude Code)

- **Fait :** GDD 0.20, cartes, règles sur une page, simulateur, kit papier v1, inventaire des builds SpacePlan par chapitre ; démo du plateau, étape 1 (plateau statique dans les deux thèmes, 26 nov.).
- **En cours : la démo animée du plateau** (`docs/jeu/spec-prototype-plateau.md`), **étape 2 « les briques animées », à moitié faite** (pioches, cartes qui volent et se retournent, zones Idées → Backlog → couloir). Restent six animations : jeton Heure, station, ticket, effort, PIX et SCAN, files. Puis les étapes 3 à 5 : script des 2 boucles, gamification, test auprès de 3 ou 4 personnes.
- **Ensuite :** le moteur de règles numérique (qui pilote les mêmes animations), puis les builds SpacePlan (PoC d'abord, puis Proto, page de lancement, Alpha).

## Cadre

- **Capacité :** 10 heures par semaine à partir de janvier 2027, à augmenter si les signaux sont bons. **Décembre :** beaucoup de temps début décembre, peu pendant les fêtes.
- **Rythme :** des sprints de 2 semaines, soit **20 heures par sprint**.
- **Répartition type d'un sprint :** environ 12 h de production (jeu, kit), 6 h de prospection, 2 h de pilotage (revue de sprint, mise à jour de ce plan).
- **Rituel :** à la fin de chaque sprint, une revue de 30 minutes avec Claude : ce qui est fait, ce qui bloque, ce qu'on ajuste.
- **Rituel de cadrage :** chaque session de travail commence par **un objectif et sa définition du « terminé »** (les étapes de la spécification servent à ça), et finit par la mise à jour des documents.
- **Rituel de sauvegarde :** à la fin de chaque session de travail, mise à jour des documents, export du whiteboard, puis commit et push sur GitHub.
- **Lien entre les outils :** Claude Code ne voit pas les discussions avec Claude (chat). **Tout ce qui est décidé en discussion est écrit dans les documents du dépôt** (ce plan, le GDD, les spécifications), qui sont la mémoire commune.

## Décisions du 26 novembre 2026 : le numérique d'abord, le plateau avant les builds

La force du jeu est dans l'**interactivité** : le plateau qui s'anime, qui montre à qui c'est le tour et ce qui se passe ensuite, les efforts qui se cumulent, les agents qui codent, la gamification. Le papier ne fait pas ressentir ça. Donc :

- **Le plateau passe en premier**, avant les builds SpacePlan : c'est le plus gros risque (l'expérience), alors que les builds sont un risque connu (elles existent dans SpacePlan).
- **D'abord une démo animée et scriptée, sans règles** (1 ou 2 boucles) : voit-on où regarder, comprend-on le flux, est-ce attirant et gratifiant ? Le moteur de règles ne se construit que si la démo convainc, et il réutilise ses animations.
- **Le papier devient une vérification légère** : relire les règles, une partie courte (cycles 0 et 1) avec 1 ou 2 personnes. Question posée : « les règles se comprennent-elles ? ». Le kit papier reste le **repli hors ligne** obligatoire.
- **Le vrai test, c'est le prototype numérique.** Les critères de réussite du GDD (envie de rejouer, leçons formulées par les joueurs, durée du cycle) s'appliquent à la partie numérique.
- **Parades contre le risque de coder des règles bancales :** toutes les règles et tous les chiffres dans le **fichier de scénario** (pas dans le code) ; les mêmes règles que le simulateur ; un test avec des proches dès que les cycles 0 et 1 sont jouables.
- **L'avance sert aussi la prospection :** le plateau animé (et plus tard les builds) servent de démo dès les premiers rendez-vous.

## Ce que change le passage à 10 heures

Sur janvier – juin, on dispose d'environ **260 heures** au lieu de 500. On garde l'essentiel, c'est-à-dire **un jeu qui marche et des écoles qui disent oui**, et on décale le reste :

- **Gardé :** les règles du jeu, le prototype sur le scénario « Studio de jeu », la prospection dès janvier, **un** pilote au printemps, un kit D réduit (3 activités).
- **Décalé à l'été 2027 :** le scénario 2 « Média local », le guide d'animation complet, la marque définitive.
- **Décalé à 2028 :** la brique C, les business schools et le scénario 3 « Industrie ».

## Sprint 0 : l'outillage (novembre 2026)

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

## Décembre 2026 : sprint d'avance

**Début décembre (temps disponible) : la démo animée du plateau** (`docs/jeu/spec-prototype-plateau.md`), puis le début du moteur de règles

| Tâche | Définition du « terminé » |
|---|---|
| Démo, étapes 1 à 4 : plateau joli, briques animées, script des 2 boucles, gamification | La démo se joue en 2 à 3 minutes et donne envie de voir la boucle suivante |
| Démo, étape 5 : la montrer à 3 ou 4 personnes sans rien expliquer, puis retoucher | 3 personnes sur 4 racontent le flux sans aide et notent l'envie de jouer à 4 sur 5 ou plus |
| Relecture des règles + **mini-test papier** (cycles 0 et 1, 1 ou 2 personnes, 1 h) | Liste des points incompris, corrections dans le GDD |

**Fin décembre (fêtes, peu de temps), des tâches courtes, qu'on peut sauter :**
- Cartographie du réseau (avancée de S1) : qui enseigne, qui connaît qui.
- Jouer seul au plateau et noter les idées de gamification.

## Les sprints

| Sprint | Dates | Objectif | Production (≈ 12 h) | Prospection (≈ 6 h) |
|---|---|---|---|---|
| **S1** | 4 – 17 janv. | Plateau jouable | **Moteur de règles** (GDD section 0, mêmes calculs que le simulateur) branché sur les animations de la démo ; **première partie test** (cycles 0 et 1) avec 2 ou 3 proches | Premier message à l'ancienne école et à l'IUT proche |
| **S2** | 18 – 31 janv. | Builds SpacePlan | Corrections après le test ; builds **PoC** (3 interrupteurs) et **Proto** ; README des builds ; page de lancement branchée sur « Jouer à votre jeu » | Guide d'entretien ; 2 messages vers le réseau indirect |
| **S3** | 1er – 14 févr. | Jeu complet | Build **Alpha** à interrupteurs ; partie test complète (cycles 0 à 4) ; feuille de score gamifiée | 2 ou 3 rendez-vous découverte, démo en main |
| **S4** | 15 – 28 févr. | Montrer | Corrections ; plusieurs équipes et leaderboard (N1) ; vidéo de démo de 2 min | 2 ou 3 rendez-vous de plus |
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
| Kit papier v1 (plateau, cartes, fiches de rôle, livret), généré depuis les documents | En avance | Fait (26 nov.) ; sert au mini-test et au repli hors ligne |
| Règles sur une page (`docs/jeu/regles-une-page.md`) et simulateur d'équilibrage (`docs/jeu/simulation-equilibrage.md`) | En avance | Fait (26 nov.) : règles validées par 2 000 parties simulées par stratégie |
| Inventaire des builds par chapitre (`docs/jeu/builds-spaceplan.md`) | En avance | Fait (26 nov.) : Proto, PoC, Alpha à interrupteurs ; Beta optionnelle |
| **Démo animée du plateau** (`docs/jeu/spec-prototype-plateau.md`), 5 étapes, sans règles | Début décembre | **En cours** : étape 1 faite (26 nov.), étape 2 à moitié (27 nov.) |
| Corriger le script de la boucle 2 de la démo (il ne suit plus les règles 0.19 et 0.20) | Début de l'étape 3 | À faire |
| Remettre les sections 5 à 11 du GDD au vocabulaire de la section 0 (PA, blocs, carte défaut, brief…) | Avant le moteur de règles | À faire |
| Moteur de règles numérique, qui pilote les animations de la démo | Décembre → S1, si la démo convainc | À faire |
| **Mini-test papier** : cycles 0 et 1, 1 ou 2 personnes | Début décembre | À organiser |
| Builds PoC et Proto + README + page de lancement | S2 | À faire |
| Build Alpha à interrupteurs | S3 | À faire |
| Build Beta à interrupteurs | Après le pilote | Optionnel |
| Interrupteur « bug » par fonctionnalité (jouer une fonctionnalité publiée avec une carte Bug) | Après S3 | Idée |
| **Retouche des portraits en pixel art** (Vera, Max, Sam, Nora, et la réserve Bill) pour qu'ils soient uniques et issus de nos propres générations d'IA | Avant toute diffusion publique (S4, vidéo de démo) | À faire |
| Feuille de score gamifiée du jeu numérique : score global, XP, niveau du studio, badges | S3 | Idée notée dans le GDD ; premier compteur dans le plateau |
| Impression finale du kit papier (A2, 250 g) | Avant le pilote (S6) | À faire |
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
