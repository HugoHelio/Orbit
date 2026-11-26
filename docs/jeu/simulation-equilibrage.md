# Simulation d'équilibrage — Orbit : Studio

*26 novembre 2026. Script : `prototype-papier/outil/simuler.py` (il lit les cartes dans `docs/jeu/cartes-orbit-studio.md`). 2 000 parties par stratégie et par variante de règles. Relancer : `python prototype-papier/outil/simuler.py`.*

## Ce que simule le script

Les règles de base (GDD 0.9) avec les 8 décisions du 26 novembre : un brief par fonctionnalité, file d'attente de PIX, joueurs recalculés à chaque release, une carte Feedback par palier de 100 joueurs, bloc d'amélioration pour les idées sur une fonctionnalité déjà sortie, pioche Défauts remélangée.

Six équipes-robots jouent chacune une stratégie fixe :

| Stratégie | Priorité | Vérification | Feedback |
|---|---|---|---|
| A | Les fonctionnalités à 3 étoiles d'abord | Aucune, tout à PIX | Ignoré |
| B | Les Must d'abord | Aucune, tout à PIX | Ignoré |
| C | Les Must d'abord | Équilibrée : SCAN sur les blocs de PIX, playtest | Trié |
| D | Les Must d'abord | Prudente : briefs détaillés, relecture, SCAN, playtest | Trié |
| E | Les fonctionnalités à 3 étoiles d'abord | Équilibrée | Trié |
| F | Les Must d'abord | Aucune | Trié |

*Limite : les robots ne changent jamais de stratégie en cours de partie. De vrais joueurs à 0 point après le cycle 0 réagiraient. Les chiffres comparent des stratégies, ils ne prédisent pas le score d'une vraie équipe.*

## Avec les règles actuelles (R0)

| Stratégie | Score moyen | Médiane | 10 % pires | Joueurs | Note | Bugs publiés | Crédits restants | Jouable au cycle 0 | Blocs humains / PIX |
|---|---|---|---|---|---|---|---|---|---|
| A · Étoiles d'abord, tout à PIX, sans vérifier | 1149 | 625 | 0 | 743 | 1.24 | 3.2 | 7.0 | 0 % | 21 / 16 |
| B · Must d'abord, tout à PIX, sans vérifier | 350 | 0 | 0 | 1201 | 0.28 | 3.2 | 7.0 | 100 % | 21 / 16 |
| C · Must d'abord, équilibré (SCAN + tri) | 5590 | 5625 | 5125 | 1140 | 4.90 | 0.0 | 0.8 | 100 % | 15 / 13 |
| D · Must d'abord, prudent (briefs détaillés, relecture, SCAN, tri) | 4967 | 5000 | 4500 | 999 | 4.97 | 0.0 | 9.0 | 100 % | 15 / 9 |
| E · Étoiles d'abord, équilibré (SCAN + tri) | 0 | 0 | 0 | 0 | 4.54 | 0.2 | 0.0 | 0 % | 17 / 13 |
| F · Must d'abord, sans vérifier, mais tri du feedback | 2888 | 2875 | 1200 | 1195 | 2.40 | 2.9 | 8.1 | 100 % | 15 / 15 |

**Ce qui marche :**
- **Le premier jouable fonctionne** : viser les étoiles d'abord donne 0 joueur au cycle 0 (A et E).
- **Vérifier et trier le feedback paie** : C fait 5 à 15 fois mieux que A et B.
- **Trier le feedback compte beaucoup** : F (qui trie, sans vérifier) fait 8 fois mieux que B (qui ne trie pas).

**Les problèmes trouvés :**
1. **Les humains produisent autant que PIX** (21 blocs contre 16 pour A et B) : avec 1 PA par bloc, un humain fait 3 blocs par cycle, comme PIX. La leçon « les agents produisent plus » disparaît. Le GDD prévoyait au départ qu'un humain produise 1 bloc par cycle.
2. **La note sature à 5** pour les équipes prudentes (bonus de +0,5 par release sans défaut) : on ne distingue plus une bonne équipe d'une très bonne.
3. **La note s'effondre vers 0** pour les équipes qui ne vérifient pas : avec score = joueurs × note, B a le plus de joueurs mais un score proche de 0. Le nombre de joueurs ne veut plus rien dire.

## Avec les réglages proposés (R7)

R7 = règles actuelles, plus 4 changements :
1. **Un humain produit au plus 1 bloc par cycle** (toujours 1 PA).
2. **Au cycle 0, PIX produit jusqu'à 5 blocs** (sinon les 6 blocs des Must ne tiennent plus au cycle 0).
3. **Plus de bonus « release sans défaut »** : la note monte seulement quand on corrige un bug signalé par un joueur.
4. **La note ne descend pas sous 1.**

| Stratégie | Score moyen | Médiane | 10 % pires | Joueurs | Note | Bugs publiés | Crédits restants | Jouable au cycle 0 | Blocs humains / PIX |
|---|---|---|---|---|---|---|---|---|---|
| A · Étoiles d'abord, tout à PIX, sans vérifier | 0 | 0 | 0 | 0 | 1.19 | 3.2 | 7.0 | 0 % | 10 / 18 |
| B · Must d'abord, tout à PIX, sans vérifier | 986 | 1000 | 925 | 985 | 1.00 | 3.2 | 7.0 | 100 % | 10 / 18 |
| C · Must d'abord, équilibré (SCAN + tri) | 3724 | 3675 | 3150 | 1022 | 3.65 | 0.0 | 2.4 | 100 % | 9 / 14 |
| D · Must d'abord, prudent (briefs détaillés, relecture, SCAN, tri) | 3206 | 3150 | 2775 | 905 | 3.55 | 0.0 | 13.8 | 100 % | 10 / 8 |
| E · Étoiles d'abord, équilibré (SCAN + tri) | 0 | 0 | 0 | 0 | 3.00 | 0.0 | 0.4 | 0 % | 10 / 15 |
| F · Must d'abord, sans vérifier, mais tri du feedback | 2238 | 2150 | 1050 | 1055 | 2.12 | 2.6 | 8.9 | 100 % | 10 / 16 |

**Le classement devient celui qu'on veut enseigner :** équilibré (C) > prudent (D, trop lent : il lui reste 14 crédits) > sans vérifier mais à l'écoute (F) > sans vérifier ni écouter (B) > mauvaises priorités (A, E). PIX produit plus que les humains, le premier jouable reste la première épreuve, et le nombre de joueurs garde son sens.

**À surveiller pendant la partie test :** les bonnes équipes livrent environ 80 % des étoiles possibles. Le choix existe, mais il est encore modéré.

## Variantes testées et écartées

| Variante | Pourquoi elle est écartée |
|---|---|
| Les grosses fonctionnalités passent à 4 blocs | Change très peu les résultats |
| Produire soi-même coûte 2 PA par bloc | Rend le premier jouable impossible au cycle 0 (0 % des parties) |
| Garder le bonus « release sans défaut » avec les autres réglages | La note des équipes prudentes sature à 5 |
