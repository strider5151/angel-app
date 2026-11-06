#!/usr/bin/env python3
"""Liest die Webseite des Angelpark Caster aus und schreibt data/caster.json.
Läuft täglich per GitHub Actions. Bei Fehlern bleiben die letzten Daten erhalten."""
import hashlib, json, re, sys, datetime as dt
from pathlib import Path
import requests
from bs4 import BeautifulSoup

BASE = "https://www.forellenzucht-caster.de/"
PAGES = {"Startseite": "index.php", "Angelpark": "angelpark_caster.php", "Preise & Öffnungszeiten": "preise_caster.php", "Teichordnung": "teichordnung_caster.php"}
ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "data" / "caster.json"
SKIP = re.compile(r"IBAN|BIC|Spendenkonto|PayPal|Kontoinhaber|Empfänger|Cookie|Datenschutz|Impressum", re.I)
NOTE = re.compile(r"geschlossen|gesperrt|Achtung|Hinweis|Betriebsferien|Urlaub|Hochwasser|Flut|Gülle|wieder geöffnet|Eisfrei|Eis\b", re.I)
UA = {"User-Agent": "Barsch-Buddy-App (privat, taegliche Abfrage)"}

ERRORS, SIZES = [], {}

def write_status(key, info):
    p = ROOT / "data" / "status.json"
    try:
        st = json.loads(p.read_text(encoding="utf-8")) if p.exists() else {}
    except Exception:
        st = {}
    info["at"] = now()
    st[key] = info
    p.write_text(json.dumps(st, ensure_ascii=False, indent=1), encoding="utf-8")

def now():
    return dt.datetime.now(dt.timezone.utc).isoformat(timespec="seconds")

def clean(t):
    return re.sub(r"\s+", " ", t or "").strip()

def page_sections(html, fallback_title):
    soup = BeautifulSoup(html, "html.parser")
    for tag in soup(["script", "style", "noscript", "nav", "header", "footer", "form", "iframe"]):
        tag.decompose()
    body = soup.find("main") or soup.find(id=re.compile("content|main", re.I)) or soup.body or soup
    sections, cur, tables = [], {"title": fallback_title, "lines": []}, []
    for el in body.find_all(["h1", "h2", "h3", "h4", "p", "li", "table"]):
        if el.find_parent("table") and el.name != "table":
            continue
        if el.name == "table":
            rows = []
            for tr in el.find_all("tr"):
                cells = [clean(td.get_text(" ")) for td in tr.find_all(["td", "th"])]
                if any(cells):
                    rows.append(cells)
            if rows:
                tables.append(rows)
                cur["lines"] += [" | ".join(c for c in r if c) for r in rows if not SKIP.search(" ".join(r))]
            continue
        if el.name == "li" and el.find(["p", "li"]):
            continue
        txt = clean(el.get_text(" "))
        if not txt or len(txt) < 2 or SKIP.search(txt):
            continue
        if el.name in ("h1", "h2", "h3", "h4"):
            if cur["lines"]:
                sections.append(cur)
            cur = {"title": txt[:80], "lines": []}
        else:
            if txt not in cur["lines"]:
                cur["lines"].append(txt)
    if cur["lines"]:
        sections.append(cur)
    # Fallback für Seiten ohne saubere Überschriften/Absätze (z. B. Text mit <br> in <div>s)
    if sum(len(s["lines"]) for s in sections) < 3:
        lines = []
        for raw in body.get_text("\n").split("\n"):
            txt = clean(raw)
            if len(txt) > 2 and not SKIP.search(txt) and txt not in lines:
                lines.append(txt)
        if lines:
            sections = [{"title": fallback_title, "lines": lines[:80]}]
    return sections, tables

def parse_prices(tables):
    """Sucht die Besatzkarte: Zeilen mit Teich | Besatz | Preis."""
    out = []
    for rows in tables:
        for r in rows:
            if len(r) < 2 or not re.search(r"teich", r[0], re.I):
                continue
            preis = r[-1] if len(r) >= 3 else ""
            locked = bool(re.search(r"gesperrt", " ".join(r), re.I))
            if not (re.search(r"\d+\s*€|€\s*\d+", preis) or locked):
                continue
            if re.fullmatch(r"\d+", r[1].strip()) or any(o["teich"] == r[0] for o in out):
                continue  # Reservierungstabelle (Personenzahl) bzw. Doppelte überspringen
            out.append({"teich": r[0], "besatz": r[1], "preis": preis if not locked else "–", "locked": locked})
    return out

