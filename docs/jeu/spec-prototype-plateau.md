# Spécification — le prototype du plateau numérique (« proto plateau »)

*Version 1, 26 novembre 2026. C'est la **prochaine étape du projet** (décision du 26 nov., voir le plan de sprints). Ce document suffit pour démarrer avec Claude Code : il dit quoi construire, dans quel ordre, et comment savoir que c'est terminé. Les règles du jeu sont dans le GDD (section 0, qui prime) et dans `docs/jeu/regles-une-page.md`.*

## 1. Pourquoi ce prototype, et pourquoi d'abord

La recette du jeu, c'est **l'interactivité** : voir le plateau qui s'illumine, les efforts qui se cumulent, les agents qui codent, les files d'attente qui grossissent, les fonctionnalités qui apparaissent, le score et les joueurs qui montent. **Le papier ne fait pas ressentir ça** : on ne sait pas à qui c'est le tour ni ce qui se passe ensuite. C'est donc ce prototype qui dira si le jeu marche ou pas.

Il passe **avant les builds SpacePlan** : les builds sont un risque connu (elles existent déjà dans SpacePlan) ; le plateau est le risque principal. On traite d'abord le plus gros risque.

**La question à laquelle il répond :** « En jouant sur cet écran, est-ce qu'on a envie de faire un cycle de plus, et est-ce qu'on voit tout seul que le goulot devient la décision et la vérification ? »

## 2. Le périmètre

| Dans le prototype | Plus tard (pas maintenant) |
|---|---|
| **Une équipe, un écran** (ordinateur ou vidéoprojecteur), sans serveur | Plusieurs équipes, leaderboard, écran animateur (N1, N2) |
| Les **règles de base complètes** (GDD section 0) sur les **5 cycles** (0 à 4) : ce sont les mêmes règles à chaque cycle | ARTY, les modules (dépendances, crash, dette technique…) |
| Les 20 cartes Fonctionnalité, le paquet de 20 cartes Test, les cartes Feedback, les 4 événements, tirés du fichier du scénario | Les textes en anglais (mais les clés de texte sont prévues dès maintenant) |
| Les animations et la gamification : c'est **le cœur du prototype** | La feuille de score complète (XP, badges) : seulement un premier compteur |
| Le bouton « Jouer à votre jeu » à la release, qui **affiche quelle build SpacePlan serait lancée** (règle de `docs/jeu/builds-spaceplan.md`) | Le lancement réel des builds |
| Le chrono du cycle (25 min puis 20), qu'on peut mettre en pause | Le cadenas par code de licence |
| Le journal de partie, exportable en fichier | Les statistiques du débrief |

## 3. Ce qu'on voit à l'écran

Le plateau reprend le Whiteboard (`docs/whiteboard/plateau-orbite.json`) et la direction artistique (`docs/jeu/direction-artistique.md`).

- **Au centre, le soleil ambre** (le pilotage) : les 3 rôles (chef de projet, designer, programmeur) avec leurs **3 jetons Heure** chacun. Un jeton utilisé se pose sur la station où l'on agit (petite animation de vol).
- **Autour, l'orbite et ses 6 stations-planètes :** Backlog → Prompt → Build → Test → Release → Feedback, puis retour au Backlog. **La station du temps en cours s'illumine.**
- **Les cartes Fonctionnalité sont des petits vaisseaux** qui voyagent de station en station. Chacune montre son nom, ses étoiles et ses **cases d'effort** (1 à 3) qui se remplissent.
- **Les satellites :** PIX sur Build, SCAN sur Test (portraits dans `assets/personnages/`). Quand ils travaillent, ils s'animent (PIX « tape du code », SCAN « scanne ») et affichent une bulle de leur personnalité (« Terminé ! Tout fonctionne parfaitement. »).
- **Les cartes Test cachées** sont visibles face cachée sous les efforts de PIX. On les retourne avec une animation à la relecture, au test ou à la release (moment fort : révélation devant les joueurs).
- **Les 3 files d'attente orange** (entre Prompt et Build, entre Build et Test, entre Feedback et Backlog) **grossissent visiblement** quand le travail s'entasse.
- **Les planètes extérieures :** Nébuleuse Games (Vera, en haut) et la communauté (Max, Sam, Nora), d'où arrivent les cartes Feedback.
- **Les pistes autour du plateau :** tokens IA (20 au départ), note (3 au départ, de 1 à 5), cycle (0 à 4), et **le compteur de boucles** : chaque cycle terminé allume un anneau de l'orbite.
- **Le tableau de bord du studio :** joueurs (compteur animé qui monte), note en étoiles, **score = joueurs × note**, et l'indicateur **MVP** qui s'allume quand les 5 *Must* sont publiés sans bug (gros moment de célébration : « Votre jeu a ses premiers joueurs ! »).
- **Un bouton « Temps suivant »** (joué par l'animateur ou l'équipe) et le chrono.
- **Le bouton de thème** clair / sombre « Tech ».

