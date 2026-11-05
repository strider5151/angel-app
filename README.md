# 🐟 Barsch-Buddy

Angel-App (PWA) für Bonn und 200 km Umkreis – gebaut fürs Handy.

**App öffnen:** https://strider5151.github.io/angel-app/
Auf dem Android-Handy in Chrome öffnen → Menü ⋮ → „App installieren“ / „Zum Startbildschirm hinzufügen“.

## Tabs
- **Heute** – Angel-Index für Rhein und Angelpark Caster, Wetter, Luftdruck-Tendenz, Sonne/Mond, Beißzeiten, Schonzeit-Hinweise, 7-Tage-Planer
- **Rhein** – Pegel Bonn (live), 7-Tage-Verlauf, Oberlauf Andernach, Zielfische des Monats, Spots, Erlaubnis-Infos
- **Caster** – Angelpark Caster (Mechernich): Status, Öffnungszeiten, Preise, Teichordnung, aktuelle Hinweise von der Webseite
- **Shops** – Angelshops im 200-km-Umkreis mit Öffnungszeiten, Filter „jetzt offen“, Entfernung
- **Lexikon** – Fische, Köder, Montagen, Ausrüstung, Knoten, Recht NRW, Begriffe
- **Fangbuch** – Fänge mit Foto; Wetter, Pegel und Mond werden automatisch mitgespeichert

## Daten
| Daten | Quelle | Aktualisierung |
|---|---|---|
| Wetter | Open-Meteo | live in der App |
| Pegel | PEGELONLINE (WSV) | live, Ausweichdaten alle 4 h |
| Angelpark Caster | forellenzucht-caster.de | täglich per GitHub Actions |
| Shops | OpenStreetMap (Overpass) + `scripts/shops_manual.json` | wöchentlich |
| Lexikon | `scripts/build_lexikon.py` | bei Bedarf |

Daten manuell aktualisieren: Reiter **Actions** → „Daten aktualisieren“ → *Run workflow*.

## Pflege
- Shop ergänzen/korrigieren: `scripts/shops_manual.json`
- Caster-Grunddaten (Fallback): `scripts/caster_base.json`
- Lexikon erweitern: `scripts/build_lexikon.py` bearbeiten und ausführen

Alle Angaben ohne Gewähr – vor Ort gelten Gewässerordnung und Erlaubnisschein.
