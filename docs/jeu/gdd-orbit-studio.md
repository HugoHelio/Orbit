# GDD — Helioso Orbit : Studio

*Game Design Document du scénario 1 **« Orbit : Studio »** (studio de jeu vidéo) du business game **Helioso Orbit**, « Piloter une équipe humains + agents IA ». C'est le document de référence du jeu : **il est mis à jour à chaque décision**, et c'est lui qui fait foi.*

| | |
|---|---|
| **Version** | 0.22 — 27 novembre 2026 |
| **Statut** | Règles validées par simulation ; kit papier prêt pour un brouillon de test (`prototype-papier/`) |
| **Plateau de travail** | Whiteboard « Helioso Orbit — plateau de l'orbite d'itération » : https://claude.ai/artifact/6uS1vcS3rbC3wgpG6S7YHn (sauvegarde : `docs/whiteboard/plateau-orbite.json`) |
| **Documents liés** | `docs/jeu/regles-une-page.md` (les règles pour les joueurs), `docs/jeu/simulation-equilibrage.md` (la simulation), `docs/jeu/cartes-orbit-studio.md` (toutes les cartes), `docs/jeu/direction-artistique.md` (palette, thèmes, typographie), `docs/jeu/reprise-spaceplan.md` (ce qu'on reprend de SpacePlan), `docs/jeu/builds-spaceplan.md` (les builds jouables de SpacePlan, fonctionnalité par fonctionnalité), `docs/offre/scenarios-business-game.md` (les autres scénarios), `docs/pilotage/plan-sprints-2027.md` (le calendrier) |

**Journal des versions**
- **0.1** — Premier plan : équipe, benchmarks, cycle, session de 3 h.
- **0.2** — Hasard + stratégie, compétition et leaderboard, plateau en orbite, architecture multijoueur.
- **0.3** — Passage au format GDD. Trois goulots sur le plateau, mécanique de tri du feedback, jeu hors ligne obligatoire, premier jet du narratif.
- **0.4** — Nom du jeu : Helioso Orbit ; scénario « Orbit : Studio » ; le studio fictif s'appelle Orbital Studio. Chapitre gratuit et cadenas par code de licence.
- **0.5** — Ton et personnages du narratif validés ; cartes en français, conçues pour être traduites en anglais.
- **0.6** — **Règles de base** simplifiées pour le premier prototype (section 0) ; les 20 fonctionnalités de SpacePlan ; un seul paquet de défauts ; premier jet complet des cartes.
- **0.7** — Direction artistique : palette HLC v2.0, deux thèmes (clair et sombre « Tech »), kit papier en style flat.
- **0.8** — Règle du **premier jouable** (0 joueur tant que les 5 Must ne sont pas livrés) ; priorités non imprimées sur les cartes ; cycle 0 libre et sans défaut ; **score = joueurs × note**.
- **0.9** — Portraits en pixel art pour Vera, Max, Sam, Nora, PIX et SCAN ; fiches de rôle A5 à la place des cartes personnage ; jetons simplifiés (9 PA, 15 blocs, 3 marqueurs) ; plateau réorganisé ; idée d'une feuille de score gamifiée pour le numérique.
- **0.10** — Huit précisions de règles et quatre réglages issus de la **simulation** (2 000 parties par stratégie) : un humain produit 1 bloc par cycle au maximum (2 au cycle 0), plus de bonus « release sans défaut », note entre 1 et 5. Règles sur une page.
- **0.11** — **Étude v2** (équipes réalistes, chance, temps) : règles simplifiées (le feedback livré fait monter la note ; un Pas fun coûte 1 étoile ; file d'attente sans suivi d'âge ; E1 seulement si le jeu a des joueurs) et cycles chronométrés (25 min, puis 20 min).
- **0.12** — 7e leçon : **la gestion des risques**. Le « risque du cycle » sur la feuille de score, une feuille de débrief sur les 4 réponses au risque.
- **0.13** — Règles plus lisibles : recto en images (le matériel en un coup d'œil, le cycle en schéma, comment lire une carte), verso pour le détail. Les crédits IA deviennent des **tokens IA**. Le cycle commence par « Écouter », et le risque du cycle se note pendant « Planifier ».
- **0.14** — **Passe sur le vocabulaire**, pour des mots compris dès la première lecture : bloc → **effort** ; point d'action → **heure** (jeton Heure) ; carte Défaut → **carte Test** (OK, Bug, Pas fun) ; brief à PIX → **prompt** ; premier jouable → **MVP** ; le cycle devient **Brief, Planning, Build, Test, Release, Review**. Les mots du métier restent en anglais, exprès, avec un glossaire dans les règles. Sur le plateau, la station « Brief » devient « Prompt » et « Production » devient « Build ». Les sections 5 à 11 gardent encore l'ancien vocabulaire : la section 0 prime. La streameuse Nova devient **Nora** (Nova ressemblait à un nom de planète). Inventaire des **builds jouables de SpacePlan** dans HLC (`docs/jeu/builds-spaceplan.md`) : les 20 fonctionnalités y apparaissent toutes, le prototype correspond au MVP.
- **0.15** — **Plateau aligné sur le nouveau vocabulaire** (section « Le plateau ») : stations Backlog → Prompt → Build → Test → Release → Feedback, jetons Heure, files Prompt → Build et Build → Test, ARTY verrouillé jusqu'au cycle 2. Étape 1 de la démo numérique faite : le plateau statique dans les deux thèmes (`game/plateau/`).
- **0.16** — Retours sur le plateau numérique : l'éditeur s'appelle **Nebulous Publishing** (le même nom en français et en anglais, et « Publishing » dit bien que c'est un éditeur, pas un studio). Il donne à l'équipe **la mission, le brief et le cadre** ; c'est **l'équipe qui écrit le Backlog** (flèche « Nos idées » du pilotage vers le Backlog). Les cartes Fonctionnalité deviennent des **tickets** (numéro, nom, étoiles, barre d'effort). Le tableau de bord montre la **banque d'heures** de l'équipe à côté des tokens IA.
- **0.17** — **Max, Sam et Nora sont les trois fondateurs d'Orbital Studio** (les visages de l'équipe : programmeur, designer, chef de projet). Les cartes Feedback deviennent **anonymes** : c'est la voix de la communauté. Le bonus « Nora » (+1 de note) disparaît : toute carte Feedback livrée vaut +0,5. Le festival accueille « une streameuse célèbre ». **Effort et heure :** 1 effort = 1 unité de travail, de taille fixe sur les tickets ; un humain la paie 1 heure, PIX 1 token.
- **0.18** — **Gamers** : les joueurs de Star Squadron s'appellent partout des gamers (règles, cartes, kit papier, simulateur, plateau numérique) ; les étudiants restent les joueurs d'Helioso Orbit. La catégorie de fonctionnalités « Joueur » devient « Vaisseau ». Simulation relancée sans le bonus Nora : scores 1 à 4 % plus bas, mêmes leçons.
- **0.19** — **12 fonctionnalités au départ, 8 idées de gamers.** Les 8 fonctionnalités que les feedbacks demandent (F08 Réglage de la difficulté, F11 Grille jusqu'aux bords, F12 Nouvelles vagues, F14 Système de score, F15 Types de missiles, F16 Victoire et récompense, F17 Explosions, F18 Fond spatial) sont cachées au départ ; une carte Feedback triée qui en cite une la fait apparaître. Sur le plateau, trois zones pour les fonctionnalités : **Idées** (pas encore choisies), **Backlog** (choisies, par priorité) et le **couloir du cycle** autour du soleil. Simulation : scores 10 à 15 % plus bas, même classement, et la leçon « trier le feedback » est plus nette.
- **0.20** — **Vera ne demande qu'un jeu en pixel art dans l'esprit de Space Invaders** (message V0 neutre). Le jeu et sa première liste de fonctionnalités viennent de l'équipe ; on donne cette liste (les 12 de départ) aux joueurs pour simplifier le cycle 0. Les 5 Must se déduisent du genre : qu'est-ce qui rend ce jeu jouable ?
- **0.21** — **Les boucles de retour et les décisions visibles.** Jeton **Prod** (1 des 3 jetons de chaque joueur, le seul qui produit un effort ; 2 au cycle 0, « l'élan du lancement », et au cycle 4, « le sprint final »). **Deux aiguillages** sur l'orbite : à la sortie du Backlog (qui produit : PIX ou le responsable) et à la sortie du Test (un problème trouvé : corriger, et le ticket recule au Build, ou publier quand même). **Ticket correctif** : une carte Feedback sur une fonctionnalité live renvoie un ticket de la Communauté au Backlog ; la fonctionnalité reste live en attendant. **Deux sortes de bugs** : bloquant (0 étoile, MVP cassé sur un Must) et mineur (la note baisse, les étoiles restent). « Relire » devient **code review**. Simulation : scores 3 à 8 % plus hauts, même classement.
- **0.22** — **La code review revient au programmeur, garant du code**, comme le playtest revient au designer, garant du fun. Les rôles sont plus nets : la cheffe de projet décide, le designer juge le fun, le programmeur vérifie le code. Simulation : scores à 0 à +1,5 %, classement inchangé.

*Tous les chiffres sont des valeurs de départ, à régler pendant les tests.*

---

## 0. Règles de base (version 1 du prototype) — elles priment sur le reste du document

Le jeu se construit comme un jeu de société : des **règles de base**, simples à expliquer et à équilibrer, puis des **modules** ajoutés un par un. Les sections 5 à 10 décrivent le jeu complet ; **pour les premiers tests, seules les règles ci-dessous s'appliquent.** Le détail de toutes les cartes est dans `docs/jeu/cartes-orbit-studio.md`.

| Élément | Règles de base | Modules pour plus tard |
|---|---|---|
| **Fonctionnalités** | Les **20 fonctionnalités de SpacePlan** (master feature list). **12 sont visibles au départ** (la première liste de l'équipe, donnée aux joueurs pour simplifier le cycle 0) ; **8 sont des idées de gamers**, cachées jusqu'à ce qu'une carte Feedback triée les cite. Taille : *Low* = 1 effort, *Medium* = 2, *High* = 3. **La priorité n'est pas imprimée** : Vera ne demande qu'un jeu en pixel art dans l'esprit de Space Invaders ; les équipes retrouvent les 5 *Must* en se demandant ce qui rend ce jeu jouable | Dépendances entre fonctionnalités ; demandes de gamers (classement, combat de boss…) |
| **MVP** (premier jouable) | **Tant que les 5 *Must* ne sont pas tous livrés sans bug bloquant, le jeu a 0 gamer.** Les étoiles des autres fonctionnalités livrées attendent et comptent dès que le MVP est atteint. Un bug bloquant révélé plus tard sur un *Must* recasse le jouable, jusqu'à la publication de son ticket correctif | — |
| **Valeur** | *Must* = 2 étoiles, *Should* = 3, *Could* = 2. **Une étoile livrée = 25 gamers** | Fun variable par carte |
| **Équipe** | Chef de projet, designer, programmeur : **3 jetons chacun par cycle (15 sur la partie) : 2 jetons Heure et 1 jeton Prod**, et une **fiche de rôle** A5 chacun. **Seul le jeton Prod produit un effort** : un humain produit donc 1 effort par cycle, 2 au cycle 0 (« l'élan du lancement ») et au cycle 4 (« le sprint final »), où chacun a 2 jetons Prod et 1 jeton Heure. 20 tokens IA pour la partie | 4e rôle |
| **Matériel** | **6 jetons Heure et 6 jetons Prod** (3 posés par joueur à chaque cycle, sur la station où l'on agit), **15 pions Effort** (posés sur les cases grises des cartes Fonctionnalité), **3 marqueurs** (tokens, note, cycle) | — |
| **Agents** | **PIX** (jusqu'à 3 efforts par cycle ; un prompt couvre une fonctionnalité entière ; les efforts en trop attendent) et **SCAN** (jusqu'à 4 tests par cycle), 1 token par action | ARTY |
| **Aiguillages** | Deux décisions de pilotage dessinées sur l'orbite. **À la sortie du Backlog : qui produit ?** PIX (le ticket s'arrête au Prompt) ou le responsable (le ticket saute le Prompt et va au Build). **À la sortie du Test, un problème trouvé : corriger ou publier ?** Corriger : 1 heure du responsable, le ticket recule au Build, l'effort fautif est refait (sans heure libre, il attend le cycle suivant) ; publier quand même : l'effet s'applique à la Release | Renvoi à PIX pour corriger |
| **Cartes Test** | **Un seul paquet de 20 cartes** : 12 OK, **2 Bug bloquants, 3 Bug mineurs**, 3 Pas fun. Prompt simple = 1 carte ; prompt détaillé = **2 cartes, on garde la meilleure**. Trois vérifications : **SCAN** (1 token, trouve les Bug), **code review** du programmeur, garant du code (1 heure, trouve tout), **playtest** du designer (1 heure, trouve les Pas fun). Bug bloquant publié : 0 étoile et −0,5 de note ; bug mineur publié : −0,5 de note ; Pas fun publié : −1 étoile. **Corriger** : 1 heure du responsable, jamais PIX ; le ticket recule au Build | Crash, dette technique, faille de sécurité ; renvoi à PIX |
| **Feedback** | 24 cartes tirées des **vrais playtests de SpacePlan**, anonymes (la voix de la communauté) ; 1 carte à chaque nouveau palier de 100 gamers ; à trier par le chef de projet. **Une seule règle** : la carte va sur la fonctionnalité citée ; si elle est déjà live, un **ticket correctif** (1 effort) part de la Communauté vers le Backlog et refait le chemin, la fonctionnalité restant live ; livrée, **la note monte de 0,5**. Plus de 4 cartes non triées à la release : −0,5 | Agent de tri |
| **Événements** | Un par cycle, ordre fixe (E1 à E4), sans choix de résolution. E1 n'apporte du feedback que si le jeu a des gamers | Résolutions et bonus ; **se préparer à l'événement annoncé** (1 heure, annule son effet), à tester au simulateur |
| **Cycle 0** | Libre : les équipes choisissent quoi produire, **sans carte Test ni coût en tokens**, sans événement ni feedback. « L'élan du lancement » : chaque humain a 2 jetons Prod | — |
| **Score** | **Gamers × note.** Gamers = étoiles publiées × 25, recalculés à chaque release. Note sur 5, départ à 3, **entre 1 et 5** : −0,5 par bug publié et si le feedback s'accumule, +0,5 par carte Feedback livrée. 0 gamer = 0 point | Bonus d'étapes et d'événements, pénalités |
| **Temps** | Cycles chronométrés : **25 min au cycle 0** (on y apprend les règles en jouant), **puis 20 min**. À la sonnerie, release avec ce qui est prêt | — |
| **Vocabulaire** | Les mots du métier sont en anglais, exprès, et expliqués dans les règles : **Brief, Planning, Build, Test, Release, Review** (les 6 temps du cycle), **prompt**, **bug** (bloquant ou mineur), **feedback**, **backlog**, **MVP**, **code review**, **playtest**, **ticket** (une fonctionnalité en route sur l'orbite), **ticket correctif**. Les unités sont en français et concrètes : **effort** (le travail d'une fonctionnalité), **heure** (le temps d'un joueur), **jeton Prod** (l'heure qui produit), **token IA** (le budget des agents), **étoile** (25 gamers), **gamer** (un joueur du jeu vidéo Star Squadron ; les étudiants sont les joueurs d'Helioso Orbit) | Glossaire bilingue dans le jeu numérique |
| **Release** | L'équipe joue vraiment à son jeu : la version de SpacePlan qui correspond à ce qu'elle a livré (voir section 12) | Activation fine fonctionnalité par fonctionnalité |

---

## 1. Vision

### Le pitch en une phrase

**Trois étudiants dirigent un petit studio de jeu vidéo qui travaille avec des agents IA, et doivent sortir un jeu au festival avant les studios concurrents. Ils découvrent qu'avec l'IA, la vraie difficulté n'est plus de produire, mais de décider et de vérifier.**

### L'intention pédagogique

**La grande leçon :** avec des agents IA, le goulot d'étranglement passe de la **production** à la **décision et à la vérification**. Les agents produisent beaucoup et vite. L'équipe humaine devient la ressource rare : elle écrit les briefs, relit, juge si c'est fun, trie les retours, arbitre.

**Les 7 leçons secondaires, à faire émerger au débrief :**
1. **La qualité du brief fait la qualité de l'agent.** Un brief bâclé coûte plus cher plus tard.
2. **Un agent testeur trouve les bugs, pas l'ennui.** Le jugement « est-ce que c'est fun ? » reste humain.
3. **Ajouter des agents n'accélère pas toujours.** Plus de production = plus de relecture = plus d'embouteillage (une loi de Brooks version IA).
4. **Livrer petit et souvent** bat livrer gros et tard. Mais plus le jeu a de gamers, plus il y a de feedback à trier : le succès crée sa propre charge.
5. **Ce qui n'est pas vérifié finit en dette** : bugs cachés, dette technique, failles de sécurité.
6. **Le nécessaire avant le séduisant.** Tant que le jeu n'est pas jouable, il n'a pas de gamers : les fonctionnalités qui rapportent le plus ne servent à rien sans les essentielles.
7. **Gérer un risque, c'est choisir sa réponse.** Face à un risque, on peut l'**éviter** (faire produire par un humain), le **réduire** (un brief détaillé), le **détecter** avant qu'il ne frappe (SCAN, relecture, playtest) ou l'**accepter** en connaissance de cause (publier sans vérifier, garder des tokens en réserve). La simulation le montre : la malchance coûte 37 % du score à une équipe qui ne vérifie rien, moins de 6 % à une équipe qui gère ses risques.

**Comment la gestion des risques est rendue visible :** à chaque cycle, l'équipe écrit sur sa feuille de score **son risque du cycle et sa parade** (30 secondes), puis note s'il est arrivé. Au débrief, elle classe ses propres décisions dans les 4 réponses au risque (feuille de débrief du livret).

### Les piliers de design

1. **Le goulot se voit.** Le plateau montre où le travail s'entasse, sans explication.
2. **Chaque hasard se maîtrise par une décision qui coûte.**
3. **La pression monte.** Les cycles raccourcissent, les événements se durcissent.
4. **Le débrief est le cœur de la session.** Tout le jeu sert à le préparer.
5. **Ça marche partout** : en salle, avec ou sans réseau, et même sur papier.

---

## 2. Public et contexte de jeu

- **Publics :** écoles d'ingénieurs, BUT Informatique et MMI (en priorité l'IUT de Sénart-Fontainebleau, site de Fontainebleau).
- **Format :** une session de 3 h en salle, animée.
- **Joueurs :** des équipes de 3 (ou 4) ; jusqu'à 10 équipes pour une promo de 30.
- **Animateur :** obligatoire. Il pilote le rythme et joue l'éditeur et la communauté.

---

## 3. Benchmarks

| Jeu de référence | Ce qu'il fait bien | Ce qu'on en reprend |
|---|---|---|
| **getKanban** (jeu de plateau Kanban) | Un tableau physique, des cartes de travail qui avancent de colonne en colonne, des cartes événements, des métriques de flux. Sessions de 3 à 4 h avec un débrief à la fin. | Le **flux visible** des tâches, les **cartes événements**, les **indicateurs** (délai, travail en cours) |
| **The Phoenix Project** (simulation DevOps de GamingWorks) | Chaque participant a un rôle précis ; quatre manches de complexité croissante ; des demandes imprévues du « business ». | Des **manches qui montent en tension**, des rôles avec de vraies responsabilités, un **commanditaire** joué par l'animateur |
| **Beer Game** (MIT, chaîne logistique) | Une **carte du flux** (commandes, production, livraisons) qui sert de plateau ; des règles simples, une forte charge émotionnelle, et un débrief qui montre que c'est le **système** qui crée les problèmes. | Le **plateau-carte du flux**, adapté au cycle d'itération ; un **débrief centré sur le système** |
| **Fresques** (Climat, Numérique, IA) | Des cartes, un atelier de 2 à 3 h en groupe, des animateurs formés qui démultiplient l'atelier. | Le **format de 3 h**, le matériel en cartes, l'objectif de **certifier des animateurs** plus tard (brique C) |
| **SpacePlan** (mon jeu) | Les phases d'un projet de jeu vidéo : conception, pré-production, production, finalisation. | Les phases deviennent les **actes du récit**, et la production devient une **boucle agile** |
| **Jeux de gestion de studio** (style « tycoon ») | Le plaisir de voir son studio grandir et son jeu gagner des gamers. | Le **score en gamers** et la fierté de « son » jeu |

**Jeux proches, à étudier (repérés le 26 nov. 2026) :**
- **Backstage Game** : un serious game pour apprendre la conduite de projet avec les codes du jeu vidéo. C'est le plus proche de notre univers.
- **Le Jeu de l'IA** (AI4Better) : un serious game sur les fondamentaux de l'IA, adopté par la RATP, avec une version numérique. **À suivre de près** pour y repérer des idées à reprendre (format, cartes, déploiement en entreprise).
- **Simultrain** : un simulateur de gestion de projet utilisé en formation professionnelle. Testé : ancien et peu convaincant, pas une référence.

**La différence avec tous ces jeux :** aucun ne met en scène la relation entre humains et agents IA.

**Piste :** je connais personnellement la personne qui anime le Beer Game. Lui faire tester le prototype papier et lui demander un avis sur le débrief.

---

## 4. Le narratif *(ton et personnages validés le 26 nov. 2026)*

### L'univers et le ton

- **Le cadre :** aujourd'hui, dans un petit studio indépendant. Le spatial est dans le jeu qu'on développe (« Star Squadron ») et dans le plateau (l'orbite), pas dans le monde réel des personnages.
- **Le ton :** léger et complice, avec de l'humour, sans tomber dans la caricature. Les agents IA sont brillants et un peu trop sûrs d'eux. L'éditeur est exigeant mais pas méchant. La communauté est enthousiaste et impitoyable.
- **Ce que le récit doit faire ressentir :** l'excitation de livrer, la panique de la release qui crashe, la fierté d'arriver au festival.

### Le pitch narratif

Trois amis, **Nora, Sam et Max**, viennent de fonder **Orbital Studio** dans un petit local. Leur projet : **« Star Squadron »**, un shoot'em up spatial rétro. Un éditeur, **Nebulous Publishing**, a accepté de leur verser une avance. Le studio est équipé de deux agents IA, mais avec un budget de tokens limité. Dans 8 semaines, il y a le **Festival du jeu indépendant**. Nebulous Publishing ne signera le contrat complet qu'avec **un seul studio** : celui qui fera la meilleure impression au festival. Les autres studios de la salle visent le même contrat.

### Les personnages non joueurs

**Chez l'éditeur**
- **Vera, productrice chez Nebulous Publishing.** Elle a parié sur les studios de la salle. Elle envoie les missions, change parfois d'avis, et rappelle les échéances. Elle s'exprime par des messages courts, lus par l'animateur au début de chaque cycle.

**Les agents IA (ils ont une personnalité)**
- **PIX, l'agent codeur.** Rapide, enthousiaste, toujours sûr d'avoir réussi (« Terminé ! Tout fonctionne parfaitement. »), même quand ce n'est pas vrai.
- **SCAN, l'agent testeur.** Méthodique et pointilleux. Il signale les bugs avec précision, mais il ne comprend pas ce qu'est le fun (« Aucun défaut détecté. Le gamer meurt en 4 secondes, conformément au code. »).
- **ARTY, l'agent artiste** (débloqué au cycle 2). Il produit des visuels superbes, mais pas toujours dans le même style.

**L'équipe du studio (les visages des rôles joués par les étudiants)**
- **Nora, la cheffe de projet** : elle tient le Backlog, écrit les prompts et trie le feedback.
- **Sam, le designer** : il veut que le jeu soit compris en 10 secondes et amusant tout de suite.
- **Max, le programmeur** : il veut que ça marche, et il repère chaque bug.

Les étudiants jouent ces rôles ; les visages rendent l'équipe vivante sur le plateau numérique. Le rôle compte plus que le personnage : chaque étudiant peut jouer n'importe quel rôle.

**La communauté** n'a pas de visage : ses cartes Feedback sont **anonymes**, comme les retours qu'un studio lit sur un forum ou une boutique en ligne.

### Les portraits *(décidé le 26 nov. 2026)*

Les personnages ont un portrait en pixel art (fichiers dans `assets/personnages/`) : Vera, les agents, et les trois fondateurs du studio, visages des rôles des joueurs.

| Personnage | Portrait | Origine |
|---|---|---|
| **Vera** | Kira | Portraits de HLC (SpacePlan), générés par IA |
| **Nora** (cheffe de projet) | Jessica | idem |
| **Sam** (designer) | Luke | idem |
| **Max** (programmeur) | Ben | idem |
| **PIX** | Robot K6, orange, avec des lunettes de geek et `</>` sur le ventre | Redessiné à partir de K6, créé par Hugo pour SpacePlan : droits acquis |
| **SCAN** | Robot K6, cyan, avec des lunettes de vision nocturne à trois lentilles et un code-barres | idem |
| *En réserve* | Bill | Pour un futur personnage (l'investisseur de l'événement E3 ?) |

**À faire avant la diffusion :** une passe de retouche sur les portraits humains (PIX et SCAN viennent de K6, qui nous appartient), pour qu'ils soient uniques et issus de nos propres générations (voir le backlog dans `docs/pilotage/plan-sprints-2027.md`).

### Les temps forts du récit, cycle par cycle

| Acte | Cycle | Message de Vera (début du cycle) | Ce qui se joue |
|---|---|---|---|
| **1. Le pitch** | 0 | « Je cherche un jeu en pixel art, dans l'esprit de Space Invaders. Le reste, c'est votre jeu. Avant de signer, montrez-moi un premier jouable. » | Retrouver les 5 *Must* parmi les 12 idées de départ (ce qui rend ce jeu jouable) : sans eux, 0 gamer |
| **2. L'accès anticipé** | 1 | « Les premiers gamers arrivent. Écoutez-les. » | Le premier feedback, la première release |
| | 2 | « Bonne nouvelle : vous pouvez recruter ARTY. À vous de voir. » | Faut-il un agent de plus ? |
| | 3 | « Changement de plan : je veux un mode 2 joueurs pour le festival. » (ou une crise technique) | La crise |
| **3. Le festival** | 4 | « Une streameuse célèbre va jouer à votre jeu en direct. Pas de crash. » | La dernière release, sous pression |
| **4. Le post-mortem** | — | Vera annonce le studio retenu | Le débrief |

### Les fins possibles (lues par l'animateur)

- **Le contrat :** le studio en tête du leaderboard signe avec Nebulous Publishing.
- **Le sursis :** les studios qui atteignent l'objectif du festival (500 gamers et une note d'au moins 4) reçoivent une proposition de suivi.
- **La fermeture :** les autres repartent avec un post-mortem, et c'est très bien, car c'est le meilleur moment pour apprendre.

### La langue des textes

- **Pilote en français.** Tous les textes (cartes, messages de Vera, règles, guide d'animation) sont écrits d'abord en français.
- **Conçus pour l'anglais dès le départ :** phrases courtes, pas de jeux de mots intraduisibles dans les règles (l'humour reste dans les phrases d'ambiance, qu'on adaptera plutôt que traduire), noms de personnages identiques dans les deux langues.
- **Dans le jeu numérique :** chaque texte a une clé et une version par langue dans le fichier du scénario (par exemple `fr` et `en`), pour ajouter l'anglais sans toucher au code.

### Le texte d'ambiance des cartes

Chaque carte porte une phrase d'ambiance courte, qui fait sourire et rappelle la leçon.

**Qui parle (règle de l'humour, 27 nov. 2026) :** une phrase ne fait parler qu'un personnage qui est vraiment en train d'agir à ce moment-là. Sinon, l'humour embrouille. Les **cartes Test sont neutres** : elles peuvent être révélées par SCAN, par un humain ou par les gamers, donc aucun personnage n'y parle ; elles décrivent ce qu'on voit à l'écran. Les personnages parlent dans **leur bulle**, et seulement de leur propre travail (PIX qui proteste quand on révèle un bug dans son code, SCAN qui annonce le résultat de son test).

Exemples :
- *Carte Test « Bug » :* « Le vaisseau traverse les aliens. Comme un fantôme. »
- *Carte Test « Pas fun » :* « Tout fonctionne. Le gamer ferme le jeu au bout de 30 secondes. »
- *Carte défaut « Faille de sécurité » :* « Une clé d'API traîne dans le code publié. Quelqu'un l'a déjà trouvée. »
- *Carte feedback :* « "Le boss est trop facile. Vous l'avez testé ?" »

---

## 5. L'équipe

### Les joueurs (3 étudiants par équipe)

| Rôle | Mission | Capacité par cycle |
|---|---|---|
| **Chef(fe) de projet** | Trie le feedback, choisit quoi faire dans le backlog, gère les tokens IA, décide de la release. | 3 points d'action (PA) |
| **Designer** | Écrit les briefs de design, juge le fun, décide des corrections de gameplay. | 3 PA |
| **Programmeur(se)** | Code les parties délicates, **relit le code des agents**, corrige les défauts. | 3 PA |

*Pour des équipes de 4 : un 4e rôle « Producteur(rice) qualité » qui fait les playtests et aide au tri du feedback.*

### Les agents IA (des cartes, pas des joueurs)

| Agent | Forces | Limites |
|---|---|---|
| **PIX, agent codeur** | Produit 3 blocs de code par cycle (un humain en produit 1). Coûte 1 token IA par bloc. | Chaque bloc cache une **carte défaut** tirée face cachée. Plus le brief est mauvais, plus le risque est élevé. Au-delà de 3 blocs par cycle, les briefs **attendent**. |
| **SCAN, agent testeur** | Teste 4 blocs par cycle et révèle les défauts techniques (bug, crash). Coûte 1 token par test. | **Ne détecte jamais un défaut « pas fun »** ni la dette technique. Rate parfois une faille. |
| **ARTY, agent artiste** *(débloqué au cycle 2)* | Produit graphismes et sons (2 blocs par cycle). | Visuels génériques (défaut « style incohérent »), risque de droits sur les assets. |

**Principe clé :** les agents ne jouent pas seuls, ils **consomment de l'attention humaine** : un brief (1 ou 2 PA) avant, une relecture (1 PA par bloc) après.

---

## 6. Le plateau : l'orbite d'itération

*Voir le Whiteboard pour la version de travail.*

**L'idée :** comme la carte du Beer Game montre le flux des commandes, de la production et des livraisons, notre plateau montre **le cycle d'itération, les acteurs et les flux**. Mais le flux tourne **en boucle** : c'est une orbite. L'agilité devient visible.

### Les zones

1. **L'orbite d'itération.** Six stations en boucle : **Backlog → Prompt → Build → Test → Release → Feedback**, puis retour au Backlog. Les cartes Fonctionnalité (des tickets) vivent dans **trois zones** : les **Idées** (à gauche, hors de l'orbite : pas encore choisies, en petites tuiles ; les idées de gamers y apparaissent, avec un **talon ambre**), le **Backlog** (une colonne à côté de la station Backlog : choisies, par ordre de priorité, **5 places au plus**, ce qui force l'équipe à prioriser ; c'est le **zoom de la planète Backlog** : même contour, et un cône qui s'ouvre de la planète vers la boîte ; **un clic sur la planète ouvre ou ferme** les Idées et le Backlog, pour alléger le plateau) et le **couloir du cycle** (un anneau entre l'orbite et le soleil, où les tickets compacts avancent de station en station). On passe d'une zone à l'autre par **glisser-déposer** : Idées ↔ Backlog dans les deux sens (on peut changer d'avis et réordonner le Backlog), puis Backlog → cycle, sans retour possible. Leur **barre d'effort** a une case de taille fixe par effort : 1 effort = 1 unité de travail, payée **1 heure** par un humain (case ambre) ou **1 token** par PIX (case cyan). Le talon du ticket porte la **lettre du responsable** (P pour Prog, D pour Design et Art) : c'est lui qui la produit, relit le travail de PIX et corrige. À ne pas confondre avec les 6 **temps** du cycle (Brief, Planning, Build, Test, Release, Review) : la station active s'illumine pendant le temps qui lui correspond.
   **Deux aiguillages et deux boucles de retour** (GDD 0.21) : à la sortie du Backlog, le couloir se sépare en deux voies (par le Prompt pour PIX ; directement au Build pour le responsable). À la sortie du Test, un ticket avec un problème trouvé recule au Build par une flèche rouge, ou part à la Release « quand même ». Une carte Feedback sur une fonctionnalité live renvoie un **ticket correctif** de la Communauté vers le Backlog, et la fonctionnalité est marquée dans « Fonctionnalités live » (« bug signalé » ou « amélioration demandée »). Chaque ticket montre ce qu'il attend : ⚒ (le jeton Prod d'un humain), PIX, ou une loupe (une vérification).
2. **Le poste de pilotage (au centre).** Les 3 humains (chef de projet, designer, programmeur), chacun avec son visage et ses 3 jetons (2 jetons Heure et 1 jeton Prod, avec un marteau). Un jeton utilisé se pose sur la station où l'on agit, **avec la lettre de son propriétaire** (**CP** chef de projet, **D** designer, **P** programmeur, comme dans SpacePlan) : on voit où chacun passe son temps, et qui sature. Les heures restent **personnelles** (pas de temps commun) et **de la même couleur pour tous** (ambre) : c'est la lettre qui dit à qui elles sont. Au pilotage et au tableau de bord, chaque visage porte sa lettre. **L'équipe nourrit le Backlog** : une flèche « Idées » part du pilotage vers le Backlog.
3. **Les satellites.** Les agents IA, posés sur la station où ils travaillent : PIX et ARTY sur Build (ARTY reste verrouillé jusqu'au cycle 2), SCAN sur Test.
4. **Les planètes extérieures.** **Nebulous Publishing**, l'éditeur (Vera), **commande un jeu pour le festival** : il ne dit ni quel jeu faire, ni quelles fonctionnalités. **Le jeu et ses idées viennent de l'équipe** (pas de flèche de l'éditeur vers les Idées). Vera intervient par ses messages et les cartes Événement. **La communauté** reçoit les releases et renvoie le feedback.
5. **Les pistes autour du plateau.** Le temps (cycles 0 à 4, puis le festival), le carburant (tokens IA), le score et la note.

### Les trois goulots (les files d'attente orange)

Les petits blocs orange sont des **files d'attente**. Il y en a trois, de taille croissante :

| Où | Pourquoi ça bloque | Taille attendue |
|---|---|---|
| **Entre Prompt et Build** | Les idées s'enchaînent vite, mais PIX ne fait que 3 efforts par cycle : même si c'est rapide, les prompts attendent. | Petite |
| **Entre Build et Test** | Les agents produisent plus que les humains ne peuvent relire. | Moyenne |
| **Entre Feedback et Backlog** | Chaque release apporte des retours, de plus en plus nombreux à mesure que le jeu gagne des gamers. Il faut les lire, les trier et décider, et ça ne peut être fait que par des humains. | **La plus grande : le goulot principal** |

**Ce que le plateau doit faire voir d'un coup d'œil :** au fil de la partie, c'est la file **Feedback → Backlog** qui grossit le plus. Le goulot principal est la **décision**, pas la production.

**En version papier :** un plateau A2, des cartes, des figurines et des jetons. **En version numérique :** le même plan, animé (les tickets qui avancent, les files d'attente qui grossissent en orbite), avec un tableau de bord : le studio (Orbital Studio, en petit), puis **le jeu vidéo Star Squadron en grand, avec son logo et son MVP**, ses **gamers** et sa note, le score, les heures de l'équipe, les tokens IA et les anneaux de boucles. Sur le plateau numérique, les joueurs de Star Squadron s'appellent **gamers**, pour ne pas les confondre avec les étudiants qui jouent à Helioso Orbit. **Les pioches sont sur le plateau**, à droite entre ARTY et SCAN : trois paquets virtuels (Événements, Feedback, Test). **Chaque carte Feedback a un petit schéma** (un écran de jeu dans le style des prototypes de SpacePlan : vaisseau en triangle, aliens en cercles, tirs en points, boîte de collision en carré, souhait du gamer en pointillés cyan), parce qu'un schéma explique mieux qu'une phrase sur une petite carte. La carte piochée vole au centre, se retourne et part à sa place : une carte Feedback rejoint la file Feedback → Backlog, un événement se pose à côté de Vera, une carte Test **reste face cachée** sous l'effort que PIX vient de faire (1 token) ; un clic sur une carte Test cachée la retourne (OK, Bug, Pas fun). Prototype en cours : `game/plateau/` (voir `docs/jeu/spec-prototype-plateau.md`).

### Le style visuel

Détail complet dans `docs/jeu/direction-artistique.md`.
- **Palette HLC v2.0** : bleu nuit `#0D2329`, sarcelle `#23C2AA`, cyan `#0AE2EA`, ambre `#FBAB00`, gris sauge `#B9CAC9`, plus un rouge corail pour les défauts.
- **Deux thèmes numériques** : clair par défaut (salles éclairées, tablettes, cohérence avec le papier) et sombre « Tech » (écrans, préférence des étudiants), au choix à tout moment.
- **Kit papier** en style flat, sur le thème clair : aplats, contours épais bleu nuit.
- **Le pilotage est un soleil ambre** au centre, les six stations sont des planètes en orbite.

---

## 7. La boucle de jeu : un cycle (environ 20 à 30 minutes)

1. **Message de Vera et événement (3 min).** L'animateur lit le message de Vera, tire la carte événement (dont le type était annoncé) et annonce le type du prochain.
2. **Arrivée et tri du feedback (4 min).** Des cartes feedback arrivent dans la file Feedback → Backlog : **1 carte pour 100 gamers**. Le chef de projet trie (1 PA pour 2 cartes) : chaque carte triée devient une tâche du Backlog ou est écartée. **Un feedback ignoré trop longtemps fait baisser la note** (« la communauté se sent ignorée »).
3. **Planification (4 min).** Le chef de projet choisit les tâches du cycle dans le Backlog. L'équipe décide qui fait quoi : humain ou agent.
4. **Briefs (4 min).** Pour chaque tâche donnée à un agent : un brief simple (1 PA) ou détaillé (2 PA). Les briefs au-delà de la capacité de PIX attendent dans la file Brief → Production.
5. **Production (4 min).** Les agents produisent : on pose une carte défaut face cachée sur chaque bloc. Les humains produisent moins, mais sans défaut caché.
6. **Test et relecture (4 min).** SCAN retourne les défauts techniques qu'il trouve. Le programmeur peut relire (1 PA par bloc) pour révéler tout défaut. Le designer peut faire un playtest (1 PA) pour repérer un « pas fun ». Ce qui n'est pas relu reste dans la file Production → Test.
7. **Release (3 min).** L'équipe choisit ce qu'elle publie. Les défauts encore cachés sont révélés **à ce moment-là, devant les gamers**. On calcule le score du cycle et l'animateur met à jour le **leaderboard**.
8. **Mini-rétro (2 min).** Une question : « Qu'est-ce qu'on change au prochain cycle ? »

**Piste pour plus tard :** un agent de tri du feedback, qui résume vite les retours mais rate les nuances (il range une remarque importante avec les autres).

---

## 8. Hasard et stratégie

**Règle de conception :** le hasard est toujours maîtrisable par une décision qui coûte quelque chose.

| Source de hasard | Comment la maîtriser (stratégie) | Ce que ça coûte |
|---|---|---|
| **Cartes défaut** sur les blocs produits par les agents | Écrire un brief détaillé pour tirer dans le paquet à faible risque | 1 PA de plus |
| | Relire le code pour révéler les défauts avant la release | 1 PA par bloc |
| | Faire produire par un humain (aucun défaut caché) | Production 3 fois plus lente |
| **Cartes événements** | Vera annonce **le type** d'événement du cycle suivant : on peut s'y préparer | Garder du temps ou des tokens en réserve |
| **Cartes feedback** | Trier tôt, pour ne pas laisser monter la frustration | Des PA du chef de projet |
| | Faire un playtest avant la release pour anticiper le « pas fun » | 1 PA du designer |

**Les grandes décisions stratégiques de la partie :**
- Quelles fonctionnalités prendre, et dans quel ordre (Fun élevé mais grosses, ou petites et sûres) ?
- Qui fait quoi : humain ou agent ?
- Recruter ARTY au cycle 2, ou pas ?
- Quel feedback traiter, lequel écarter ?
- Quoi publier à chaque release, et quoi garder pour le cycle suivant ?
- Comment dépenser les 20 tokens IA sur 4 cycles ?

---

## 9. Compétition et leaderboard

Toutes les équipes jouent le même scénario en parallèle, **sans interaction directe entre les équipes dans la v0**. La compétition passe par le **leaderboard**, mis à jour après chaque release.

### Le score

*En règles de base (section 0) : **score = gamers × note**, et les gamers sont recalculés à chaque release (ils ne s'additionnent pas). Le barème complet ci-dessous (version 0.3) sera revu quand on ajoutera les modules.*

**Score = Gamers + (Note × 100) + Bonus d'étapes − Pénalités**

| Élément | Points |
|---|---|
| **Gamers** | Somme des valeurs Fun livrées × 25 à chaque release, cumulée sur la partie |
| **Note** (sur 5, départ à 3) | × 100 au score. +0,5 pour une release sans aucun défaut visible, −0,5 par crash visible, −0,5 si plus de 4 cartes feedback attendent depuis plus d'un cycle |
| **Bonus d'étape : premier jouable** | +50 si les 3 fonctionnalités du cycle 0 sont livrées sans crash |
| **Bonus d'étape : événement bien résolu** | +30 à +80 selon la carte événement (chaque carte indique sa meilleure résolution) |
| **Bonus d'étape : objectif du festival** | +200 si 500 gamers et une note d'au moins 4 sont atteints |
| **Bonus de gestion** | +5 par token IA restant à la fin |
| **Pénalité : faille de sécurité publiée** | −150 |
| **Pénalité : dette technique non traitée à la fin** | −20 par carte |

### La feuille de score du jeu numérique (idée, à concevoir au N1)

Sur papier, la feuille de score reste simple. **Dans le jeu numérique, elle doit devenir un vrai moment de jeu**, moderne et gamifié :
- un **score global** bien visible, avec son évolution cycle par cycle ;
- de l'**XP** gagnée par les bonnes pratiques (un brief détaillé, une relecture, un feedback trié, une release sans défaut), qui fait monter le **niveau du studio** ;
- des **badges** liés aux leçons du jeu (par exemple « Premier jouable au cycle 0 », « Zéro bug au festival », « Inbox zéro » pour le feedback), en lien avec les badges et l'arbre de compétences de SpacePlan ;
- au débrief, un récapitulatif par équipe qui sert de support à la discussion.

**Point de vigilance (à surveiller pendant les tests) :** une équipe ne doit pas pouvoir gagner en déléguant tout aux agents sans rien relire, ni en ignorant le feedback. Le barème doit rendre ces stratégies perdantes. Le leaderboard reste à affiner après les premières parties.

---

## 10. Le matériel (prototype papier)

- **Le plateau A2 de l'orbite d'itération**, un par équipe, avec les trois zones de files d'attente marquées.
- **12 cartes fonctionnalités**, chacune avec une valeur **Fun** (1 à 5) et une **taille** en blocs (1 à 4). Par exemple : vaisseau qui se déplace, tir, vague d'ennemis, collisions et score, écran titre, sons, bonus, boss, niveaux 2 et 3, classement en ligne, mode 2 joueurs, options d'accessibilité.
- **Des cartes défaut**, tirées face cachée pour chaque bloc produit par un agent : *aucun défaut*, *bug mineur*, *crash*, *pas fun*, *dette technique* (le prochain bloc lié coûte +1), *faille de sécurité* (rare, catastrophique si elle part en release). Deux paquets : briefs simples (risque élevé) et briefs détaillés (risque faible).
- **Environ 30 cartes feedback** anonymes : idée de fonctionnalité, signalement de bug, plainte « pas fun », compliment.
- **8 cartes événements**, avec une tension qui monte, chacune avec sa meilleure résolution et son bonus.
- **Des figurines** pour les 3 humains et les 3 agents.
- **Des jetons** : points d'action et tokens IA.
- **Une feuille de score** par équipe et **un leaderboard** au tableau pour l'animateur.

---

## 11. La session de 3 heures

| Horaire | Séquence | Contenu |
|---|---|---|
| **0:00 – 0:15** | Accueil et récit | Message de Vera, objectif du festival, constitution des studios concurrents |
| **0:15 – 0:30** | Règles et matériel | Rôles, plateau de l'orbite, cartes, exemple d'un tour |
| **0:30 – 0:50** | **Acte 1 : cycle 0, le pitch** | Message de Vera ; les équipes retrouvent les 5 *Must* parmi les 12 cartes de départ et les produisent. Sans défauts, sans tokens, sans événement |
| **0:50 – 1:20** | **Cycle 1** (30 min) | Premiers gamers, premier feedback. Premier leaderboard |
| **1:20 – 1:45** | **Cycle 2** (25 min) | ARTY peut être recruté. Événement : mise à jour du modèle de PIX (+1 bloc, mais ses défauts changent) |
| **1:45 – 1:55** | Pause | |
| **1:55 – 2:15** | **Cycle 3, la crise** (20 min) | Vera exige un mode 2 joueurs, ou une clé d'API se retrouve dans le code publié |
| **2:15 – 2:30** | **Acte 3 : cycle 4, le festival** (15 min) | Une streameuse célèbre joue en direct : chaque crash compte double. Leaderboard final et annonce du studio retenu |
| **2:30 – 3:00** | **Acte 4 : post-mortem** (30 min) | Le débrief |

**Le rythme est voulu :** les cycles raccourcissent (30, 25, 20, puis 15 minutes) pendant que les événements se durcissent et que le feedback s'accumule.

### Le débrief en 4 temps (30 min)

1. **Ressenti (5 min) :** « En un mot, comment vous êtes-vous senti au cycle 3 ? »
2. **Ce qui s'est passé (10 min) :** on regarde les plateaux et le leaderboard. Quelle file d'attente a le plus grossi ? En principe, Feedback → Backlog, puis Build → Test.
3. **Les leçons (10 min) :** les équipes formulent les leçons à partir de leurs propres décisions, et classent leurs décisions dans les **4 réponses au risque** (éviter, réduire, détecter, accepter). On relit les « risques du cycle » : lesquels étaient vus venir ?
4. **Transfert au réel (5 min) :** « Dans votre prochain projet, quelle règle allez-vous appliquer ? »

---

## 12. Technique : multijoueur et hors ligne

### Les exigences

| Exigence | Conséquence sur le design |
|---|---|
| **Les équipes avancent au même rythme** | Tour par tour **piloté par l'animateur** : c'est lui qui fait passer tout le monde à la phase suivante. Pas d'action en temps réel. |
| **Le leaderboard doit être juste** | Les tirages et le calcul du score sont faits **à un seul endroit** (serveur ou écran de l'animateur). |
| **Le débrief a besoin de l'historique** | Chaque décision est enregistrée dans un **journal de partie**. |
| **Jouable hors ligne (obligatoire)** | Voir ci-dessous. |
| **Pas de données personnelles** | Des noms de studios, pas de comptes étudiants. |
| **L'animateur voit tout** | Un écran animateur projeté : phase, chrono, événements, leaderboard, état de chaque équipe. |

### Le jeu hors ligne : trois niveaux de repli

Une session ne doit **jamais** s'arrêter à cause du réseau.
1. **En ligne (N2)** : tout est synchronisé.
2. **Réseau coupé** : chaque poste d'équipe continue seul (le jeu est chargé à l'avance et garde son état en local). L'animateur passe en saisie manuelle du leaderboard. La synchronisation reprend au retour du réseau.
3. **Plus de matériel** : on termine la partie sur le plateau papier. Le kit papier est **toujours** dans le sac de l'animateur.

### Les niveaux d'architecture

| Niveau | Comment ça marche | Serveur ? | Quand |
|---|---|---|---|
| **N0 : papier + leaderboard** | Les équipes jouent sur plateau papier. L'animateur saisit les scores dans une petite page web projetée (qui marche hors ligne). | Non | Tests de janvier (S2) |
| **N1 : un écran par équipe, sans synchronisation** | Chaque équipe a son plateau numérique animé, qui marche hors ligne. À la fin de chaque cycle, l'animateur saisit les scores. | Non | Prototype web v0 (S3) |
| **N2 : multijoueur synchronisé** | L'animateur crée une partie avec un code. Les équipes la rejoignent. Les phases, les tirages et les scores sont centralisés. Repli automatique en N1 si le réseau tombe. | Oui, léger (Firebase) | Après le pilote (été 2027) |

**Les règles techniques dès le N1 :**
- Le jeu est une **machine à états** (les phases du cycle), pilotée par une seule source.
- Le scénario est dans un **fichier de configuration** séparé (fonctionnalités, agents, défauts, feedback, événements, barème, textes du récit).
- Chaque décision est écrite dans le **journal de partie**.
- L'application est **installable et utilisable hors ligne** (une application web qui se charge une fois et fonctionne ensuite sans réseau).

### Le jeu SpacePlan joué à chaque release

Le code du mini-jeu SpacePlan (prototype, PoC, alpha, bêta) est repris dans `game/spaceplan-builds/`. À chaque release, l'animateur lance la version la plus proche de ce que l'équipe a livré : prototype après le cycle 0, puis des versions de plus en plus complètes. Le jeu numérique activera plus tard les fonctionnalités une par une, selon les cartes livrées (et montrera les défauts laissés passer).

### Chapitre gratuit et licence

Le dépôt est public, mais l'usage du jeu est sous **licence Helioso** (voir `LICENSE.md`).
- **Chapitre gratuit :** le cycle 0 et le cycle 1, jouables seul, sans code. C'est aussi la démo de prospection.
- **Cadenas (dès le N1) :** la suite du jeu (cycles 2 à 4, événements, leaderboard, écran animateur) se débloque avec un **code de licence** délivré après paiement (facture et bon de commande pour les établissements, Stripe pour les indépendants). Un système simple, comme dans SpacePlan.
- **Open core (avec le N2) :** les contenus payants (scénarios complets, cartes, événements, écran animateur synchronisé) ne sont **pas dans le dépôt public** ; ils sont livrés depuis Firebase aux seules licences valides.

---

## 13. Le plan du prototype

*Aligné sur le plan de sprints (version 8) : **le numérique d'abord** (décision du 26 nov. 2026). Le papier devient une vérification légère des règles et le repli hors ligne.*

| Étape | Quand | Livrable | Ce qu'on vérifie |
|---|---|---|---|
| **1. Règles v0** | Fait (26 nov. 2026) | Ce GDD, la liste complète des cartes, les règles sur une page, le simulateur, le kit papier v1 | Les règles tiennent sur une page recto-verso et la simulation récompense la bonne stratégie |
| **2. Démo animée du plateau** | Début déc. 2026 (en cours) | Scénario scripté de 2 boucles, sans règles (`docs/jeu/spec-prototype-plateau.md`) | Comprend-on le flux sans explication ? A-t-on envie de jouer ? |
| **3. Mini-test papier** | Début déc. 2026 | Cycles 0 et 1 avec 1 ou 2 personnes | Les règles se comprennent-elles ? |
| **4. Moteur de règles (N1, une équipe)** | S1 (4 – 17 janv.) | Les règles de la section 0, mêmes calculs que le simulateur, branchées sur les animations de la démo. Première partie test (cycles 0 et 1) avec 2 ou 3 proches | Le jeu tourne sans calculs à la main |
| **5. Builds SpacePlan** | S2 (18 – 31 janv.) | Builds PoC et Proto, page de lancement « Jouer à votre jeu » (`docs/jeu/builds-spaceplan.md`) | L'équipe joue vraiment au jeu qu'elle a livré |
| **6. Jeu complet** | S3 (1er – 14 févr.) | Cycles 0 à 4, build Alpha, feuille de score gamifiée | Une partie complète tient dans la session de 3 h |
| **7. Démo de prospection** | S4 (15 – 28 févr.) | Plusieurs équipes et leaderboard (N1), vidéo de 2 min | Un enseignant comprend l'intérêt en 2 minutes |
| **8. Multijoueur (N2)** | Été 2027 | Parties avec code, écran animateur synchronisé, repli hors ligne | Une classe de 30 joue sans incident, même avec une coupure réseau |

**Les critères de réussite des parties test** (sur le prototype numérique) :
- Au moins 2 joueurs sur 3 veulent rejouer.
- Au débrief, les joueurs formulent **eux-mêmes** au moins 3 des 7 leçons.
- Un cycle tient en moins de 30 minutes.
- L'équipe qui relit et trie le plus n'est pas pénalisée au leaderboard.

---

## 14. Journal des décisions

| Date | Décision |
|---|---|
| 26 nov. 2026 | Scénario « Studio de jeu » retenu pour le premier prototype |
| 26 nov. 2026 | Équipe : chef de projet, designer, programmeur + agent codeur et agent testeur ; agent artiste à débloquer au cycle 2 |
| 26 nov. 2026 | Les phases de SpacePlan deviennent les actes du récit ; la production tourne en boucle agile |
| 26 nov. 2026 | Hasard et stratégie mélangés : chaque hasard se maîtrise par une décision qui coûte |
| 26 nov. 2026 | Compétition entre équipes avec un leaderboard ; barème à affiner après les tests |
| 26 nov. 2026 | Tour par tour piloté par l'animateur |
| 26 nov. 2026 | Plateau en « orbite d'itération », inspiré de la carte du Beer Game |
| 26 nov. 2026 | Trois files d'attente sur le plateau ; le goulot principal est Feedback → Backlog |
| 26 nov. 2026 | Le jeu doit pouvoir se jouer hors ligne, avec repli sur papier |
| 26 nov. 2026 | Nom : **Helioso Orbit** (gamme de jeux) ; ce scénario s'appelle « Orbit : Studio » ; le studio fictif des joueurs s'appelle **Orbital Studio** |
| 26 nov. 2026 | Dépôt GitHub public sous licence Helioso ; chapitre 1 gratuit, la suite débloquée par un code de licence ; contenus premium hors du dépôt à partir du N2 |
| 26 nov. 2026 | Adresse du jeu en ligne : **orbit.helioso.com** |
| 26 nov. 2026 | Ton léger avec de l'humour ; personnages PIX, SCAN, ARTY, Vera, Max, Sam et Nora validés |
| 26 nov. 2026 | Textes en français pour le pilote, écrits pour être traduits en anglais ; une clé par texte et une version par langue dans le jeu numérique |
| 26 nov. 2026 | Règles de base simplifiées pour le premier prototype (section 0) ; modules ajoutés un par un ensuite |
| 26 nov. 2026 | Les 20 fonctionnalités de la master feature list de SpacePlan (les 2 « demandes de joueurs », classement et combat de boss, viendront plus tard) |
| 26 nov. 2026 | Les insights de playtest de SpacePlan deviennent les cartes Feedback |
| 26 nov. 2026 | Le code du mini-jeu SpacePlan est repris dans le dépôt public `Orbit`, sous licence Helioso |
| 26 nov. 2026 | Direction artistique : palette HLC v2.0 ; style flat pour le papier ; deux thèmes numériques, clair par défaut et sombre « Tech » ; le pilotage est un soleil, les stations des planètes |
| 26 nov. 2026 | **Premier jouable :** 0 joueur tant que les 5 *Must* ne sont pas livrés sans bug. La priorité n'est pas imprimée sur les cartes et les fonctionnalités sont renumérotées par catégorie : la priorisation devient le premier exercice du jeu |
| 26 nov. 2026 | Cycle 0 libre (et non plus guidé), sans carte Défaut ni coût en tokens |
| 26 nov. 2026 | **Score = joueurs × note** (note sur 5, départ à 3) : un jeu sans joueurs vaut 0 point, et la note pèse proportionnellement à l'audience |
| 26 nov. 2026 | Portraits en pixel art : Vera (Jessica), Max (Ben ; anciennement Lou, renommé pour fonctionner aussi en anglais), Sam (Luke), Nora (Kira) ; PIX et SCAN redessinés à partir du robot K6. Passe de retouche prévue avant diffusion |
| 26 nov. 2026 | Les cartes personnage disparaissent : chaque joueur reçoit une **fiche de rôle** A5 (mission, actions, rappels). Les règles des agents sont sur le plateau |
| 26 nov. 2026 | Jetons simplifiés : 9 PA, 15 blocs, 3 marqueurs (plus de jetons de crédit) |
| 26 nov. 2026 | Plateau : pilotage en simple disque ambre (sans rayons) ; carte Événement de Vera en haut à droite ; pioche Défauts en bas à droite, à côté de SCAN |
| 26 nov. 2026 | Version numérique : feuille de score gamifiée (score global, XP, niveau du studio, badges) |
| 26 nov. 2026 | Précisions de règles : un brief par fonctionnalité ; blocs de PIX en trop reportés ; joueurs recalculés à chaque release ; 1 carte Feedback par nouveau palier de 100 joueurs ; pas de bonus sans publication ; bloc d'amélioration pour une idée sur une fonctionnalité sortie ; pioche Défauts remélangée |
| 26 nov. 2026 | **Réglages issus de la simulation** (`docs/jeu/simulation-equilibrage.md`) : un humain produit 1 bloc par cycle au maximum (2 au cycle 0, où il n'y a rien à vérifier ni à trier ; d'abord testé avec PIX à 5 blocs au cycle 0, écarté car illogique, résultats identiques) ; plus de bonus « release sans défaut » ; la note reste entre 1 et 5. Classement obtenu : équilibré > prudent > sans vérifier mais à l'écoute > sans vérifier ni écouter > mauvaises priorités |
| 26 nov. 2026 | **Étude v2 du simulateur** (`docs/jeu/simulation-equilibrage.md`) : 6 profils d'équipes réalistes, chance, temps. Simplifications adoptées : le feedback livré fait monter la note (fin des étoiles bonus et des cas particuliers) ; un Pas fun publié coûte 1 étoile ; la pénalité de file se compte sans suivi d'âge ; E1 seulement si le jeu a des joueurs. Les cycles sont chronométrés (25 min, puis 20 min) car 5 cycles libres dépassent le temps disponible |
| 26 nov. 2026 | **7e leçon : la gestion des risques.** Aucune règle ajoutée : un « risque du cycle » sur la feuille de score et une feuille de débrief sur les 4 réponses au risque. Le module « se préparer à l'événement » attendra la partie test |
| 26 nov. 2026 | Lisibilité : les **crédits IA deviennent des tokens IA** (le vrai vocabulaire de l'IA) ; les jetons de blocs deviennent des **carrés bloc** ; règles en recto (images) et verso (détail) ; les 6 temps du cycle : Écouter, Planifier, Produire, Vérifier, Sortir, Compter ; légende du matériel sur le plateau |
| 26 nov. 2026 | Kit papier v1 généré automatiquement à partir de `docs/jeu/cartes-orbit-studio.md` (`prototype-papier/outil/generer_kit.py`) |
| 26 nov. 2026 | **Le numérique d'abord :** la force du jeu est l'interactivité (plateau qui s'anime, efforts qui se cumulent, agents qui codent, gamification), que le papier ne fait pas ressentir. Le papier devient une vérification légère des règles et le repli hors ligne ; le vrai test est le **prototype du plateau numérique** (`docs/jeu/spec-prototype-plateau.md`), qui passe **avant les builds SpacePlan**. Il commence par une **démo animée et scriptée, sans règles** (2 boucles), pour tester le flux et la gamification avant de coder les règles |
| 26 nov. 2026 | **Builds SpacePlan :** pas une seule build à 20 interrupteurs, mais **une base par chapitre** (Proto, PoC, Alpha, puis Beta) avec des interrupteurs pour les fonctionnalités du chapitre et des précédents. Seul cas sans build : MVP incomplet (`docs/jeu/builds-spaceplan.md`) |
| 26 nov. 2026 | **Plateau au nouveau vocabulaire** : stations Prompt et Build (au lieu de Brief et Production), files Prompt → Build et Build → Test, jetons Heure au pilotage. Premier plateau numérique statique, dans les deux thèmes (`game/plateau/`, étape 1 de la démo) |
| 27 nov. 2026 | **Retours sur le plateau numérique :** l'éditeur devient **Nebulous Publishing** ; il donne la mission, le brief et le cadre à l'équipe, qui écrit elle-même le Backlog ; les cartes Fonctionnalité deviennent des tickets avec une barre d'effort ; banque d'heures de l'équipe au tableau de bord. **Provisoire :** dans la démo, les visages de Nora, Sam et Max servent pour l'équipe (chef de projet, designer, programmeur), et la communauté n'a plus de visages. Les cartes Feedback restent signées Max, Sam et Nora : à trancher (nouveaux portraits pour l'équipe ou pour la communauté) |
| 27 nov. 2026 | **Max, Sam et Nora deviennent les fondateurs du studio** (visages de l'équipe) ; **feedback anonyme**, sans signature ; plus de bonus Nora (+0,5 pour toute carte Feedback livrée) ; « une streameuse célèbre » au festival. Tranche la question laissée ouverte le même jour. **1 effort = 1 unité de travail**, de taille fixe sur les tickets, payée 1 heure (humain) ou 1 token (PIX) |
| 27 nov. 2026 | **Heures personnelles, sans couleur par rôle.** On garde les tâches réservées par rôle (le goulot, c'est « la bonne personne n'a plus de temps » : le programmeur qui doit relire tout le code de PIX). Pour le rendre visible sans compliquer : la lettre du responsable sur chaque ticket (CP, D, P, comme dans SpacePlan), et la lettre du propriétaire sur chaque jeton Heure posé. Les petits visages étaient illisibles à cette taille ; les visages restent au pilotage et au tableau de bord, avec leur lettre. Aucune règle ne change |
| 27 nov. 2026 | **Portraits de Vera et Nora échangés** : Vera prend le visage plus mûr (Kira), Nora le visage plus jeune (Jessica), qui fait étudiante. Les fichiers `vera-portrait.png` et `nora-portrait.png` sont échangés. Sur le plateau, les prénoms s'affichent sous les rôles (Nora, Sam, Max) et sous l'éditeur (Vera) |
| 27 nov. 2026 | **Titres et flèches du plateau numérique :** « Helioso Orbit » seul en haut (c'est le nom du jeu de plateau) ; Orbital Studio en petit, **Star Squadron en grand avec un logo** (vaisseau en pixel art, dessin original) et son MVP juste dessous ; **« gamers »** pour les joueurs de Star Squadron (les étudiants sont les joueurs d'Helioso Orbit) ; la flèche de l'éditeur revient vers le **Backlog** (elle traversait tout le plateau) ; « Idées » au lieu de « Nos idées » |
| 27 nov. 2026 | **« Gamers » partout** pour les joueurs de Star Squadron (règles, glossaire, cartes, kit, simulateur, plateau) ; « joueurs » = les étudiants. Catégorie « Joueur » → « Vaisseau ». Les playtesteurs de SpacePlan sont appelés playtesteurs |
| 27 nov. 2026 | **Pioches virtuelles sur le plateau numérique** (Événements, Feedback, Test) : la carte vole, se retourne et part à sa place ; la carte Test reste cachée sous l'effort de PIX jusqu'à ce qu'on la retourne. Les cartes et leurs textes (fr et en) sont dans le fichier du scénario |
| 27 nov. 2026 | **Pioches à droite du plateau** (entre ARTY et SCAN), après essai de trois placements (à droite, à gauche, chacune près de sa source). **Un schéma par carte Feedback**, dans le style des prototypes de SpacePlan (diapositives « Playtest debrief » du PowerPoint de SpacePlan) |
| 27 nov. 2026 | **12 fonctionnalités au départ, 8 idées de gamers** révélées par le feedback trié (F08, F11, F12, F14, F15, F16, F17, F18 : celles que les feedbacks demandent). Le début est moins écrasant, la boucle agile devient visible (on livre, les gamers suggèrent, le backlog se nourrit). Plateau : zones Idées, Backlog et couloir du cycle. Pioches en colonne à droite |
| 27 nov. 2026 | **Le jeu vient de l'équipe** : Nebulous Publishing commande un jeu, sans dire lequel ni ses fonctionnalités (plus de flèche de Vera vers les Idées). **Glisser-déposer** entre Idées et Backlog (dans les deux sens) puis vers le cycle (sans retour). Talon ambre pour les idées de gamers (au lieu d'une bulle jaune peu claire). Tableau de bord : un bloc **Fonctionnalités live** sous Star Squadron ; les anneaux de boucles passent dans la barre du haut |
| 27 nov. 2026 | **Message V0 neutre** : Vera veut un jeu en pixel art dans l'esprit de Space Invaders, rien de plus. L'équipe assemble sa première liste de fonctionnalités (les 12 de départ, fournies pour simplifier le cycle 0) et en déduit les 5 Must. Sur le plateau, la zone s'appelle « Idées de l'équipe » |
| 27 nov. 2026 | **Backlog limité à 5 places** sur le plateau : l'équipe doit prioriser |
| 27 nov. 2026 | **Le Backlog est un zoom de la planète Backlog** (cône, même contour noir), qu'un clic ouvre ou ferme. **Qui parle au joueur :** les agents ne parlent que de leur propre travail (PIX et SCAN, dans une bulle au-dessus d'eux) ; les règles du plateau (« Backlog plein », « plus rien à coder ») passent par un **avis neutre**, sans personnage. Vera reste la voix de l'éditeur (brief, événements). Piste ouverte : un narrateur ou un tuteur pour guider la première partie |
| 27 nov. 2026 | **K6, maître de jeu** : le robot K6 (mascotte de SpacePlan, version « professeur ») guide les joueurs dans la barre du bas du plateau (sa tête avec le chapeau), en sous-titre : un message par temps du cycle (Brief, Planning, Build…), qui ne cache jamais le plateau. **Logo de Star Squadron** : la fusée du logo de référence à gauche (image découpée, `assets/logos/star-squadron-fusee.png`), titre en lettres pixel sur un bandeau bleu nuit à droite (STAR en blanc, SQUADRON en ambre), d'après le logo de référence `assets/logos/star-squadron-reference.png` |
| 27 nov. 2026 | **Plan du prototype (section 13) aligné sur le plan de sprints v8** : démo animée, puis mini-test papier, moteur de règles, builds SpacePlan, jeu complet, démo de prospection, multijoueur. Les critères de réussite s'appliquent aux parties test numériques. Aucune règle ne change |
| 27 nov. 2026 | **Jamais « vaisseau » pour une fonctionnalité.** Sur le plateau, une carte Fonctionnalité est un **ticket** (ou une fonctionnalité, une *feature*) qui **avance** de station en station ; le mot « vaisseau » est réservé au vaisseau de Star Squadron (catégorie « Vaisseau », F02). **Lisibilité des cartes Test** (retours sur l'étape 2 de la démo) : la légende du plateau explique les petites cartes sous les efforts de PIX (« ? » cachée, « ✓ » OK, « ! » Bug), chaque petite carte a une infobulle, et quand PIX fait un effort, un avis dit qu'une carte Test vient d'être tirée et glissée dessous. Aucune règle ne change |
| 27 nov. 2026 | **Qui parle dans l'humour** : un personnage ne parle que s'il agit à ce moment-là. Les cartes Test deviennent **neutres** (plus de phrase de PIX ou de SCAN sur une carte, puisqu'elle peut être révélée par SCAN, un humain ou les gamers) ; les personnages parlent dans leur bulle. Section 4 et phrases des cartes mises à jour |
| 27 nov. 2026 | **Les temps du cycle et les stations** : Brief → aucune station (Vera parle) ; Planning → Backlog ; Build → Prompt (les prompts), puis Build ; Test → Test ; Release → Release ; Review → Feedback. **Script de la démo corrigé** pour suivre les règles 0.19 et 0.20 (cycle 1 : 4 cartes Feedback avec E1, 3 idées de gamers révélées par le tri, F17 et F18 publiées, F14 attend dans la file Prompt → Build ; 400 gamers, note 4, score 1 600). La pioche Événements est réservée à l'animateur (ou au déroulé automatique) dans le vrai jeu |
| 27 nov. 2026 | **F18 s'appelle « Fond étoilé défilant »** (en anglais *Scrolling starfield*) au lieu de « Fond spatial », peu clair : le plan 2D d'étoiles qui défile derrière le vaisseau et les aliens. **Le design n'est pas gelé** : on continue d'itérer sur le plateau (le gel du matin est levé) |
| 27 nov. 2026 | **GDD 0.21 : boucles de retour et décisions visibles.** Jeton Prod (2 au cycle 0, « l'élan du lancement », et au cycle 4, « le sprint final ») ; aiguillage « qui produit » à la sortie du Backlog et « corriger ou publier quand même » à la sortie du Test ; seul un humain corrige (1 heure, hors jeton Prod) ; ticket correctif pour une fonctionnalité live, qui reste live ; Bug bloquant (2 cartes) et Bug mineur (3 cartes) ; « relire » devient « code review » (« Review » reste le 6e temps du cycle) ; playtest montré à la station Test. Simulation : scores 3 à 8 % plus hauts, même classement des profils |
| 27 nov. 2026 | **GDD 0.22 : la code review revient au programmeur** (garant du code), plus au responsable de la fonctionnalité. Rôles plus nets ; le programmeur a du travail même quand PIX produit. Simulation neutre (0 à +1,5 %). |
| 27 nov. 2026 | **Le plateau numérique montre les règles 0.22** (démo, script v2) : deux repères « Aiguillage » sur l'orbite (sortie du Backlog, sortie du Test) qui ouvrent un panneau de décision (une ligne par ticket, ce que coûte chaque choix, les choix impossibles grisés avec leur raison) ; jetons ⚒ Prod corail avec un petit marteau ; badge de ce qu'attend un ticket (`</>` PIX, ⚒ jeton Prod, loupe = vérification) ; panneau des trois vérifications près de la station Test ; flèche rouge de la petite boucle ; ticket correctif à talon rouge et marque « bug signalé » dans les fonctionnalités live. |

---

## 15. Questions ouvertes

1. ~~Le ton du narratif~~ **Décidé :** humour léger, personnages validés.
2. ~~La langue~~ **Décidé :** français pour le pilote, conçu pour l'anglais.
3. **L'évaluation :** les enseignants voudront-ils noter les étudiants à partir du jeu ? Si oui, il faudra une grille.
4. **Plus tard :** une interaction entre les équipes, par exemple une audience partagée au festival ?
5. **Plus tard :** un agent de tri du feedback ?
