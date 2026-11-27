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
| Les animations : stations qui s'illuminent, vaisseaux qui voyagent, efforts qui se remplissent, agents qui travaillent, files qui grossissent, cartes qui se retournent | Plusieurs équipes, leaderboard, sauvegarde, journal |
| **La couche de gamification** : score qui s'incrémente, gamers qui augmentent, étoiles qui volent vers les fonctionnalités, note du jeu, célébration du MVP, anneau de boucle qui s'allume | XP, badges, feuille de score complète |
| Une barre de lecture : lecture, pause, pas à pas, vitesse (×1, ×2), recommencer | Le chrono de 20 minutes |

## 3. Ce qu'on voit à l'écran

Le plateau reprend le Whiteboard (`docs/whiteboard/plateau-orbite.json`) et la direction artistique (`docs/jeu/direction-artistique.md`).

- **Au centre, le soleil ambre** (le pilotage) : les 3 rôles avec leurs 3 jetons Heure. Un jeton utilisé s'envole vers la station où l'on agit.
- **L'orbite et ses 6 stations-planètes :** Backlog → Prompt → Build → Test → Release → Feedback. **La station active s'illumine.** Le nom du temps en cours (Brief, Planning, Build, Test, Release, Review) s'affiche en grand.
- **Les cartes Fonctionnalité sont des petits vaisseaux** qui voyagent de station en station, avec leur nom, leurs étoiles et leurs cases d'effort qui se remplissent.
- **Les satellites :** PIX sur Build, SCAN sur Test (portraits dans `assets/personnages/`). Ils s'animent quand ils travaillent, avec une bulle de personnalité (PIX : « Terminé ! Tout fonctionne parfaitement. » ; SCAN : « Aucun défaut détecté. »).
- **Les cartes Test cachées** sous les efforts de PIX, qui se retournent (OK en vert, Bug en rouge).
- **Les 3 files d'attente orange**, qui grossissent quand le travail s'entasse (surtout Feedback → Backlog).
- **Les planètes extérieures :** Nebulous Publishing (Vera), qui donne à l'équipe la mission, le brief et le cadre, et la communauté, d'où partent les cartes Feedback (anonymes).
- **Le tableau de bord du studio :** gamers (compteur qui défile), note en étoiles, **score**, tokens IA, indicateur **MVP**, et le **compteur de boucles** (un anneau s'allume à chaque cycle terminé).

## 4. Le scénario de la démo (le script)

Durée visée : **2 à 3 minutes en vitesse ×1**. Les chiffres suivent l'esprit des règles (1 étoile = 25 gamers, score = gamers × note), sans calcul réel.

**Boucle 1 : le cycle 0, « le pitch »**
1. *Brief* : Vera apparaît : « Avant de signer, je veux un premier jouable. »
2. *Planning* : 5 cartes quittent le Backlog (les 5 *Must*).
3. *Build* : les jetons Heure des 3 humains s'envolent ; les efforts se remplissent un par un.
4. *Release* : les 5 vaisseaux passent la station Release.
5. *Review* : **célébration du MVP** (« Votre jeu a ses premiers gamers ! ») ; 10 étoiles volent vers le jeu ; le compteur passe de 0 à 250 gamers ; note 3 ; le score monte à 750 ; le premier anneau de boucle s'allume.

**Boucle 2 : le cycle 1, « l'accès anticipé »**
1. *Brief* : « Les premiers gamers arrivent. Écoutez-les. »
2. *Planning* : 2 cartes Feedback arrivent de la communauté dans la file Feedback → Backlog ; le chef de projet en trie une ; 3 fonctionnalités partent vers Prompt (Explosions, Score, Fond spatial).
3. *Build* : PIX s'anime et fait 3 efforts (3 tokens dépensés), avec 3 cartes Test cachées ; un humain fait 1 effort ; la file Prompt → Build garde 1 effort en attente.
4. *Test* : SCAN scanne 2 efforts : un OK, **un Bug trouvé** (rouge, corrigé par le programmeur). Un effort n'est pas testé.
5. *Release* : la carte Test non testée se retourne **devant les gamers** : OK, soulagement (moment de tension).
6. *Review* : les étoiles volent vers les 3 nouvelles fonctionnalités ; les gamers passent de 250 à 475 ; une carte Feedback livrée fait monter la note à 3,5 ; le score passe à 1 662 ; le deuxième anneau s'allume. Une nouvelle carte Feedback arrive : la file Feedback → Backlog grossit (le succès crée sa propre charge).

*Le script est un fichier de données, facile à modifier (ordre, textes, durées, chiffres) sans toucher au code.*

> **À corriger au début de l'étape 3 (relevé le 27 nov. 2026) :** la boucle 2 ne suit plus les règles du GDD 0.19 et 0.20.
> - Explosions (F17), Score (F14) et Fond spatial (F18) sont des **idées de gamers cachées** : chacune n'apparaît que si l'on trie la carte Feedback qui la cite (FB18, FB07, FB19). Il faut donc trier 3 cartes, pas une.
> - Ces 3 fonctionnalités font **6 efforts** (3 + 2 + 1). Le script n'en produit que 4, dont un reste en attente, mais publie les 3 avec leurs 9 étoiles.
> - Elles sont toutes au designer (D), qui ne produit qu'**1 effort par cycle**.
>
> Deux façons de corriger : changer les fonctionnalités de la boucle 2, ou n'en publier que 2 sur 3 et **montrer celle qui n'est pas finie** (ce qui illustre bien la leçon). Les chiffres des gamers et du score sont à recalculer en conséquence.

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

*Idées notées pendant le gel (à traiter à l'étape 5) :* aucune pour l'instant.

| # | Étape | Terminé quand… | Fait |
|---|---|---|---|
| 1 | **Le plateau statique, joli** : soleil, 6 stations, files, satellites, planètes extérieures, tableau de bord, deux thèmes | On l'ouvre en double-cliquant et on a envie de jouer dessus | ☑ 26 nov. 2026 |
| 2 | **Les briques animées** : *(fait le 27 nov. : les pioches virtuelles Événement, Feedback et Test, la carte qui vole, se retourne et part à sa place, la carte Test cachée sous un ticket qu'on retourne d'un clic ; pioches en colonne à droite ; un schéma par carte Feedback ; les trois zones des fonctionnalités, Idées → Backlog → couloir du cycle, avec les clics « choisir », « lancer » et « trier un feedback », qui fait apparaître les idées de gamers ; tickets compacts avec une loupe au survol)* ; faire voler une pastille Heure (CP, D, P) du pilotage jusqu'à la station où l'on agit, en laissant sa place vide au pilotage ; illuminer une station, faire voyager un vaisseau, remplir un effort, animer PIX et SCAN, retourner une carte Test, faire grossir une file. *(Fait le 27 nov., à valider : `js/animations.js` (les 6 briques : jeton Heure qui vole et revient, comète sur l'orbite et station qui s'allume, vaisseau qui glisse dans le couloir, effort qui se remplit, PIX qui envoie des `</>` et SCAN qui balaie le ticket, file qui grossit, sature et déborde) ; `js/banc.js` (le banc d'essai, un bouton par animation, et les actions qu'appellera le script : une heure puis un effort, SCAN qui teste sans voir les Pas fun…))* | Chaque animation se déclenche par un bouton de test et elle est belle | ☐ |
| 3 | **Le lecteur et le script** des 2 boucles, avec la barre de lecture | La démo se joue de bout en bout en 2 à 3 minutes, et on peut la mettre en pause, avancer pas à pas, recommencer | ☐ |
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
