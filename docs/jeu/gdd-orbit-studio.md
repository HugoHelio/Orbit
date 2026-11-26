# GDD — Helioso Orbit : Studio

*Game Design Document du scénario 1 **« Orbit : Studio »** (studio de jeu vidéo) du business game **Helioso Orbit**, « Piloter une équipe humains + agents IA ». C'est le document de référence du jeu : **il est mis à jour à chaque décision**, et c'est lui qui fait foi.*

| | |
|---|---|
| **Version** | 0.5 — 26 novembre 2026 |
| **Statut** | Conception, avant prototype papier |
| **Plateau de travail** | Whiteboard « Helioso Orbit — plateau de l'orbite d'itération » : https://claude.ai/artifact/6uS1vcS3rbC3wgpG6S7YHn (sauvegarde : `docs/whiteboard/plateau-orbite.json`) |
| **Documents liés** | `docs/offre/scenarios-business-game.md` (les autres scénarios), `docs/pilotage/plan-sprints-2027.md` (le calendrier) |

**Journal des versions**
- **0.1** — Premier plan : équipe, benchmarks, cycle, session de 3 h.
- **0.2** — Hasard + stratégie, compétition et leaderboard, plateau en orbite, architecture multijoueur.
- **0.3** — Passage au format GDD. Trois goulots sur le plateau, mécanique de tri du feedback, jeu hors ligne obligatoire, premier jet du narratif.
- **0.4** — Nom du jeu : Helioso Orbit ; scénario « Orbit : Studio » ; le studio fictif s'appelle Orbital Studio. Chapitre gratuit et cadenas par code de licence.
- **0.5** — Ton et personnages du narratif validés ; cartes en français, conçues pour être traduites en anglais.

*Tous les chiffres sont des valeurs de départ, à régler pendant les tests.*

---

## 1. Vision

### Le pitch en une phrase

**Trois étudiants dirigent un petit studio de jeu vidéo qui travaille avec des agents IA, et doivent sortir un jeu au festival avant les studios concurrents. Ils découvrent qu'avec l'IA, la vraie difficulté n'est plus de produire, mais de décider et de vérifier.**

### L'intention pédagogique

**La grande leçon :** avec des agents IA, le goulot d'étranglement passe de la **production** à la **décision et à la vérification**. Les agents produisent beaucoup et vite. L'équipe humaine devient la ressource rare : elle écrit les briefs, relit, juge si c'est fun, trie les retours, arbitre.

**Les 5 leçons secondaires, à faire émerger au débrief :**
1. **La qualité du brief fait la qualité de l'agent.** Un brief bâclé coûte plus cher plus tard.
2. **Un agent testeur trouve les bugs, pas l'ennui.** Le jugement « est-ce que c'est fun ? » reste humain.
3. **Ajouter des agents n'accélère pas toujours.** Plus de production = plus de relecture = plus d'embouteillage (une loi de Brooks version IA).
4. **Livrer petit et souvent** bat livrer gros et tard. Mais plus le jeu a de joueurs, plus il y a de feedback à trier : le succès crée sa propre charge.
5. **Ce qui n'est pas vérifié finit en dette** : bugs cachés, dette technique, failles de sécurité.

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
- **Lou, la joueuse acharnée** : elle veut de la difficulté et repère chaque bug.
- **Sam, le joueur occasionnel** : il veut comprendre en 10 secondes et s'amuser tout de suite.
- **Nova, la streameuse** : elle a beaucoup d'abonnés. Un bon retour de sa part rapporte des joueurs, un crash en direct en fait perdre beaucoup.

### Les temps forts du récit, cycle par cycle

| Acte | Cycle | Message de Vera (début du cycle) | Ce qui se joue |
|---|---|---|---|
| **1. Le pitch** | 0 | « Montrez-moi un premier jouable. Trois fonctionnalités, pas plus. » | Choisir l'essentiel |
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
- *Carte feedback :* « Lou : "Le boss est trop facile. Vous l'avez testé ?" »

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

**Point de vigilance (à surveiller pendant les tests) :** une équipe ne doit pas pouvoir gagner en déléguant tout aux agents sans rien relire, ni en ignorant le feedback. Le barème doit rendre ces stratégies perdantes. Le leaderboard reste à affiner après les premières parties.

---

## 10. Le matériel (prototype papier)

- **Le plateau A2 de l'orbite d'itération**, un par équipe, avec les trois zones de files d'attente marquées.
- **12 cartes fonctionnalités**, chacune avec une valeur **Fun** (1 à 5) et une **taille** en blocs (1 à 4). Par exemple : vaisseau qui se déplace, tir, vague d'ennemis, collisions et score, écran titre, sons, bonus, boss, niveaux 2 et 3, classement en ligne, mode 2 joueurs, options d'accessibilité.
- **Des cartes défaut**, tirées face cachée pour chaque bloc produit par un agent : *aucun défaut*, *bug mineur*, *crash*, *pas fun*, *dette technique* (le prochain bloc lié coûte +1), *faille de sécurité* (rare, catastrophique si elle part en release). Deux paquets : briefs simples (risque élevé) et briefs détaillés (risque faible).
- **Environ 30 cartes feedback** signées Lou, Sam ou Nova : idée de fonctionnalité, signalement de bug, plainte « pas fun », compliment.
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
| **0:30 – 0:50** | **Acte 1 : cycle 0, le pitch** | Vision du jeu, choix des 3 fonctionnalités du premier jouable. Cycle guidé, sans défauts ni événements |
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
3. **Les leçons (10 min) :** les équipes formulent les leçons à partir de leurs propres décisions.
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
- Au débrief, les joueurs formulent **eux-mêmes** au moins 3 des 5 leçons.
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
| 26 nov. 2026 | Ton léger avec de l'humour ; personnages PIX, SCAN, ARTY, Vera, Lou, Sam et Nova validés |
| 26 nov. 2026 | Textes en français pour le pilote, écrits pour être traduits en anglais ; une clé par texte et une version par langue dans le jeu numérique |

---

## 15. Questions ouvertes

1. ~~Le ton du narratif~~ **Décidé :** humour léger, personnages validés.
2. ~~La langue~~ **Décidé :** français pour le pilote, conçu pour l'anglais.
3. **L'évaluation :** les enseignants voudront-ils noter les étudiants à partir du jeu ? Si oui, il faudra une grille.
4. **Plus tard :** une interaction entre les équipes, par exemple une audience partagée au festival ?
5. **Plus tard :** un agent de tri du feedback ?
