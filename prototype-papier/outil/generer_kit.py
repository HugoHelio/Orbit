"""Génère le kit papier d'Orbit : Studio (cartes, plateau, livret) en HTML puis en PDF.

Source unique : docs/jeu/cartes-orbit-studio.md. Modifier les cartes dans ce fichier,
puis relancer :  python prototype-papier/outil/generer_kit.py
Dépendance : pip install playwright && playwright install chromium
"""
import base64, math, re, sys
from pathlib import Path

ICI = Path(__file__).resolve().parent
RACINE = ICI.parents[1] if (ICI.parents[1] / "docs").exists() else ICI
SOURCE = RACINE / "docs/jeu/cartes-orbit-studio.md"
SORTIE = RACINE / "prototype-papier"
POLICES = ICI / "fonts"
PORTRAITS = RACINE / "assets/personnages"

NAVY, NAVY0, TEAL, CYAN, AMBER, SAGE, CORAL = "#0D2329", "#0A1114", "#23C2AA", "#0AE2EA", "#FBAB00", "#B9CAC9", "#E5484D"
TEAL_T, AMBER_T, MUTED, BG = "#0E7C6B", "#8A5A00", "#4B5F63", "#EEF3F3"

# ---------------------------------------------------------------- lecture du .md
md = SOURCE.read_text(encoding="utf-8")


def tables_sous(titre):
    """Renvoie les lignes (listes de cellules) des tableaux d'une section ## ou ###."""
    m = re.search(r"^#{2,3} .*" + re.escape(titre) + r".*$", md, re.M)
    bloc = md[m.end():]
    fin = re.search(r"^#{2,3} ", bloc, re.M)
    bloc = bloc[: fin.start()] if fin else bloc
    lignes = []
    for l in bloc.splitlines():
        if l.startswith("|") and not re.match(r"^\|[-| ]+\|$", l):
            cells = [c.strip() for c in l.strip().strip("|").split("|")]
            lignes.append(cells)
    return [l for l in lignes if l[0] not in ("Id", "Action", "Élément")]


def nettoie(t):
    t = t.replace("**", "").replace("« ", "").replace(" »", "")
    return t.strip()


def gras(t):
    return re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", t)


actions = [l for l in tables_sous("Les actions (reprises") ]
refs = [l for l in tables_sous("fiches de rôle et les agents") if l[0].startswith("R")]
feats = []
for l in tables_sous("règle du MVP"):
    feats.append(dict(id=l[0], nom=l[1], cat=l[2], blocs=int(l[3]), etoiles=l[4].count("★"),
                      resp=l[5], prio=l[6], phrase=nettoie(l[7]),
                      idee_gamer=len(l) > 8 and "gamer" in l[8].lower()))
MUSTS = [f for f in feats if f["prio"] == "Must"]
NOMS_F = {f["id"]: f["nom"] for f in feats}
feedbacks = [dict(id=l[0], type=l[1], cit=nettoie(l[2]), cible=l[3]) for l in tables_sous("24 cartes Feedback")]
events = [dict(id=l[0], type=l[1], cycle=l[2], texte=l[3], effet=l[4]) for l in tables_sous("cartes Événement")]
veras = [dict(id=l[0], moment=l[1], msg=l[2]) for l in tables_sous("messages de Vera")]

phr = re.search(r"\*\*Phrases d'ambiance\*\*(.*?)\n\n", md, re.S).group(1)


def phrases(prefixe):
    ligne = [l for l in phr.splitlines() if l.startswith(f"- *{prefixe}")][0]
    return [p.strip() for p in re.findall(r"«(.+?)»(?= /|$)", ligne.split(":*", 1)[1].strip())]


PH = {"Aucun": phrases("OK"), "Bug bloquant": phrases("Bug bloquant"), "Bug mineur": phrases("Bug mineur"),
      "Pas fun": phrases("Pas fun")}
dtab = {l[1].replace("*", ""): l for l in tables_sous("paquet de cartes Test")}
defauts = []
for typ, cle in (("OK", "Aucun"), ("Bug bloquant", "Bug bloquant"), ("Bug mineur", "Bug mineur"), ("Pas fun", "Pas fun")):
    l = dtab[typ]
    a, b = [int(x) for x in re.findall(r"\d+", l[0])]
    for i, n in enumerate(range(a, b + 1)):
        defauts.append(dict(id=f"T{n:02d}", type=typ, cle=cle, revele=l[3].replace("**", ""),
                            effet=gras(l[4]), phrase=PH[cle][i % len(PH[cle])]))

def portrait(nom):
    f = PORTRAITS / f"{nom}-portrait.png"
    return "data:image/png;base64," + base64.b64encode(f.read_bytes()).decode()


PORT = {n: portrait(n) for n in ("max", "sam", "nora", "vera", "pix", "scan")}


def img_portrait(nom, taille=10, fond=SAGE):
    return (f'<div style="width:{taille}mm;height:{taille}mm;border-radius:50%;border:.6mm solid {NAVY};background:{fond};overflow:hidden;flex:none">'
            f'<img src="{PORT[nom]}" style="width:100%;height:100%;image-rendering:pixelated;display:block"></div>')


# ---------------------------------------------------------------- petites formes SVG


def etoile(taille=5.2, coul=AMBER):
    pts = []
    for k in range(10):
        r = 50 if k % 2 == 0 else 21
        a = math.pi / 2 + k * math.pi / 5
        pts.append(f"{50 + r * math.cos(a):.1f},{55 - r * math.sin(a):.1f}")
    return (f'<svg viewBox="0 0 100 100" style="width:{taille}mm;height:{taille}mm">'
            f'<polygon points="{" ".join(pts)}" fill="{coul}" stroke="{NAVY}" stroke-width="7" stroke-linejoin="round"/></svg>')


ICONES = {
    "check": f'<circle cx="50" cy="50" r="42" fill="{TEAL}" stroke="{NAVY}" stroke-width="7"/><path d="M30 52 L45 66 L71 36" fill="none" stroke="{NAVY}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>',
    "bug": f'<ellipse cx="50" cy="58" rx="24" ry="30" fill="{CORAL}" stroke="{NAVY}" stroke-width="7"/><circle cx="50" cy="26" r="13" fill="{CORAL}" stroke="{NAVY}" stroke-width="7"/>'
           f'<path d="M26 48 L10 40 M26 62 L8 62 M28 76 L12 86 M74 48 L90 40 M74 62 L92 62 M72 76 L88 86 M50 34 L50 86" stroke="{NAVY}" stroke-width="6" stroke-linecap="round"/>',
    "ennui": f'<circle cx="50" cy="50" r="42" fill="{CORAL}" stroke="{NAVY}" stroke-width="7"/><circle cx="36" cy="42" r="5" fill="{NAVY}"/><circle cx="64" cy="42" r="5" fill="{NAVY}"/><path d="M32 70 L68 66" stroke="{NAVY}" stroke-width="7" stroke-linecap="round"/>',
    "q": f'<circle cx="50" cy="50" r="42" fill="#fff" stroke="{CORAL}" stroke-width="9"/><text x="50" y="70" text-anchor="middle" font-family="Bricolage Grotesque" font-weight="800" font-size="58" fill="{CORAL}">?</text>',
    "bulle": f'<path d="M14 18 H86 Q92 18 92 24 V64 Q92 70 86 70 H44 L26 88 L30 70 H14 Q8 70 8 64 V24 Q8 18 14 18Z" fill="{AMBER}" stroke="{NAVY}" stroke-width="7" stroke-linejoin="round"/><circle cx="32" cy="44" r="6" fill="{NAVY}"/><circle cx="50" cy="44" r="6" fill="{NAVY}"/><circle cx="68" cy="44" r="6" fill="{NAVY}"/>',
    "Communauté": f'<circle cx="34" cy="36" r="14" fill="{SAGE}" stroke="{NAVY}" stroke-width="6"/><circle cx="66" cy="36" r="14" fill="{AMBER}" stroke="{NAVY}" stroke-width="6"/><path d="M10 84 Q10 58 34 58 Q50 58 50 74 Q50 58 66 58 Q90 58 90 84Z" fill="#fff" stroke="{NAVY}" stroke-width="6" stroke-linejoin="round"/>',
    "Technique": f'<circle cx="50" cy="50" r="22" fill="{CYAN}" stroke="{NAVY}" stroke-width="6"/>' + "".join(
        f'<rect x="44" y="8" width="12" height="16" rx="2" fill="{CYAN}" stroke="{NAVY}" stroke-width="5" transform="rotate({a} 50 50)"/>' for a in range(0, 360, 45)) + f'<circle cx="50" cy="50" r="8" fill="#fff" stroke="{NAVY}" stroke-width="5"/>',
    "Éditeur": f'<rect x="14" y="30" width="72" height="52" rx="6" fill="{TEAL}" stroke="{NAVY}" stroke-width="6"/><path d="M36 30 V20 Q36 14 42 14 H58 Q64 14 64 20 V30" fill="none" stroke="{NAVY}" stroke-width="6"/><path d="M14 52 H86" stroke="{NAVY}" stroke-width="6"/>',
    "soleil": f'<circle cx="50" cy="50" r="24" fill="{AMBER}" stroke="{NAVY}" stroke-width="6"/>' + "".join(
        f'<path d="M50 6 L56 20 L44 20Z" fill="{AMBER}" stroke="{NAVY}" stroke-width="4" stroke-linejoin="round" transform="rotate({a} 50 50)"/>' for a in range(0, 360, 45)),
    "agent": f'<rect x="18" y="26" width="64" height="54" rx="10" fill="{CYAN}" stroke="{NAVY}" stroke-width="6"/><circle cx="38" cy="50" r="7" fill="{NAVY}"/><circle cx="62" cy="50" r="7" fill="{NAVY}"/><path d="M38 66 H62 M50 26 V12" stroke="{NAVY}" stroke-width="6" stroke-linecap="round"/><circle cx="50" cy="10" r="5" fill="{AMBER}" stroke="{NAVY}" stroke-width="4"/>',
    "humain": f'<circle cx="50" cy="32" r="18" fill="{SAGE}" stroke="{NAVY}" stroke-width="6"/><path d="M16 88 Q16 56 50 56 Q84 56 84 88Z" fill="{SAGE}" stroke="{NAVY}" stroke-width="6" stroke-linejoin="round"/>',
    "vera": f'<circle cx="50" cy="34" r="18" fill="{TEAL}" stroke="{NAVY}" stroke-width="6"/><path d="M16 88 Q16 58 50 58 Q84 58 84 88Z" fill="{TEAL}" stroke="{NAVY}" stroke-width="6" stroke-linejoin="round"/><path d="M40 70 L50 80 L60 70" fill="none" stroke="{NAVY}" stroke-width="5"/>',
}


