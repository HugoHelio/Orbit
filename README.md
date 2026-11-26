# Helioso Orbit

**Helioso Orbit** est un business game pour apprendre à **piloter une équipe humains + agents IA**, destiné aux écoles d'ingénieurs, aux IUT et, plus tard, aux business schools. Grande leçon : avec l'IA, le goulot d'étranglement passe de la production à la décision et à la vérification.

Le jeu se décline en scénarios : **Orbit : Studio** (un studio de jeu vidéo, le premier en développement), **Orbit : Média local** et **Orbit : Industrie**.

Un projet **Helioso**.

## Licence

Ce dépôt est **public, mais pas open source** : le code est visible, l'usage du jeu est sous licence Helioso. Le premier chapitre est gratuit ; la suite, et toute utilisation en cours, en atelier ou en formation (y compris par un établissement d'enseignement), demande une licence. Voir [`LICENSE.md`](LICENSE.md).

## Contenu du dépôt

| Dossier | Contenu |
|---|---|
| `docs/jeu/` | **Le GDD d'Orbit : Studio** (la référence du jeu), les cartes, la direction artistique et ce qu'on reprend de SpacePlan |
| `docs/offre/` | La proposition d'activité et les scénarios du business game |
| `docs/pilotage/` | Le plan de sprints 2027 |
| `docs/whiteboard/` | La sauvegarde du whiteboard du plateau (format JSON) et son lien |
| `prototype-papier/` | Les cartes et le plateau à imprimer (à partir du sprint 1) |
| `game/` | Le code du prototype web (à partir du sprint 3) |

Les données internes (contacts, contrats, prospection, scénarios de revenus) ne sont **pas** dans ce dépôt : elles sont dans Google Drive.

## Règles de travail

- Le **dépôt Git est la référence** pour tous les documents. Le projet claude.ai « Creation Activité AI » en garde une copie pour le contexte des conversations.
- Le **GDD** (`docs/jeu/gdd-orbit-studio.md`) est mis à jour à chaque décision de design, avec son journal des versions et son journal des décisions.
- À la fin de chaque session de travail : mise à jour des documents, export du whiteboard, puis **commit et push**.

## Liens

- Dépôt : https://github.com/HugoHelio/Orbit
- Whiteboard du plateau : https://claude.ai/artifact/6uS1vcS3rbC3wgpG6S7YHn
- Planches de style : https://claude.ai/artifact/4BPUkjWkmBSnmjL38LyVxb
- Le jeu en ligne (à venir) : https://orbit.helioso.com
