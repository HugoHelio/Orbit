# Étude du jeu par simulation — Orbit : Studio

*Version 2 du 26 novembre 2026. Script : `prototype-papier/outil/simuler.py`, qui lit les cartes dans `docs/jeu/cartes-orbit-studio.md`. 3 000 parties par profil. Relancer : `python prototype-papier/outil/simuler.py` (ou `--rapide`).*

## En bref

- **Le jeu récompense les bonnes décisions.** L'équipe experte fait en moyenne 2,2 fois le score des fonceurs. Trop vérifier coûte aussi : les perfectionnistes finissent derrière les élèves sérieux.
- **Les scores vont de 0 à environ 5 400 points.** Le plafond théorique est de 6 375 points (toutes les étoiles et une note de 5), mais il est hors d'atteinte en 5 cycles.
- **La chance ne pèse que sur les équipes qui ne vérifient pas.** Elle fait varier le score d'environ ±25 % chez les fonceurs, et de moins de ±5 % chez les experts. Notre principe de design est confirmé : chaque hasard se maîtrise par une décision.
- **Le temps est le vrai problème.** Sans chronomètre, 5 cycles prennent environ 2 h 07 pour une classe de 6 équipes, alors qu'une session de 3 h n'en laisse qu'environ 1 h 50 pour jouer. **Décision prise : des cycles chronométrés**, 25 minutes pour le cycle 0, puis 20 minutes.
- **L'étude a trouvé 5 incohérences ou complications.** Les quatre premières sont corrigées, la cinquième est à surveiller pendant la partie test (voir plus bas).

## Les profils d'équipes simulés

Ces équipes ne suivent pas une stratégie fixe comme les robots de la version 1 :
- elles **se trompent** : elles identifient mal un Must, ou perdent une action en hésitant ;
- elles **tentent des choses**, car chaque décision est tirée au hasard selon leur profil ;
- elles **apprennent** : après un cycle à 0 joueur, elles retrouvent les Must, et après un bug publié, elles utilisent davantage SCAN.

| Profil | Comportement |
|---|---|
| Les fonceurs | Tout à PIX, peu de vérification ; ils apprennent un peu après un échec |
| Les élèves sérieux | Font les choses bien, sans tout optimiser |
| Les perfectionnistes | Vérifient tout, écrivent des briefs détaillés ; ils sont lents |
| Le chef de projet débordé | Produit beaucoup, trie peu le feedback |
| Les artistes | Visent les étoiles et le fun, playtestent tout, vérifient peu le code |
| L'équipe experte | Les Must d'abord, PIX vérifié par SCAN, feedback trié |

## Les scores (règles simplifiées, version 0.11)

| Profil | Score moyen | 10 % pires | Médiane | 10 % meilleurs | Min | Max | Joueurs | Note | Premier jouable au cycle 0 | Bugs publiés | Tokens restants |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Les fonceurs | 1 950 | 875 | 1 800 | 3 412 | 0 | 5 000 | 916 | 2,13 | 6 % | 2,3 | 5,0 |
| Les élèves sérieux | 4 054 | 3 062 | 4 250 | 4 750 | 0 | 5 375 | 905 | 4,48 | 37 % | 0,6 | 3,2 |
| Les perfectionnistes | 3 801 | 3 000 | 3 938 | 4 375 | 1 875 | 5 000 | 813 | 4,67 | 72 % | 0,0 | 8,7 |
| Le chef de projet débordé | 2 028 | 900 | 1 850 | 3 600 | 0 | 5 125 | 929 | 2,19 | 26 % | 1,4 | 1,7 |
| Les artistes | 3 067 | 1 750 | 3 150 | 4 375 | 0 | 5 250 | 876 | 3,51 | 14 % | 1,3 | 5,8 |
| L'équipe experte | 4 324 | 3 712 | 4 375 | 4 750 | 1 750 | 5 250 | 895 | 4,83 | 100 % | 0,3 | 3,4 |

**Le score minimum est 0.** Il est rare, car presque toutes les équipes trouvent le premier jouable au cycle 1. **Le meilleur score trouvé est 5 375**, en essayant 20 000 stratégies sans erreur. **Le plafond théorique est de 6 375** (51 étoiles × 25 joueurs × une note de 5) : il faudrait tout produire, sans un seul défaut.

**Le premier jouable au cycle 0 est un vrai filtre.** Une équipe qui se trompe sur un seul des 5 Must fait 0 au cycle 0, puis rattrape son retard au cycle 1. Ces taux dépendent de notre hypothèse sur la lecture du message de Vera. La partie test dira si elle est trop pessimiste.

**Avant simplification**, avec les mêmes profils, le classement était le même mais plus serré : 3 433 pour l'équipe experte contre 1 877 pour les fonceurs, soit 1,8 fois plus au lieu de 2,2. Écouter les joueurs rapportait aussi moins. La simplification rend donc les règles plus simples et les leçons plus nettes.

## La chance

Pour mesurer la chance, on compare les 10 % de parties où l'équipe a tiré le moins de cartes Défaut défavorables avec les 10 % où elle en a tiré le plus. Dans le premier groupe, environ 15 % des cartes sont défavorables ; dans le second, environ 55 %.

