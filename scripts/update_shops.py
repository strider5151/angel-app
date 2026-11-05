#!/usr/bin/env python3
"""Sucht Angelshops im Umkreis von 200 km um Bonn über OpenStreetMap (Overpass) und schreibt data/shops.json."""
import json, sys, datetime as dt
from pathlib import Path
import requests

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "data" / "shops.json"
EXTRA = ROOT / "scripts" / "shops_extra.json"
LAT, LON, R = 50.7374, 7.0982, 200000
Q = f"""[out:json][timeout:180];
(
  nwr["shop"="fishing"](around:{R},{LAT},{LON});
  nwr["shop"~"outdoor|sports"]["fishing"~"yes|only"](around:{R},{LAT},{LON});
  nwr["shop"~"outdoor|sports|pet"]["name"~"[Aa]ngel"](around:{R},{LAT},{LON});
);
out center tags;"""
SERVERS = ["https://overpass-api.de/api/interpreter", "https://overpass.kumi.systems/api/interpreter", "https://maps.mail.ru/osm/tools/overpass/api/interpreter"]

def fetch():
    for s in SERVERS:
        try:
            r = requests.post(s, data={"data": Q}, timeout=240, headers={"User-Agent": "Barsch-Buddy-App"})
            r.raise_for_status()
            return r.json()["elements"]
        except Exception as e:
            print(f"WARN {s}: {e}", file=sys.stderr)
    return None

def main():
    els = fetch()
    if els is None:
        print("Overpass nicht erreichbar – behalte alte Daten.", file=sys.stderr)
        return
    extra = json.loads(EXTRA.read_text(encoding="utf-8")) if EXTRA.exists() else {}
    shops, seen = [], set()
    for e in els:
        t = e.get("tags", {})
        name = t.get("name")
        if not name:
            continue
        lat = e.get("lat") or e.get("center", {}).get("lat")
        lon = e.get("lon") or e.get("center", {}).get("lon")
        if lat is None:
            continue
        key = (name.lower(), round(lat, 3), round(lon, 3))
        if key in seen:
            continue
        seen.add(key)
        s = {
            "name": name, "lat": lat, "lon": lon,
            "street": " ".join(x for x in [t.get("addr:street"), t.get("addr:housenumber")] if x),
            "postcode": t.get("addr:postcode", ""), "city": t.get("addr:city", ""),
            "phone": t.get("phone") or t.get("contact:phone", ""),
            "website": t.get("website") or t.get("contact:website", ""),
            "opening_hours": t.get("opening_hours", ""),
            "kind": "fishing" if t.get("shop") == "fishing" else "outdoor",
        }
        # manuelle Ergänzungen (z. B. Rheinkarten-Verkauf, fehlende Öffnungszeiten)
        for k, v in extra.items():
            if k.lower() in name.lower():
                s.update(v)
        shops.append(s)
    # Handgepflegte Shops ergänzen, falls sie in OpenStreetMap fehlen
    manual = ROOT / "scripts" / "shops_manual.json"
    if manual.exists():
        for m in json.loads(manual.read_text(encoding="utf-8")):
            hit = next((s for s in shops if m["name"].lower().split()[-1] in s["name"].lower() and abs(s["lat"] - m["lat"]) < 0.02 and abs(s["lon"] - m["lon"]) < 0.03), None)
            if hit:
                for k, v in m.items():
                    if v and not hit.get(k):
                        hit[k] = v
            else:
                shops.append(dict(m))
    data = {"updated": dt.datetime.now(dt.timezone.utc).isoformat(timespec="seconds"), "center": {"lat": LAT, "lon": LON}, "radius_km": R // 1000, "shops": shops}
    OUT.parent.mkdir(exist_ok=True)
    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"OK: {len(shops)} Shops")

if __name__ == "__main__":
    main()
