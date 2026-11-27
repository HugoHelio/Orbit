# Orbit : Studio — les règles

*Version 6 du 27 novembre 2026 : la code review revient au programmeur, garant du code (comme le playtest revient au designer, garant du fun). Version 5 du 27 novembre 2026 : jeton Prod, code review, deux sortes de bugs, deux aiguillages (qui produit ; corriger ou publier quand même), ticket correctif pour une fonctionnalité live. Version 4 du 26 novembre 2026 : passe sur le vocabulaire (effort, heure, carte Test, MVP, prompt, cycle Brief → Review). Recto « l'essentiel en images », verso « le détail ». Elle découle du GDD (version 0.14, section 0) et des cartes (`docs/jeu/cartes-orbit-studio.md`), et a été vérifiée par simulation (`docs/jeu/simulation-equilibrage.md`). Dans le livret, les symboles sont remplacés par les vrais visuels du jeu.*

## Le but

Vous dirigez **Orbital Studio**, un petit studio de jeu vidéo qui travaille avec deux agents IA. En 5 cycles, sortez le meilleur jeu possible pour le festival. Le studio en tête signe avec l'éditeur Nebulous Publishing.

**Score = gamers × note.**

*Certains mots sont en anglais, exprès : ce sont ceux qu'on entend chaque jour dans un studio ou une équipe tech (brief, release, bug, feedback, prompt...). Autant les apprendre en jouant.*

## Le matériel en un coup d'œil

| | Nom | Ce que c'est |
|---|---|---|
| ⭐ | **Étoile** | La valeur d'une fonctionnalité pour les gamers (les joueurs de votre jeu vidéo). **1 étoile = 25 gamers.** |
| 🟩 | **Effort** | La quantité de travail d'une fonctionnalité : 1 à 3 cases grises sur sa carte. Quand un effort est fait, on pose un **pion Effort** sur une case. |
| 🟠 | **Heure** | Le temps d'un joueur : **3 jetons par joueur et par cycle**, soit **15 sur la partie** (5 cycles). Chaque action coûte 1 ou 2 heures : on pose ses jetons sur la station où l'on agit. Les heures non utilisées sont perdues. |
| ⚒ | **Jeton Prod** | Un des 3 jetons est un **jeton Prod** : le seul qui permet de **produire soi-même un effort**. Produire demande une longue plage de concentration ; entre les réunions, les code reviews et les tests, chacun n'en trouve qu'une par cycle. Il peut aussi servir d'heure ordinaire. |
| 🔷 | **Token IA** | Le budget IA du studio, comme les tokens que l'on paie pour utiliser une IA : **20 pour toute la partie**. Chaque effort fait par PIX et chaque test de SCAN coûte 1 token. On le suit avec un marqueur sur la piste. |
| 🟥 | **Carte Test** | Cachée sous chaque effort fait par PIX : elle dit ce que cache son travail, *OK*, *Bug bloquant*, *Bug mineur* ou *Pas fun*. Personne ne la regarde avant de tester. |
| 🟨 | **Carte Feedback** | Ce que dit la communauté des gamers, de façon anonyme, à trier. |
| 📈 | **Note** | La qualité du jeu aux yeux des gamers, de 1 à 5. Elle commence à 3. |

## Un cycle en 6 temps

1. **Brief** : Vera, l'éditrice (jouée par l'animateur), donne les nouvelles du cycle.
2. **Planning** : trier le feedback, choisir les fonctionnalités, noter le risque du cycle.
3. **Build** : écrire un prompt pour PIX, faire soi-même les efforts.
4. **Test** : vérifier (SCAN, code review, playtest), puis corriger ou publier quand même.
5. **Release** : on publie. Les cartes Test encore cachées se révèlent.
6. **Review** : on compte les gamers, la note et le score.

## Le détail

### 1. Brief

L'animateur lit le message de Vera et retourne la carte Événement du cycle. Son type a été annoncé au cycle précédent : on pouvait s'y préparer.

### 2. Planning

- **Trier le feedback** (le chef de projet, 1 heure pour 2 cartes). Une carte Bug, Idée ou Pas fun se pose sur la fonctionnalité qu'elle cite. Si cette fonctionnalité est **déjà live**, un **ticket correctif** (1 effort) part de la Communauté vers le Backlog et refait tout le chemin ; la fonctionnalité reste live en attendant. Quand ce travail est publié, **la note monte de 0,5**. Les cartes Hors liste et Compliment s'écartent.
- **Choisir** les fonctionnalités : au départ, 12 idées sont visibles : la première liste de votre équipe. Rangez celles que vous voulez faire dans le Backlog, par priorité, puis choisissez celles du cycle.
- **Qui produit ? (l'aiguillage à la sortie du Backlog)** Pour chaque fonctionnalité qui part dans le cycle, choisissez :
  - **PIX** : le ticket s'arrête à la station Prompt. Vite (jusqu'à 3 efforts par cycle), pour 1 token par effort, mais avec un risque : une carte Test cachée sous chaque effort.
  - **Le responsable** (le programmeur pour « Prog », le designer pour « Design » et « Art ») : le ticket saute le Prompt et va au Build. Lent (son jeton Prod : 1 effort par cycle), mais sans risque.
- **Idées de gamers :** 8 autres fonctionnalités sont cachées. Quand vous triez une carte Feedback qui cite l'une d'elles, elle apparaît et rejoint vos idées.
- **Noter le risque du cycle** sur la feuille de score, en une phrase : ce qui pourrait mal tourner, et ce que vous faites contre. Après la release, cochez s'il est arrivé.

