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
- elles **apprennent** : après un cycle à 0 gamer, elles retrouvent les Must, et après un bug publié, elles utilisent davantage SCAN.

| Profil | Comportement |
|---|---|
| Les fonceurs | Tout à PIX, peu de vérification ; ils apprennent un peu après un échec |
| Les élèves sérieux | Font les choses bien, sans tout optimiser |
| Les perfectionnistes | Vérifient tout, écrivent des briefs détaillés ; ils sont lents |
| Le chef de projet débordé | Produit beaucoup, trie peu le feedback |
| Les artistes | Visent les étoiles et le fun, playtestent tout, vérifient peu le code |
| L'équipe experte | Les Must d'abord, PIX vérifié par SCAN, feedback trié |

## Les scores (GDD 0.19 : 12 fonctionnalités au départ, 8 idées de gamers ; relancé le 27 novembre 2026)

*Depuis le GDD 0.19, 8 fonctionnalités sont cachées au départ et n'apparaissent que quand une carte Feedback triée les cite. Les scores baissent de 10 à 15 % (moins de fonctionnalités disponibles tôt), le classement ne change pas, et l'écart entre les équipes qui trient le feedback et les autres se creuse : 3 377 pour les élèves sérieux, 1 722 pour le chef de projet débordé (avant : 3 960 et 1 958).*

| Profil | Score moyen | 10 % pires | Médiane | 10 % meilleurs | Min | Max | Gamers | Note | Premier jouable au cycle 0 | Bugs publiés | Tokens restants |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Les fonceurs | 1 598 | 650 | 1 438 | 2 712 | 0 | 5 000 | 699 | 2,22 | 8 % | 2,2 | 6,0 |
| Les élèves sérieux | 3 377 | 2 325 | 3 488 | 4 250 | 650 | 5 000 | 777 | 4,31 | 42 % | 0,7 | 2,2 |
| Les perfectionnistes | 3 291 | 2 475 | 3 375 | 4 000 | 1 400 | 4 750 | 707 | 4,62 | 73 % | 0,0 | 6,4 |
| Le chef de projet débordé | 1 722 | 675 | 1 562 | 2 900 | 0 | 4 625 | 700 | 2,40 | 29 % | 1,2 | 2,9 |
| Les artistes | 2 462 | 1 375 | 2 450 | 3 500 | 550 | 4 750 | 711 | 3,41 | 16 % | 1,2 | 6,0 |
| L'équipe experte | 3 861 | 3 100 | 3 906 | 4 500 | 1 400 | 5 125 | 810 | 4,75 | 100 % | 0,4 | 1,2 |

*Version précédente (GDD 0.17, les 20 fonctionnalités visibles, sans bonus Nora) : fonceurs 1 871, élèves sérieux 3 960, perfectionnistes 3 740, chef de projet débordé 1 958, artistes 2 944, équipe experte 4 282.*

**Le score minimum est 0.** Il est rare, car presque toutes les équipes trouvent le premier jouable au cycle 1. **Le meilleur score trouvé est 5 375**, en essayant 20 000 stratégies sans erreur. **Le plafond théorique est de 6 375** (51 étoiles × 25 gamers × une note de 5) : il faudrait tout produire, sans un seul défaut.

**Le premier jouable au cycle 0 est un vrai filtre.** Une équipe qui se trompe sur un seul des 5 Must fait 0 au cycle 0, puis rattrape son retard au cycle 1. Ces taux dépendent de notre hypothèse sur la lecture du message de Vera. La partie test dira si elle est trop pessimiste.