def icone(nom, taille=14):
    return f'<svg viewBox="0 0 100 100" style="width:{taille}mm;height:{taille}mm">{ICONES[nom]}</svg>'


def polices_css():
    css = ""
    for f in sorted(POLICES.glob("*.woff2")):
        b64 = base64.b64encode(f.read_bytes()).decode()
        css += f"@font-face{{font-family:'Bricolage Grotesque';font-weight:800;src:url(data:font/woff2;base64,{b64}) format('woff2');}}\n"
    return css


CSS = polices_css() + f"""
*{{box-sizing:border-box;margin:0;padding:0}}
body{{font-family:Inter,sans-serif;color:{NAVY};-webkit-print-color-adjust:exact;print-color-adjust:exact}}
.t{{font-family:'Bricolage Grotesque',Inter,sans-serif;font-weight:800;letter-spacing:-.01em;line-height:1.05}}
.feuille{{width:210mm;height:297mm;position:relative;page-break-after:always;overflow:hidden}}
.grille{{position:absolute;left:10.5mm;top:16.5mm;display:grid;grid-template-columns:repeat(3,63mm);grid-template-rows:repeat(3,88mm)}}
.carte{{width:63mm;height:88mm;padding:2.2mm}}
.in{{height:100%;border:.8mm solid {NAVY};border-radius:3.2mm;overflow:hidden;display:flex;flex-direction:column;background:#fff;position:relative}}
.bande{{display:flex;justify-content:space-between;align-items:center;padding:1.6mm 3mm;border-bottom:.8mm solid {NAVY};font-size:7.5pt;font-weight:800;letter-spacing:.08em;text-transform:uppercase}}
.corps{{padding:2.6mm 3mm 2.2mm;display:flex;flex-direction:column;gap:2mm;flex:1}}
.nom{{font-size:15pt}}
.txt{{font-size:10pt;line-height:1.28}}
.cit{{font-size:11.5pt;line-height:1.3;font-style:italic}}
.ph{{font-size:9.5pt;font-style:italic;color:{MUTED};line-height:1.25}}
.bas{{margin-top:auto;display:flex;justify-content:space-between;align-items:flex-end;gap:2mm}}
.pas{{display:flex;gap:1.2mm;align-items:center}}
.bloc{{width:7mm;height:7mm;border:.6mm solid {NAVY};border-radius:1mm;background:{SAGE}}}
.pill{{display:inline-block;border:.5mm solid {NAVY};border-radius:10mm;padding:.5mm 2.2mm;font-size:7.5pt;font-weight:700;background:#fff}}
.lab{{font-size:6.8pt;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:{MUTED}}}
.id{{font-size:6.5pt;font-weight:700;color:{MUTED};letter-spacing:.06em}}
.centre{{align-items:center;justify-content:center;text-align:center}}
.coupe{{position:absolute;inset:0;pointer-events:none}}
"""


def page_html(titre, corps, taille="A4", extra_css=""):
    return f"""<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>{titre}</title>
<style>@page{{size:{taille};margin:0}}{CSS}{extra_css}</style></head><body>{corps}</body></html>"""


def traits_coupe():
    xs = [10.5 + 63 * i for i in range(4)]
    ys = [16.5 + 88 * i for i in range(4)]
    s = '<svg class="coupe" viewBox="0 0 210 297" style="width:210mm;height:297mm">'
    for x in xs:
        s += f'<line x1="{x}" y1="4" x2="{x}" y2="13" stroke="{MUTED}" stroke-width=".2"/><line x1="{x}" y1="284" x2="{x}" y2="293" stroke="{MUTED}" stroke-width=".2"/>'
    for y in ys:
        s += f'<line x1="2" y1="{y}" x2="8.5" y2="{y}" stroke="{MUTED}" stroke-width=".2"/><line x1="201.5" y1="{y}" x2="208" y2="{y}" stroke="{MUTED}" stroke-width=".2"/>'
    return s + "</svg>"


def feuilles(cartes, pied, dos=None):
    """9 cartes par A4. Si dos est donné, une page de dos (miroir, bord long) suit chaque page."""
    out = ""
    for p in range(0, len(cartes), 9):
        lot = cartes[p:p + 9]
        cells = lot + [""] * (9 - len(lot))
        out += f'<div class="feuille">{traits_coupe()}<div class="grille">' + "".join(
            f'<div class="carte">{c}</div>' for c in cells) + f'</div><div style="position:absolute;bottom:5mm;left:0;right:0;text-align:center" class="id">{pied} · recto · page {p // 9 + 1}</div></div>'
        if dos:
            miroir = [""] * 9
            for i in range(len(lot)):
                r, c = divmod(i, 3)
                miroir[r * 3 + (2 - c)] = dos(lot_items[p + i]) if callable(dos) else dos
            out += f'<div class="feuille">{traits_coupe()}<div class="grille">' + "".join(
                f'<div class="carte">{c}</div>' for c in miroir) + f'</div><div style="position:absolute;bottom:5mm;left:0;right:0;text-align:center" class="id">{pied} · verso · page {p // 9 + 1}</div></div>'
    return out


# ---------------------------------------------------------------- les cartes
def c_feat(f):
    blocs = "".join('<div class="bloc"></div>' for _ in range(f["blocs"]))
    et = "".join(etoile() for _ in range(f["etoiles"]))
    resp = {"Prog": "Programmeur", "Design": "Designer", "Art": "Designer (art)"}[f["resp"]]
    return f"""<div class="in"><div class="bande" style="background:{TEAL}"><span>{f['cat']}</span><span>{f['id']}</span></div>
<div class="corps"><div class="t nom">{f['nom']}</div>
<div><div class="lab">Taille</div><div class="pas" style="margin-top:1mm">{blocs}<span class="txt" style="margin-left:1mm">{f['blocs']} effort{'s' if f['blocs'] > 1 else ''}</span></div></div>
<div><div class="lab">Valeur</div><div class="pas" style="margin-top:1mm">{et}<span class="txt" style="margin-left:1mm">{f['etoiles'] * 25} gamers</span></div></div>
<div class="ph">« {f['phrase']} »</div>
<div class="bas"><span class="pill">{resp}</span><span class="lab">{'Idée de gamer' if f.get('idee_gamer') else 'Fonctionnalité'}</span></div></div></div>"""


