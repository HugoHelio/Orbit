# Cartes d'Orbit : Studio — règles de base, version 1

*Premier jet complet des cartes du prototype papier — 26 novembre 2026. Conforme aux règles de base du GDD (version 0.6, section 0). Sources : la master feature list et les insights de playtest de SpacePlan (`docs/jeu/reprise-spaceplan.md`).*

*Chaque carte a un identifiant (F01, D01, FB01, E01, V0…) : c'est sa clé pour la traduction anglaise et pour le jeu numérique.*

---

## 1. Aide-mémoire des actions (carte Référence, une par joueur)

Chaque humain a **3 points d'action (PA) par cycle**. L'équipe a **20 crédits IA pour toute la partie**.

| Action | Coût | Qui |
|---|---|---|
| Trier 2 cartes Feedback | 1 PA | Chef de projet |
| Écrire un brief **simple** pour un agent (1 carte Défaut tirée par bloc) | 1 PA | Chef de projet ou designer |
| Écrire un brief **détaillé** (2 cartes Défaut tirées par bloc, on garde la meilleure) | 2 PA | Chef de projet ou designer |
| Produire 1 bloc soi-même (aucune carte Défaut) | 1 PA | Le responsable de la fonctionnalité |
| Relire 1 bloc produit par PIX (révèle sa carte Défaut) | 1 PA | Le responsable de la fonctionnalité |
| Faire un playtest d'une fonctionnalité (révèle un « Pas fun » sur tous ses blocs) | 1 PA | Designer |
| Corriger un défaut révélé | 1 PA | Le responsable de la fonctionnalité |
| Faire produire 1 bloc par PIX | 1 crédit | — |
| Faire tester 1 bloc par SCAN (révèle un « Bug », jamais un « Pas fun ») | 1 crédit | — |

**Le responsable** d'une fonctionnalité est indiqué sur sa carte : **Prog** = le programmeur ; **Design** et **Art** = le designer.

---

## 2. Les cartes Référence des rôles et des agents

| Id | Carte | Capacité | Phrase |
|---|---|---|---|
| R1 | **Chef(fe) de projet** | 3 PA. Trie le feedback, choisit les tâches, gère les crédits, décide de la release | « Tout le monde a une idée. Moi, j'ai un planning. » |
| R2 | **Designer** | 3 PA. Responsable des fonctionnalités Design et Art. Seul à pouvoir faire un playtest | « Ça marche, d'accord. Mais est-ce que c'est fun ? » |
| R3 | **Programmeur(se)** | 3 PA. Responsable des fonctionnalités Prog. Relit et corrige le code | « Qui a écrit ça ? Ah. PIX. » |
| A1 | **PIX, agent codeur** | Produit jusqu'à 3 blocs par cycle, 1 crédit par bloc. Chaque bloc reçoit une carte Défaut face cachée | « Terminé ! Tout fonctionne parfaitement. » |
| A2 | **SCAN, agent testeur** | Teste jusqu'à 4 blocs par cycle, 1 crédit par test. Révèle les « Bug », jamais les « Pas fun » | « Aucun défaut détecté. Le joueur meurt en 4 secondes, conformément au code. » |

---

## 3. Les 20 cartes Fonctionnalité (la master feature list de SpacePlan)

**Taille :** charge *Low* = 1 bloc, *Medium* = 2 blocs, *High* = 3 blocs. **Valeur :** *Must* = 2 étoiles, *Should* = 3 étoiles, *Could* = 2 étoiles. **Chaque étoile livrée = 25 joueurs.**

### Les 5 Must Have (le premier jouable, cycle 0)

| Id | Fonctionnalité | Catégorie | Blocs | Étoiles | Responsable | Phrase d'ambiance |
|---|---|---|---|---|---|---|
| F01 | Apparition du vaisseau | Joueur | 1 | ★★ | Prog | « Sans vaisseau, c'est un fond d'écran. » |
| F02 | Contrôles : bouger et tirer | Gameplay | 1 | ★★ | Prog | « Gauche, droite, feu. Le reste, c'est du talent. » |
| F03 | Grille d'aliens : apparition, mouvement, tirs | Aliens | 1 | ★★ | Prog | « Ils arrivent. En rang, et très polis. » |
| F04 | Collision missile | Gameplay | 1 | ★★ | Design | « Touché ! Enfin… en théorie. » |
| F05 | Défaite et redémarrage | Interface | 2 | ★★ | Art | « Game over. Encore une partie ? » |