**Avant simplification**, avec les mêmes profils, le classement était le même mais plus serré : 3 433 pour l'équipe experte contre 1 877 pour les fonceurs, soit 1,8 fois plus au lieu de 2,2. Écouter les gamers rapportait aussi moins. La simplification rend donc les règles plus simples et les leçons plus nettes.

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
| 1 | **La note ne pouvait presque que baisser.** Seules 2 cartes Feedback (des Bug sur F06) la faisaient monter, donc elle n'avait pas de sens positif. | **Simplifié :** toute carte Feedback livrée fait monter la note (+0,5, ou +1 pour Nora). Le travail sur les fonctionnalités donne les gamers, l'écoute des gamers donne la note. |
| 2 | **Une carte Bug portait sur une fonctionnalité qui n'est peut-être pas sortie** (FB12, sur F15). | Avec la règle unique du feedback, la carte attend la sortie de la fonctionnalité. Plus de cas particulier. |
| 3 | **E1 apportait des retours de gamers même à un jeu sans gamers.** | E1 ne fait piocher que si le jeu a des gamers. |
| 4 | **Des calculs inutiles.** La moitié des étoiles arrondie à l'inférieur donnait 1 étoile pour les fonctionnalités à 2 comme à 3 étoiles, et il fallait suivre l'âge de chaque carte dans la file. | Un Pas fun coûte 1 étoile. La pénalité de file se compte à la release : plus de 4 cartes non triées, −0,5. |
| 5 | **Toutes les équipes ont à peu près le même nombre de gamers** (800 à 930) : les différences viennent surtout de la note. La leçon « les agents produisent plus » se voit peu dans les gamers. | **À surveiller** pendant la partie test. Si besoin, on agrandira le backlog avec les demandes des gamers (classement, combat de boss), comme le prévoit la section 0 du GDD. |

**Deux simplifications assumées, à expliquer au débrief si on nous les signale :**
- **Les humains ne produisent jamais de défaut.** Ils sont lents mais savent ce qu'ils font. C'est volontaire : ça rend visible le compromis entre la vitesse et la fiabilité.
- **PIX ne produit pas de défaut au cycle 0.** C'est un cycle de prise en main, sans pression : PIX est « en démo ».

**À surveiller :** les bonnes équipes approchent la note maximale de 5. Si la partie test le confirme, la note de départ pourra passer à 2,5.

## Étude v3 : les règles du GDD 0.21 (27 novembre 2026)

Trois changements testés l'un après l'autre (1 500 parties par profil, même graine) :
- **B** : les 5 cartes Bug deviennent 2 Bug bloquants (0 étoile, MVP cassé sur un Must) et 3 Bug mineurs (−0,5 de note, les étoiles restent) ;
- **C** : « le sprint final », 2 jetons Prod au cycle 4 ;
- **D** : le travail demandé par un feedback sur une fonctionnalité live est un effort, qui prend le jeton Prod (le ticket correctif).

| Profil | A : règles 0.20 | B : bugs 2 + 3 | C : + sprint final | D : + correctif = Prod (règles 0.21) |
|---|---|---|---|---|
| Les fonceurs | 1 574 | 1 632 | 1 702 | 1 713 |
| Les élèves sérieux | 3 281 | 3 372 | 3 516 | 3 516 |
| Les perfectionnistes | 3 218 | 3 245 | 3 463 | 3 443 |
| Le chef de projet débordé | 1 733 | 1 716 | 1 790 | 1 787 |
| Les artistes | 2 429 | 2 500 | 2 641 | 2 646 |
| L'équipe experte | 3 767 | 3 781 | 3 929 | 3 931 |

**Ce qu'on en retient :** les scores montent de 3 à 8 %, surtout grâce au sprint final ; **le classement des profils ne change pas** (l'équipe experte devant, les fonceurs et le chef de projet débordé derrière). Les bugs mineurs adoucissent un peu la punition des équipes qui vérifient peu, sans les sauver. Le jeton Prod ne change rien aux chiffres : il rend visible une règle qui existait déjà (1 effort humain par cycle). La correction d'un problème trouvé au Test reste 1 heure, hors jeton Prod, comme avant.

**GDD 0.22 : la code review au programmeur.** Même étude (1 500 parties par profil, même graine), règles 0.21 puis code review faite par le programmeur au lieu du responsable :

| Profil | Règles 0.21 | Code review au programmeur (règles 0.22) |
|---|---|---|
| Les fonceurs | 1 713 | 1 711 |
| Les élèves sérieux | 3 516 | 3 523 |
| Les perfectionnistes | 3 443 | 3 496 |
| Le chef de projet débordé | 1 787 | 1 797 |
| Les artistes | 2 646 | 2 673 |
| L'équipe experte | 3 931 | 3 958 |

Effet neutre (0 à +1,5 %) : le programmeur a souvent des heures libres quand PIX produit, et le designer garde les siennes pour le playtest. Le classement ne change pas.