def parse_closures(text, year):
    """Erkennt z. B. '13.01.–31.01.2027 geschlossen'."""
    res = []
    for m in re.finditer(r"(\d{1,2})\.(\d{1,2})\.(\d{4})?\s*(?:-|–|bis)\s*(\d{1,2})\.(\d{1,2})\.(\d{4})?[^.]{0,40}?geschlossen", text, re.I):
        d1, m1, y1, d2, m2, y2 = m.groups()
        y2 = int(y2 or y1 or year); y1 = int(y1 or y2)
        try:
            a = dt.date(y1, int(m1), int(d1)); b = dt.date(y2, int(m2), int(d2))
        except ValueError:
            continue
        if b >= dt.date.today():
            res.append({"from": a.isoformat(), "to": b.isoformat(), "note": f"{a:%d.%m.}–{b:%d.%m.%Y}"})
    return res

def main():
    base = json.loads((ROOT / "scripts" / "caster_base.json").read_text(encoding="utf-8"))
    old = json.loads(OUT.read_text(encoding="utf-8")) if OUT.exists() else {}
    old_sc = old.get("scraped", {})
    sections, tables, ok = [], [], 0
    for title, path in PAGES.items():
        try:
            r = requests.get(BASE + path, headers=UA, timeout=30)
            r.raise_for_status()
            SIZES[path] = len(r.text)
            r.encoding = r.apparent_encoding or "utf-8"
            s, t = page_sections(r.text, title)
            for sec in s:
                if sec["title"] == title or not sec["title"]:
                    sec["title"] = title
                sections.append(sec)
            tables += t
            ok += 1
        except Exception as e:
            print(f"WARN {path}: {e}", file=sys.stderr)
            ERRORS.append(f"{path}: {e}")
    if ok == 0:
        print("Keine Seite erreichbar – behalte alte Daten.", file=sys.stderr)
        write_status("caster", {"pages_ok": 0, "errors": ERRORS})
        if old:
            return
        sections = []
    alltext = "\n".join(l for s in sections for l in s["lines"])
    h = hashlib.sha256(alltext.encode()).hexdigest()
    changed_at = old_sc.get("changed_at")
    if old_sc.get("hash") and old_sc.get("hash") != h:
        changed_at = now()
    notes = []
    for s in sections:
        if s["title"].startswith("Teichordnung"):
            continue
        for l in s["lines"]:
            if NOTE.search(l) and len(l) < 300 and l not in notes:
                notes.append(l)
    curated = dict(base)
    prices = parse_prices(tables)
    if len(prices) >= 2:
        for p in prices:  # Beschreibung aus der Basis behalten, falls kürzer
            for b in base["prices"]:
                if b["teich"].split()[0:2] == p["teich"].split()[0:2] and len(b["besatz"]) > len(p["besatz"]):
                    p["besatz"] = b["besatz"]
        curated["prices"] = prices
    curated["closures"] = parse_closures(alltext, dt.date.today().year) or base.get("closures", [])
    data = {
        "updated": now(),
        "curated": curated,
        "scraped": {"fetched_at": now() if ok else old_sc.get("fetched_at"), "pages_ok": ok, "hash": h if ok else old_sc.get("hash"),
                     "changed_at": changed_at, "notes": notes[:6], "sections": sections[:40]}
    }
    OUT.parent.mkdir(exist_ok=True)
    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=1), encoding="utf-8")
    write_status("caster", {"pages_ok": ok, "sections": len(sections), "lines": sum(len(x["lines"]) for x in sections), "tables": len(tables), "prices": len(prices), "errors": ERRORS,
                            "html_sizes": SIZES})
    print(f"OK: {ok} Seiten, {len(sections)} Abschnitte, {len(prices)} Preiszeilen, {len(notes)} Hinweise")

if __name__ == "__main__":
    main()