## 4. Ce qu'on peut faire (les interactions)

Chaque action coûte des heures (jetons) ou des tokens, selon les règles de base. Le jeu **refuse** une action impossible (plus d'heures, plus de tokens, mauvais rôle) avec un message court.

| Temps du cycle | Actions à l'écran |
|---|---|
| **Brief** | Le message de Vera s'affiche (portrait + texte), puis la carte Événement se retourne |
| **Planning** | Trier une carte Feedback (glisser sur une fonctionnalité ou l'écarter) ; choisir les fonctionnalités du cycle (glisser du Backlog vers Prompt) ; écrire le risque du cycle (champ texte court) |
| **Build** | Pour une fonctionnalité : prompt simple ou détaillé à PIX (une carte Test cachée par effort, 1 token par effort, 3 efforts par cycle au maximum, le reste attend dans la file) ; ou effort fait par un humain (1 heure, sans carte Test) |
| **Test** | Relire un effort (1 heure) ; tester avec SCAN (1 token, 4 par cycle) ; playtester (1 heure, designer) ; corriger un problème trouvé (1 heure) |
| **Release** | Cocher les fonctionnalités prêtes à publier ; bouton « Publier » : révélation des cartes Test cachées ; bouton « Jouer à votre jeu » (affiche la build qui serait lancée) |
| **Review** | Calcul animé : étoiles → joueurs → note → score ; arrivée des cartes Feedback (1 par nouveau palier de 100 joueurs) ; pénalité si plus de 4 cartes non triées ; l'anneau de la boucle s'allume |

## 5. Les règles techniques (en plus de `CLAUDE.md`)

- **Dossier :** `game/plateau/` (`index.html`, `style.css`, `js/`).
- **Le plateau s'ouvre en double-cliquant sur `index.html`**, sans serveur ni Internet. Donc le scénario est un fichier JavaScript chargé par une balise `<script>` (`game/scenarios/orbit-studio.js`, qui définit `window.SCENARIO`), pas un JSON chargé par `fetch` (qui ne marche pas en ouverture directe de fichier).
- **Le fichier du scénario contient tout ce qui peut changer :** les 20 fonctionnalités (id, nom, catégorie, efforts, étoiles, priorité cachée, responsable, phrase), les 20 cartes Test, les cartes Feedback, les 4 événements, les messages de Vera, les chiffres des règles (heures par rôle, capacité de PIX et de SCAN, tokens de départ, joueurs par étoile, effets sur la note, durée des cycles) et **tous les textes affichés** (clé + `fr`). La source des données est `docs/jeu/cartes-orbit-studio.md`.
- **Les règles sont les mêmes que celles du simulateur** (`prototype-papier/outil/simuler.py`) : s'en servir comme référence pour le calcul du score, du MVP et de la note, pour que le jeu et la simulation donnent les mêmes résultats.
- **Le moteur est une machine à états** (les 6 temps × 5 cycles), séparé de l'affichage : un fichier pour l'état et les règles, un fichier pour le dessin et les animations.
- **Le hasard est rejouable :** les paquets sont mélangés avec une graine (affichée dans le journal), pour pouvoir rejouer une partie à l'identique.
- **L'état est sauvegardé dans le navigateur** à chaque action : on peut fermer et rouvrir sans perdre la partie. Un bouton « Nouvelle partie ».
- **Le journal de partie** note chaque action (cycle, temps, rôle, action, coût, résultat) ; bouton « Exporter le journal ».
- **Dessin :** le plateau en SVG, les animations en CSS (transitions) et un peu de JavaScript. Pas de bibliothèque lourde. Toutes les couleurs par les variables CSS de la direction artistique.

## 6. Les étapes de construction (une étape = une session de travail)

Chaque étape se termine par un test dans le navigateur, une mise à jour de ce document (cocher l'étape) et un commit.

| # | Étape | Terminé quand… | Fait |
|---|---|---|---|
| 1 | **Le plateau statique, joli** : soleil, 6 stations, files, satellites, planètes extérieures, pistes, deux thèmes | On l'ouvre en double-cliquant et on a envie de jouer dessus | ☐ |
| 2 | **Le fichier du scénario** et les 20 cartes Fonctionnalité dans le Backlog | Les 20 cartes s'affichent avec nom, étoiles et cases d'effort, sans texte en dur dans le code | ☐ |
| 3 | **La machine à états** : les 6 temps et les 5 cycles, bouton « Temps suivant », station active qui s'illumine, chrono | On fait défiler une partie vide du cycle 0 au cycle 4 | ☐ |
| 4 | **Planning et Build** : choisir, jetons Heure, prompts à PIX, cartes Test cachées, tokens, file d'attente de PIX | Au cycle 0, on fait les 5 *Must* à la main ; au cycle 1, PIX travaille et les cartes Test se posent | ☐ |
| 5 | **Test et Release** : relire, SCAN, playtest, corriger, publier, révélation des cartes Test | Une fonctionnalité publiée avec un Bug rapporte 0 étoile, comme dans les règles | ☐ |
| 6 | **Review et score** : joueurs, note, MVP, score animés ; anneau de boucle | Les scores d'une partie correspondent à ceux du simulateur pour les mêmes décisions | ☐ |
| 7 | **Feedback et événements** : arrivée des cartes, tri, pénalité, messages de Vera, événements E1 à E4 | Une partie complète des cycles 0 à 4 est jouable de bout en bout | ☐ |
| 8 | **La gamification** : célébration du MVP, compteur de joueurs, bulles de PIX et SCAN, files qui grossissent, sons légers (coupables) | Un proche regarde 2 minutes et dit « c'est quoi ce jeu ? je peux essayer ? » | ☐ |
| 9 | **Journal, sauvegarde, « Jouer à votre jeu »** (affiche la build qui serait lancée) | On ferme le navigateur, on rouvre, la partie continue ; le journal s'exporte | ☐ |

**Estimation :** 9 sessions de 2 à 3 heures, soit 20 à 25 heures : la période libre de début décembre, puis S1. À revoir après l'étape 3.

## 7. Comment on saura que ça marche (le test)

Partie test avec 2 ou 3 proches, cycles 0 et 1 d'abord (après l'étape 7), puis la partie complète. Les critères du GDD (section 13) s'appliquent :
- au moins 2 joueurs sur 3 veulent rejouer ;
- au débrief, les joueurs formulent **eux-mêmes** au moins 3 des 7 leçons ;
- un cycle tient en moins de 20 à 25 minutes ;
- l'équipe qui relit et trie n'est pas pénalisée.

Questions propres au numérique : sait-on toujours à qui c'est le tour et quoi faire ensuite ? Voit-on la file Feedback → Backlog grossir sans qu'on l'explique ? Quel moment a été le plus fort (MVP, révélation des cartes Test, arrivée de Nora) ?

## 8. Le prompt de départ pour Claude Code

> Lis `CLAUDE.md`, puis `docs/jeu/spec-prototype-plateau.md`, la section 0 du GDD, `docs/jeu/regles-une-page.md`, `docs/jeu/direction-artistique.md` et `docs/jeu/cartes-orbit-studio.md`. Nous faisons l'étape 1 de la spécification : le plateau statique. Explique-moi ton plan en quelques lignes avant de coder, puis propose-moi de tester dans le navigateur.