def c_defaut(d):
    ic = {"Aucun": "check", "Bug bloquant": "bug", "Bug mineur": "bug", "Pas fun": "ennui"}[d["cle"]]
    effet = "Rien à signaler : cet effort est propre." if d["cle"] == "Aucun" else d["effet"]
    corr = "" if d["cle"] == "Aucun" else '<div class="txt" style="font-size:8.5pt;margin-top:1mm"><b>Corriger :</b> 1 heure du responsable ; le ticket recule au Build.</div>'
    return f"""<div class="in"><div class="bande" style="background:{CORAL}"><span>Test</span><span>{d['id']}</span></div>
<div class="corps"><div style="display:flex;align-items:center;gap:2.5mm">{icone(ic, 15)}<div class="t nom" style="font-size:17pt">{d['type']}</div></div>
<div class="txt" style="font-size:9pt"><b>Révélé par :</b> {d['revele']}</div>
<div style="border:.6mm solid {NAVY};border-radius:2mm;padding:2mm;background:{BG}"><div class="lab" style="margin-bottom:.8mm">S'il part en release</div><div class="txt" style="font-size:9pt">{effet}</div>{corr}</div>
<div class="ph" style="margin-top:auto">« {d['phrase']} »</div></div></div>"""


DOS_DEFAUT = f"""<div class="in centre" style="border-color:{NAVY}"><div style="position:absolute;inset:2.2mm;border:1.2mm solid {CORAL};border-radius:2mm"></div>
<div style="display:flex;flex-direction:column;align-items:center;gap:3mm">{icone('q', 26)}<div class="t" style="font-size:18pt">Test ?</div>
<div class="ph" style="max-width:40mm">Face cachée sous chaque effort fait par PIX</div><div class="lab">Helioso Orbit</div></div></div>"""


def c_feedback(fb):
    typ = {"Bug": CORAL, "Pas fun": CORAL, "Idée": TEAL, "Compliment": SAGE}[fb["type"]]
    cible = fb["cible"]
    if cible.startswith("F"):
        cible = f"<b>{cible}</b> · {NOMS_F[cible]}"
    else:
        cible = "<b>Hors liste</b>" + (" · une idée pour plus tard" if "plus tard" in cible else "")
    if fb["cible"].startswith("F"):
        effet_tri = f"<b>Trié :</b> sur {fb['cible']}. Publié : <b>note +0,5</b> (1 effort de plus si {fb['cible']} est déjà publiée)."
    else:
        effet_tri = "<b>Trié :</b> on l'écarte. Savoir dire non, c'est aussi du pilotage."
    return f"""<div class="in"><div class="bande" style="background:{AMBER}"><span>Feedback</span><span>{fb['id']}</span></div>
<div class="corps"><div style="display:flex;align-items:center;gap:2mm;justify-content:space-between">
<div style="display:flex;align-items:center;gap:2mm">{icone('bulle', 11)}<div class="t" style="font-size:13pt">La communauté</div></div>
<span class="pill" style="background:{typ}">{fb['type']}</span></div>
<div class="cit">« {fb['cit']} »</div>
<div class="bas" style="flex-direction:column;align-items:stretch;gap:1.2mm"><div style="display:flex;justify-content:space-between;align-items:center"><div class="lab">Fonctionnalité citée</div></div><div class="txt" style="font-size:9pt">{cible}</div>
<div style="border-top:.4mm solid {SAGE};padding-top:1.2mm;font-size:8pt;line-height:1.25">{effet_tri}</div></div></div></div>"""


DOS_FEEDBACK = f"""<div class="in centre" style="background:#fff"><div style="position:absolute;inset:2.2mm;border:1.2mm solid {AMBER};border-radius:2mm"></div>
<div style="display:flex;flex-direction:column;align-items:center;gap:3mm">{icone('bulle', 26)}<div class="t" style="font-size:18pt">Feedback</div>
<div class="ph" style="max-width:42mm">1 carte pour 100 gamers</div><div class="lab">Helioso Orbit</div></div></div>"""


def c_event_recto(e):
    quand = f"Cycle {e['cycle']}" if e["cycle"].isdigit() else "Variante"
    return f"""<div class="in centre"><div style="position:absolute;top:0;left:0;right:0" class="bande" ><span></span></div>
<div style="position:absolute;top:0;left:0;right:0;background:{NAVY};color:#fff;padding:1.6mm 3mm;display:flex;justify-content:space-between;font-size:7.5pt;font-weight:800;letter-spacing:.08em;text-transform:uppercase"><span>Événement</span><span>{e['id']}</span></div>
<div style="display:flex;flex-direction:column;align-items:center;gap:3mm;margin-top:6mm">{icone(e['type'], 26)}<div class="t" style="font-size:18pt">{e['type']}</div><span class="pill">{quand}</span>
<div class="ph" style="max-width:44mm">Vera annonce le type un cycle à l'avance. Retournez la carte au début du cycle.</div></div></div>"""


def c_event_verso(e):
    titre = re.search(r"\*\*(.+?)\*\*", e["texte"]).group(1)
    reste = e["texte"].split("**")[-1].strip()
    return f"""<div class="in"><div class="bande" style="background:{NAVY};color:#fff"><span>Événement · {e['type']}</span><span>{e['id']}</span></div>
<div class="corps"><div class="t nom" style="font-size:13.5pt">{titre}</div>{f'<div class="ph">{reste}</div>' if reste else ''}
<div style="margin-top:auto;border:.6mm solid {NAVY};border-radius:2mm;padding:2.2mm;background:{BG}"><div class="lab" style="margin-bottom:1mm">Effet</div><div class="txt">{e['effet']}</div></div></div></div>"""


def c_vera(v):
    msg = re.sub(r"\*\((.+?)\)\*", r'<span class="ph" style="font-style:italic">(\1)</span>', v["msg"])
    msg = msg.replace("« ", "« ").strip()
    return f"""<div class="in"><div class="bande" style="background:{TEAL}"><span>Vera · Nebulous Publishing</span><span>{v['id']}</span></div>
<div class="corps"><div style="display:flex;align-items:center;gap:2.5mm">{img_portrait('vera', 13, TEAL)}<div class="t nom" style="font-size:15pt">{v['moment']}</div></div>
<div class="cit" style="font-size:{'9.5pt' if len(msg) > 180 else '11pt'}">{msg}</div><div class="lab" style="margin-top:auto">À lire par l'animateur</div></div></div>"""


# ---------------------------------------------------------------- le plateau (SVG en mm, A2 paysage)
def ellipse_pt(a, cx=297, cy=228, rx=206, ry=128):
    r = math.radians(a)
    return cx + rx * math.cos(r), cy - ry * math.sin(r)