## Étude v4 : et si tous les jetons étaient égaux ? (27 novembre 2026, question de l'utilisateur)

**La question :** le jeton ⚒ Prod (une seule action de production par cycle) est-il compris par les joueurs ? Peut-on le supprimer : 3 jetons égaux, chaque action (prompt, code, code review, playtest, correction, tri) coûte 1 heure ?

Quatre variantes (1 500 parties par profil, même graine). On ajoute un profil test, **« Sans PIX »** : l'équipe experte qui fait tout à la main, sans agent. Si elle gagne, la leçon du jeu (« l'IA déplace le goulot vers la vérification ») disparaît.
- **A** : les règles 0.22 (jeton Prod : 1 effort humain par cycle, 2 au cycle 0 et au cycle 4) ;
- **B** : 3 jetons égaux, sans limite (un humain peut produire 3 efforts par cycle) ;
- **C** : 3 jetons égaux, mais **un effort humain coûte 2 heures** ;
- **D** : **4 jetons égaux par cycle, un effort humain coûte 2 heures**, tout le reste 1 heure. Pas de jeton Prod, pas d'exception au cycle 0 ni au cycle 4.

| Profil | A : jeton Prod (0.22) | B : jetons égaux | C : égaux, effort = 2 h | D : 4 h, effort = 2 h |
|---|---|---|---|---|
| Les fonceurs | 1 711 | 2 448 | 1 430 | 1 993 |
| Les élèves sérieux | 3 523 | 4 521 | 2 604 | 3 977 |
| Les perfectionnistes | 3 496 | 4 281 | 2 520 | 3 558 |
| Le chef de projet débordé | 1 797 | 2 288 | 1 541 | 1 913 |
| Les artistes | 2 673 | 3 429 | 2 011 | 2 837 |
| L'équipe experte | 3 958 | 4 610 | 2 853 | 4 148 |
| **Sans PIX (tout à la main)** | **2 426** | **4 275** | 1 733 | **3 338** |
| Part des efforts faits par PIX | 45 à 61 % | 32 à 43 % | 55 à 69 % | 49 à 55 % |
| MVP au cycle 0 (équipe experte) | 100 % | 100 % | **0 %** | 100 % |

**Ce qu'on en retient :**
- **B casse la leçon.** Les humains deviennent aussi productifs que PIX : l'équipe « Sans PIX » fait presque aussi bien que l'équipe experte (4 275 contre 4 610) et mieux que les perfectionnistes. Les agents ne servent presque plus (un tiers des efforts). C'est ce que la première étude avait déjà montré, et la raison de la limite d'un effort humain par cycle.
- **C garde la leçon mais casse le cycle 0** : avec 3 heures, chaque humain ne produit qu'un effort, et les 5 Must (6 efforts) ne tiennent plus dans le cycle. Personne n'a de MVP au cycle 0.
- **D fonctionne** : scores proches des règles 0.22 (+1 à +16 %), même classement, PIX fait toujours la moitié des efforts, MVP au cycle 0 comme aujourd'hui, même durée de partie (environ 2 heures de jeu simulées). La leçon reste, un peu moins forte : « Sans PIX » perd 20 % face à l'équipe experte (contre 39 % avec le jeton Prod).
- Avec D, la règle se dit en une phrase : **« 4 heures par cycle. Produire un effort prend 2 heures ; tout le reste prend 1 heure. »** Plus de jeton Prod, plus d'élan du lancement ni de sprint final : le cycle 0 marche tout seul (2 efforts par humain + 3 de PIX = 7, pour 6 efforts de Must).

**Décision (27 nov. 2026, GDD 0.23) : la variante D est adoptée.** Le simulateur la prend par défaut (`heures=4`, `effort_humain=2`, plus de plafond d'efforts humains).

## Historique : la version 1 de l'étude

La première étude utilisait des robots à stratégie fixe et a conduit à 4 réglages :
- un humain produit 1 bloc par cycle au maximum ;
- plus de bonus « release sans défaut » ;
- la note reste entre 1 et 5 ;
- au cycle 0, chaque humain produit 2 blocs. Une première version donnait 5 blocs à PIX au cycle 0 : elle a été écartée car illogique, avec des résultats identiques.

Elle avait montré que les humains produisaient autant que PIX, et que la note saturait ou s'effondrait.
