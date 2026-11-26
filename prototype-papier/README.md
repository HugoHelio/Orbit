# Prototype papier — Orbit : Studio (v1.2)

Le kit à imprimer pour la première partie test. Style **B2 flat**, thème clair (voir `docs/jeu/direction-artistique.md`).

| Fichier | Contenu | Impression |
|---|---|---|
| `plateau-A2.pdf` | Le plateau de l'orbite d'itération | A2 paysage, 100 %, en reprographie |
| `plateau-4xA4.pdf` | Le même plateau en 4 morceaux (échelle 90 %, 12 mm de recouvrement) | A4 paysage, « taille réelle », puis scotcher |
| `cartes-recto.pdf` | Fonctionnalités F01–F20 et messages de Vera V0–V5 | A4, recto seul, 250 g |
| `cartes-recto-verso.pdf` | Défauts D01–D20, Feedback FB01–FB24, Événements E1–E6, avec leurs dos | A4, **recto verso, bord long**, 250 g |
| `livret.pdf` | Guide d'impression, 3 fiches de rôle A5 (une par joueur), l'explication des jetons, feuille de score, leaderboard et déroulé de l'animateur, planche de jetons | A4, recto seul |

Cartes de 63 × 88 mm (format des protège-cartes standard), 9 par page, jointives : on coupe sur les traits gris.

## Régénérer le kit

Le kit est **généré** à partir de `docs/jeu/cartes-orbit-studio.md` : on modifie une carte dans ce fichier, puis on relance le script. On ne retouche jamais les PDF à la main.

```
pip install playwright
playwright install chromium
python prototype-papier/outil/generer_kit.py
```

Le script écrit les PDF ici, et les pages HTML intermédiaires dans `prototype-papier/html/` (ignorées par Git). Les portraits viennent de `assets/personnages/`. La police Bricolage Grotesque (licence SIL OFL) est dans `outil/fonts/` ; Inter doit être installée sur l'ordinateur.
