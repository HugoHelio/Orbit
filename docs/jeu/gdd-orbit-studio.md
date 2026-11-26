# GDD — Helioso Orbit : Studio

*Game Design Document du scénario 1 **« Orbit : Studio »** (studio de jeu vidéo) du business game **Helioso Orbit**, « Piloter une équipe humains + agents IA ». C'est le document de référence du jeu : **il est mis à jour à chaque décision**, et c'est lui qui fait foi.*

| | |
|---|---|
| **Version** | 0.12 — 26 novembre 2026 |
| **Statut** | Règles validées par simulation ; kit papier prêt pour un brouillon de test (`prototype-papier/`) |
| **Plateau de travail** | Whiteboard « Helioso Orbit — plateau de l'orbite d'itération » : https://claude.ai/artifact/6uS1vcS3rbC3wgpG6S7YHn (sauvegarde : `docs/whiteboard/plateau-orbite.json`) |
| **Documents liés** | `docs/jeu/regles-une-page.md` (les règles pour les joueurs), `docs/jeu/simulation-equilibrage.md` (la simulation), `docs/jeu/cartes-orbit-studio.md` (toutes les cartes), `docs/jeu/direction-artistique.md` (palette, thèmes, typographie), `docs/jeu/reprise-spaceplan.md` (ce qu'on reprend de SpacePlan), `docs/offre/scenarios-business-game.md` (les autres scénarios), `docs/pilotage/plan-sprints-2027.md` (le calendrier) |

**Journal des versions**
- **0.1** — Premier plan : équipe, benchmarks, cycle, session de 3 h.
- **0.2** — Hasard + stratégie, compétition et leaderboard, plateau en orbite, architecture multijoueur.
- **0.3** — Passage au format GDD. Trois goulots sur le plateau, mécanique de tri du feedback, jeu hors ligne obligatoire, premier jet du narratif.
- **0.4** — Nom du jeu : Helioso Orbit ; scénario « Orbit : Studio » ; le studio fictif s'appelle Orbital Studio. Chapitre gratuit et cadenas par code de licence.
- **0.5** — Ton et personnages du narratif validés ; cartes en français, conçues pour être traduites en anglais.
- **0.6** — **Règles de base** simplifiées pour le premier prototype (section 0) ; les 20 fonctionnalités de SpacePlan ; un seul paquet de défauts ; premier jet complet des cartes.
- **0.7** — Direction artistique : palette HLC v2.0, deux thèmes (clair et sombre « Tech »), kit papier en style flat.
- **0.8** — Règle du **premier jouable** (0 joueur tant que les 5 Must ne sont pas livrés) ; priorités non imprimées sur les cartes ; cycle 0 libre et sans défaut ; **score = joueurs × note**.
- **0.9** — Portraits en pixel art pour Vera, Max, Sam, Nova, PIX et SCAN ; fiches de rôle A5 à la place des cartes personnage ; jetons simplifiés (9 PA, 15 blocs, 3 marqueurs) ; plateau réorganisé ; idée d'une feuille de score gamifiée pour le numérique.
- **0.10** — Huit précisions de règles et quatre réglages issus de la **simulation** (2 000 parties par stratégie) : un humain produit 1 bloc par cycle au maximum (2 au cycle 0), plus de bonus « release sans défaut », note entre 1 et 5. Règles sur une page.
- **0.11** — **Étude v2** (équipes réalistes, chance, temps) : règles simplifiées (le feedback livré fait monter la note ; un Pas fun coûte 1 étoile ; file d'attente sans suivi d'âge ; E1 seulement si le jeu a des joueurs) et cycles chronométrés (25 min, puis 20 min).
- **0.12** — 7e leçon : **la gestion des risques**. Le « risque du cycle » sur la feuille de score, une feuille de débrief sur les 4 réponses au risque.

*Tous les chiffres sont des valeurs de départ, à régler pendant les tests.*

---

## 0. Règles de base (version 1 du prototype) — elles priment sur le reste du document

Le jeu se construit comme un jeu de société : des **règles de base**, simples à expliquer et à équilibrer, puis des **modules** ajoutés un par un. Les sections 5 à 10 décrivent le jeu complet ; **pour les premiers tests, seules les règles ci-dessous s'appliquent.** Le détail de toutes les cartes est dans `docs/jeu/cartes-orbit-studio.md`.

| Élément | Règles de base | Modules pour plus tard |
|---|---|---|
| **Fonctionnalités** | Les **20 fonctionnalités de SpacePlan** (master feature list). Taille : *Low* = 1 bloc, *Medium* = 2, *High* = 3. **La priorité n'est pas imprimée** : les équipes retrouvent les 5 *Must* à partir du message de Vera | Dépendances entre fonctionnalités ; demandes de joueurs (classement, combat de boss…) |
| **Premier jouable** | **Tant que les 5 *Must* ne sont pas tous livrés sans bug, le jeu a 0 joueur.** Les étoiles des autres fonctionnalités livrées attendent et comptent dès que le premier jouable est atteint. Un bug révélé plus tard sur un *Must* recasse le jouable | — |
| **Valeur** | *Must* = 2 étoiles, *Should* = 3, *Could* = 2. **Une étoile livrée = 25 joueurs** | Fun variable par carte |
| **Équipe** | Chef de projet, designer, programmeur : **3 PA chacun par cycle**, et une **fiche de rôle** A5 chacun. **Un humain produit au plus 1 bloc par cycle** (1 PA), 2 au cycle 0. 20 crédits IA pour la partie | 4e rôle |
| **Matériel** | **9 jetons PA** (posés sur la station où l'on agit), **15 jetons bloc** (posés sur les carrés des cartes Fonctionnalité), **3 marqueurs** (crédits, note, cycle) | — |
| **Agents** | **PIX** (jusqu'à 3 blocs par cycle ; un brief couvre une fonctionnalité entière ; les blocs en trop attendent) et **SCAN** (jusqu'à 4 tests par cycle), 1 crédit par action | ARTY |
| **Défauts** | **Un seul paquet de 20 cartes** : 12 Aucun, 5 Bug, 3 Pas fun. Brief simple = 1 carte ; brief détaillé = **2 cartes, on garde la meilleure**. SCAN trouve les Bug, seul le playtest du designer trouve les Pas fun. Bug publié : 0 étoile ; Pas fun publié : −1 étoile | Crash, dette technique, faille de sécurité ; renvoi à PIX |
| **Feedback** | 24 cartes tirées des **vrais playtests de SpacePlan**, signées Max, Sam ou Nova ; 1 carte à chaque nouveau palier de 100 joueurs ; à trier par le chef de projet. **Une seule règle** : la carte va sur la fonctionnalité citée, 1 bloc de travail si elle est déjà sortie ; livrée, **la note monte de 0,5** (+1 pour Nova). Plus de 4 cartes non triées à la release : −0,5 | Agent de tri |
| **Événements** | Un par cycle, ordre fixe (E1 à E4), sans choix de résolution. E1 n'apporte du feedback que si le jeu a des joueurs | Résolutions et bonus ; **se préparer à l'événement annoncé** (1 PA, annule son effet), à tester au simulateur |
| **Cycle 0** | Libre : les équipes choisissent quoi produire, **sans carte Défaut ni coût en crédits**, sans événement ni feedback. Comme il n'y a rien à vérifier ni à trier, chaque humain peut produire 2 blocs | — |
| **Score** | **Joueurs × note.** Joueurs = étoiles en ligne × 25, recalculés à chaque release. Note sur 5, départ à 3, **entre 1 et 5** : −0,5 par bug publié et si le feedback s'accumule, +0,5 par carte Feedback livrée (+1 pour Nova). 0 joueur = 0 point | Bonus d'étapes et d'événements, pénalités |
| **Temps** | Cycles chronométrés : **25 min au cycle 0** (on y apprend les règles en jouant), **puis 20 min**. À la sonnerie, release avec ce qui est prêt | — |
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
4. **Livrer petit et souvent** bat livrer gros et tard. Mais plus le jeu a de joueurs, plus il y a de feedback à trier : le succès crée sa propre charge.
5. **Ce qui n'est pas vérifié finit en dette** : bugs cachés, dette technique, failles de sécurité.
6. **Le nécessaire avant le séduisant.** Tant que le jeu n'est pas jouable, il n'a pas de joueurs : les fonctionnalités qui rapportent le plus ne servent à rien sans les essentielles.
7. **Gérer un risque, c'est choisir sa réponse.** Face à un risque, on peut l'**éviter** (faire produire par un humain), le **réduire** (un brief détaillé), le **détecter** avant qu'il ne frappe (SCAN, relecture, playtest) ou l'**accepter** en connaissance de cause (publier sans vérifier, garder des crédits en réserve). La simulation le montre : la malchance coûte 37 % du score à une équipe qui ne vérifie rien, moins de 6 % à une équipe qui gère ses risques.

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
| **Jeux de gestion de studio** (style « tycoon ») | Le plaisir de voir son studio grandir et son jeu gagner des joueurs. | Le **score en joueurs** et la fierté de « son » jeu |

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

Trois amis viennent de fonder **Orbital Studio** dans un petit local. Leur projet : **« Star Squadron »**, un shoot'em up spatial rétro. Un éditeur, **Nébuleuse Games**, a accepté de leur verser une avance. Le studio est équipé de deux agents IA, mais avec un budget de crédits limité. Dans 8 semaines, il y a le **Festival du jeu indépendant**. Nébuleuse Games ne signera le contrat complet qu'avec **un seul studio** : celui qui fera la meilleure impression au festival. Les autres studios de la salle visent le même contrat.

### Les personnages non joueurs

**Chez l'éditeur**
- **Vera, productrice chez Nébuleuse Games.** Elle a parié sur les studios de la salle. Elle envoie les missions, change parfois d'avis, et rappelle les échéances. Elle s'exprime par des messages courts, lus par l'animateur au début de chaque cycle.

**Les agents IA (ils ont une personnalité)**
- **PIX, l'agent codeur.** Rapide, enthousiaste, toujours sûr d'avoir réussi (« Terminé ! Tout fonctionne parfaitement. »), même quand ce n'est pas vrai.
- **SCAN, l'agent testeur.** Méthodique et pointilleux. Il signale les bugs avec précision, mais il ne comprend pas ce qu'est le fun (« Aucun défaut détecté. Le joueur meurt en 4 secondes, conformément au code. »).
- **ARTY, l'agent artiste** (débloqué au cycle 2). Il produit des visuels superbes, mais pas toujours dans le même style.

**La communauté (trois joueurs types, sur les cartes feedback)**
- **Max, le joueur acharné** : il veut de la difficulté et repère chaque bug.
- **Sam, le joueur occasionnel** : il veut comprendre en 10 secondes et s'amuser tout de suite.
- **Nova, la streameuse** : elle a beaucoup d'abonnés. Un bon retour de sa part rapporte des joueurs, un crash en direct en fait perdre beaucoup.

### Les portraits *(décidé le 26 nov. 2026)*

Les personnages non joueurs ont un portrait en pixel art (fichiers dans `assets/personnages/`). Les rôles des joueurs n'en ont pas : ce sont les joueurs eux-mêmes.

| Personnage | Portrait | Origine |
|---|---|---|
| **Vera** | Jessica | Portraits de HLC (SpacePlan), générés par IA |
| **Max** | Ben | idem |
| **Sam** | Luke | idem |
| **Nova** | Kira | idem |
| **PIX** | Robot K6, orange, avec des lunettes de geek et `</>` sur le ventre | Redessiné à partir de K6, créé par Hugo pour SpacePlan : droits acquis |
| **SCAN** | Robot K6, cyan, avec des lunettes de vision nocturne à trois lentilles et un code-barres | idem |
| *En réserve* | Bill | Pour un futur personnage (l'investisseur de l'événement E3 ?) |

**À faire avant la diffusion :** une passe de retouche sur les portraits humains (PIX et SCAN viennent de K6, qui nous appartient), pour qu'ils soient uniques et issus de nos propres générations (voir le backlog dans `docs/pilotage/plan-sprints-2027.md`).

### Les temps forts du récit, cycle par cycle

| Acte | Cycle | Message de Vera (début du cycle) | Ce qui se joue |
|---|---|---|---|
| **1. Le pitch** | 0 | « Avant de signer, je veux un premier jouable : un vaisseau qui apparaît, qui bouge et qui tire, des aliens en face, un missile qui les touche, et une partie qu'on peut perdre et recommencer. » | Retrouver les 5 *Must* parmi les 20 cartes : sans eux, 0 joueur |
| **2. L'accès anticipé** | 1 | « Les premiers joueurs arrivent. Écoutez-les. » | Le premier feedback, la première release |
| | 2 | « Bonne nouvelle : vous pouvez recruter ARTY. À vous de voir. » | Faut-il un agent de plus ? |
| | 3 | « Changement de plan : je veux un mode 2 joueurs pour le festival. » (ou une crise technique) | La crise |
| **3. Le festival** | 4 | « Nova va jouer à votre jeu en direct. Pas de crash. » | La dernière release, sous pression |
| **4. Le post-mortem** | — | Vera annonce le studio retenu | Le débrief |

### Les fins possibles (lues par l'animateur)

- **Le contrat :** le studio en tête du leaderboard signe avec Nébuleuse Games.
- **Le sursis :** les studios qui atteignent l'objectif du festival (500 joueurs et une note d'au moins 4) reçoivent une proposition de suivi.
- **La fermeture :** les autres repartent avec un post-mortem, et c'est très bien, car c'est le meilleur moment pour apprendre.

### La langue des textes

- **Pilote en français.** Tous les textes (cartes, messages de Vera, règles, guide d'animation) sont écrits d'abord en français.
- **Conçus pour l'anglais dès le départ :** phrases courtes, pas de jeux de mots intraduisibles dans les règles (l'humour reste dans les phrases d'ambiance, qu'on adaptera plutôt que traduire), noms de personnages identiques dans les deux langues.
- **Dans le jeu numérique :** chaque texte a une clé et une version par langue dans le fichier du scénario (par exemple `fr` et `en`), pour ajouter l'anglais sans toucher au code.

### Le texte d'ambiance des cartes

Chaque carte porte une phrase d'ambiance courte, qui fait sourire et rappelle la leçon. Exemples :
- *Carte défaut « Crash » :* « PIX : "C'est impossible, j'ai tout vérifié." »
- *Carte défaut « Pas fun » :* « Sam : "J'ai rien compris, j'ai fermé le jeu." »
- *Carte défaut « Faille de sécurité » :* « Une clé d'API traîne dans le code publié. Quelqu'un l'a déjà trouvée. »
- *Carte feedback :* « Max : "Le boss est trop facile. Vous l'avez testé ?" »

---

## 5. L'équipe

### Les joueurs (3 étudiants par équipe)

| Rôle | Mission | Capacité par cycle |
|---|---|---|
| **Chef(fe) de projet** | Trie le feedback, choisit quoi faire dans le backlog, gère les crédits IA, décide de la release. | 3 points d'action (PA) |
| **Designer** | Écrit les briefs de design, juge le fun, décide des corrections de gameplay. | 3 PA |
| **Programmeur(se)** | Code les parties délicates, **relit le code des agents**, corrige les défauts. | 3 PA |

*Pour des équipes de 4 : un 4e rôle « Producteur(rice) qualité » qui fait les playtests et aide au tri du feedback.*

### Les agents IA (des cartes, pas des joueurs)

| Agent | Forces | Limites |
|---|---|---|
| **PIX, agent codeur** | Produit 3 blocs de code par cycle (un humain en produit 1). Coûte 1 crédit IA par bloc. | Chaque bloc cache une **carte défaut** tirée face cachée. Plus le brief est mauvais, plus le risque est élevé. Au-delà de 3 blocs par cycle, les briefs **attendent**. |
| **SCAN, agent testeur** | Teste 4 blocs par cycle et révèle les défauts techniques (bug, crash). Coûte 1 crédit par test. | **Ne détecte jamais un défaut « pas fun »** ni la dette technique. Rate parfois une faille. |
| **ARTY, agent artiste** *(débloqué au cycle 2)* | Produit graphismes et sons (2 blocs par cycle). | Visuels génériques (défaut « style incohérent »), risque de droits sur les assets. |

**Principe clé :** les agents ne jouent pas seuls, ils **consomment de l'attention humaine** : un brief (1 ou 2 PA) avant, une relecture (1 PA par bloc) après.

---

## 6. Le plateau : l'orbite d'itération

*Voir le Whiteboard pour la version de travail.*

**L'idée :** comme la carte du Beer Game montre le flux des commandes, de la production et des livraisons, notre plateau montre **le cycle d'itération, les acteurs et les flux**. Mais le flux tourne **en boucle** : c'est une orbite. L'agilité devient visible.

### Les zones

1. **L'orbite d'itération.** Six stations en boucle : **Backlog → Brief → Production → Test et relecture → Release → Feedback**, puis retour au Backlog. Les cartes de tâches (des « vaisseaux ») avancent de station en station.
2. **Le poste de pilotage (au centre).** Les 3 humains avec leurs jetons de points d'action.
3. **Les satellites.** Les agents IA, posés sur la station où ils travaillent : PIX et ARTY sur Production, SCAN sur Test.
4. **Les planètes extérieures.** **Nébuleuse Games** envoie les missions vers le Backlog. **La communauté** reçoit les releases et renvoie le feedback.
5. **Les pistes autour du plateau.** Le temps (cycles 0 à 4, puis le festival), le carburant (crédits IA), le score et la note.

### Les trois goulots (les files d'attente orange)

Les petits blocs orange sont des **files d'attente**. Il y en a trois, de taille croissante :

| Où | Pourquoi ça bloque | Taille attendue |
|---|---|---|
| **Entre Brief et Production** | Les idées s'enchaînent vite, mais PIX ne produit que 3 blocs par cycle : même si c'est rapide, les briefs attendent. | Petite |
| **Entre Production et Test** | Les agents produisent plus que les humains ne peuvent relire. | Moyenne |
| **Entre Feedback et Backlog** | Chaque release apporte des retours, de plus en plus nombreux à mesure que le jeu gagne des joueurs. Il faut les lire, les trier et décider, et ça ne peut être fait que par des humains. | **La plus grande : le goulot principal** |

**Ce que le plateau doit faire voir d'un coup d'œil :** au fil de la partie, c'est la file **Feedback → Backlog** qui grossit le plus. Le goulot principal est la **décision**, pas la production.

**En version papier :** un plateau A2, des cartes, des figurines et des jetons. **En version numérique :** le même plan, animé (les vaisseaux qui voyagent, les files d'attente qui grossissent en orbite).

### Le style visuel

Détail complet dans `docs/jeu/direction-artistique.md`.
- **Palette HLC v2.0** : bleu nuit `#0D2329`, sarcelle `#23C2AA`, cyan `#0AE2EA`, ambre `#FBAB00`, gris sauge `#B9CAC9`, plus un rouge corail pour les défauts.
- **Deux thèmes numériques** : clair par défaut (salles éclairées, tablettes, cohérence avec le papier) et sombre « Tech » (écrans, préférence des étudiants), au choix à tout moment.
- **Kit papier** en style flat, sur le thème clair : aplats, contours épais bleu nuit.
- **Le pilotage est un soleil ambre** au centre, les six stations sont des planètes en orbite.

---

## 7. La boucle de jeu : un cycle (environ 20 à 30 minutes)

1. **Message de Vera et événement (3 min).** L'animateur lit le message de Vera, tire la carte événement (dont le type était annoncé) et annonce le type du prochain.
2. **Arrivée et tri du feedback (4 min).** Des cartes feedback arrivent dans la file Feedback → Backlog : **1 carte pour 100 joueurs**. Le chef de projet trie (1 PA pour 2 cartes) : chaque carte triée devient une tâche du Backlog ou est écartée. **Un feedback ignoré trop longtemps fait baisser la note** (« la communauté se sent ignorée »).
3. **Planification (4 min).** Le chef de projet choisit les tâches du cycle dans le Backlog. L'équipe décide qui fait quoi : humain ou agent.
4. **Briefs (4 min).** Pour chaque tâche donnée à un agent : un brief simple (1 PA) ou détaillé (2 PA). Les briefs au-delà de la capacité de PIX attendent dans la file Brief → Production.
5. **Production (4 min).** Les agents produisent : on pose une carte défaut face cachée sur chaque bloc. Les humains produisent moins, mais sans défaut caché.
6. **Test et relecture (4 min).** SCAN retourne les défauts techniques qu'il trouve. Le programmeur peut relire (1 PA par bloc) pour révéler tout défaut. Le designer peut faire un playtest (1 PA) pour repérer un « pas fun ». Ce qui n'est pas relu reste dans la file Production → Test.
7. **Release (3 min).** L'équipe choisit ce qu'elle publie. Les défauts encore cachés sont révélés **à ce moment-là, devant les joueurs**. On calcule le score du cycle et l'animateur met à jour le **leaderboard**.
8. **Mini-rétro (2 min).** Une question : « Qu'est-ce qu'on change au prochain cycle ? »

**Piste pour plus tard :** un agent de tri du feedback, qui résume vite les retours mais rate les nuances (il range une remarque de Nova avec les autres).

---

## 8. Hasard et stratégie

**Règle de conception :** le hasard est toujours maîtrisable par une décision qui coûte quelque chose.

| Source de hasard | Comment la maîtriser (stratégie) | Ce que ça coûte |
|---|---|---|
| **Cartes défaut** sur les blocs produits par les agents | Écrire un brief détaillé pour tirer dans le paquet à faible risque | 1 PA de plus |
| | Relire le code pour révéler les défauts avant la release | 1 PA par bloc |
| | Faire produire par un humain (aucun défaut caché) | Production 3 fois plus lente |
| **Cartes événements** | Vera annonce **le type** d'événement du cycle suivant : on peut s'y préparer | Garder du temps ou des crédits en réserve |
| **Cartes feedback** | Trier tôt, pour ne pas laisser monter la frustration | Des PA du chef de projet |
| | Faire un playtest avant la release pour anticiper le « pas fun » | 1 PA du designer |

**Les grandes décisions stratégiques de la partie :**
- Quelles fonctionnalités prendre, et dans quel ordre (Fun élevé mais grosses, ou petites et sûres) ?
- Qui fait quoi : humain ou agent ?
- Recruter ARTY au cycle 2, ou pas ?
- Quel feedback traiter, lequel écarter ?
- Quoi publier à chaque release, et quoi garder pour le cycle suivant ?
- Comment dépenser les 20 crédits IA sur 4 cycles ?

---

## 9. Compétition et leaderboard

Toutes les équipes jouent le même scénario en parallèle, **sans interaction directe entre les équipes dans la v0**. La compétition passe par le **leaderboard**, mis à jour après chaque release.

### Le score

*En règles de base (section 0) : **score = joueurs × note**, et les joueurs sont recalculés à chaque release (ils ne s'additionnent pas). Le barème complet ci-dessous (version 0.3) sera revu quand on ajoutera les modules.*

**Score = Joueurs + (Note × 100) + Bonus d'étapes − Pénalités**

| Élément | Points |
|---|---|
| **Joueurs** | Somme des valeurs Fun livrées × 25 à chaque release, cumulée sur la partie |
| **Note** (sur 5, départ à 3) | × 100 au score. +0,5 pour une release sans aucun défaut visible, −0,5 par crash visible, −0,5 si plus de 4 cartes feedback attendent depuis plus d'un cycle |
| **Bonus d'étape : premier jouable** | +50 si les 3 fonctionnalités du cycle 0 sont livrées sans crash |
| **Bonus d'étape : événement bien résolu** | +30 à +80 selon la carte événement (chaque carte indique sa meilleure résolution) |
| **Bonus d'étape : objectif du festival** | +200 si 500 joueurs et une note d'au moins 4 sont atteints |
| **Bonus de gestion** | +5 par crédit IA restant à la fin |
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
- **Environ 30 cartes feedback** signées Max, Sam ou Nova : idée de fonctionnalité, signalement de bug, plainte « pas fun », compliment.
- **8 cartes événements**, avec une tension qui monte, chacune avec sa meilleure résolution et son bonus.
- **Des figurines** pour les 3 humains et les 3 agents.
- **Des jetons** : points d'action et crédits IA.
- **Une feuille de score** par équipe et **un leaderboard** au tableau pour l'animateur.

---

## 11. La session de 3 heures

| Horaire | Séquence | Contenu |
|---|---|---|
| **0:00 – 0:15** | Accueil et récit | Message de Vera, objectif du festival, constitution des studios concurrents |
| **0:15 – 0:30** | Règles et matériel | Rôles, plateau de l'orbite, cartes, exemple d'un tour |
| **0:30 – 0:50** | **Acte 1 : cycle 0, le pitch** | Message de Vera ; les équipes retrouvent les 5 *Must* parmi les 20 cartes et les produisent. Sans défauts, sans crédits, sans événement |
| **0:50 – 1:20** | **Cycle 1** (30 min) | Premiers joueurs, premier feedback. Premier leaderboard |
| **1:20 – 1:45** | **Cycle 2** (25 min) | ARTY peut être recruté. Événement : mise à jour du modèle de PIX (+1 bloc, mais ses défauts changent) |
| **1:45 – 1:55** | Pause | |
| **1:55 – 2:15** | **Cycle 3, la crise** (20 min) | Vera exige un mode 2 joueurs, ou une clé d'API se retrouve dans le code publié |
| **2:15 – 2:30** | **Acte 3 : cycle 4, le festival** (15 min) | Nova joue en direct : chaque crash compte double. Leaderboard final et annonce du studio retenu |
| **2:30 – 3:00** | **Acte 4 : post-mortem** (30 min) | Le débrief |

**Le rythme est voulu :** les cycles raccourcissent (30, 25, 20, puis 15 minutes) pendant que les événements se durcissent et que le feedback s'accumule.

### Le débrief en 4 temps (30 min)

1. **Ressenti (5 min) :** « En un mot, comment vous êtes-vous senti au cycle 3 ? »
2. **Ce qui s'est passé (10 min) :** on regarde les plateaux et le leaderboard. Quelle file d'attente a le plus grossi ? En principe, Feedback → Backlog, puis Production → Test.
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

| Étape | Sprint | Livrable | Ce qu'on vérifie |
|---|---|---|---|
| **1. Règles v0** | S1 (4 – 17 janv.) | Ce GDD finalisé, la liste complète des cartes, le plateau dessiné | Les règles tiennent sur une page recto-verso |
| **2. Prototype papier (N0)** | S2 (18 – 31 janv.) | Plateau A2 et cartes imprimés. Partie test de 90 min (cycle 0 + 2 cycles) avec **2 équipes** de proches | Règles comprises en moins de 15 min ? Les goulots apparaissent-ils tout seuls ? Le barème récompense-t-il la bonne stratégie ? |
| **3. Prototype web (N1)** | S3 (1er – 14 févr.) | Plateau numérique animé par équipe, hors ligne + page leaderboard | Le jeu tourne sans calculs à la main |
| **4. Démo** | S4 (15 – 28 févr.) | Vidéo de 2 min + version jouable en 5 min pour la prospection | Un enseignant comprend l'intérêt en 2 minutes |
| **5. Multijoueur (N2)** | Été 2027 | Parties avec code, écran animateur synchronisé, repli hors ligne | Une classe de 30 joue sans incident, même avec une coupure réseau |

**Les critères de réussite du test papier :**
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
| 26 nov. 2026 | Ton léger avec de l'humour ; personnages PIX, SCAN, ARTY, Vera, Max, Sam et Nova validés |
| 26 nov. 2026 | Textes en français pour le pilote, écrits pour être traduits en anglais ; une clé par texte et une version par langue dans le jeu numérique |
| 26 nov. 2026 | Règles de base simplifiées pour le premier prototype (section 0) ; modules ajoutés un par un ensuite |
| 26 nov. 2026 | Les 20 fonctionnalités de la master feature list de SpacePlan (les 2 « demandes de joueurs », classement et combat de boss, viendront plus tard) |
| 26 nov. 2026 | Les insights de playtest de SpacePlan deviennent les cartes Feedback |
| 26 nov. 2026 | Le code du mini-jeu SpacePlan est repris dans le dépôt public `Orbit`, sous licence Helioso |
| 26 nov. 2026 | Direction artistique : palette HLC v2.0 ; style flat pour le papier ; deux thèmes numériques, clair par défaut et sombre « Tech » ; le pilotage est un soleil, les stations des planètes |
| 26 nov. 2026 | **Premier jouable :** 0 joueur tant que les 5 *Must* ne sont pas livrés sans bug. La priorité n'est pas imprimée sur les cartes et les fonctionnalités sont renumérotées par catégorie : la priorisation devient le premier exercice du jeu |
| 26 nov. 2026 | Cycle 0 libre (et non plus guidé), sans carte Défaut ni coût en crédits |
| 26 nov. 2026 | **Score = joueurs × note** (note sur 5, départ à 3) : un jeu sans joueurs vaut 0 point, et la note pèse proportionnellement à l'audience |
| 26 nov. 2026 | Portraits en pixel art : Vera (Jessica), Max (Ben ; anciennement Lou, renommé pour fonctionner aussi en anglais), Sam (Luke), Nova (Kira) ; PIX et SCAN redessinés à partir du robot K6. Passe de retouche prévue avant diffusion |
| 26 nov. 2026 | Les cartes personnage disparaissent : chaque joueur reçoit une **fiche de rôle** A5 (mission, actions, rappels). Les règles des agents sont sur le plateau |
| 26 nov. 2026 | Jetons simplifiés : 9 PA, 15 blocs, 3 marqueurs (plus de jetons crédit) |
| 26 nov. 2026 | Plateau : pilotage en simple disque ambre (sans rayons) ; carte Événement de Vera en haut à droite ; pioche Défauts en bas à droite, à côté de SCAN |
| 26 nov. 2026 | Version numérique : feuille de score gamifiée (score global, XP, niveau du studio, badges) |
| 26 nov. 2026 | Précisions de règles : un brief par fonctionnalité ; blocs de PIX en trop reportés ; joueurs recalculés à chaque release ; 1 carte Feedback par nouveau palier de 100 joueurs ; pas de bonus sans publication ; bloc d'amélioration pour une idée sur une fonctionnalité sortie ; pioche Défauts remélangée |
| 26 nov. 2026 | **Réglages issus de la simulation** (`docs/jeu/simulation-equilibrage.md`) : un humain produit 1 bloc par cycle au maximum (2 au cycle 0, où il n'y a rien à vérifier ni à trier ; d'abord testé avec PIX à 5 blocs au cycle 0, écarté car illogique, résultats identiques) ; plus de bonus « release sans défaut » ; la note reste entre 1 et 5. Classement obtenu : équilibré > prudent > sans vérifier mais à l'écoute > sans vérifier ni écouter > mauvaises priorités |
| 26 nov. 2026 | **Étude v2 du simulateur** (`docs/jeu/simulation-equilibrage.md`) : 6 profils d'équipes réalistes, chance, temps. Simplifications adoptées : le feedback livré fait monter la note (fin des étoiles bonus et des cas particuliers) ; un Pas fun publié coûte 1 étoile ; la pénalité de file se compte sans suivi d'âge ; E1 seulement si le jeu a des joueurs. Les cycles sont chronométrés (25 min, puis 20 min) car 5 cycles libres dépassent le temps disponible |
| 26 nov. 2026 | **7e leçon : la gestion des risques.** Aucune règle ajoutée : un « risque du cycle » sur la feuille de score et une feuille de débrief sur les 4 réponses au risque. Le module « se préparer à l'événement » attendra la partie test |
| 26 nov. 2026 | Kit papier v1 généré automatiquement à partir de `docs/jeu/cartes-orbit-studio.md` (`prototype-papier/outil/generer_kit.py`) |

---

## 15. Questions ouvertes

1. ~~Le ton du narratif~~ **Décidé :** humour léger, personnages validés.
2. ~~La langue~~ **Décidé :** français pour le pilote, conçu pour l'anglais.
3. **L'évaluation :** les enseignants voudront-ils noter les étudiants à partir du jeu ? Si oui, il faudra une grille.
4. **Plus tard :** une interaction entre les équipes, par exemple une audience partagée au festival ?
5. **Plus tard :** un agent de tri du feedback ?