| Profil | Score avec de la chance | Score avec de la malchance | Écart |
|---|---|---|---|
| Les fonceurs | 2 713 | 1 715 | **−37 %** |
| Les artistes | 3 520 | 2 811 | −20 % |
| Le chef de projet débordé | 2 307 | 1 835 | −20 % |
| Les élèves sérieux | 4 264 | 3 777 | −11 % |
| L'équipe experte | 4 424 | 4 172 | −6 % |
| Les perfectionnistes | 3 716 | 3 656 | **−2 %** |

**À dire au débrief :** la malchance n'excuse pas un mauvais score. Les équipes qui vérifient ne la subissent presque pas. Ce n'est pas le hasard qui fait perdre, c'est l'absence de vérification.

## Le temps

**Hypothèses de durée** (débutants, sur papier, à caler pendant la partie test) :
- environ 2 minutes pour le message de Vera, 4 minutes de planification, 2 minutes de mini-rétro ;
- de 0,3 à 1,5 minute par action ;
- 2 à 5 minutes pour la release et le comptage ;
- 8 minutes de découverte en plus au cycle 0.

| | Cycle 0 | Cycle 1 | Cycle 2 | Cycle 3 | Cycle 4 | Total |
|---|---|---|---|---|---|---|
| Une équipe (moyenne des profils) | 30 min | 22 min | 22 min | 21 min | 21 min | **1 h 57** |
| Une classe de 6 équipes (on attend la plus lente) | 32 min | 25 min | 25 min | 23 min | 23 min | **2 h 07** (2 h 10 dans 10 % des cas) |

**Le temps disponible :** une session de 3 h moins l'accueil (15 min), le débrief (30 min) et la pause (10 min) laisse environ **1 h 55 de jeu**. Si les règles sont expliquées en jouant le cycle 0, sans séquence de 15 minutes à part, c'est même **2 h 10**.

**Décision :** des **cycles chronométrés, 25 minutes au cycle 0 puis 20 minutes**, soit 1 h 45 de jeu. À la sonnerie, on passe à la release avec ce qui est prêt. Le chronomètre fait aussi partie du jeu : c'est la pression de la deadline. Il reste de la marge pour jouer à SpacePlan, mais seulement au cycle 0 et au festival.

## Les incohérences trouvées

| # | Ce qui n'allait pas | Ce qu'on a fait |
|---|---|---|
| 1 | **La note ne pouvait presque que baisser.** Seules 2 cartes Feedback (des Bug sur F06) la faisaient monter, donc elle n'avait pas de sens positif. | **Simplifié :** toute carte Feedback livrée fait monter la note (+0,5, ou +1 pour Nova). Le travail sur les fonctionnalités donne les joueurs, l'écoute des joueurs donne la note. |
| 2 | **Une carte Bug portait sur une fonctionnalité qui n'est peut-être pas sortie** (FB12, sur F15). | Avec la règle unique du feedback, la carte attend la sortie de la fonctionnalité. Plus de cas particulier. |
| 3 | **E1 apportait des retours de joueurs même à un jeu sans joueurs.** | E1 ne fait piocher que si le jeu a des joueurs. |
| 4 | **Des calculs inutiles.** La moitié des étoiles arrondie à l'inférieur donnait 1 étoile pour les fonctionnalités à 2 comme à 3 étoiles, et il fallait suivre l'âge de chaque carte dans la file. | Un Pas fun coûte 1 étoile. La pénalité de file se compte à la release : plus de 4 cartes non triées, −0,5. |
| 5 | **Toutes les équipes ont à peu près le même nombre de joueurs** (800 à 930) : les différences viennent surtout de la note. La leçon « les agents produisent plus » se voit peu dans les joueurs. | **À surveiller** pendant la partie test. Si besoin, on agrandira le backlog avec les demandes des joueurs (classement, combat de boss), comme le prévoit la section 0 du GDD. |

**Deux simplifications assumées, à expliquer au débrief si on nous les signale :**
- **Les humains ne produisent jamais de défaut.** Ils sont lents mais savent ce qu'ils font. C'est volontaire : ça rend visible le compromis entre la vitesse et la fiabilité.
- **PIX ne produit pas de défaut au cycle 0.** C'est un cycle de prise en main, sans pression : PIX est « en démo ».

**À surveiller :** les bonnes équipes approchent la note maximale de 5. Si la partie test le confirme, la note de départ pourra passer à 2,5.

## Historique : la version 1 de l'étude

La première étude utilisait des robots à stratégie fixe et a conduit à 4 réglages :
- un humain produit 1 bloc par cycle au maximum ;
- plus de bonus « release sans défaut » ;
- la note reste entre 1 et 5 ;
- au cycle 0, chaque humain produit 2 blocs. Une première version donnait 5 blocs à PIX au cycle 0 : elle a été écartée car illogique, avec des résultats identiques.

Elle avait montré que les humains produisaient autant que PIX, et que la note saturait ou s'effondrait.
