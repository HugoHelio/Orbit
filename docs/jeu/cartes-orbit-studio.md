# Cartes d'Orbit : Studio — règles de base, version 6

*Cartes du prototype papier — version 6 du 26 novembre 2026 : passe sur le vocabulaire (bloc → effort, point d'action → heure, carte Défaut → carte Test avec OK / Bug / Pas fun, brief à PIX → prompt, premier jouable → MVP, cycle Brief, Planning, Build, Test, Release, Review). Version 5 : simplifications issues de l'étude v2 (le feedback livré fait monter la note, un Pas fun coûte 1 étoile, file d'attente sans suivi d'âge, E1 seulement si le jeu a des joueurs). Version 4 : réglages issus de la simulation (un effort humain par cycle, 2 efforts humains au cycle 0, plus de bonus « release sans problème », note entre 1 et 5) et les 8 précisions de règles. Version 3 : fiches de rôle à la place des cartes personnage, jetons simplifiés, portraits (version 2 : règle du MVP, priorités non imprimées, score = joueurs × note). Conforme aux règles de base du GDD (version 0.14, section 0) et aux règles sur une page (`docs/jeu/regles-une-page.md`). Sources : la master feature list et les insights de playtest de SpacePlan (`docs/jeu/reprise-spaceplan.md`).*

*Chaque carte a un identifiant (F01, T01, FB01, E01, V0…) : c'est sa clé pour la traduction anglaise et pour le jeu numérique.*

---

## 1. Les actions (reprises sur les fiches de rôle)

Chaque humain a **3 heures de travail par cycle (3 jetons Heure)**. L'équipe a **20 tokens IA pour toute la partie**.

| Action | Coût | Qui |
|---|---|---|
| Trier 2 cartes Feedback | 1 heure | Chef de projet |
| Écrire un prompt **simple** pour une fonctionnalité entière (1 carte Test tirée par effort de PIX) | 1 heure | Chef de projet ou designer |
| Écrire un prompt **détaillé** pour une fonctionnalité entière (2 cartes Test tirées par effort, on garde la meilleure) | 2 heures | Chef de projet ou designer |
| Faire 1 effort soi-même (aucune carte Test ; **1 effort par cycle au maximum**, 2 au cycle 0) | 1 heure | Le responsable de la fonctionnalité |
| Relire 1 effort produit par PIX (révèle sa carte Test) | 1 heure | Le responsable de la fonctionnalité |
| Faire un playtest d'une fonctionnalité (révèle un « Pas fun » sur tous ses efforts) | 1 heure | Designer |
| Corriger un problème révélé | 1 heure | Le responsable de la fonctionnalité |
| PIX fait 1 effort (3 par cycle ; les efforts en trop attendent le cycle suivant) | 1 token | — |
| SCAN teste 1 effort (révèle un « Bug », jamais un « Pas fun ») | 1 token | — |

**Le responsable** d'une fonctionnalité est indiqué sur sa carte : **Prog** = le programmeur ; **Design** et **Art** = le designer.

**La note et le score.** La note du jeu est **sur 5** et commence à **3**. Elle baisse de 0,5 par bug publié, et quand la communauté se sent ignorée. Elle monte quand l'équipe **livre ce que les joueurs demandent** : +0,5 par carte Feedback traitée (+1 pour Nora). **Elle reste entre 1 et 5.** **Joueurs = étoiles du jeu publié × 25**, recalculés à chaque release. **Score = joueurs × note.** Sans MVP, il n'y a pas de joueurs : le score vaut 0.

---

## 2. Les fiches de rôle et les agents

**Chaque joueur prend la fiche de son rôle** (format A5, posée devant lui). Elle remplace à la fois une carte personnage et l'aide-mémoire : elle dit ce que le joueur doit faire, avec quelles actions, et quand. Les rôles n'ont pas de portrait : ce sont les joueurs eux-mêmes.

| Id | Fiche | Mission | Ses actions | Phrase |
|---|---|---|---|---|
| R1 | **Chef(fe) de projet** | Choisit les tâches, gère les tokens IA, décide de la release | Trier le feedback ; écrire les prompts ; décider des actions de PIX et de SCAN | « Tout le monde a une idée. Moi, j'ai un planning. » |
| R2 | **Designer** | Responsable des fonctionnalités Design et Art ; garant du fun | Écrire les prompts ; produire, relire et corriger ses fonctionnalités ; faire les playtests (seul à pouvoir le faire) | « Ça marche, d'accord. Mais est-ce que c'est fun ? » |
| R3 | **Programmeur(se)** | Responsable des fonctionnalités Prog ; garant du code | Produire, relire et corriger ses fonctionnalités | « Qui a écrit ça ? Ah. PIX. » |

**Les agents IA ne sont pas des cartes** : leurs règles sont imprimées sur le plateau, avec leur portrait.

| Id | Agent | Capacité | Phrase |
|---|---|---|---|
| A1 | **PIX, agent codeur** | Produit jusqu'à 3 efforts par cycle, 1 token par effort. Chaque effort reçoit une carte Test face cachée | « Terminé ! Tout fonctionne parfaitement. » |
| A2 | **SCAN, agent testeur** | Teste jusqu'à 4 efforts par cycle, 1 token par test. Révèle les « Bug », jamais les « Pas fun » | « Aucun bug détecté. Le joueur meurt en 4 secondes, conformément au code. » |

### Les jetons et les marqueurs

| Matériel | Nombre | À quoi ça sert |
|---|---|---|
| **Jeton Heure** | 9 (3 par joueur) | Au début du cycle, chaque joueur pose ses 3 jetons sur son emplacement du poste de pilotage. Pour agir, il prend un jeton et le pose sur la station où il agit (Prompt, Build, Test…). En fin de cycle, tous les jetons reviennent au poste de pilotage. Au débrief, on voit où l'équipe a passé son temps. |
| **Pion Effort** | 15 | Un effort, c'est une part du travail d'une fonctionnalité. On pose un pion Effort sur une case grise de la carte Fonctionnalité dès que cet effort est fait (par un humain ou par PIX). Quand toutes les cases sont couvertes, la fonctionnalité est prête pour la release. Après sa release, ses pions reviennent dans la réserve. |
| **Marqueur** | 3 | Un pion pour chaque piste du plateau : tokens IA (départ 20), note (départ 3) et cycle (départ 0). |

---

## 3. Les 20 cartes Fonctionnalité (la master feature list de SpacePlan)

**Taille :** charge *Low* = 1 effort, *Medium* = 2 efforts, *High* = 3 efforts. **Valeur :** *Must* = 2 étoiles, *Should* = 3 étoiles, *Could* = 2 étoiles. **Chaque étoile livrée = 25 joueurs.**

### La règle du MVP (premier jouable)

- **Tant que les 5 fonctionnalités Must ne sont pas toutes livrées, et sans bug révélé, le jeu ne rapporte aucun joueur.** Un jeu où l'on ne peut ni bouger, ni tirer, ni toucher un alien n'a pas de joueurs, même avec de superbes explosions.
- Les étoiles des autres fonctionnalités déjà livrées sont **en attente** : elles comptent dès que le MVP est atteint.
- Si un bug est révélé plus tard sur une fonctionnalité Must, le MVP est **cassé** : le jeu retombe à 0 joueur jusqu'à la correction.
- **La priorité (Must, Should, Could) n'est pas imprimée sur les cartes.** Les équipes doivent retrouver les 5 Must à partir du message de Vera (V0). C'est le premier exercice de priorisation. Les Should valent plus d'étoiles que les Must : c'est un piège voulu (la valeur n'est pas la nécessité).
- Les numéros suivent les catégories, pas les priorités : on ne peut pas deviner les Must à leur numéro.

| Id | Fonctionnalité | Catégorie | Efforts | Étoiles | Responsable | Priorité (non imprimée) | Phrase d'ambiance |
|---|---|---|---|---|---|---|---|
| F01 | 3 types de vaisseaux | Joueur | 1 | ★★ | Design | Could | « Rapide, solide ou équilibré ? » |
| F02 | Apparition du vaisseau | Joueur | 1 | ★★ | Prog | Must | « Sans vaisseau, c'est un fond d'écran. » |
| F03 | Boucliers (vies) | Joueur | 2 | ★★ | Prog | Could | « Une deuxième chance, puis une troisième. » |
| F04 | Puissance de feu (nombre de canons) | Joueur | 2 | ★★ | Design | Could | « Deux canons, c'est deux fois plus de fun. Ou pas. » |
| F05 | Collision alien / vaisseau | Gameplay | 3 | ★★★ | Prog | Should | « Le contact rapproché a enfin des conséquences. » |
| F06 | Collision missile | Gameplay | 1 | ★★ | Design | Must | « Touché ! Enfin… en théorie. » |
| F07 | Contrôles : bouger et tirer | Gameplay | 1 | ★★ | Prog | Must | « Gauche, droite, feu. Le reste, c'est du talent. » |
| F08 | Réglage de la difficulté | Gameplay | 2 | ★★★ | Design | Should | « Ni trop facile, ni impossible. Le plus dur à coder. » |
| F09 | Grille d'aliens : apparition, mouvement, tirs | Aliens | 1 | ★★ | Prog | Must | « Ils arrivent. En rang, et très polis. » |
| F10 | Grille qui descend | Aliens | 2 | ★★★ | Prog | Should | « Plus ils descendent, plus on transpire. » |
| F11 | Grille qui va jusqu'aux bords | Aliens | 1 | ★★★ | Prog | Should | « Les aliens découvrent les côtés de l'écran. » |
| F12 | Nouvelles vagues d'aliens | Aliens | 2 | ★★★ | Prog | Should | « Vous pensiez avoir gagné ? » |
| F13 | Défaite et redémarrage | Interface | 2 | ★★ | Art | Must | « Game over. Encore une partie ? » |
| F14 | Système de score | Interface | 2 | ★★★ | Design | Should | « Sans score, pas de rivalité. » |
| F15 | Types de missiles | Interface | 1 | ★★★ | Art | Should | « Les miens sont bleus. Les leurs, rouges. Merci. » |
| F16 | Victoire et récompense | Interface | 3 | ★★★ | Art | Should | « Gagner, c'est bien. Le sentir, c'est mieux. » |
| F17 | Explosions | Immersion | 3 | ★★★ | Art | Should | « Boum. Enfin un peu de respect. » |
| F18 | Fond spatial | Immersion | 1 | ★★★ | Art | Should | « Des étoiles. Beaucoup d'étoiles. » |
| F19 | Rencontrer SpaceTron | Immersion | 3 | ★★ | Art | Could | « Il était temps qu'on se présente. » |
| F20 | Visuels, univers et ton | Immersion | 3 | ★★★ | Design | Should | « Un jeu, c'est d'abord une ambiance. » |

**Les 5 Must (la solution, pour l'animateur) :** F02 Apparition du vaisseau, F07 Contrôles, F09 Grille d'aliens, F06 Collision missile, F13 Défaite et redémarrage, soit 6 efforts et 10 étoiles (250 joueurs).

**Repères pour l'équilibrage :** 37 efforts au total (6 pour les Must, 23 pour les Should, 8 pour les Could) et 51 étoiles au maximum (1 275 joueurs). Une équipe ne peut pas tout faire en 4 cycles : **elle doit choisir**.

---

## 4. Le paquet de cartes Test (20 cartes)

Pour chaque effort produit par PIX, une carte Test est glissée **face cachée** sous la carte Fonctionnalité (l'effort lui-même est marqué d'un pion Effort). Prompt simple : on tire 1 carte. Prompt détaillé : on en tire 2 et on garde la meilleure (l'autre retourne sous le paquet). **Quand la pioche est vide, on mélange la défausse pour la reformer.**

| Id | Type | Nombre | Révélé par | Effet s'il part en release |
|---|---|---|---|---|
| T01 – T12 | **OK** | 12 | Relecture, test, playtest ou release | — |
| T13 – T17 | **Bug** | 5 | SCAN, relecture ou release | La fonctionnalité ne rapporte **aucun joueur** tant qu'elle n'est pas corrigée, et la note baisse de 0,5 |
| T18 – T20 | **Pas fun** | 3 | Playtest du designer, relecture ou release (**jamais par SCAN**) | La fonctionnalité **perd 1 étoile** tant qu'elle n'est pas corrigée |

**Corriger un problème révélé** coûte 1 heure au responsable de la fonctionnalité. La carte Test est alors défaussée.

**Phrases d'ambiance**
- *OK :* « PIX : "Je vous l'avais dit." » / « Propre. Suspect, mais propre. » / « Rien à signaler, capitaine. »
- *Bug :* « PIX : "C'est impossible, j'ai tout vérifié." » / « Le vaisseau traverse les aliens. Comme un fantôme. » / « Le jeu se fige quand on tire trop vite. » / « Le score affiche −12. » / « L'alien touché ne disparaît pas. »
- *Pas fun :* « SCAN : "Fonctionnement conforme." Sam : "J'ai fermé le jeu." » / « Techniquement parfait. Humainement ennuyeux. » / « On gagne en 13 secondes. »

*Probabilités pour l'équilibrage : un effort a 40 % de risque de problème avec un prompt simple, environ 16 % avec un prompt détaillé.*

---

## 5. Les 24 cartes Feedback

Après chaque release, l'équipe pioche **1 nouvelle carte Feedback à chaque palier de 100 joueurs atteint pour la première fois** (une équipe à 250 joueurs en a pioché 2 en tout), placée dans la file **Feedback → Backlog**. Le chef de projet les trie (1 heure pour 2 cartes).

**Effet du tri (une seule règle pour Bug, Idée et Pas fun) :** on pose la carte sur la fonctionnalité citée.
- Si la fonctionnalité est **déjà publiée**, il faut produire **1 effort de plus** dessus (correction ou amélioration). Quand ce travail est publié, **la note monte de 0,5** (+1 pour Nora).
- Si la fonctionnalité **n'est pas encore publiée**, la carte attend : la note monte quand la fonctionnalité est publiée.
- **Hors liste / Compliment :** on l'écarte. Savoir dire non, c'est aussi du pilotage.

**À la release, s'il reste plus de 4 cartes Feedback non triées, la note baisse de 0,5** : « la communauté se sent ignorée ».

*Les citations viennent des vrais playtests de SpacePlan (16 joueurs, prototype et alpha).*

| Id | Signée | Type | Citation | Fonctionnalité citée |
|---|---|---|---|---|
| FB01 | Max | Bug | « La boîte de collision de mon vaisseau est trop large : je suis touché alors que le tir ne me touche pas ! » | F06 |
| FB02 | Max | Bug | « J'ai touché l'alien et il n'a pas disparu. » | F06 |
| FB03 | Max | Idée | « Si j'appuie sans arrêt sur espace, je tue tous les aliens. Trop facile. » | F08 |
| FB04 | Max | Idée | « Il nous faut des ennemis plus petits et plus nombreux. » | F12 |
| FB05 | Max | Idée | « Quand je tire sur les côtés, les aliens restants restent au milieu. » | F11 |
| FB06 | Max | Idée | « Mes missiles pourraient détruire ceux des aliens ? » | F15 |
| FB07 | Max | Pas fun | « Le meilleur score est plafonné, il ne départage personne. » | F14 |
| FB08 | Max | Pas fun | « Pourquoi un vaisseau avec plus de canons aurait aussi plus de boucliers ? » | F04 |
| FB09 | Max | Compliment | « Le jeu est stable. Bravo, rien n'a planté. » | Hors liste |
| FB10 | Sam | Pas fun | « C'était rapide et facile… on pourrait avoir plus d'aliens ? » | F12 |
| FB11 | Sam | Pas fun | « Que je gagne ou que je perde, la fin est décevante. » | F16 |
| FB12 | Sam | Bug | « Je confonds les missiles des aliens et les miens. » | F15 |
| FB13 | Sam | Idée | « On pourrait avoir un bouton pause ? » | Hors liste |
| FB14 | Sam | Pas fun | « L'icône "Shield S", j'ai cru que c'était un 5. » | F20 |
| FB15 | Sam | Pas fun | « C'est dur au début, puis trop facile. Ça n'a pas de sens. » | F08 |
| FB16 | Sam | Compliment | « Les graphismes sont vraiment cool ! » | Hors liste |
| FB17 | Sam | Idée | « On pourrait avoir différents types d'aliens ? » | Hors liste |
| FB18 | Nora | Pas fun | « Quand je touche ou que je suis touchée, il ne se passe rien. Il faut des explosions ! » | F17 |
| FB19 | Nora | Pas fun | « L'espace paraît un peu statique. » | F18 |
| FB20 | Nora | Idée | « Dommage qu'il n'y ait pas de son… » | Hors liste |
| FB21 | Nora | Compliment | « La sensation de puissance du vaisseau est géniale ! » | Hors liste |
| FB22 | Nora | Pas fun | « Finir le jeu avec le meilleur vaisseau, ce n'est pas gratifiant. » | F16 |
| FB23 | Nora | Idée | « Un classement en ligne, et je fais un live tous les soirs ! » | Hors liste (une idée pour plus tard) |
| FB24 | Nora | Idée | « Un combat de boss pour finir en beauté ? » | Hors liste (une idée pour plus tard) |

---

## 6. Les cartes Événement (règles de base : un événement par cycle, sans choix)

**Le recto** montre le type, que Vera annonce un cycle à l'avance. **Le verso** décrit l'effet.

| Id | Type (recto) | Cycle | Événement (verso) | Effet |
|---|---|---|---|---|
| E1 | Communauté | 1 | **Les premiers joueurs arrivent.** Les forums s'animent. | Si votre jeu a des joueurs, piochez 2 cartes Feedback de plus ce cycle |
| E2 | Technique | 2 | **Mise à jour du modèle de PIX.** Plus rapide, toujours aussi sûr de lui. | Ce cycle, PIX peut produire 4 efforts au lieu de 3 |
| E3 | Éditeur | 3 | **Vera veut une démo pour ses investisseurs.** | À la release de ce cycle, si une fonctionnalité du MVP a un bug, la note baisse de 0,5 de plus |
| E4 | Communauté | 4 | **Nora joue en direct au festival.** Des milliers de spectateurs. | Ce cycle, chaque bug publié fait baisser la note de 1 au lieu de 0,5 |
| E5 | Technique | Rechange | **SCAN est en maintenance.** | Ce cycle, SCAN ne peut faire aucun test |
| E6 | Éditeur | Rechange | **Les tokens IA augmentent.** | Ce cycle, chaque action d'un agent coûte 2 tokens |

*Pour les premières parties, l'ordre est fixe (E1 à E4). E5 et E6 servent à varier les parties suivantes.*

---

## 7. Les messages de Vera (lus par l'animateur)

| Id | Moment | Message |
|---|---|---|
| V0 | Cycle 0 | « Bienvenue chez Nébuleuse Games. Avant de signer, je veux un MVP : un vaisseau qui apparaît, qui bouge et qui tire, des aliens en face, un missile qui les touche, et une partie qu'on peut perdre et recommencer. Rien de plus. Tant que ce n'est pas jouable, personne n'y jouera. » |
| V1 | Cycle 1 | « Les premiers joueurs arrivent. Écoutez-les… mais pas tous. Prochain événement : Technique. » |
| V2 | Cycle 2 | « PIX a été mis à jour. Plus vite, ce n'est pas forcément mieux. Prochain événement : Éditeur. » |
| V3 | Cycle 3 | « Mes investisseurs veulent une démo. Pas de bug sur l'essentiel, s'il vous plaît. Prochain événement : Communauté. » |
| V4 | Cycle 4 | « C'est le festival. Nora est en direct. Je compte sur vous. » |
| V5 | Fin | « Merci à tous les studios. Nébuleuse Games signe avec… » *(l'animateur annonce le studio en tête du leaderboard)* |

---

## 8. Le cycle 0 (libre, sans carte Test)

- Les **20 cartes Fonctionnalité** sont posées dans le Backlog, **mélangées**, sans indication de priorité.
- L'animateur lit le message de Vera (V0). Les équipes doivent en déduire les 5 Must.
- Les actions sont les actions normales (heures, prompts, PIX), avec deux exceptions pour ce cycle : **aucune carte Test** et **aucun coût en tokens IA**. Pas d'événement ni de feedback.
- Capacité du cycle 0 : PIX produit jusqu'à 3 efforts (si le chef de projet écrit les prompts) et, comme il n'y a rien à tester ni à trier, **chaque humain peut produire 2 efforts** sur ses fonctionnalités. Soit 7 efforts pour les 6 efforts des Must : ils tiennent, **à condition de ne pas se disperser**.
- Release : si les 5 Must sont livrés, 10 étoiles = **250 joueurs**, et le score du cycle vaut 250 × 3 (la note de départ) = 750. Sinon : **0 joueur et 0 point**, et l'animateur le fait remarquer au leaderboard.
- Au cycle 1, une équipe à 250 joueurs pioche **2 cartes Feedback**, plus 2 avec l'événement E1. Une équipe à 0 joueur ne pioche rien : personne ne parle d'un jeu qui n'existe pas.

---

## 9. Le matériel à imprimer (récapitulatif)

| Élément | Quantité par équipe |
|---|---|
| Plateau A2 de l'orbite d'itération | 1 |
| Fiches de rôle A5 (R1 à R3) | 3 |
| Cartes Fonctionnalité (F01 à F20) | 20 |
| Cartes Test (T01 à T20) | 20 |
| Cartes Feedback (FB01 à FB24) | 24 |
| Jetons Heure | 9 |
| Pions Effort | 15 |
| Marqueurs (tokens, note, cycle) | 3 |
| Feuille de score | 1 |
| **Pour l'animateur :** cartes Événement (E1 à E6) et messages de Vera (V0 à V5) | 1 jeu |
