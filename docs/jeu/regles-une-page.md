# Orbit : Studio — les règles

*Version 4 du 26 novembre 2026 : passe sur le vocabulaire (effort, heure, carte Test, MVP, prompt, cycle Brief → Review). Recto « l'essentiel en images », verso « le détail ». Elle découle du GDD (version 0.14, section 0) et des cartes (`docs/jeu/cartes-orbit-studio.md`), et a été vérifiée par simulation (`docs/jeu/simulation-equilibrage.md`). Dans le livret, les symboles sont remplacés par les vrais visuels du jeu.*

## Le but

Vous dirigez **Orbital Studio**, un petit studio de jeu vidéo qui travaille avec deux agents IA. En 5 cycles, sortez le meilleur jeu possible pour le festival. Le studio en tête signe avec l'éditeur Nebulous Publishing.

**Score = gamers × note.**

*Certains mots sont en anglais, exprès : ce sont ceux qu'on entend chaque jour dans un studio ou une équipe tech (brief, release, bug, feedback, prompt...). Autant les apprendre en jouant.*

## Le matériel en un coup d'œil

| | Nom | Ce que c'est |
|---|---|---|
| ⭐ | **Étoile** | La valeur d'une fonctionnalité pour les gamers (les joueurs de votre jeu vidéo). **1 étoile = 25 gamers.** |
| 🟩 | **Effort** | La quantité de travail d'une fonctionnalité : 1 à 3 cases grises sur sa carte. Quand un effort est fait, on pose un **pion Effort** sur une case. |
| 🟠 | **Heure** | Le temps d'un joueur : **3 jetons Heure par joueur et par cycle**. Chaque action coûte 1 ou 2 heures : on pose ses jetons sur la station où l'on agit. |
| 🔷 | **Token IA** | Le budget IA du studio, comme les tokens que l'on paie pour utiliser une IA : **20 pour toute la partie**. Chaque effort fait par PIX et chaque test de SCAN coûte 1 token. On le suit avec un marqueur sur la piste. |
| 🟥 | **Carte Test** | Cachée sous chaque effort fait par PIX : elle dit ce que cache son travail, *OK*, *Bug* ou *Pas fun*. Personne ne la regarde avant de tester. |
| 🟨 | **Carte Feedback** | Ce que dit la communauté des gamers, de façon anonyme, à trier. |
| 📈 | **Note** | La qualité du jeu aux yeux des gamers, de 1 à 5. Elle commence à 3. |

## Un cycle en 6 temps

1. **Brief** : Vera, l'éditrice (jouée par l'animateur), donne les nouvelles du cycle.
2. **Planning** : trier le feedback, choisir les fonctionnalités, noter le risque du cycle.
3. **Build** : écrire un prompt pour PIX, faire soi-même les efforts.
4. **Test** : relire, tester avec SCAN, playtester, corriger.
5. **Release** : on publie. Les cartes Test encore cachées se révèlent.
6. **Review** : on compte les gamers, la note et le score.

## Le détail

### 1. Brief

L'animateur lit le message de Vera et retourne la carte Événement du cycle. Son type a été annoncé au cycle précédent : on pouvait s'y préparer.

### 2. Planning

- **Trier le feedback** (le chef de projet, 1 heure pour 2 cartes). Une carte Bug, Idée ou Pas fun se pose sur la fonctionnalité qu'elle cite. Si cette fonctionnalité est déjà publiée, il faut 1 effort de plus dessus. Quand ce travail est publié, **la note monte de 0,5**. Les cartes Hors liste et Compliment s'écartent.
- **Choisir** les fonctionnalités : au départ, 12 idées sont visibles : la première liste de votre équipe. Rangez celles que vous voulez faire dans le Backlog, par priorité, puis choisissez celles du cycle.
- **Idées de gamers :** 8 autres fonctionnalités sont cachées. Quand vous triez une carte Feedback qui cite l'une d'elles, elle apparaît et rejoint vos idées.
- **Noter le risque du cycle** sur la feuille de score, en une phrase : ce qui pourrait mal tourner, et ce que vous faites contre. Après la release, cochez s'il est arrivé.

