# Les versions jouables de SpacePlan

Le mini-jeu SpacePlan (un shoot'em up en JavaScript sur `canvas`) à ses 4 étapes de développement, repris du projet SpacePlan (même titulaire) et désormais sous **licence Helioso** (voir `LICENSE.md` à la racine).

| Dossier | Étape | Source d'origine |
|---|---|---|
| `1-prototype/` | Prototype (conception) | `SP-C14-Proto-SpacePlan-Playtest` |
| `2-poc/` | Preuve de concept (pré-production) | `SP-PP25-PoC-SpacePlan-Playtest` |
| `3-alpha/` | Alpha (production) | `SP-PR13-Alpha-Playtest` |
| `4-beta/` | Bêta (finalisation), avec ses images | `SP-CL10-Beta-SpacePlan-Playtest` |
| `assets/img/` | Images partagées (vaisseaux, aliens, compte à rebours) | `public/assets/img` |

**État :** les fichiers sont copiés tels quels. Ils dépendent encore de la plateforme SpacePlan (`SP-main.js`, jQuery, chemins `../../../assets/`). Les rendre jouables seuls, dans le navigateur, est une tâche du sprint S3.

**Usage dans Orbit : Studio :** à chaque release, l'équipe joue à la version qui correspond à ce qu'elle a livré. Plus tard, le jeu numérique activera les fonctionnalités une par une (voir la section 12 du GDD).
