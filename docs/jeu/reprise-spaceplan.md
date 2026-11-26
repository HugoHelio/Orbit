# Reprise de SpacePlan pour Orbit : Studio

*Inventaire des contenus de SpacePlan réutilisables dans Helioso Orbit — 26 novembre 2026. Source : dossier local `VS-Projects/HLC` (lecture seule).*

## 1. La master feature list (20 fonctionnalités)

Source : `public/SpacePlan/2-Pre-Production/SP-PP14-FL-Estimates2-StickK6` (liste classée, priorisée MoSCoW, estimée en « t-shirt sizing », avec un responsable par rôle). Elle vient du mindmap de conception (`SP-C8`, `SP-PP4`) et de la priorisation (`SP-PP5`).

| Rang | Priorité | Fonctionnalité | Charge | Responsable |
|---|---|---|---|---|
| 1 | Must Have | Spawn Player Ship | Low | Prog |
| 2 | Must Have | Ship controls: Move & Fire | Low | Prog |
| 3 | Must Have | Aliens grid spawns, moves & fires | Low | Prog |
| 4 | Must Have | Collision box with Missile | Low | Design |
| 5 | Must Have | Lose feedback & Restart | Medium | Art |
| 6 | Should Have | Aliens grid moving till border | Low | Prog |
| 7 | Should Have | Aliens grid moving down | Medium | Prog |
| 8 | Should Have | Explosions | High | Art |
| 9 | Should Have | Missile types | Low | Art |
| 10 | Should Have | Difficulty level tuning | Medium | Design |
| 11 | Should Have | New Alien grids spawn | Medium | Prog |
| 12 | Should Have | Collision Alien / Ship | High | Prog |
| 13 | Should Have | Scoring system | Medium | Design |
| 14 | Should Have | Win conditions & feedback | High | Art |
| 15 | Should Have | Visuals, Context & Tone | High | Design |
| 16 | Should Have | Space background | Low | Art |
| 17 | Could Have | 3 Ship types | Low | Design |
| 18 | Could Have | Shields [Lives] | Medium | Prog |
| 19 | Could Have | Fire Power [# of guns] | Medium | Design |
| 20 | Could Have | Meet SpaceTron | High | Art |

Les 20 fonctionnalités sont réparties en 5 catégories : Player, Alien, Gameplay, UI/UX, Immersion. *(L'utilisateur se souvenait de 22 fonctionnalités : 20 sont listées dans ce fichier ; les 2 autres sont à retrouver si elles existent ailleurs.)*

**Les 3 rôles de SpacePlan** (Luke, programmeur ; Kira, artiste ; Ben, designer) correspondent presque exactement aux rôles d'Orbit : Studio (programmeur, designer, chef de projet). Les responsables de la liste servent à savoir **qui doit relire** ce qu'un agent a produit.

## 2. Les problèmes de design (insights de playtest)

Ce sont des retours de 16 joueurs, à chaque étape, rédigés comme de vrais rapports de playtest. **Ils peuvent devenir directement les cartes Feedback** (avec leurs citations, attribuées à Lou, Sam ou Nova).

### Prototype (`1-Conception/SP-C15`)
1. **Manque de défi :** trop facile, trop court (13 s en moyenne pour finir le niveau). « Si j'appuie sans arrêt sur espace, je tue tous les aliens. » « Les aliens restants restent au milieu et ne vont pas sur les côtés. »
2. **Frustrations de gameplay :** la boîte de collision du vaisseau est trop large ; la collision avec les aliens ne marche pas.
3. **Manque de feedback :** pas d'explosions, fin de partie décevante, on confond les missiles des aliens et les siens.
4. **Recommandations :** corriger les collisions, ajouter des explosions, ajouter de la profondeur en production.

### Alpha (`3-Production/SP-PR14`)
1. **Progression de difficulté illogique :** trop dur avec les premiers vaisseaux, trop facile avec les meilleurs. « Pourquoi un vaisseau avec plus de canons aurait aussi plus de boucliers ? »
2. **Pas de sentiment d'accomplissement :** tout le monde finit le jeu avec le meilleur vaisseau, les scores ne départagent pas les joueurs.
3. **Ressenti et immersion :** pas de son, l'espace paraît statique, l'icône « Shield S » ressemble à un 5, demande d'un bouton pause.
4. **Recommandations :** difficulté progressive, scores comparables, finitions de l'interface, combat de boss ou fin de jeu gratifiante.

*À compléter avec les insights de la PoC (`2-Pre-Production/SP-PP26`) et de la bêta.*

## 3. Le jeu lui-même : 4 versions jouables déjà codées

Le mini-jeu SpacePlan (shoot'em up en JavaScript, sur un `canvas`) existe à 4 étapes de développement :

| Étape | Fichier | Taille |
|---|---|---|
| Prototype | `public/js/SpacePlan/1-Conception/SP-C14-Proto-SpacePlan-Playtest/index.js` | 38 Ko |
| PoC (preuve de concept) | `public/js/SpacePlan/2-Pre-Production/SP-PP25-PoC-SpacePlan-Playtest/index.js` | 42 Ko |
| Alpha | `public/js/SpacePlan/3-Production/SP-PR13-Alpha-Playtest/index.js` | 56 Ko |
| Bêta | `public/SpacePlan/4-Closing/SP-CL10-Beta-SpacePlan-Playtest/index.js` (+ images) | 31 Ko |

Classes principales (Alpha) : `Player`, `Projectile`, `Invader`, `InvaderProjectile`, `Grid`, `Particle`.

**Idée forte :** à chaque release dans Orbit : Studio, l'équipe **joue vraiment à son jeu**. Le jeu affiché n'active que les fonctionnalités que l'équipe a livrées (et montre les défauts qu'elle a laissés passer : collision trop large, pas d'explosions…). Le logiciel devient visible, et le feedback des joueurs prend tout son sens.

**Point d'attention :** le code de SpacePlan est sous la licence commerciale SpacePlan. Le copier dans le dépôt public `Orbit` est possible (même titulaire), mais il faudra le placer sous la licence Helioso, ou le garder dans la partie non publique (open core).

## 4. Autres contenus réutilisables (à explorer)

- Mindmap des fonctionnalités (`SP-C8`, `SP-PP4`) : pour le cycle 0 (le pitch).
- Dépendances entre fonctionnalités (`SP-PP8`, `SP-PP9`) : pour une règle simple « cette fonctionnalité demande celle-là ».
- Gestion des risques (`SP-PP16`) et du budget (`SP-PP17` à `SP-PP19`) : pour des cartes événements.
- Plan de test (`SP-PR11`) et rapport de tests (`SP-PR15`) : pour le rôle de SCAN.
- Rétrospectives (`SP-C16`, `SP-PP27`, `SP-PR16`) : pour le débrief.
