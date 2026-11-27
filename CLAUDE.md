# CLAUDE.md — contexte du projet Helioso Orbit

## Le projet

**Helioso Orbit** est un **business game** de 3 heures, joué en salle par des équipes de 3 étudiants, qui apprend à piloter un projet avec des **agents IA**. Grande leçon : avec l'IA, le goulot d'étranglement passe de la production à la **décision et à la vérification**.

Le jeu se décline en scénarios : **Orbit : Studio** (le premier, en développement : les joueurs dirigent le studio fictif *Orbital Studio*), **Orbit : Média local**, **Orbit : Industrie**.

Il fait partie de l'activité **Helioso** en préparation (lancement mi/fin 2027), qui vend aux écoles :
- un kit et une formation « Enseigner avec l'IA » (brique D) ;
- ce business game, en licence avec séminaires animés (brique B) ;
- plus tard, un atelier licencié à des animateurs certifiés (brique C).

## Où on en est et prochaine étape

*À lire en premier à chaque session. Mis à jour à chaque décision (dernière mise à jour : 27 novembre 2026).*

- L'utilisateur prépare le projet aussi en discussion avec Claude (chat), que Claude Code ne voit pas : **les décisions sont toujours reportées dans les documents du dépôt**. Si une demande contredit un document, le signaler et demander laquelle des deux fait foi.
- **Fait :** GDD 0.20, étape 1 de la démo du plateau (`game/plateau/index.html`, plateau statique dans les deux thèmes), cartes, règles sur une page, simulateur, kit papier v1, inventaire des builds SpacePlan.
- **Prochaine étape : la démo animée du plateau** (`docs/jeu/spec-prototype-plateau.md`) : un scénario scripté de 2 boucles, **sans règles derrière**, pour voir si le flux se comprend et si la gamification est engageante. Elle passe **avant les règles numériques et les builds SpacePlan**. **Étapes 1 et 2 faites. Étape en cours : l'étape 3 (le lecteur et le script des 2 boucles), codée, à valider par l'utilisateur** (`game/plateau/js/script-demo.js`, `game/plateau/js/lecteur.js`). Ensuite, l'étape 4 : la gamification (compteurs qui défilent, étoiles qui volent, célébration du MVP, sons). **Le design de la démo est gelé jusqu'à l'étape 5** : une nouvelle idée de design se note dans la spécification (section 6), on ne l'applique pas.
- **Ensuite, si la démo convainc :** le moteur de règles (mêmes calculs que le simulateur), qui pilote les mêmes animations que la démo.
- **Ensuite :** les builds SpacePlan (PoC d'abord), voir `docs/jeu/builds-spaceplan.md` et le plan de sprints.

## Les documents de référence

- `docs/jeu/gdd-orbit-studio.md` : **le GDD, qui fait foi pour tout le design du jeu.** Lis-le avant de coder une règle.
- `docs/offre/scenarios-business-game.md` : les trois scénarios.
- `docs/offre/proposition-offre-ecoles-ia.md` : l'offre commerciale.
- `docs/pilotage/plan-sprints-2027.md` : le calendrier et les sprints.
- `docs/whiteboard/plateau-orbite.json` : la sauvegarde du whiteboard du plateau.
- `LICENSE.md` : la licence Helioso (code visible, usage sous licence).
- `docs/jeu/direction-artistique.md` : la palette, les deux thèmes et la typographie.
- `docs/jeu/spec-prototype-plateau.md` : **la spécification de la prochaine étape**, la démo animée du plateau, en 5 étapes.
- `docs/jeu/builds-spaceplan.md` : les builds jouables de SpacePlan et la règle « cartes publiées → build » (après le plateau).
- `docs/jeu/regles-une-page.md`, `docs/jeu/cartes-orbit-studio.md`, `prototype-papier/outil/simuler.py` : les règles, les cartes et le simulateur (référence pour le calcul du score).

## Conventions

- **Langue :** tout en français (documents, textes du jeu, commentaires du code, messages de commit). Les noms de variables et de fichiers de code restent en anglais.
- **Textes du jeu traduisibles :** aucun texte affiché n'est écrit en dur dans le code. Chaque texte a une clé et une version par langue (`fr` d'abord, `en` ensuite) dans le fichier du scénario.
- **Une décision de design = une mise à jour du GDD** : modifier la section concernée, ajouter une ligne au journal des décisions et, si besoin, monter la version.
- **Le dépôt est public** : ne jamais committer de secret (clés d'API, fichiers `.env`, configuration Firebase privée), ni de données personnelles (contacts, prospection), ni de chiffres internes (scénarios de revenus). Ces informations sont dans Google Drive.
- **Messages de commit** courts et clairs, en français, par exemple : `GDD 0.5 : barème du leaderboard`.

## Le code du jeu (dossier `game/`)

L'utilisateur n'est pas développeur : il pilote, Claude Code écrit le code. Donc :
- **Rester simple** : application web en HTML, CSS et JavaScript, sans framework lourd au départ.
- Le jeu est une **machine à états** (les phases d'un cycle), pilotée par une seule source.
- Le scénario est dans un **fichier de configuration séparé** (fonctionnalités, agents, défauts, feedback, événements, barème, textes du récit), pour brancher d'autres scénarios sans toucher au code.
- Chaque décision de jeu est écrite dans un **journal de partie** (pour le débrief).
- Le jeu doit **fonctionner hors ligne** (application web installable, état gardé en local).
- **Chapitre gratuit et cadenas :** le cycle 0 et le cycle 1 sont jouables sans code ; la suite se débloque avec un code de licence. Un système simple au début (N1). À partir du multijoueur (N2), les contenus payants ne sont plus dans le dépôt public : ils sont servis par Firebase aux licences valides.
- **Deux thèmes, clair (par défaut) et sombre « Tech »** : toutes les couleurs passent par des variables CSS (`--bg`, `--surface`, `--text`, `--accent`…) définies dans `docs/jeu/direction-artistique.md`, avec un bouton pour basculer de l'un à l'autre. Jamais de couleur en dur dans les composants.
- Expliquer chaque étape en termes simples et proposer de tester dans le navigateur après chaque changement.