### Les 11 Should Have

| Id | Fonctionnalité | Catégorie | Blocs | Étoiles | Responsable | Phrase d'ambiance |
|---|---|---|---|---|---|---|
| F06 | Grille qui va jusqu'aux bords | Aliens | 1 | ★★★ | Prog | « Les aliens découvrent les côtés de l'écran. » |
| F07 | Grille qui descend | Aliens | 2 | ★★★ | Prog | « Plus ils descendent, plus on transpire. » |
| F08 | Explosions | Immersion | 3 | ★★★ | Art | « Boum. Enfin un peu de respect. » |
| F09 | Types de missiles | Interface | 1 | ★★★ | Art | « Les miens sont bleus. Les leurs, rouges. Merci. » |
| F10 | Réglage de la difficulté | Gameplay | 2 | ★★★ | Design | « Ni trop facile, ni impossible. Le plus dur à coder. » |
| F11 | Nouvelles vagues d'aliens | Aliens | 2 | ★★★ | Prog | « Vous pensiez avoir gagné ? » |
| F12 | Collision alien / vaisseau | Gameplay | 3 | ★★★ | Prog | « Le contact rapproché a enfin des conséquences. » |
| F13 | Système de score | Interface | 2 | ★★★ | Design | « Sans score, pas de rivalité. » |
| F14 | Victoire et récompense | Interface | 3 | ★★★ | Art | « Gagner, c'est bien. Le sentir, c'est mieux. » |
| F15 | Visuels, univers et ton | Immersion | 3 | ★★★ | Design | « Un jeu, c'est d'abord une ambiance. » |
| F16 | Fond spatial | Immersion | 1 | ★★★ | Art | « Des étoiles. Beaucoup d'étoiles. » |

### Les 4 Could Have

| Id | Fonctionnalité | Catégorie | Blocs | Étoiles | Responsable | Phrase d'ambiance |
|---|---|---|---|---|---|---|
| F17 | 3 types de vaisseaux | Joueur | 1 | ★★ | Design | « Rapide, solide ou équilibré ? » |
| F18 | Boucliers (vies) | Joueur | 2 | ★★ | Prog | « Une deuxième chance, puis une troisième. » |
| F19 | Puissance de feu (nombre de canons) | Joueur | 2 | ★★ | Design | « Deux canons, c'est deux fois plus de fun. Ou pas. » |
| F20 | Rencontrer SpaceTron | Immersion | 3 | ★★ | Art | « Il était temps qu'on se présente. » |

**Repères pour l'équilibrage :** 37 blocs au total (6 pour les Must, 23 pour les Should, 8 pour les Could) et 51 étoiles au maximum (1 275 joueurs). Une équipe ne peut pas tout faire en 4 cycles : **elle doit choisir**.

---

## 4. Le paquet de cartes Défaut (20 cartes)