def plateau_svg(vb="0 0 594 420", w="594mm", h="420mm"):
    s = [f'<svg viewBox="{vb}" style="width:{w};height:{h};display:block" xmlns="http://www.w3.org/2000/svg" font-family="Inter">']
    s.append(f'<rect width="594" height="420" fill="#fff"/>')
    # frise géométrique
    cols = [TEAL, AMBER, NAVY, SAGE, CYAN]
    k = 0
    for x in range(0, 594, 12):
        for y0, up in ((0, True), (408, False)):
            c = cols[k % 5]; k += 1
            s.append(f'<path d="M{x} {y0 + (12 if up else 0)} L{x + 6} {y0 + (2 if up else 10)} L{x + 12} {y0 + (12 if up else 0)}Z" fill="{c}" stroke="{NAVY}" stroke-width=".6"/>' if up else
                     f'<path d="M{x} {y0} L{x + 6} {y0 + 10} L{x + 12} {y0}Z" fill="{c}" stroke="{NAVY}" stroke-width=".6"/>')
    for y in range(12, 408, 12):
        for x0, left in ((0, True), (582, False)):
            c = cols[k % 5]; k += 1
            s.append(f'<path d="M{x0 + (12 if left else 0)} {y} L{x0 + (2 if left else 10)} {y + 6} L{x0 + (12 if left else 0)} {y + 12}Z" fill="{c}" stroke="{NAVY}" stroke-width=".6"/>')
    s.append(f'<rect x="12" y="12" width="570" height="396" rx="8" fill="{BG}" stroke="{NAVY}" stroke-width="1"/>')

    def T(x, y, txt, size=5, w=400, anchor="start", fill=NAVY, fam="Inter", ls=0, style=""):
        fam = "'Bricolage Grotesque'" if fam == "B" else fam
        return f'<text x="{x}" y="{y}" font-size="{size}" font-weight="{w}" text-anchor="{anchor}" fill="{fill}" font-family="{fam}" letter-spacing="{ls}" style="{style}">{txt}</text>'

    # titre
    s.append(T(26, 30, "HELIOSO ORBIT · ORBIT : STUDIO", 3.6, 800, ls=.5, fill=TEAL_T))
    s.append(T(26, 43, "L'orbite d'itération", 11, 800, fam="B"))
    s.append(T(26, 51, "Avec l'IA, le goulot passe de la production à la décision et à la vérification.", 3.4, 500, fill=MUTED))

    # orbite
    s.append(f'<ellipse cx="297" cy="228" rx="206" ry="128" fill="none" stroke="{NAVY}" stroke-width="1.2" stroke-dasharray="5 3.5"/>')

    def fleche(a):
        x, y = ellipse_pt(a)
        r = math.radians(a)
        dx, dy = 206 * math.sin(r), 128 * math.cos(r)  # sens horaire à l'écran
        ang = math.degrees(math.atan2(dy, dx))
        return f'<path d="M-5 -4.5 L5 0 L-5 4.5Z" fill="{NAVY}" transform="translate({x:.1f} {y:.1f}) rotate({ang:.1f})"/>'

    for a in (150, 330, 282, 258, 102, 78, 41, 19, 236):
        s.append(fleche(a))

    # soleil du pilotage
    cx, cy = 297, 228
    s.append(f'<circle cx="{cx}" cy="{cy}" r="54" fill="{AMBER}" stroke="{NAVY}" stroke-width="1.4"/>')
    s.append(T(cx, cy - 27, "POSTE DE PILOTAGE", 3.3, 800, "middle", ls=.5))
    s.append(T(cx, cy - 18, "Les humains", 6.5, 800, "middle", fam="B"))
    for j, role in enumerate(("Chef(fe) de projet", "Designer", "Programmeur(se)")):
        y = cy - 6 + j * 12
        s.append(T(cx - 36, y + 1.5, role, 3.4, 700))
        for i in range(4):
            s.append(f'<circle cx="{cx + 6 + i * 8}" cy="{y}" r="3.3" fill="#fff" stroke="{NAVY}" stroke-width=".8"/>')
    s.append(T(cx, cy + 37, "Posez ici vos 4 jetons Heure à chaque cycle", 3, 600, "middle"))

    # stations
    stations = [(180, "1", "Backlog", "Idées et demandes", "Les cartes Fonctionnalité à faire"),
                (120, "2", "Prompt", "On écrit la consigne de PIX", "Prompt simple : 1 h · détaillé : 2 h"),
                (60, "3", "Build", "Agents et humains codent", "Pions Effort + cartes Test cachées"),
                (0, "4", "Test", "On trouve les bugs et le pas fun", "SCAN, code review, playtest ; corriger ou publier"),
                (300, "5", "Release", "On publie le jeu", "Review : score = gamers × note"),
                (240, "6", "Feedback", "Retours des gamers", "1 carte pour 100 gamers")]
    for a, n, nom, sous, aide in stations:
        x, y = ellipse_pt(a)
        X, Y = x - 46, y - 50
        s.append(f'<rect x="{X:.1f}" y="{Y:.1f}" width="92" height="100" rx="7" fill="#fff" stroke="{NAVY}" stroke-width="1.4"/>')
        s.append(f'<rect x="{x - 33:.1f}" y="{Y + 17:.1f}" width="66" height="68" rx="3" fill="none" stroke="{SAGE}" stroke-width=".8" stroke-dasharray="2.5 2"/>')
        s.append(f'<circle cx="{X + 10:.1f}" cy="{Y + 9:.1f}" r="6" fill="{TEAL}" stroke="{NAVY}" stroke-width="1"/>')
        s.append(T(X + 10, Y + 11.2, n, 5.5, 800, "middle", fam="B"))
        s.append(T(X + 19, Y + 10.5, nom, 6.2, 800, fam="B"))
        s.append(T(X + 19, Y + 15, sous, 2.9, 500, fill=MUTED))
        s.append(T(x, Y + 95, aide, 2.9, 600, "middle"))

    # files d'attente
    def slots(x0, y0, n, cols, warn_last=False, size=13):
        out = []
        for i in range(n):
            r, c = divmod(i, cols)
            fill = "#fff" if (warn_last and i == n - 1) else AMBER
            stroke = CORAL if (warn_last and i == n - 1) else NAVY
            out.append(f'<rect x="{x0 + c * (size + 3):.1f}" y="{y0 + r * (size + 3):.1f}" width="{size}" height="{size}" rx="2.5" fill="{fill}" stroke="{stroke}" stroke-width="{1.4 if warn_last and i == n - 1 else 1}"/>')
            if warn_last and i == n - 1:
                out.append(T(x0 + c * (size + 3) + size / 2, y0 + r * (size + 3) + size / 2 + 2, "+", 7, 800, "middle", CORAL))
        return "".join(out)

    x, y = ellipse_pt(90)
    s.append(f'<rect x="{x - 32}" y="{y - 21}" width="64" height="33" rx="5" fill="{BG}"/>')
    s.append(T(x, y - 15, "FILE D'ATTENTE", 3, 800, "middle", AMBER_T, ls=.4))
    s.append(slots(x - 23.5, y - 11, 3, 3))
    s.append(T(x, y + 9, "Prompts prêts, pas encore faits", 2.8, 600, "middle"))

    x, y = ellipse_pt(30)
    s.append(f'<rect x="{x - 28}" y="{y - 18}" width="70" height="32" rx="5" fill="{BG}"/>')
    s.append(T(x + 7, y - 12, "GOULOT : LA VÉRIFICATION", 3, 800, "middle", AMBER_T, ls=.4))
    s.append(slots(x - 16.5, y - 8, 3, 3))
    s.append(T(x + 7, y + 11, "Efforts faits, pas encore testés", 2.8, 600, "middle"))

    x, y = 102, 312
    s.append(f'<rect x="{x - 62}" y="{y - 20}" width="88" height="44" rx="5" fill="{BG}"/>')
    s.append(T(x - 58, y - 13, "GOULOT PRINCIPAL", 3.2, 800, fill=AMBER_T, ls=.4))
    s.append(T(x - 58, y - 7.5, "Trier le feedback (1 heure pour 2)", 3, 700))
    s.append(slots(x - 58, y - 3, 5, 5, warn_last=True, size=11.5))
    s.append(T(x - 58, y + 17, "Plus de 4 cartes non triées à la release :", 2.7, 600, fill=CORAL))
    s.append(T(x - 58, y + 21, "la note baisse de 0,5.", 2.7, 600, fill=CORAL))

    # agents
    def agent(x, y, nom, l1, l2, n):
        w = 88
        out = [f'<rect x="{x}" y="{y}" width="{w}" height="36" rx="5" fill="#fff" stroke="{NAVY}" stroke-width="1.2"/>',
               f'<rect x="{x + 2}" y="{y + 2}" width="22" height="32" rx="3" fill="{BG}"/>',
               f'<image href="{PORT[nom.lower()]}" x="{x + 3}" y="{y + 7}" width="20" height="20" style="image-rendering:pixelated"/>',
               T(x + 27, y + 6.5, "AGENT IA", 2.6, 800, ls=.4, fill=MUTED), T(x + w - 4, y + 7, nom, 4.6, 800, "end", fam="B"),
               T(x + 27, y + 13, l1, 2.8, 600), T(x + 27, y + 17.5, l2, 2.7, 500, fill=MUTED)]
        for i in range(n):
            out.append(f'<rect x="{x + 27 + i * 11}" y="{y + 22}" width="9" height="9" rx="2" fill="#fff" stroke="{NAVY}" stroke-width=".8" stroke-dasharray="1.6 1.2"/>')
        return "".join(out)

    s.append(agent(358, 170, "PIX", "Codeur · jusqu'à 3 efforts par cycle", "1 token par effort · 1 carte Test cachée", 3))
    s.append(agent(358, 248, "SCAN", "Testeur · jusqu'à 4 tests par cycle", "1 token par test · bugs oui, ennui non", 4))

    # pioches et éditeur
    def zone_carte(x, y, titre, sous, coul):
        return (f'<rect x="{x}" y="{y}" width="66" height="91" rx="4" fill="#fff" stroke="{coul}" stroke-width="1.4" stroke-dasharray="3 2"/>'
                + T(x + 33, y + 42, titre, 5, 800, "middle", fam="B") + T(x + 33, y + 48, sous, 2.8, 600, "middle", MUTED))

    s.append(zone_carte(500, 26, "Événement", "la carte du cycle", NAVY))
    s.append(f'<circle cx="487" cy="34" r="10" fill="{TEAL}" stroke="{NAVY}" stroke-width="1"/>')
    s.append(f'<image href="{PORT["vera"]}" x="479" y="26" width="16" height="16"/>')
    s.append(T(487, 49, "VERA", 2.8, 800, "middle", TEAL_T, ls=.3))
    s.append(T(487, 53, "éditrice", 2.5, 500, "middle", MUTED))
    s.append(zone_carte(499, 292, "Pioche Test", "20 cartes, face cachée", CORAL))
    s.append(zone_carte(264, 305, "Pioche Feedback", "24 cartes, face cachée", AMBER))
    s.append(T(297, 301, "COMMUNAUTÉ · LES GAMERS", 2.8, 800, "middle", AMBER_T, ls=.3))
    for i, n in enumerate(("max", "sam", "nora")):
        px_ = 281 + i * 16
        s.append(f'<circle cx="{px_}" cy="291" r="6.5" fill="{AMBER if n == "nora" else SAGE}" stroke="{NAVY}" stroke-width=".8"/>')
        s.append(f'<image href="{PORT[n]}" x="{px_ - 5.5}" y="285.5" width="11" height="11"/>')

    # pistes : tokens, note, cycles
    s.append(T(26, 66, "TOKENS IA", 3.2, 800, ls=.4))
    s.append(T(26, 70.5, "Le budget IA de l'équipe · −1 par effort de PIX ou test de SCAN", 2.7, 500, fill=MUTED))
    for i in range(20):
        r, c = divmod(i, 10)
        cx_, cy_ = 30 + c * 10.5, 77 + r * 10.5
        s.append(f'<circle cx="{cx_}" cy="{cy_}" r="4.2" fill="#fff" stroke="{CYAN}" stroke-width="1.1"/>')
        s.append(T(cx_, cy_ + 1.1, str(20 - i), 2.8, 700, "middle", MUTED))
    s.append(T(26, 107, "NOTE DU JEU (SUR 5)", 3.2, 800, ls=.4))
    notes = [1 + 0.5 * i for i in range(9)]
    for i, n in enumerate(notes):
        x_ = 26 + i * 10.6
        s.append(f'<rect x="{x_}" y="110" width="9.4" height="9.4" rx="2" fill="{AMBER if n == 3 else "#fff"}" stroke="{NAVY}" stroke-width="{1.4 if n == 3 else .8}"/>')
        s.append(T(x_ + 4.7, 116, f"{n:g}".replace(".", ","), 2.8, 700, "middle"))
    s.append(T(26, 125, "Départ sur la case ambre (3) · bug publié (bloquant ou mineur) −0,5 · feedback publié +0,5", 2.7, 500, fill=MUTED))
    s.append(T(26, 140, "CYCLE", 3.2, 800, ls=.4))
    for i, lab in enumerate(("0", "1", "2", "3", "4", "Fin")):
        x_ = 26 + i * 15
        s.append(f'<rect x="{x_}" y="143" width="13" height="10" rx="2" fill="{TEAL if i == 0 else "#fff"}" stroke="{NAVY}" stroke-width=".8"/>')
        s.append(T(x_ + 6.5, 149.6, lab, 3.4, 800, "middle"))
    s.append(T(26, 158, "0 : sans carte Test, 2 efforts par humain · 1 à 4 : E1 à E4", 2.7, 500, fill=MUTED))

    # porte du premier jouable (à côté de la Release)
    s.append(f'<rect x="352" y="392" width="94" height="13" rx="3" fill="{AMBER}" stroke="{NAVY}" stroke-width="1"/>')
    s.append(f'<rect x="355" y="395" width="7" height="7" rx="1" fill="#fff" stroke="{NAVY}" stroke-width=".8"/>')
    s.append(T(365, 398.2, "MVP ATTEINT", 2.9, 800, ls=.3))
    s.append(T(365, 402.3, "Sans lui : 0 gamer, quelles que soient les étoiles", 2.5, 600))
    # légende
    leg = [(AMBER, "Files d'attente, soleil, gamers"), (CYAN, "Agents IA"), (TEAL, "Stations, éditeur"), (CORAL, "Cartes Test et alertes")]
    for i, (c, t) in enumerate(leg):
        s.append(f'<rect x="{26 + i * 0}" y="{368 + i * 7.5}" width="5" height="5" rx="1" fill="{c}" stroke="{NAVY}" stroke-width=".6"/>')
        s.append(T(34, 372 + i * 7.5, t, 2.9, 600))
    s.append(T(26, 364, "LES COULEURS", 2.8, 800, ls=.4, fill=MUTED))
    s.append(T(88, 364, "LE MATÉRIEL", 2.8, 800, ls=.4, fill=MUTED))
    pts = []
    for k in range(10):
        r_ = 2.8 if k % 2 == 0 else 1.2
        a_ = math.pi / 2 + k * math.pi / 5
        pts.append(f"{90.5 + r_ * math.cos(a_):.2f},{393.3 - r_ * math.sin(a_):.2f}")
    s.append(f'<circle cx="90.5" cy="370.5" r="2.6" fill="{AMBER}" stroke="{NAVY}" stroke-width=".6"/>')
    s.append(T(96, 372, "Jeton Heure : le temps d'un joueur · coder = 2 heures", 2.9, 600))
    s.append(f'<rect x="88" y="375.5" width="5" height="5" rx="1" fill="{SAGE}" stroke="{NAVY}" stroke-width=".6"/>')
    s.append(T(96, 379.5, "Pion Effort : 1 effort fait", 2.9, 600))
    s.append(f'<circle cx="90.5" cy="385.5" r="2.6" fill="#fff" stroke="{CYAN}" stroke-width="1"/>')
    s.append(T(96, 387, "Token IA : budget des agents", 2.9, 600))
    s.append(f'<polygon points="{" ".join(pts)}" fill="{AMBER}" stroke="{NAVY}" stroke-width=".5"/>')
    s.append(T(96, 394.5, "Étoile : 25 gamers", 2.9, 600))
    s.append(T(568, 402, "© Helioso · orbit.helioso.com · prototype papier v1.3", 2.6, 500, "end", MUTED))
    s.append("</svg>")
    return "".join(s)