### 3. Build

- **Écrire un prompt pour PIX** (le chef de projet ou le designer) : un prompt couvre une fonctionnalité entière. Il coûte 1 heure s'il est simple, 2 heures s'il est détaillé.
- **PIX fait jusqu'à 3 efforts par cycle**, pour 1 token chacun. Pour chaque effort, glissez une carte Test face cachée sous la carte Fonctionnalité. Prompt simple : on tire 1 carte. Prompt détaillé : on en tire 2 et on garde la meilleure. Les efforts en trop attendent le cycle suivant.
- **Un humain fait au plus 1 effort par cycle** (2 au cycle 0), pour 1 heure, et seulement sur ses fonctionnalités. Son travail n'a jamais de problème : pas de carte Test.
- Une carte Fonctionnalité dont toutes les cases portent un pion Effort est **prête pour la release**.

### 4. Test

- **Relire** un effort de PIX (1 heure, le responsable de la fonctionnalité) : on retourne sa carte Test.
- **SCAN** teste jusqu'à 4 efforts par cycle, pour 1 token par test. Il trouve les Bug, jamais les Pas fun.
- **Playtester** une fonctionnalité (1 heure, le designer) : on trouve ses Pas fun.
- **Corriger** un problème trouvé (1 heure, le responsable) : la carte Test est défaussée.

### 5. Release

L'équipe choisit les fonctionnalités prêtes qu'elle publie. Les cartes Test encore cachées sont retournées devant les gamers.

- **Bug publié** : la fonctionnalité rapporte 0 étoile jusqu'à sa correction, et la note baisse de 0,5.
- **Pas fun publié** : la fonctionnalité perd 1 étoile jusqu'à sa correction.

### 6. Review

- **Gamers = étoiles du jeu publié × 25**, recalculés à chaque release.
- **MVP (Minimum Viable Product) :** tant que les 5 fonctionnalités essentielles ne sont pas toutes publiées sans bug, **le jeu a 0 gamer**. Vera ne demande qu'un jeu en pixel art dans l'esprit de Space Invaders : à vous de trouver ce qui le rend jouable.
- **Feedback :** une nouvelle carte à chaque palier de 100 gamers atteint pour la première fois.
- **Communauté ignorée :** s'il reste plus de 4 cartes Feedback non triées, la note baisse de 0,5.
- **La note reste entre 1 et 5.** Score du cycle = gamers × note.

### Les règles particulières

- **Cycle 0 :** pas de carte Test, pas de token dépensé, pas d'événement, pas de feedback. Il n'y a rien à tester ni à trier : **chaque humain peut faire 2 efforts**.
- **Le chrono :** chaque cycle est chronométré, **25 minutes au cycle 0, puis 20 minutes**. À la sonnerie, on passe à la release avec ce qui est prêt.
- **Les rôles :** le programmeur est responsable des fonctionnalités « Prog », le designer des fonctionnalités « Design » et « Art ». Le chef de projet trie, écrit les prompts et décide des actions des agents.
- **Pioche Test vide :** on mélange la défausse pour la reformer.

### Les mots du métier

| Mot | Ce qu'il veut dire | Mot | Ce qu'il veut dire |
|---|---|---|---|
| **Brief** | Les nouvelles et consignes du début de cycle | **Bug** | Une erreur : la fonctionnalité ne marche pas |
| **Planning** | Le moment où l'on décide quoi faire | **Release** | La sortie d'une nouvelle version du jeu |
| **Build** | Fabriquer le jeu : faire les efforts | **Review** | Le bilan de fin de cycle |
| **Prompt** | La consigne écrite que l'on donne à une IA | **Feedback** | Ce que les gamers disent du jeu |
| **Gamer** | Un joueur de votre jeu vidéo, Star Squadron (à ne pas confondre avec vous, les joueurs d'Helioso Orbit) | | |
| **Backlog** | La liste des fonctionnalités à faire | **MVP** | La plus petite version du jeu qui mérite des gamers |