### 3. Build

- **Écrire un prompt pour PIX** (le chef de projet ou le designer) : un prompt couvre une fonctionnalité entière. Il coûte 1 heure s'il est simple, 2 heures s'il est détaillé.
- **PIX fait jusqu'à 3 efforts par cycle**, pour 1 token chacun. Pour chaque effort, glissez une carte Test face cachée sous la carte Fonctionnalité. Prompt simple : on tire 1 carte. Prompt détaillé : on en tire 2 et on garde la meilleure. Les efforts en trop attendent le cycle suivant.
- **Un humain produit un effort avec son jeton Prod** : 1 par cycle (2 au cycle 0 et au cycle 4), et seulement sur ses fonctionnalités. Son travail n'a jamais de problème : pas de carte Test.
- Une carte Fonctionnalité dont toutes les cases portent un pion Effort est **prête pour la release**.

### 4. Test

Trois façons de vérifier, qui ne trouvent pas les mêmes choses :

| Vérification | Qui, et ce que ça coûte | Ce qu'elle trouve |
|---|---|---|
| **SCAN** (tests automatiques) | L'agent, 1 token par effort, jusqu'à 4 par cycle | Les Bug, **jamais les Pas fun** |
| **Code review** | Le programmeur (garant du code), 1 heure par effort de PIX | Tout : on retourne la carte Test |
| **Playtest** | Le designer, 1 heure pour toute la fonctionnalité | Les Pas fun |

**Un problème trouvé ? (l'aiguillage à la sortie du Test)**
- **Corriger** (1 heure du responsable, jamais PIX) : le ticket recule au Build, l'effort fautif est refait, la carte Test est défaussée et le ticket revient au Test. S'il n'a plus d'heure, le ticket attend au Build le cycle suivant.
- **Publier quand même** : le ticket part à la Release avec son défaut, et l'effet s'applique.

### 5. Release

L'équipe choisit les fonctionnalités prêtes qu'elle publie. Les cartes Test encore cachées sont retournées devant les gamers.

- **Bug bloquant publié** : la fonctionnalité ne marche pas, elle rapporte 0 étoile, et la note baisse de 0,5. Sur une fonctionnalité Must, le MVP est cassé : 0 gamer.
- **Bug mineur publié** : les gamers continuent de jouer ; la fonctionnalité garde ses étoiles, mais la note baisse de 0,5.
- **Pas fun publié** : la fonctionnalité perd 1 étoile.
- Pour corriger une fonctionnalité déjà live, il faut un **ticket correctif** (voir le Planning).

### 6. Review

- **Gamers = étoiles du jeu publié × 25**, recalculés à chaque release.
- **MVP (Minimum Viable Product) :** tant que les 5 fonctionnalités essentielles ne sont pas toutes publiées sans bug bloquant, **le jeu a 0 gamer**. Vera ne demande qu'un jeu en pixel art dans l'esprit de Space Invaders : à vous de trouver ce qui le rend jouable.
- **Feedback :** une nouvelle carte à chaque palier de 100 gamers atteint pour la première fois.
- **Communauté ignorée :** s'il reste plus de 4 cartes Feedback non triées, la note baisse de 0,5.
- **La note reste entre 1 et 5.** Score du cycle = gamers × note.

### Les règles particulières

- **Cycle 0, « l'élan du lancement » :** pas de carte Test, pas de token dépensé, pas d'événement, pas de feedback. L'équipe est motivée et sa vision est claire : **chacun a 2 jetons Prod et 1 jeton Heure**.
- **Cycle 4, « le sprint final » :** avant le festival, l'équipe donne tout : **chacun a de nouveau 2 jetons Prod et 1 jeton Heure**.
- **Le chrono :** chaque cycle est chronométré, **25 minutes au cycle 0, puis 20 minutes**. À la sonnerie, on passe à la release avec ce qui est prêt.
- **Les rôles :** le programmeur est responsable des fonctionnalités « Prog », le designer des fonctionnalités « Design » et « Art ». Le chef de projet trie, écrit les prompts et décide des actions des agents.
- **Pioche Test vide :** on mélange la défausse pour la reformer.

### Les mots du métier

| Mot | Ce qu'il veut dire | Mot | Ce qu'il veut dire |
|---|---|---|---|
| **Brief** | Les nouvelles et consignes du début de cycle | **Bug** | Une erreur. *Bloquant* : la fonctionnalité ne marche pas. *Mineur* : on peut jouer, mais ça agace |
| **Planning** | Le moment où l'on décide quoi faire | **Release** | La sortie d'une nouvelle version du jeu |
| **Build** | Fabriquer le jeu : faire les efforts | **Review** | Le bilan de fin de cycle |
| **Prompt** | La consigne écrite que l'on donne à une IA | **Feedback** | Ce que les gamers disent du jeu |
| **Gamer** | Un joueur de votre jeu vidéo, Star Squadron (à ne pas confondre avec vous, les joueurs d'Helioso Orbit) | | |
| **Backlog** | La liste des fonctionnalités à faire | **MVP** | La plus petite version du jeu qui mérite des gamers |
| **Code review** | Le programmeur relit le travail de PIX | **Playtest** | Un humain joue pour juger si c'est fun |
| **Ticket** | Une fonctionnalité en route sur l'orbite | **Ticket correctif** | Le travail de plus sur une fonctionnalité déjà live |
