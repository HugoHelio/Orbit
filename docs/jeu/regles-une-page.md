# Orbit : Studio — les règles en une page

*Version 2 du 26 novembre 2026, pour la première partie test (simplifiée après l'étude v2 du simulateur). Elle découle du GDD (version 0.11, section 0) et des cartes (`docs/jeu/cartes-orbit-studio.md`), et a été vérifiée par simulation (`docs/jeu/simulation-equilibrage.md`).*

## Le but

Vous dirigez Orbital Studio. En 5 cycles (0 à 4), sortez le meilleur jeu possible pour le festival. **Score = joueurs × note.** Le studio en tête signe avec Nébuleuse Games.

## Le matériel de l'équipe

Un plateau, 3 fiches de rôle, 20 cartes Fonctionnalité, la pioche Défauts (20), la pioche Feedback (24), 9 jetons PA, 15 jetons bloc et 3 marqueurs : crédits (départ 20), note (départ 3) et cycle (départ 0).

## Un cycle, en 6 temps

1. **Vera parle.** L'animateur lit son message et retourne la carte Événement du cycle (son type a été annoncé au cycle précédent). L'équipe note sur la feuille de score **son risque du cycle et sa parade**, en 30 secondes.
2. **Trier le feedback.** Le chef de projet trie les cartes en attente, 2 cartes pour 1 PA :
    - **Bug, Idée ou Pas fun** : posez la carte sur la fonctionnalité citée. Si elle est déjà sortie, il faut **1 bloc de travail** dessus. Quand ce travail sort (ou la fonctionnalité, si elle n'était pas encore sortie), **la note monte de 0,5** (+1 pour Nova).
    - **Hors liste ou Compliment** : on l'écarte.
3. **Briefer et produire.** Pour agir, posez un jeton PA sur la station concernée.
    - **Un brief couvre une fonctionnalité entière** : 1 PA (simple) ou 2 PA (détaillé), écrit par le chef de projet ou le designer.
    - **PIX** produit jusqu'à **3 blocs par cycle**, 1 crédit par bloc. Les blocs en trop attendent dans la file Brief → Production et passent au cycle suivant.
    - Pour chaque bloc de PIX, glissez une **carte Défaut face cachée** sous la carte Fonctionnalité. Brief simple : on tire 1 carte. Brief détaillé : on en tire 2 et on garde la meilleure.
    - **Un humain produit au plus 1 bloc par cycle** (2 au cycle 0), pour 1 PA, et seulement sur ses fonctionnalités. Son bloc n'a jamais de défaut.
    - Chaque bloc produit reçoit un **jeton bloc**. Une carte pleine est prête à sortir.
4. **Vérifier.**
    - **Relire** 1 bloc de PIX (1 PA, le responsable) révèle sa carte Défaut.
    - **SCAN** teste jusqu'à 4 blocs par cycle, 1 crédit par test. Il révèle les Bug, jamais les Pas fun.
    - **Playtest** (1 PA, le designer) : il révèle les Pas fun de toute une fonctionnalité.
    - **Corriger** un défaut révélé : 1 PA, le responsable. La carte Défaut est défaussée.
5. **Release.** L'équipe choisit les fonctionnalités prêtes qu'elle publie. Les défauts encore cachés sont révélés devant les joueurs.
    - **Bug publié** : la fonctionnalité rapporte 0 étoile jusqu'à sa correction, et la note baisse de 0,5.
    - **Pas fun publié** : la fonctionnalité perd 1 étoile jusqu'à sa correction.
6. **Compter.**
    - **Joueurs = étoiles du jeu en ligne × 25**, recalculés à chaque release.
    - **Premier jouable :** tant que les 5 fonctionnalités essentielles ne sont pas toutes sorties sans bug, **le jeu a 0 joueur**. Vera les décrit au cycle 0 : à vous de les retrouver.
    - **Feedback :** une nouvelle carte à chaque palier de 100 joueurs atteint pour la première fois.
    - **Communauté ignorée :** s'il reste plus de 4 cartes non triées, la note baisse de 0,5.
    - **La note reste entre 1 et 5.** Score du cycle = joueurs × note.

## Les règles particulières

- **Cycle 0 :** pas de carte Défaut, pas de coût en crédits, pas d'événement, pas de feedback. Comme il n'y a rien à vérifier ni à trier, **chaque humain peut produire 2 blocs**.
- **Pioche Défauts vide :** on mélange la défausse pour la reformer.
- **Le temps :** chaque cycle est chronométré, **25 minutes au cycle 0, puis 20 minutes**. À la sonnerie, on passe à la release avec ce qui est prêt.
- **Les rôles :** le programmeur est responsable des fonctionnalités « Prog », le designer des fonctionnalités « Design » et « Art ». Le chef de projet trie, briefe et décide des actions des agents.
