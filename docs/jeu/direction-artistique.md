# Direction artistique — Helioso Orbit

*Décidée le 26 novembre 2026. Planches de référence : canevas « Helioso Orbit — planches de style comparatives » (https://claude.ai/artifact/4BPUkjWkmBSnmjL38LyVxb), planches **B2** (papier), **C** (numérique sombre) et **D** (numérique clair).*

## 1. Les principes

- **Une seule palette**, reprise de HLC v2.0 (`stylegeneral.css`), pour le papier comme pour le numérique : on reconnaît le même jeu sur tous les supports.
- **Deux thèmes** dans le jeu numérique :
  - **Clair** (par défaut) : pour les salles éclairées, les projections en plein jour, les tablettes, et en cohérence avec le kit papier.
  - **Sombre « Tech »** : pour les écrans, les salles obscures, et les étudiants qui le préfèrent.
  - Chaque joueur ou l'animateur peut basculer de l'un à l'autre à tout moment.
- **Le kit papier suit le thème clair**, en style **flat** : aplats francs, contours épais bleu nuit, formes géométriques.
- **Le centre du plateau est un soleil**, dessiné comme un simple disque ambre (le pilotage, l'équipe humaine), et les stations sont des planètes en orbite : *hélios*, Helioso.

## 2. La palette

| Nom | Code | Rôle |
|---|---|---|
| Bleu nuit profond | `#0A1114` | Fond du thème sombre |
| Bleu nuit | `#0D2329` | Encre : texte et contours du thème clair et du papier ; surfaces secondaires du thème sombre |
| Sarcelle | `#23C2AA` | Couleur principale : actions, Fonctionnalités, éditeur |
| Cyan | `#0AE2EA` | Couleur secondaire : agents IA, station active |
| Ambre | `#FBAB00` | Soleil du pilotage, gamers, étoiles, files d'attente (papier), Feedback |
| Gris sauge | `#B9CAC9` | Éléments neutres, décor |
| Rouge corail | `#E5484D` (clair) / `#F87171` (sombre) | Défauts et alertes (ajouté : HLC v2.0 n'avait pas de couleur d'alerte) |

## 3. Les deux thèmes (variables pour le jeu numérique)

| Variable | Thème clair | Thème sombre « Tech » |
|---|---|---|
| `--bg` (fond) | `#E9F3F1` | `#0A1114` |
| `--surface` (panneaux, cartes) | `#FFFFFF` | `#161F22` |
| `--surface-2` (zones internes, pastilles) | `#E9F3F1` | `#0D2329` |
| `--border` | ombre douce, sans bordure | `#24313A` |
| `--text` | `#0D2329` | `#E6EDF3` |
| `--text-muted` | `#4B5F63` | `#8CA3AB` |
| `--accent` (remplissage) | `#23C2AA` | `#23C2AA` |
| `--accent-text` (texte sur fond clair) | `#0E7C6B` | `#0AE2EA` |
| `--agent` | `#0AE2EA` | `#0AE2EA` |
| `--sun` | `#FBAB00` | `#FBAB00` |
| `--sun-text` (texte ambre lisible) | `#8A5A00` | `#FBAB00` |
| `--danger` | `#E5484D` | `#F87171` |
| `--queue` (files d'attente) | `#F26B5B` | `#FBAB00` |

**Contraste :** sur fond clair, ne jamais écrire en sarcelle `#23C2AA` ou en ambre `#FBAB00` (trop pâles) : utiliser `--accent-text` et `--sun-text`.

## 4. La typographie

| Usage | Police |
|---|---|
| Titres, noms de cartes (papier et thème clair) | **Bricolage Grotesque** 800 |
| Titres du thème sombre | **Inter** 900, majuscules espacées pour les petites étiquettes |
| Règles, citations, interface | **Inter** 400 à 700 |

Corps de texte imprimé : 11 pt minimum sur les cartes.

## 5. Les couleurs par type de carte

| Carte | Bandeau ou bordure |
|---|---|
| Fonctionnalité | Sarcelle |
| Défaut | Rouge corail |
| Feedback | Ambre |
| Événement | Bleu nuit (texte blanc) |
| Fiche de rôle (A5, une par joueur) | Sarcelle pour l'étiquette, jetons PA en ambre |
| Message de Vera | Sarcelle, avec son portrait |

## 6. Le papier (kit prototype)

- Fond blanc, plateau sur `#EEF3F3`, contours **3 px bleu nuit `#0D2329`**, coins arrondis.
- Frises géométriques en bordure du plateau (clin d'œil aux références Esther Mahlangu de SpacePlan).
- Files d'attente : cases ambre ; pilotage : **grand disque ambre au centre, sans rayons** (plus lisible, moins chargé).
- Impression économique : peu d'aplats sombres, sauf le bandeau des cartes Événement.

## 7. Les personnages en pixel art

- **Portraits des personnages** (Vera, les agents et les trois fondateurs du studio) dans `assets/personnages/` (un fichier `<nom>-portrait.png` par personnage, fond transparent, à afficher dans un cercle) : Vera, Max, Sam, Nora, PIX et SCAN. Le détail est dans le GDD (section 4, « Les portraits »).
- **Les agents sont des robots de la même famille** (dérivés de K6, la mascotte de SpacePlan), en grille de 19 × 30 pixels : **PIX en ambre**, **SCAN en cyan** (la couleur des agents). Contours bleu nuit `#0D2329`.
- **Affichage :** toujours en `image-rendering: pixelated`, jamais lissé.
- **À faire :** une passe de retouche des portraits humains (issus de générations IA de SpacePlan), pour un style homogène et unique.


## 8. Les variables dérivées (jeu numérique)

Le plateau numérique (`game/plateau/style.css`) ajoute quelques variables tirées de la palette, pour ne jamais écrire de couleur en dur dans les composants :

| Variable | Thème clair | Thème sombre « Tech » | Rôle |
|---|---|---|---|
| `--ink` | `#0D2329` | `#0D2329` | Encre bleu nuit : texte et contours posés sur l'ambre ou le cyan |
| `--line` | `#0D2329` | `#2E4550` | Contours du style flat (planètes, vaisseaux) |
| `--line-soft` | `#B9CAC9` | `#24313A` | Traits secondaires, éléments éteints |
| `--ciel` | `#B9CAC9` | `#8CA3AB` | Étoiles du fond |
| `--fond-plateau` | `#F4FAF9` | `#0C1518` | Fond du cadre du plateau |
| `--halo-soleil`, `--halo-agent` | ambre et cyan transparents | idem, un peu plus forts | Lueurs du soleil et de la station active |
| `--sur-accent`, `--sur-danger` | `#0D2329`, `#FFFFFF` | `#0A1114`, `#0A1114` | Texte posé sur un aplat sarcelle ou rouge |
| `--sur-encre` | `#FFFFFF` | `#E6EDF3` | Texte posé sur un aplat bleu nuit (carte Événement) |

**L'écran de jeu des schémas de feedback.** Les cartes Feedback montrent un petit écran de jeu, dans le style des prototypes de SpacePlan. Il est sombre dans les deux thèmes, avec ses propres variables : `--ecran-fond` (`#0A1114`), `--ecran-vaisseau` (rouge corail, le vaisseau en triangle), `--ecran-alien` (`#6DBE4B`, les aliens en cercles), `--ecran-tir` (ambre, les tirs du joueur), `--ecran-tir-alien` (`#FF8A3D`, les tirs des aliens), `--ecran-boite` (cyan, les boîtes de collision et **le souhait du gamer, en pointillés**), `--ecran-texte` (`#E6EDF3`).