# ---------------------------------------------------------------- le livret (A4)
def livret():
    def actions_de(role):
        out = []
        for a in actions:
            qui = a[2].lower()
            if role == "R1" and ("chef" in qui or a[2] == "—"):
                out.append(a)
            elif role == "R2" and ("designer" in qui or "responsable" in qui):
                out.append(a)
            elif role == "R3" and "responsable" in qui:
                out.append(a)
        return out

    def fiche(r):
        rid, nom, mission, _, phrase = r
        nom = nom.replace("**", "")
        lig = "".join(f"<tr><td>{gras(a[0])}{' <i>(ses fonctionnalités)</i>' if 'responsable' in a[2].lower() else ''}{' <i>(vous décidez)</i>' if a[2] == '—' else ''}</td><td class='c'><b>{a[1]}</b></td></tr>" for a in actions_de(rid))
        return f"""<div style="height:148.5mm;padding:10mm 14mm;border-bottom:.3mm dashed {MUTED};position:relative">
<div style="display:flex;justify-content:space-between;align-items:center"><div><div class="lab" style="color:{TEAL_T}">Fiche de rôle · {rid}</div><div class="t" style="font-size:24pt;margin-top:1mm">{nom}</div></div>
<div style="display:flex;gap:1.6mm;align-items:center">{''.join(f'<div style="width:7mm;height:7mm;border-radius:50%;border:.6mm solid {NAVY};background:{AMBER}"></div>' for _ in range(4))}<span class="txt" style="margin-left:1mm"><b>4 heures par cycle</b><br>coder = 2 heures</span></div></div>
<div class="txt" style="margin:2.5mm 0 1mm;font-size:11pt"><b>Votre mission :</b> {mission}.</div>
<div class="ph" style="margin-bottom:3mm">« {nettoie(phrase)} »</div>
<div class="lab" style="margin-bottom:1.5mm">Vos actions</div>
<table class="tab" style="font-size:10.5pt">{lig}</table>
<div class="txt" style="margin-top:4mm;font-size:9.5pt;line-height:1.4"><b>Pour agir</b>, prenez un de vos jetons au poste de pilotage et posez-le sur la station où vous agissez. Coder un effort prend 2 jetons ; toute autre action, 1 jeton. Ils reviennent au poste de pilotage à la fin du cycle.<br>
<b>MVP :</b> tant que les 5 fonctionnalités essentielles ne sont pas publiées sans bug bloquant, le jeu a 0 gamer. <b>Score</b> = gamers × note.</div></div>"""

    jet_expl = f"""<div style="height:148.5mm;padding:10mm 14mm;position:relative">
<div class="lab" style="color:{TEAL_T}">Le matériel de l'équipe</div><div class="t" style="font-size:22pt;margin:1mm 0 4mm">Les pions, à quoi ça sert ?</div>
<div style="display:flex;flex-direction:column;gap:4mm">
<div style="display:flex;gap:4mm;align-items:flex-start"><div style="width:11mm;height:11mm;border-radius:50%;border:.6mm solid {NAVY};background:{AMBER};flex:none;display:flex;align-items:center;justify-content:center;font-size:5.5pt;font-weight:800">1 h</div>
<div class="txt"><b>Jetons Heure</b>, 4 par joueur et par cycle : c'est votre temps de travail, 20 heures sur la partie. Coder un effort soi-même prend 2 heures (une longue plage de concentration) ; toute autre action prend 1 heure. Au début du cycle, ils sont au poste de pilotage. Pour agir, posez-en un sur la station où vous agissez. À la fin du cycle, ils reviennent. Au débrief, on voit où l'équipe a passé son temps.</div></div>
<div style="display:flex;gap:4mm;align-items:flex-start"><div style="width:11mm;height:11mm;border:.6mm solid {NAVY};border-radius:1.6mm;background:{SAGE};flex:none"></div>
<div class="txt"><b>15 pions Effort</b> : le travail fait. Une fonctionnalité demande 1 à 3 efforts (les cases grises sur sa carte). Chaque effort fait, par un humain ou par PIX, se marque d'un pion sur une case. Carte pleine = fonctionnalité prête pour la release. Après la release, les pions reviennent dans la réserve.</div></div>
<div style="display:flex;gap:4mm;align-items:flex-start"><div style="width:11mm;height:11mm;border-radius:50%;border:.6mm solid {NAVY};background:{NAVY};flex:none"></div>
<div class="txt"><b>3 marqueurs</b> pour les pistes du plateau : les tokens IA (départ 20, on recule d'une case par action d'agent), la note (départ 3) et le cycle (départ 0).</div></div>
<div class="txt" style="border:.6mm solid {NAVY};border-radius:2mm;padding:3mm;background:{BG}"><b>Les efforts de PIX :</b> quand PIX fait un effort, posez le pion Effort <b>et</b> glissez une carte Test face cachée sous la carte Fonctionnalité. On ne la regarde qu'en relisant, en testant ou à la release.</div>
</div><div class="txt" style="margin-top:4mm;font-size:8.5pt;color:{MUTED}">Des cubes, des pions ou des pièces de récupération font très bien l'affaire.</div></div>"""
    page_fiches = f'<div class="feuille">{fiche(refs[0])}{fiche(refs[1])}</div><div class="feuille">{fiche(refs[2])}{jet_expl}</div>'

    lignes = "".join(f"<tr><td class='c'><b>{c}</b></td><td></td><td class='c'>oui · non</td><td></td><td></td><td></td><td></td><td></td></tr>" for c in ("0", "1", "2", "3", "4"))
    risques = "".join(f"<tr><td class='c'><b>{c}</b></td><td></td><td></td><td class='c'>oui · non</td></tr>" for c in ("0", "1", "2", "3", "4"))
    score = f"""<div class="feuille" style="padding:14mm">
<div style="display:flex;justify-content:space-between;align-items:baseline"><div class="t" style="font-size:24pt">Feuille de score</div><div class="lab">Helioso Orbit · Orbit : Studio</div></div>
<div style="display:flex;gap:6mm;margin:5mm 0">{''.join(f'<div style="flex:1;border:.6mm solid {NAVY};border-radius:2mm;padding:2mm 3mm;height:16mm"><div class="lab">{l}</div></div>' for l in ('Nom du studio', 'Chef(fe) de projet', 'Designer', 'Programmeur(se)'))}</div>
<table class="tab big"><tr><th>Cycle</th><th>Fonctionnalités publiées</th><th>MVP<br>atteint ?</th><th>Étoiles (total)</th><th>Gamers<br>(étoiles × 25)</th><th>Note<br>(sur 5)</th><th>Score<br>(gamers × note)</th><th>Tokens IA<br>restants</th></tr>{lignes}</table>
<div class="t" style="font-size:13pt;margin:5mm 0 1mm">Notre risque du cycle</div>
<div class="txt" style="font-size:8.5pt;margin-bottom:2mm">Au début de chaque cycle, en 30 secondes : quel risque voyons-nous, et que faisons-nous contre ? Après la release : est-il arrivé ?</div>
<table class="tab risques"><tr><th>Cycle</th><th>Le risque que nous voyons</th><th>Notre parade</th><th>Arrivé ?</th></tr>{risques}</table>
<div style="border:.8mm solid {NAVY};border-radius:3mm;padding:3mm 4mm;margin-top:5mm;background:{BG};display:flex;justify-content:space-between;align-items:center"><div class="lab">Score final</div>
<div class="t" style="font-size:14pt">Gamers ______ × note ____ = <span style="display:inline-block;border-bottom:.6mm solid {NAVY};width:28mm"></span></div></div>
<div class="txt" style="margin-top:4mm;font-size:8.5pt;color:{MUTED}">Rappels : gamers = étoiles publiées × 25, recalculés à chaque release ; la note reste entre 1 et 5 ; sans MVP, 0 gamer ; un bug bloquant publié ne rapporte aucun gamer et coûte 0,5 de note ; un bug mineur publié coûte 0,5 de note ; un « Pas fun » publié coûte 1 étoile ; chaque carte Feedback traitée et publiée fait monter la note de 0,5.</div></div>"""

    equipes = "".join(f"<tr><td class='c'><b>{i}</b></td>" + "<td></td>" * 7 + "</tr>" for i in range(1, 9))
    leader = f"""<div class="feuille" style="padding:14mm">
<div style="display:flex;justify-content:space-between;align-items:baseline"><div class="t" style="font-size:24pt">Leaderboard de l'animateur</div><div class="lab">Helioso Orbit</div></div>
<div class="txt" style="margin:3mm 0 5mm">À recopier au tableau, ou dans la page de leaderboard, après chaque release. Score = gamers × note. Une équipe sans MVP est à 0 : faites-le remarquer.</div>
<table class="tab big"><tr><th>#</th><th>Studio</th><th>Cycle 0</th><th>Cycle 1</th><th>Cycle 2</th><th>Cycle 3</th><th>Cycle 4</th><th>Final</th></tr>{equipes}</table>
<div class="t" style="font-size:14pt;margin:8mm 0 3mm">Déroulé de l'animateur</div>
<table class="tab">{''.join(f"<tr><td class='c'><b>{v['id']}</b></td><td>{v['moment']}</td><td>{re.sub(r'[*]', '', v['msg'])}</td></tr>" for v in veras)}</table>
<div class="txt" style="margin-top:3mm;font-size:8.5pt"><b>La solution du MVP (à garder pour vous) :</b> {", ".join(f["id"] + " " + f["nom"] for f in MUSTS)}.<br>Événements : E1 au cycle 1, E2 au cycle 2, E3 au cycle 3, E4 au cycle 4. E5 et E6 servent à varier les parties suivantes.</div></div>"""

    def jeton_rond(c, txt, r=13):
        return f'<div style="width:{r}mm;height:{r}mm;border-radius:50%;border:.6mm solid {NAVY};background:{c};display:flex;align-items:center;justify-content:center;font-size:6.5pt;font-weight:800">{txt}</div>'

    pa = "".join(jeton_rond(AMBER, "1 h") for _ in range(12))
    cr = "".join(jeton_rond(NAVY, f'<span style="color:#fff">{t}</span>') for t in ("IA", "NOTE", "CYCLE"))
    bl = "".join(f'<div style="width:12mm;height:12mm;border:.6mm solid {NAVY};border-radius:1.6mm;background:{SAGE}"></div>' for _ in range(15))
    jetons = f"""<div class="feuille" style="padding:12mm 14mm">
<div style="display:flex;justify-content:space-between;align-items:baseline"><div class="t" style="font-size:22pt">Jetons à découper</div><div class="lab">À imprimer sur papier épais</div></div>
<div class="lab" style="margin:5mm 0 2mm">12 jetons Heure (4 par humain)</div><div style="display:flex;flex-wrap:wrap;gap:3mm">{pa}</div>
<div class="lab" style="margin:5mm 0 2mm">3 marqueurs : tokens IA, note, cycle</div><div style="display:flex;flex-wrap:wrap;gap:3mm">{cr}</div>
<div class="lab" style="margin:5mm 0 2mm">15 pions Effort</div><div style="display:flex;flex-wrap:wrap;gap:2.4mm">{bl}</div>
<div class="txt" style="margin-top:5mm;font-size:8.5pt;color:{MUTED}">Astuce : des cubes de couleur ou des pions de récupération font très bien l'affaire à la place de ces jetons.</div></div>"""

    guide = f"""<div class="feuille" style="padding:16mm">
<div class="lab" style="color:{TEAL_T}">Helioso Orbit · Orbit : Studio · prototype papier v1</div>
<div class="t" style="font-size:30pt;margin:2mm 0 6mm">Le kit à imprimer</div>
<table class="tab big"><tr><th>Fichier</th><th>Contenu</th><th>Impression</th></tr>
<tr><td><b>plateau-A2.pdf</b></td><td>Le plateau de l'orbite d'itération</td><td>A2 paysage, 100 %, en reprographie</td></tr>
<tr><td><b>plateau-4xA4.pdf</b></td><td>Le même plateau en 4 morceaux</td><td>A4 paysage, « taille réelle », puis assembler en suivant les repères</td></tr>
<tr><td><b>cartes-recto.pdf</b></td><td>Fonctionnalités F01–F20 et messages de Vera V0–V5</td><td>A4, recto seul, papier 250 g ou plus</td></tr>
<tr><td><b>cartes-recto-verso.pdf</b></td><td>Cartes Test T01–T20, Feedback FB01–FB24, Événements E1–E6, avec leurs dos</td><td>A4, <b>recto verso, retournement bord long</b>, 250 g</td></tr>
<tr><td><b>livret.pdf</b></td><td>Ce guide, les règles (recto : l'essentiel en images ; verso : le détail), les 3 fiches de rôle, l'explication des pions, la feuille de score avec le risque du cycle, la feuille de débrief, le leaderboard, la planche de jetons</td><td>A4, recto seul ; les fiches de rôle se coupent en deux (A5)</td></tr></table>
<div class="t" style="font-size:15pt;margin:8mm 0 3mm">Par équipe</div>
<div class="txt">1 plateau · 3 fiches de rôle (une par joueur) · 20 Fonctionnalités · 20 cartes Test · 24 Feedback · 12 jetons Heure · 15 pions Effort · 3 marqueurs · 1 feuille de score.<br>
<b>Pour l'animateur :</b> les 6 Événements, les 6 messages de Vera et le leaderboard.</div>
<div class="t" style="font-size:15pt;margin:8mm 0 3mm">Conseils</div>
<div class="txt">• Coupez sur les traits gris : les cartes sont jointives, un seul coup de massicot sépare deux cartes.<br>
• Avant le recto verso, imprimez une page test et vérifiez que le dos tombe bien derrière chaque carte.<br>
• Les cartes font 63 × 88 mm : elles rentrent dans des protège-cartes standard.<br>
• Ce kit est généré à partir de <b>docs/jeu/cartes-orbit-studio.md</b> : on modifie les cartes là, puis on relance le script.</div>
<div style="position:absolute;bottom:14mm;left:16mm;right:16mm;display:flex;justify-content:space-between" class="id"><span>© Helioso — usage sous licence (voir LICENSE.md)</span><span>orbit.helioso.com</span></div></div>"""
    css = f"""
.tab{{width:100%;border-collapse:collapse;font-size:9pt}}
.tab td,.tab th{{border:.4mm solid {NAVY};padding:1.6mm 2mm;text-align:left;vertical-align:top;line-height:1.25}}
.tab th{{background:{TEAL};font-size:8pt;text-transform:uppercase;letter-spacing:.04em}}
.tab tr:nth-child(even) td{{background:{BG}}}
.tab .c{{text-align:center;white-space:nowrap}}
.big td{{height:13mm}} .big th{{height:auto}}
.risques td{{height:10mm}} .risques td:nth-child(2),.risques td:nth-child(3){{width:42%}}
"""
    import markdown
    texte = (RACINE / "docs/jeu/regles-une-page.md").read_text(encoding="utf-8")
    texte = re.sub(r"^\*Version.*?\*\n", "", texte, flags=re.M)
    essentiel, detail = texte.split("## Le détail", 1)
    # 1. les symboles du document deviennent les visuels du jeu
    sym = {
        "⭐": etoile(7),
        "🟩": f'<div style="width:7mm;height:7mm;border:.6mm solid {NAVY};border-radius:1.2mm;background:{SAGE}"></div>',
        "🟠": f'<div style="width:7mm;height:7mm;border-radius:50%;border:.6mm solid {NAVY};background:{AMBER};font-size:5pt;font-weight:800;display:flex;align-items:center;justify-content:center">1 h</div>',
        "🔷": f'<div style="width:7mm;height:7mm;border-radius:50%;border:.6mm solid {NAVY};background:#fff;box-shadow:inset 0 0 0 1.1mm {CYAN};font-size:5.5pt;font-weight:800;display:flex;align-items:center;justify-content:center">IA</div>',
        "🟥": f'<div style="width:6mm;height:8.5mm;border:.5mm solid {NAVY};border-radius:1mm;background:#fff;border-top:2.4mm solid {CORAL}"></div>',
        "🟨": f'<div style="width:6mm;height:8.5mm;border:.5mm solid {NAVY};border-radius:1mm;background:#fff;border-top:2.4mm solid {AMBER}"></div>',
        "📈": f'<div style="border:.5mm solid {NAVY};border-radius:1mm;padding:.4mm 1mm;font-size:6.5pt;font-weight:800;background:{AMBER}">3/5</div>',
    }
    html1 = markdown.markdown(essentiel, extensions=["tables"])
    for k, v in sym.items():
        html1 = html1.replace(k, f'<div style="display:flex;justify-content:center">{v}</div>')
    # 2. le cycle en 6 temps devient un schéma
    etapes = [("1", "Brief", "Vera donne les nouvelles du cycle", f'<img src="{PORT["vera"]}">'),
              ("2", "Planning", "Trier le feedback, choisir, noter le risque", icone("bulle", 9)),
              ("3", "Build", "Prompt pour PIX, efforts des humains", f'<img src="{PORT["pix"]}">'),
              ("4", "Test", "SCAN, code review, playtest ; corriger ou publier", f'<img src="{PORT["scan"]}">'),
              ("5", "Release", "On publie : les cartes Test cachées se révèlent", etoile(9)),
              ("6", "Review", "Gamers × note = score", f'<div class="t" style="font-size:20pt;line-height:1">×</div>')]
    sch = '<div class="cycle">'
    for i, (n, t, d, ic) in enumerate(etapes):
        sch += (f'<div class="et"><div class="rond">{ic}<span class="num">{n}</span></div>'
                f'<div class="t" style="font-size:9.5pt;margin-top:1.2mm">{t}</div><div class="ph" style="font-size:7.3pt;font-style:normal">{d}</div></div>')
        if i < len(etapes) - 1:
            sch += '<div class="fl">→</div>'
    sch += '</div><div class="ph" style="text-align:center;font-size:7.5pt;margin-top:1mm">… puis on recommence : c\'est l\'orbite d\'itération.</div>'
    html1 = re.sub(r"(<h2>Un cycle en 6 temps</h2>)\s*<ol>.*?</ol>", lambda m: m.group(1) + sch, html1, flags=re.S)
    # 3. comment lire une carte Fonctionnalité
    ex = next(f for f in feats if f["id"] == "F14")
    lire = f"""<h2>Lire une carte Fonctionnalité</h2><div style="display:flex;gap:6mm;align-items:center">
<div style="width:63mm;height:88mm;flex:none"><div class="carte" style="padding:0;width:63mm;height:88mm">{c_feat(ex)}</div></div>
<div class="txt" style="font-size:9.6pt;line-height:1.6"><b>① En haut :</b> la catégorie et le numéro.<br><b>② Le nom</b> de la fonctionnalité.<br>
<b>③ Taille :</b> {ex['blocs']} cases grises = {ex['blocs']} efforts à faire. Chaque effort fait reçoit un pion Effort.<br>
<b>④ Valeur :</b> {ex['etoiles']} étoiles = {ex['etoiles'] * 25} gamers, dès qu'elle est publiée sans bug bloquant.<br>
<b>⑤ En bas :</b> qui en est responsable (il la produit et la corrige).<br>
<span class="ph">La priorité n'est pas écrite : à vous de deviner ce qui est essentiel.</span></div></div>"""
    regles = (f'<div class="feuille regles" style="padding:9mm 13mm"><div class="lab" style="color:{TEAL_T}">Règles · recto : l\'essentiel</div>{html1}{lire}</div>'
              f'<div class="feuille regles" style="padding:9mm 13mm"><div class="lab" style="color:{TEAL_T}">Règles · verso : le détail</div>'
              f'<h1>Le détail, temps par temps</h1><div class="verso">{markdown.markdown(detail, extensions=['tables'])}</div></div>')
    css += f"""
.regles h1{{font-family:'Bricolage Grotesque';font-weight:800;font-size:19pt;margin:1mm 0 1.5mm}}
.regles h2{{font-family:'Bricolage Grotesque';font-weight:800;font-size:12pt;margin:3mm 0 1.5mm;color:{TEAL_T}}}
.regles h3{{font-family:'Bricolage Grotesque';font-weight:800;font-size:11pt;margin:3mm 0 1mm}}
.regles p,.regles li{{font-size:9.4pt;line-height:1.35}}
.regles ul,.regles ol{{padding-left:5mm}} .regles li{{margin:.6mm 0}}
.regles table{{width:100%;border-collapse:collapse}}
.regles td,.regles th{{border-bottom:.3mm solid {SAGE};padding:1.1mm 1.5mm;font-size:8.8pt;text-align:left;vertical-align:middle;line-height:1.3}}
.regles th{{font-size:7pt;text-transform:uppercase;letter-spacing:.05em;color:{MUTED}}}
.regles td:first-child{{width:10mm}} .regles td:nth-child(2){{width:34mm}}
.cycle{{display:flex;align-items:flex-start;justify-content:space-between;gap:1mm;margin-top:1mm}}
.et{{width:25mm;text-align:center}}
.rond{{position:relative;width:15mm;height:15mm;margin:0 auto;border-radius:50%;border:.7mm solid {NAVY};background:{BG};display:flex;align-items:center;justify-content:center}}
.rond img{{width:11mm;height:11mm;image-rendering:pixelated}}
.num{{position:absolute;top:-1.5mm;left:-1.5mm;width:5.5mm;height:5.5mm;border-radius:50%;background:{TEAL};border:.5mm solid {NAVY};font-size:7pt;font-weight:800;display:flex;align-items:center;justify-content:center}}
.verso p,.verso li{{font-size:9pt;line-height:1.3}} .verso h3{{margin:2.2mm 0 .8mm}}
.verso td{{font-size:8pt;padding:.8mm 1.2mm}} .verso td:first-child,.verso td:nth-child(3){{width:17mm}} .verso td:nth-child(2){{width:auto}}
.fl{{font-size:14pt;font-weight:800;margin-top:4mm;color:{MUTED}}}
"""
    rep = [("Éviter", "Ne pas prendre le risque", "Faire le travail par un humain : jamais de problème, mais lent (2 heures par effort)"),
           ("Réduire", "Rendre le risque moins probable", "Prompt détaillé : le risque de problème passe de 40 % à 16 %"),
           ("Détecter", "Le trouver avant qu'il ne frappe", "SCAN, code review, playtest, avant la release"),
           ("Accepter", "Le prendre en connaissance de cause", "Publier sans tester, ou garder des tokens en réserve")]
    lignes_rep = "".join(f"<tr><td><b>{a}</b><br><span class='ph'>{b}</span></td><td>{c}</td><td></td></tr>" for a, b, c in rep)
    debrief = f"""<div class="feuille" style="padding:14mm">
<div style="display:flex;justify-content:space-between;align-items:baseline"><div class="t" style="font-size:24pt">Débrief</div><div class="lab">Helioso Orbit · une feuille par équipe</div></div>
<div class="txt" style="margin:2mm 0 4mm">Trente minutes après le festival, avec la feuille de score sous les yeux.</div>
<div class="t" style="font-size:13pt;margin-bottom:2mm">1. Ressenti · 2. Ce qui s'est passé</div>
<div style="border:.6mm solid {NAVY};border-radius:3mm;padding:3mm 4mm;height:26mm"><div class="lab">Où était notre goulot ? Quelle file d'attente a le plus grossi ?</div></div>
<div class="t" style="font-size:13pt;margin:5mm 0 1mm">3. Les leçons : nos 4 réponses au risque</div>
<div class="txt" style="font-size:9pt;margin-bottom:2mm">Face à un risque, on a toujours le choix entre 4 réponses. Classez vos propres décisions de la partie dans la bonne case.</div>
<table class="tab rep"><tr><th>Réponse</th><th>Dans le jeu</th><th>Nos décisions de la partie</th></tr>{lignes_rep}</table>
<div style="border:.6mm solid {NAVY};border-radius:3mm;padding:3mm 4mm;margin-top:4mm;height:20mm"><div class="lab">Nos risques du cycle : lesquels sont arrivés ? Lesquels avions-nous vus venir ?</div></div>
<div class="t" style="font-size:13pt;margin:5mm 0 2mm">4. Transfert au réel</div>
<div style="border:.6mm solid {NAVY};border-radius:3mm;padding:3mm 4mm;height:22mm"><div class="lab">Dans notre prochain projet, quelle règle allons-nous appliquer ?</div></div></div>"""
    css += """
.rep td{height:17mm} .rep td:nth-child(1){width:26%} .rep td:nth-child(2){width:34%}
"""
    return page_html("Livret", guide + regles + page_fiches + score + debrief + leader + jetons, extra_css=css)


