# Spécification — la démo animée du plateau (« proto plateau »)

*Version 2, 26 novembre 2026. C'est la **prochaine étape du projet**. Ce document suffit pour démarrer avec Claude Code : il dit quoi construire, dans quel ordre, et comment savoir que c'est terminé.*

*Version 1 → 2 : ce n'est plus un jeu avec ses règles, c'est une **démo animée et scriptée**. Le moteur de règles viendra après, si la démo convainc.*

## 1. Pourquoi cette démo, et pourquoi d'abord

La recette du jeu, c'est **l'interactivité et la gamification** : le plateau qui s'illumine, les efforts qui se remplissent, les agents qui travaillent, les fonctionnalités qui apparaissent, le score et les gamers qui montent. Le papier ne fait pas ressentir ça.

Avant de coder les règles, on veut savoir si **l'expérience** marche. La démo n'a donc **pas besoin de vraies règles** : elle joue un **scénario écrit à l'avance**, 1 ou 2 boucles d'itération, comme un petit film qu'on peut arrêter et rejouer.

**Les questions auxquelles elle répond :**
1. **Comprend-on où regarder** et ce qui se passe, sans explication ?
2. **Voit-on le flux** : le travail qui tourne sur l'orbite, les files qui se remplissent, le goulot ?
3. **Est-ce attirant** (*appealing*) : a-t-on envie de jouer en voyant l'écran ?
4. **Est-ce gratifiant** (*rewarding*) : les étoiles, les gamers, la note et le score qui montent donnent-ils envie de faire une boucle de plus ?

## 2. Le périmètre

| Dans la démo | Pas dans la démo |
|---|---|
| Le plateau complet et joli, dans les deux thèmes | Les règles, les calculs réels, les choix des joueurs |
| **Un scénario scripté de 2 boucles** (cycle 0, puis cycle 1), avec des données inventées mais crédibles | Le hasard (les cartes Test révélées sont écrites dans le script) |
| Les animations : stations qui s'illuminent, tickets (les fonctionnalités) qui avancent, efforts qui se remplissent, agents qui travaillent, files qui grossissent, cartes qui se retournent | Plusieurs équipes, leaderboard, sauvegarde, journal |
| **La couche de gamification** : score qui s'incrémente, gamers qui augmentent, étoiles qui volent vers les fonctionnalités, note du jeu, célébration du MVP, anneau de boucle qui s'allume | XP, badges, feuille de score complète |
| Une barre de lecture : lecture, pause, pas à pas, vitesse (×1, ×2), recommencer | Le chrono de 20 minutes |

## 3. Ce qu'on voit à l'écran

Le plateau reprend le Whiteboard (`docs/whiteboard/plateau-orbite.json`) et la direction artistique (`docs/jeu/direction-artistique.md`).