Une carte Défaut est posée **face cachée** sur chaque bloc produit par PIX. Brief simple : on tire 1 carte. Brief détaillé : on en tire 2 et on garde la meilleure (l'autre retourne sous le paquet).

| Id | Type | Nombre | Révélé par | Effet s'il part en release |
|---|---|---|---|---|
| D01 – D12 | **Aucun défaut** | 12 | Relecture, test, playtest ou release | — |
| D13 – D17 | **Bug** | 5 | SCAN, relecture ou release | La fonctionnalité ne rapporte **aucun joueur** tant qu'elle n'est pas corrigée, et la note baisse de 0,5 |
| D18 – D20 | **Pas fun** | 3 | Playtest du designer, relecture ou release (**jamais par SCAN**) | La fonctionnalité ne rapporte que **la moitié de ses étoiles** (arrondi à l'inférieur) tant qu'elle n'est pas corrigée |

**Corriger un défaut révélé** coûte 1 PA au responsable de la fonctionnalité. La carte Défaut est alors défaussée.

**Phrases d'ambiance**
- *Aucun défaut :* « PIX : "Je vous l'avais dit." » / « Propre. Suspect, mais propre. » / « Rien à signaler, capitaine. »
- *Bug :* « PIX : "C'est impossible, j'ai tout vérifié." » / « Le vaisseau traverse les aliens. Comme un fantôme. » / « Le jeu se fige quand on tire trop vite. » / « Le score affiche −12. » / « L'alien touché ne disparaît pas. »
- *Pas fun :* « SCAN : "Fonctionnement conforme." Sam : "J'ai fermé le jeu." » / « Techniquement parfait. Humainement ennuyeux. » / « On gagne en 13 secondes. »

*Probabilités pour l'équilibrage : un bloc a 40 % de risque de défaut avec un brief simple, environ 16 % avec un brief détaillé.*

---

## 5. Les 24 cartes Feedback

Après chaque release, l'équipe pioche **1 carte Feedback pour 100 joueurs** (au total cumulé), placée dans la file **Feedback → Backlog**. Le chef de projet les trie (1 PA pour 2 cartes).

**Effet du tri, selon le type :**
- **Bug :** crée une tâche de correction de 1 bloc sur la fonctionnalité citée. Livrée, elle fait remonter la note de 0,5 (maximum 5).
- **Pas fun / Idée liée à une fonctionnalité :** on pose la carte sur la fonctionnalité citée. Si elle est livrée (ou corrigée) au cycle suivant, elle rapporte **+1 étoile**.
- **Hors liste / Compliment :** on l'écarte. Savoir dire non, c'est aussi du pilotage.
- **Les cartes de Nova comptent double :** +2 étoiles au lieu de +1, et elles comptent pour 2 dans la file d'attente.

**Si plus de 4 cartes attendent depuis plus d'un cycle, la note baisse de 0,5** : « la communauté se sent ignorée ».

*Les citations viennent des vrais playtests de SpacePlan (16 joueurs, prototype et alpha).*

| Id | Signée | Type | Citation | Fonctionnalité citée |
|---|---|---|---|---|
| FB01 | Lou | Bug | « La boîte de collision de mon vaisseau est trop large : je suis touchée alors que le tir ne me touche pas ! » | F04 |
| FB02 | Lou | Bug | « J'ai touché l'alien et il n'a pas disparu. » | F04 |
| FB03 | Lou | Idée | « Si j'appuie sans arrêt sur espace, je tue tous les aliens. Trop facile. » | F10 |
| FB04 | Lou | Idée | « Il nous faut des ennemis plus petits et plus nombreux. » | F11 |
| FB05 | Lou | Idée | « Quand je tire sur les côtés, les aliens restants restent au milieu. » | F06 |
| FB06 | Lou | Idée | « Mes missiles pourraient détruire ceux des aliens ? » | F09 |
| FB07 | Lou | Pas fun | « Le meilleur score est plafonné, il ne départage personne. » | F13 |
| FB08 | Lou | Pas fun | « Pourquoi un vaisseau avec plus de canons aurait aussi plus de boucliers ? » | F19 |
| FB09 | Lou | Compliment | « Le jeu est stable. Bravo, rien n'a planté. » | Hors liste |
| FB10 | Sam | Pas fun | « C'était rapide et facile… on pourrait avoir plus d'aliens ? » | F11 |
| FB11 | Sam | Pas fun | « Que je gagne ou que je perde, la fin est décevante. » | F14 |
| FB12 | Sam | Bug | « Je confonds les missiles des aliens et les miens. » | F09 |
| FB13 | Sam | Idée | « On pourrait avoir un bouton pause ? » | Hors liste |
| FB14 | Sam | Pas fun | « L'icône "Shield S", j'ai cru que c'était un 5. » | F15 |
| FB15 | Sam | Pas fun | « C'est dur au début, puis trop facile. Ça n'a pas de sens. » | F10 |
| FB16 | Sam | Compliment | « Les graphismes sont vraiment cool ! » | Hors liste |
| FB17 | Sam | Idée | « On pourrait avoir différents types d'aliens ? » | Hors liste |
| FB18 | Nova | Pas fun | « Quand je touche ou que je suis touchée, il ne se passe rien. Il faut des explosions ! » | F08 |
| FB19 | Nova | Pas fun | « L'espace paraît un peu statique. » | F16 |
| FB20 | Nova | Idée | « Dommage qu'il n'y ait pas de son… » | Hors liste |
| FB21 | Nova | Compliment | « La sensation de puissance du vaisseau est géniale ! » | Hors liste |
| FB22 | Nova | Pas fun | « Finir le jeu avec le meilleur vaisseau, ce n'est pas gratifiant. » | F14 |
| FB23 | Nova | Idée | « Un classement en ligne, et je fais un live tous les soirs ! » | Hors liste (une idée pour plus tard) |
| FB24 | Nova | Idée | « Un combat de boss pour finir en beauté ? » | Hors liste (une idée pour plus tard) |

---

## 6. Les cartes Événement (règles de base : un événement par cycle, sans choix)

**Le recto** montre le type, que Vera annonce un cycle à l'avance. **Le verso** décrit l'effet.

| Id | Type (recto) | Cycle | Événement (verso) | Effet |
|---|---|---|---|---|
| E1 | Communauté | 1 | **Les premiers joueurs arrivent.** Les forums s'animent. | Piochez 2 cartes Feedback de plus ce cycle |
| E2 | Technique | 2 | **Mise à jour du modèle de PIX.** Plus rapide, toujours aussi sûr de lui. | Ce cycle, PIX peut produire 4 blocs au lieu de 3 |
| E3 | Éditeur | 3 | **Vera veut une démo pour ses investisseurs.** | À la release de ce cycle, si un des 5 Must a un bug, la note baisse de 0,5 de plus |
| E4 | Communauté | 4 | **Nova joue en direct au festival.** Des milliers de spectateurs. | Ce cycle, chaque bug publié fait baisser la note de 1 au lieu de 0,5 |
| E5 | Technique | Rechange | **SCAN est en maintenance.** | Ce cycle, SCAN ne peut faire aucun test |
| E6 | Éditeur | Rechange | **Les crédits IA augmentent.** | Ce cycle, chaque action d'un agent coûte 2 crédits |

*Pour les premières parties, l'ordre est fixe (E1 à E4). E5 et E6 servent à varier les parties suivantes.*

---

## 7. Les messages de Vera (lus par l'animateur)

| Id | Moment | Message |
|---|---|---|
| V0 | Cycle 0 | « Bienvenue chez Nébuleuse Games. Montrez-moi un premier jouable : les cinq Must, rien de plus. » |
| V1 | Cycle 1 | « Les premiers joueurs arrivent. Écoutez-les… mais pas tous. Prochain événement : Technique. » |
| V2 | Cycle 2 | « PIX a été mis à jour. Plus vite, ce n'est pas forcément mieux. Prochain événement : Éditeur. » |
| V3 | Cycle 3 | « Mes investisseurs veulent une démo. Pas de bug sur l'essentiel, s'il vous plaît. Prochain événement : Communauté. » |
| V4 | Cycle 4 | « C'est le festival. Nova est en direct. Je compte sur vous. » |
| V5 | Fin | « Merci à tous les studios. Nébuleuse Games signe avec… » *(l'animateur annonce le studio en tête du leaderboard)* |

---

## 8. Le cycle 0 (guidé)

- Les **5 Must Have** (F01 à F05, 6 blocs) sont posés dans le Backlog.
- Pour ce cycle seulement : **PIX produit les 6 blocs, sans carte Défaut et sans coût en crédits.** L'animateur explique chaque étape de l'orbite pendant que les équipes avancent.
- Release : 5 fonctionnalités × 2 étoiles = 10 étoiles = **250 joueurs**. Au cycle 1, chaque équipe pioche donc **2 cartes Feedback**, plus 2 avec l'événement E1.

---

## 9. Le matériel à imprimer (récapitulatif)

| Élément | Quantité par équipe |
|---|---|
| Plateau A2 de l'orbite d'itération | 1 |
| Cartes Référence (R1 à R3, A1, A2) + aide-mémoire | 5 + 3 |
| Cartes Fonctionnalité (F01 à F20) | 20 |
| Cartes Défaut (D01 à D20) | 20 |
| Cartes Feedback (FB01 à FB24) | 24 |
| Jetons point d'action | 9 |
| Jetons crédit IA | 20 |
| Jetons bloc | 40 |
| Feuille de score | 1 |
| **Pour l'animateur :** cartes Événement (E1 à E6) et messages de Vera (V0 à V5) | 1 jeu |