# ---------------------------------------------------------------- assemblage
def construire():
    global lot_items
    SORTIE.mkdir(exist_ok=True)
    html = {}
    recto = [c_feat(f) for f in feats]
    html["cartes-recto"] = page_html("Cartes recto", feuilles(recto, "Fonctionnalités") + feuilles([c_vera(v) for v in veras], "Messages de Vera (animateur)"))

    corps = ""
    lot_items = defauts
    corps += feuilles([c_defaut(d) for d in defauts], "Cartes Test", dos=lambda d: DOS_DEFAUT)
    lot_items = feedbacks
    corps += feuilles([c_feedback(f) for f in feedbacks], "Feedback", dos=lambda f: DOS_FEEDBACK)
    lot_items = events
    corps += feuilles([c_event_recto(e) for e in events], "Événements", dos=c_event_verso)
    html["cartes-recto-verso"] = page_html("Cartes recto verso", corps)

    html["plateau-A2"] = page_html("Plateau A2", plateau_svg(), "594mm 420mm")
    # 4 morceaux A4 paysage, avec 12 mm de recouvrement, à l'échelle 0,9
    tuiles = ""
    for r in range(2):
        for c in range(2):
            x0, y0 = c * (297 - 12), r * (210 - 12)
            w, h = 309, 222
            tuiles += (f'<div style="width:297mm;height:210mm;position:relative;page-break-after:always;display:flex;align-items:center;justify-content:center">'
                       + plateau_svg(f"{x0} {y0} {w} {h}", f"{w * .9:.1f}mm", f"{h * .9:.1f}mm")
                       + f'<div class="id" style="position:absolute;bottom:2.5mm;left:0;right:0;text-align:center">Morceau {r * 2 + c + 1} sur 4 (ligne {r + 1}, colonne {c + 1}) · recouvrement de 12 mm · échelle 90 %</div></div>')
    html["plateau-4xA4"] = page_html("Plateau 4xA4", tuiles, "297mm 210mm")
    html["livret"] = livret()

    sources = SORTIE / "html"
    sources.mkdir(exist_ok=True)
    for nom, h in html.items():
        (sources / f"{nom}.html").write_text(h, encoding="utf-8")

    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        try:
            nav = p.chromium.launch()
        except Exception:
            # Sans Chromium installé par Playwright, on utilise Microsoft Edge (déjà présent sous Windows).
            nav = p.chromium.launch(channel="msedge")
        page = nav.new_page()
        for nom in html:
            page.goto((sources / f"{nom}.html").as_uri())
            page.wait_for_timeout(300)
            page.pdf(path=str(SORTIE / f"{nom}.pdf"), prefer_css_page_size=True, print_background=True)
            print("ok", nom)
        nav.close()


if __name__ == "__main__":
    construire()