- **Au centre, le soleil ambre** (le pilotage) : les 3 rôles avec leurs 3 jetons Heure. Un jeton utilisé s'envole vers la station où l'on agit.
- **L'orbite et ses 6 stations-planètes :** Backlog → Prompt → Build → Test → Release → Feedback. **La station active s'illumine.** Le nom du temps en cours (Brief, Planning, Build, Test, Release, Review) s'affiche en grand.
- **Les cartes Fonctionnalité sont des tickets** qui avancent de station en station dans le couloir du cycle, avec leur nom, leurs étoiles et leurs cases d'effort qui se remplissent.
- **Les satellites :** PIX sur Build, SCAN sur Test (portraits dans `assets/personnages/`). Ils s'animent quand ils travaillent, avec une bulle de personnalité (PIX : « Terminé ! Tout fonctionne parfaitement. » ; SCAN : « Aucun défaut détecté. »).
- **Les cartes Test cachées** sous les efforts de PIX, qui se retournent (OK en vert, Bug en rouge).
- **Les 3 files d'attente orange**, qui grossissent quand le travail s'entasse (surtout Feedback → Backlog).
- **Les planètes extérieures :** Nebulous Publishing (Vera), qui donne à l'équipe la mission, le brief et le cadre, et la communauté, d'où partent les cartes Feedback (anonymes).
- **Le tableau de bord du studio :** gamers (compteur qui défile), note en étoiles, **score**, tokens IA, indicateur **MVP**, et le **compteur de boucles** (un anneau s'allume à chaque cycle terminé).

## 4. Le scénario de la démo (le script)

Durée visée : **2 à 3 minutes en vitesse ×1**. Les chiffres suivent l'esprit des règles (1 étoile = 25 gamers, score = gamers × note), sans calcul réel.

**Boucle 1 : le cycle 0, « le pitch »** *(pas de carte Test, pas de token, pas d'événement ni de feedback ; chaque humain peut faire 2 efforts)*
1. *Brief* : Vera (message V0) : un jeu en pixel art dans l'esprit de Space Invaders ; « avant de signer, montrez-moi un premier jouable ».
2. *Planning* : la station Backlog s'allume. Les 5 *Must* passent des Idées au Backlog (F02, F07, F09, F06, F13 : 5 places, pile ce qu'il faut), puis partent dans le couloir, à la station Prompt.
3. *Build* : la station Prompt s'allume ; la cheffe de projet passe 2 heures à écrire les prompts de F09 et F13. La station Build s'allume ; PIX fait les 3 efforts de F09 et F13 (sans carte Test ni token au cycle 0) ; le programmeur fait F02 et F07 (2 heures), le designer F06 (1 heure). 6 efforts : les 5 *Must* sont prêts.
4. *Test* : rien à tester au cycle 0 ; les tickets passent la station Test.
5. *Release* : les 5 tickets partent vers la communauté ; ils rejoignent les « Fonctionnalités live » de Star Squadron ; le MVP est publié.
6. *Review* : 10 étoiles, soit **250 gamers** ; note 3 ; **score 750** ; le premier anneau de boucle s'allume ; les heures reviennent au pilotage.

**Boucle 2 : le cycle 1, « l'accès anticipé »**
1. *Brief* : Vera (message V1) : « Les premiers gamers arrivent. Écoutez-les… mais pas tous. » L'animateur retourne l'événement **E1** (2 cartes Feedback de plus, car le jeu a des gamers).
2. *Planning* : **4 cartes Feedback** arrivent dans la file Feedback → Backlog (2 pour les paliers de 100 et 200 gamers, 2 pour E1) : FB18 (des explosions !), FB19 (l'espace est statique), FB07 (le score plafonne) et FB16 (un compliment). La cheffe de projet les trie (2 heures, 1 heure pour 2 cartes) : trois **idées de gamers apparaissent** (F17 Explosions, F18 Fond spatial, F14 Système de score), le compliment s'écarte. Les trois passent au Backlog puis dans le couloir.
3. *Build* : prompts de F17 (la cheffe de projet, 1 heure) et de F14 (le designer, 1 heure). PIX fait les **3 efforts de F17** (3 tokens, 3 cartes Test cachées) : il a fini sa capacité, **le prompt de F14 attend** dans la file Prompt → Build (le goulot). Le designer fait F18 (1 heure).
4. *Test* : SCAN teste 2 efforts de F17 (2 tokens) : un OK, **un Bug trouvé** (PIX proteste) ; le designer le corrige (1 heure). Le troisième effort n'est pas testé.
5. *Release* : la carte non testée se retourne **devant les gamers** : OK, soulagement. F17 et F18 sont publiées ; F14 reste en Prompt, pas finie.
6. *Review* : 6 étoiles de plus, soit **400 gamers** ; les 2 cartes Feedback livrées (FB18 avec F17, FB19 avec F18) font monter la note de 3 à **4** ; **score 1 600** ; le deuxième anneau s'allume. Deux nouvelles cartes Feedback arrivent (paliers de 300 et 400 gamers) : la file grossit, **le succès crée sa propre charge**.

*Bilan des heures au cycle 1 : cheffe de projet 3 (tri 2, prompt 1), designer 3 (prompt, effort, correction), programmeur 0 : ses fonctionnalités ne sont pas au programme ce cycle. Tokens : 20 → 15.*

*Correspondance entre les temps du cycle et les stations (décidée le 27 nov. 2026) :* Brief → aucune station (Vera parle) ; Planning → Backlog ; Build → Prompt (les prompts), puis Build ; Test → Test ; Release → Release ; Review → Feedback.

*Le script est un fichier de données (`game/plateau/js/script-demo.js`), facile à modifier (ordre, textes, durées, chiffres) sans toucher au code.*

## 5. Les règles techniques (en plus de `CLAUDE.md`)

- **Dossier :** `game/plateau/` (`index.html`, `style.css`, `js/`).
- **La démo s'ouvre en double-cliquant sur `index.html`**, sans serveur ni Internet. Le script et les textes sont des fichiers JavaScript chargés par une balise `<script>` (par exemple `game/plateau/js/script-demo.js`, qui définit `window.DEMO_SCRIPT`), pas des JSON chargés par `fetch`.
- **Le script est une liste d'étapes** (par exemple `{ temps: "build", action: "effort", fonctionnalite: "F17", par: "PIX", duree: 800 }`). Un petit lecteur les joue l'une après l'autre.
- **Séparer le dessin du script :** les fonctions d'affichage (« illuminer une station », « remplir un effort », « faire voler des étoiles », « faire monter le compteur ») ne savent pas d'où viennent les ordres. Plus tard, le vrai moteur de règles appellera **les mêmes fonctions** à la place du script : rien n'est jeté.
- **Les textes affichés** ont une clé et une version `fr`, comme le demande `CLAUDE.md`. Les noms des fonctionnalités viennent de `docs/jeu/cartes-orbit-studio.md`.
- **Dessin :** plateau en SVG, animations en CSS et un peu de JavaScript, sans bibliothèque lourde. Toutes les couleurs par les variables CSS de la direction artistique ; bouton de thème clair / sombre.
- **Sons :** légers et coupés par défaut, un bouton pour les activer (célébration du MVP, étoiles, compteur).

## 6. Les étapes de construction (une étape = une session de travail)

Chaque étape se termine par un test dans le navigateur, une mise à jour de ce document (cocher l'étape) et un commit.

**Design gelé jusqu'à l'étape 5 (décidé le 27 nov. 2026).** Le plateau, ses zones et le vocabulaire ne bougent plus pendant les étapes 2 à 4 : on anime ce qui existe. Une nouvelle idée de design va dans la liste ci-dessous et on la traite à l'étape 5, après les premiers regards. Seules exceptions : un défaut qui empêche une animation de fonctionner ou de se comprendre. Pas de nouvelle interaction non plus : le script de l'étape 3 appelle les mêmes fonctions que les clics.

*Corrections de compréhension faites pendant le gel (27 nov., retours sur l'étape 2) :* « ticket » au lieu de « vaisseau » ; légende et infobulles des cartes Test ; avis quand PIX tire une carte Test ; dans le banc d'essai, **on clique sur un ticket pour choisir la fonctionnalité**, puis les boutons (avancer, effort, PIX, SCAN) agissent sur elle et un avis dit pourquoi une action n'est pas possible.

*Idées notées pendant le gel (à traiter à l'étape 5 ou au moteur de règles) :*
- **La pioche Événements n'est pas pour les joueurs** (27 nov.) : c'est l'animateur qui retourne la carte Événement au début du Brief (dans le numérique : automatiquement quand il fait passer tout le monde au cycle suivant, la même carte pour toutes les équipes). Dans la démo, le clic sur la pioche reste ouvert pour le banc d'essai ; avec le moteur de règles, il sera réservé à l'animateur.

| # | Étape | Terminé quand… | Fait |
|---|---|---|---|
| 1 | **Le plateau statique, joli** : soleil, 6 stations, files, satellites, planètes extérieures, tableau de bord, deux thèmes | On l'ouvre en double-cliquant et on a envie de jouer dessus | ☑ 26 nov. 2026 |
| 2 | **Les briques animées** : *(fait le 27 nov. : les pioches virtuelles Événement, Feedback et Test, la carte qui vole, se retourne et part à sa place, la carte Test cachée sous un ticket qu'on retourne d'un clic ; pioches en colonne à droite ; un schéma par carte Feedback ; les trois zones des fonctionnalités, Idées → Backlog → couloir du cycle, avec les clics « choisir », « lancer » et « trier un feedback », qui fait apparaître les idées de gamers ; tickets compacts avec une loupe au survol)* ; faire voler une pastille Heure (CP, D, P) du pilotage jusqu'à la station où l'on agit, en laissant sa place vide au pilotage ; illuminer une station, faire avancer un ticket, remplir un effort, animer PIX et SCAN, retourner une carte Test, faire grossir une file. *(Fait le 27 nov. : `js/animations.js` (les 6 briques : jeton Heure qui vole et revient, comète sur l'orbite et station qui s'allume, ticket qui glisse dans le couloir, effort qui se remplit, PIX qui envoie des `</>` et SCAN qui balaie le ticket, file qui grossit, sature et déborde) ; `js/banc.js` (le banc d'essai, un bouton par animation, et les actions qu'appellera le script : une heure puis un effort, SCAN qui teste sans voir les Pas fun…))* | Chaque animation se déclenche par un bouton de test et elle est belle | ☑ 27 nov. 2026 |
| 3 | **Le lecteur et le script** des 2 boucles, avec la barre de lecture | La démo se joue de bout en bout en 2 à 3 minutes, et on peut la mettre en pause, avancer pas à pas, recommencer | ☐ *(fait le 27 nov., à valider : `js/script-demo.js` (l'état de départ et les 75 étapes des 2 boucles), `js/lecteur.js` (le lecteur et la barre de lecture : lecture/pause, aussi à la barre d'espace, pas à pas, ×1 ou ×2, recommencer, barre d'avancement) ; environ 2 minutes à ×1. La démo s'ouvre au début du cycle 0 ; le banc d'essai reste disponible avec `index.html?etat=vitrine` ou `?banc=1`)* |
| 4 | **La couche de gamification** : compteur de gamers, étoiles qui volent, note, score, célébration du MVP, anneaux de boucle, sons | En la regardant, on a envie de voir la boucle suivante | ☐ |
| 5 | **Les retouches après les premiers regards** | Les points relevés au test (section 7) sont corrigés | ☐ |

**Estimation :** 4 à 5 sessions de 2 à 3 heures, soit 10 à 15 heures : la période libre de début décembre.

## 7. Comment on saura que ça marche (le test)

Montrer la démo à 3 ou 4 personnes (proches, puis un enseignant si possible), **sans rien expliquer avant**. Après une première lecture, leur demander :
1. « Qu'est-ce qui s'est passé ? » Est-ce qu'ils racontent le cycle, les agents, les tests, les gamers ?
2. « Où regardiez-vous ? » Est-ce qu'il y avait trop de choses à la fois ?
3. « Quel moment vous a plu le plus ? » (MVP, révélation de la carte Test, gamers qui montent…)
4. « Vous auriez envie de jouer ? » Sur une échelle de 1 à 5.

**C'est réussi si** au moins 3 personnes sur 4 racontent le flux sans aide et notent l'envie de jouer à 4 ou plus. Sinon, on corrige la démo avant d'écrire une seule règle.

**Après la démo :** si elle convainc, on construit le moteur de règles (GDD section 0, mêmes calculs que `prototype-papier/outil/simuler.py`) qui pilotera les mêmes animations, puis on y branche les builds SpacePlan.

## 8. Le prompt de départ pour Claude Code

> Lis `CLAUDE.md`, puis `docs/jeu/spec-prototype-plateau.md`, `docs/jeu/direction-artistique.md` et le Whiteboard `docs/whiteboard/plateau-orbite.json`. Nous faisons l'étape 1 de la spécification : le plateau statique et joli, sans règles. Explique-moi ton plan en quelques lignes avant de coder, puis propose-moi de tester dans le navigateur.
