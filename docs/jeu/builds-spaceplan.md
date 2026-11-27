# Les builds de SpacePlan, fonctionnalité par fonctionnalité

*Inventaire du 26 novembre 2026, fait dans le dossier HLC (`public/SpacePlan/` pour les pages, `public/js/SpacePlan/` pour le code JavaScript). HLCv2.0 a exactement la même arborescence. Les dossiers HLC sont en lecture seule : rien n'a été copié ni modifié. But : savoir quelle version jouable de SpacePlan montrer à chaque release d'Orbit : Studio (GDD, section 12).*

## Ce qu'on a trouvé

Dans SpacePlan, chaque mission « Code », « Dev » ou « Art » contient un **mini-jeu jouable** : le shoot'em up de l'équipe, au stade où il en est, avec la fonctionnalité que l'on vient d'ajouter. Le joueur la teste dans une boîte de réglage (*Tuning box*, *Test box* ou *Log box*), puis valide. Chaque build porte un numéro de version, de 0.11 à 0.4, et un kanban qui nomme les tâches terminées.

Il y a aussi **quatre démos complètes** : Proto, PoC (« FP »), Alpha et Beta.

## Les builds, dans l'ordre

| Build (dossier) | Version | Ce qui est ajouté (tâches du kanban) | Fonctionnalités d'Orbit |
|---|---|---|---|
| **Conception** | | | |
| SP-C11-Proto-MakingArt1 | — | Premiers dessins du vaisseau et de l'alien | (F20) |
| SP-C12-CodingBugsGame | — | Apparition, contrôles du vaisseau, mouvement des aliens, collisions, début et fin de partie, missiles (mini-jeu de bugs, pas le jeu lui-même) | F02, F07, F09, F13 |
| SP-C13-Proto-MakingArt2 | — | Boîtes de collision, système de missiles. Pas le temps de faire les explosions | F06 |
| SP-C14-Proto-SpacePlan-Playtest | — | **Prototype** joué par les testeurs | F02, F06, F07, F09, F13 : **le MVP** |
| SP-4-ProtoDemo | — | Démo du prototype | MVP |
| **Pré-production (PoC, « FP »)** | | | |
| SP-PP21-CodingBugsGame | — | Grille jusqu'aux bords, cadence de tir, apparition, contrôles, grille qui tire, collision des missiles | F11 (+ MVP) |
| SP-PP22-PoC-MakingContent | — | Dessin du vaisseau et de l'alien | (F20) |
| SP-PP23-PoC-MakingContent2 | — | Boîte de collision plus petite pour le vaisseau, plus grande pour les aliens | F06 (réglage) |
| SP-PP24-PoC-MakingContent3-Explosions | — | **Types de missiles, explosions** (réglages : taille, particules, vitesse, fondu) | F15, F17 |
| SP-PP25-PoC-SpacePlan-Playtest | — | PoC joué par les testeurs | MVP + F11, F15, F17 |
| SP-6-PoCDemo | — | Démo du PoC | idem |
| **Production (Alpha)** | | | |
| SP-PR4-Code | 0.11 | 7. La grille descend ; 11. Collision alien / vaisseau | F10, F05 |
| SP-PR5-Code | 0.12 | 13. Score ; 5. Écran de défaite et redémarrage ; 6. Fond spatial (étoiles) | F14, F13, F18 |
| SP-PR6-Dev | 0.13 | 12. Nouvelles vagues d'aliens ; 14. Conditions et écran de victoire | F12, F16 |
| SP-PR7-Dev | 0.14 | 15. Trois types de vaisseaux ; 18. Puissance de feu | F01, F04 |
| SP-PR9-Dev | 0.15 | 17. Boucliers ; 19. Visuels des vaisseaux | F03, (F20) |
| SP-PR10-Dev | 0.16 | Données des joueurs (journal : vaisseau, boucliers, grilles détruites) | — (analytics) |
| SP-PR13-Alpha-Playtest | — | **Alpha** jouée par les 16 testeurs | toutes sauf F08, F19, F20 |
| SP-7-AlphaDemo | — | Démo de l'Alpha | idem |
| **Closing (Beta)** | | | |
| SP-CL3-Code | 0.30 | Vitesse et tirs des aliens qui augmentent après quelques vagues ; taille des grilles | F08 |
| SP-CL4-Code | 0.31 | Rythme entre deux vagues ; puissance de feu et boucliers par vaisseau | F08 |
| SP-CL5-Art | 0.32 | Étoiles plus rapides, finition des vaisseaux, icône du bouclier | (F18, F20) |
| SP-CL6-Art | 0.33 | 19. Visuels des aliens ; 20. SpaceTron ; 21. Contexte et ton dans l'interface | F19, F20 |
| SP-CL7-Tests | 0.35 | Plan de test | — |
| SP-CL9-Dev | 0.4 | Réglage final de la difficulté (11e vague, plus d'aliens pour les vaisseaux à 2 canons) | F08 |
| SP-3-BetaDemo | — | **Beta** complète | les 20 |

## Où chaque fonctionnalité d'Orbit apparaît

| Id | Fonctionnalité | Première build jouable |
|---|---|---|
| F01 | 3 types de vaisseaux | PR7 (0.14) |
| F02 | Apparition du vaisseau | Proto (C14) |
| F03 | Boucliers | PR9 (0.15) |
| F04 | Puissance de feu | PR7 (0.14) |
| F05 | Collision alien / vaisseau | PR4 (0.11) |
| F06 | Collision missile | Proto (C13, C14) |
| F07 | Contrôles | Proto (C14) |
| F08 | Difficulté | CL3 à CL9 (0.30 à 0.4) |
| F09 | Grille d'aliens | Proto (C14) |
| F10 | Grille qui descend | PR4 (0.11) |
| F11 | Grille jusqu'aux bords | PoC (PP21) |
| F12 | Nouvelles vagues | PR6 (0.13) |
| F13 | Défaite et redémarrage | Proto (C14), écran complet en PR5 (0.12) |
| F14 | Score | PR5 (0.12) |
| F15 | Types de missiles | PoC (PP24) |
| F16 | Victoire et récompense | PR6 (0.13) |
| F17 | Explosions | PoC (PP24) |
| F18 | Fond spatial | PR5 (0.12) |
| F19 | SpaceTron | CL6 (0.33) |
| F20 | Visuels, univers et ton | CL6 (0.33), par petites touches avant |

Bonne nouvelle : **les 20 fonctionnalités d'Orbit ont toutes une build où elles apparaissent.** La master feature list d'Orbit et l'histoire de SpacePlan sont bien la même.

## Inventaire des combinaisons par chapitre (26 nov. 2026, soir)

*Remplace l'idée d'une seule build Beta à 20 interrupteurs : les builds ne sont pas une seule base de code. Ce travail passe **après le prototype du plateau** (`docs/jeu/spec-prototype-plateau.md`), en S2 et S3.*

### Comment les builds sont vraiment construites (lecture du code de HLC)

- **Entre les chapitres, le code change vraiment.** Proto (38 Ko), PoC (42 Ko) et Alpha (56 à 96 Ko) n'ont pas la même structure : la grille du Proto fait 3 ou 4 colonnes d'aliens de 92 px sur 1 rang, celle de l'Alpha 8 à 11 colonnes de 60 px sur 4 à 6 rangs. Entre PP25 et PR4, environ 2 500 lignes diffèrent. On ne peut donc pas tirer le Proto d'une build Alpha en coupant des interrupteurs : il faut **garder une base par chapitre**.
- **À l'intérieur de la Production, c'est l'inverse.** PR4 contient déjà le code des vaisseaux, des boucliers, des vagues et du score, mais **désactivé à la main** : blocs en commentaire (« adding stars as particles to the background - in prod », vagues multiples), valeurs neutres (`SHIELD = 0`, `selectedShipType = 0`, intervalle de vague à 8 000 000 pour qu'aucune nouvelle grille n'arrive), affichage du score masqué (`display: none`). Chaque fonctionnalité de ce chapitre est donc déjà un « interrupteur fait à la main ». Les transformer en vrais interrupteurs est simple.
- **Les boîtes de réglage existantes (ON/OFF, x1/x4) ne sont pas des interrupteurs de fonctionnalité** : ce sont les choix de l'exercice SpacePlan (trouver le bon réglage pour valider). On ne les réutilise pas telles quelles.
- **Les fonctionnalités du PoC sont faciles à isoler** dans PP25 et dans l'Alpha : F15 = la couleur des missiles (jaune pour le joueur, orange pour les aliens), F17 = les appels à `createParticles`, F11 = le recalcul de la largeur de la grille quand une colonne meurt.

### Les chapitres et leurs fonctionnalités

| Chapitre | Base de code (dans HLC) | Fonctionnalités du chapitre | Nombre |
|---|---|---|---|
| 1. Conception | Proto (`SP-C14` / `SP-4-ProtoDemo`) | F02, F06, F07, F09, F13 (les 5 *Must*, le MVP) | 5 |
| 2. Pré-production | PoC (`SP-PP25` / `SP-6-PoCDemo`) | F11, F15, F17 | 3 |
| 3. Production | Alpha (`SP-PR13` / `SP-7-AlphaDemo`) | F10, F05, F14, F18, F12, F16, F01, F04, F03 (+ écran complet de F13) | 9 |
| 4. Closing | Beta (`SP-CL9` 0.4 / `SP-3-BetaDemo`) | F08, F19, F20 | 3 |

### Les dépendances logiques (gérées dans le code, pas dans les règles)

| Fonctionnalité | Dépend de | Pourquoi |
|---|---|---|
| F05 Collision alien / vaisseau | F10 Grille qui descend | Sans descente, les aliens ne touchent jamais le vaisseau |
| F04 Puissance de feu | F01 3 types de vaisseaux | Dans le code, le nombre de canons dépend du type de vaisseau |
| F08 Difficulté | F12 Nouvelles vagues | La difficulté monte de vague en vague |
| Tout le reste | les 5 *Must* | Règle du MVP |

Une fonctionnalité publiée dont la dépendance manque **compte au score mais ne se voit pas** dans le jeu.

### Combien de combinaisons, et lesquelles existent déjà

| Base | Interrupteurs | Combinaisons possibles | Déjà couvertes par une build existante | Solution |
|---|---|---|---|---|
| **Aucune** | — | MVP incomplet | — | **Pas de build à montrer** : c'est la règle du jeu (0 gamer) |
| **Proto** | 0 | 1 (MVP seul) | 1 : C14 / ProtoDemo | Garder tel quel |
| **PoC** | 3 (F11, F15, F17) | 7 | 2 : PP21 (F11) et PP25 (les 3) | 3 interrupteurs dans PP25 |
| **Alpha** | 9 du chapitre + 3 du PoC = 12 | environ 2 300 (après dépendances) | 6 : PR4, PR5, PR6, PR7, PR9, PR13 | 12 interrupteurs dans PR13 : impossible en builds séparées, naturel en interrupteurs |
| **Beta** | 3 de plus (F08, F19, F20) | 8 sur une Alpha complète | 5 : CL3, CL4, CL6, CL9, BetaDemo | Optionnel pour le pilote |

### Quelle base montrer à une release (la règle de la page de lancement)

1. Les 5 *Must* ne sont pas tous publiés sans bug → **pas de build** (« votre jeu n'est pas encore jouable »).
2. Rien d'autre que le MVP → **Proto**.
3. Au moins une fonctionnalité du PoC, aucune au-delà → **PoC**, avec ses 3 interrupteurs.
4. Au moins une fonctionnalité de Production → **Alpha**, avec ses 12 interrupteurs (ceux du PoC compris : une équipe peut faire le score sans les explosions).
5. Au moins une fonctionnalité de Closing → **Beta** si sa base à interrupteurs existe ; sinon on reste sur l'Alpha, et F08, F19, F20 ne se voient pas encore.

**Aucune équipe n'est bloquée par l'ordre** : le seul cas sans build est le MVP incomplet. Les interrupteurs sont passés dans l'adresse de la build, par exemple `index.html?f=F11,F17`.

### Faisabilité et effort (à confirmer avec Claude Code)

| Travail | Effort estimé | Sprint |
|---|---|---|
| PoC : copier PP25, 3 interrupteurs lus dans l'adresse | une demi-journée | S2 (à faire en premier : valide la méthode) |
| Proto : copier C14, retirer la boîte de réglage | 1 à 2 h | S2 |
| README de `game/spaceplan-builds/` : le tableau « cartes publiées → build » ci-dessus | 1 h | S2 |
| Page de lancement, branchée sur le bouton « Jouer à votre jeu » du plateau | une demi-journée | S2 |
| Alpha : partir de PR13, remplacer les blocs commentés et valeurs neutres par 12 interrupteurs, en s'aidant des différences PR4 → PR13 | 1 à 2 jours | S3 |
| Beta : partir de CL9 (0.4), 15 interrupteurs | 1 à 2 jours | Après le pilote |

**Bonus possible (plus tard) :** un interrupteur « bug » par fonctionnalité (les builds « CodingBugsGame » contiennent déjà des bugs volontaires, par exemple l'explosion désactivée « bug introduced intentionnaly » dans PR4), pour jouer une fonctionnalité publiée avec une carte Bug.

## Ce que ça change pour Orbit : Studio

1. **Le MVP existe déjà : c'est le prototype (C14 / ProtoDemo).** À la première release qui atteint le MVP, l'équipe joue au prototype de SpacePlan. Très fort pédagogiquement : « voilà votre jeu ».
2. **Les builds sont linéaires, les équipes d'Orbit ne le sont pas.** D'où une base par chapitre avec des interrupteurs (ci-dessus).
3. **Pour le prototype papier**, pas besoin de code : l'animateur montre la démo la plus proche (Proto, PoC, Alpha ou Beta) selon la règle « quelle base montrer ».

## À décider

- Vérifier les droits : le code et les visuels de SpacePlan appartiennent à Helioso, mais certains visuels ont été générés par IA (même passe de vérification que pour les portraits).
