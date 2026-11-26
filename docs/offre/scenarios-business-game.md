# Scénarios du business game Helioso Orbit

*Document de conception — version 1, 25 novembre 2026.*

## Principe

Le business game s'appelle **Helioso Orbit**. Chaque scénario porte le nom « Orbit : … » : **Orbit : Studio**, **Orbit : Média local**, **Orbit : Industrie**.

Un seul moteur de jeu : une carte 2D où des tâches circulent entre humains et agents IA, avec des goulots, des retouches et des erreurs visibles. Les **règles restent les mêmes**, seul le **scénario** change selon le public. Un scénario est un fichier de configuration : le brief, les lots de travail, les ressources, les indicateurs et les événements aléatoires.

| # | Scénario | Publics | Inspiré de | Calendrier |
|---|---|---|---|---|
| 1 | **Orbit : Studio** (studio de jeu) | Écoles d'ingénieurs, BUT Informatique, MMI | SpacePlan | Janvier – avril 2027 (prototype et pilote) |
| 2 | **Orbit : Média local** | BUT GEA, TC, MMI, business schools | Fontainebleau Live (cas réel) | Été 2027 (voir point d'attention) |
| 3 | **Orbit : Industrie** | Écoles d'ingénieurs, BUT QLIO, GEII | À définir | Dans un 3e temps (2028) |

---

## Scénario 1 : Orbit : Studio

- **Brief :** un petit studio doit sortir en quelques semaines un jeu de type shoot'em up spatial, avec une équipe mixte d'humains et d'agents IA.
- **Lots de travail :** game design, code, graphismes, sons, tests, publication.
- **Ce qu'on apprend :** découper un projet technique, déléguer le code et les assets à des agents, organiser la vérification et les tests, gérer la dette technique créée par l'IA.
- *Le détail complet est dans le GDD : `docs/jeu/gdd-orbit-studio.md`.*

---

## Scénario 2 : Orbit : Média local

### Le brief

Une association de commerçants d'une ville fictive de taille moyenne veut lancer, en 8 tours de jeu (8 semaines fictives), **un agenda local en ligne des événements et des commerces**. L'objectif est d'atteindre une audience locale fidèle, avec un budget limité.

*Inspiré d'un cas réel : Fontainebleau Live, que j'ai conçu et que je fais tourner. C'est un argument fort en séance (« je l'ai fait »). La ville du jeu reste fictive pour laisser les étudiants libres de leurs choix.*

### Les lots de travail

1. **Collecte des événements :** automatiser la récupération des agendas (API Google, sites des associations, de la mairie).
2. **Rédaction des fiches** d'événements et de commerces.
3. **SEO local :** pages, mots-clés, fiches d'établissement.
4. **Diffusion :** réseaux sociaux, newsletter.
5. **Partenariats :** convaincre les commerçants, les associations et la mairie.
6. **Mesure :** audience, abonnés, retours.

### Les ressources

| Ressource | Forces | Limites et erreurs typiques |
|---|---|---|
| **Agent rédacteur** | Très rapide, peu cher | Erreurs factuelles (dates, lieux, horaires), ton uniforme |
| **Agent SEO** | Produit beaucoup de pages optimisées | Risque de sur-optimisation pénalisée par Google |
| **Agent automatisation** | Collecte les agendas en continu | Tombe en panne si une source change ; doublons |
| **Agent visuels** | Affiches et posts en série | Visuels génériques, droits à vérifier |
| **Chargé(e) de communication** | Ligne éditoriale, vérification | Lent, coûteux |
| **Développeur** | Configure et répare les automatisations | Ressource rare |
| **Responsable partenariats** | Relation de confiance avec les commerçants et la mairie | **L'IA ne peut pas le remplacer** |
| **Chef de projet** (le joueur) | Arbitre et priorise | Temps limité à chaque tour |

### Les indicateurs

- **Audience** (visites, abonnés)
- **Fiabilité** des informations : chaque erreur publiée fait baisser la confiance, et la confiance multiplie l'audience
- **Coût**
- **Partenaires** engagés

### Les événements aléatoires

- Un festival est annulé, mais l'agent l'a déjà publié partout.
- Google met à jour son algorithme et les pages sur-optimisées chutent.
- Un commerçant partenaire se plaint d'une fiche erronée.
- La mairie propose un partenariat, à condition de garantir la fiabilité.
- Le site d'agenda d'une association change de format et l'automatisation casse.

### Ce que les étudiants apprennent

- L'IA accélère énormément la **production** de contenu et l'automatisation.
- La **confiance** et la **relation locale** restent humaines, et ce sont elles qui font l'audience.
- Sans **vérification**, la vitesse de l'IA se retourne contre le projet.
- Marketing digital concret : SEO local, automatisation, construction d'une audience.

### Point d'attention sur le calendrier

Ce scénario est prévu pour l'été 2027. Mais si le pilote du printemps se fait avec un département **GEA, TC ou MMI** d'IUT, il faut l'avancer à la place du scénario 1 pour ce pilote. On décide de l'ordre quand l'interlocuteur du pilote est connu (sprint S5 ou S6).

---

## Scénario 3 : Orbit : Industrie (dans un 3e temps)

- **Publics :** écoles d'ingénieurs, BUT QLIO et GEII.
- **Pistes :** industrialiser un produit, réorganiser un atelier ou un service qualité avec des agents IA.
- *À concevoir en 2028, ou plus tôt si une école d'ingénieurs le demande.*
