#!/usr/bin/env python3
"""Erzeugt data/lexikon.json – Angel-Wissen zum Nachschlagen (einmalig bzw. bei Änderungen ausführen)."""
import json
from pathlib import Path

CATS = [
    {"id": "fische", "name": "Fischarten", "icon": "fish"},
    {"id": "koeder", "name": "Köder", "icon": "bait"},
    {"id": "montagen", "name": "Montagen & Methoden", "icon": "wave"},
    {"id": "ausruestung", "name": "Ausrüstung", "icon": "rod"},
    {"id": "knoten", "name": "Knoten", "icon": "knot"},
    {"id": "recht", "name": "Recht & Regeln NRW", "icon": "law"},
    {"id": "begriffe", "name": "Begriffe A–Z", "icon": "book"},
]

E = []
def fish(title, latin, text, erkennung, lebensraum, koeder, beste, nrw, rekord=None):
    facts = [["Erkennung", erkennung], ["Lebensraum", lebensraum], ["Top-Köder", koeder], ["Beste Zeit", beste], ["NRW-Regeln", nrw]]
    if rekord:
        facts.append(["Größe", rekord])
    E.append({"cat": "fische", "title": title, "latin": latin, "text": text, "facts": facts})

fish("Flussbarsch", "Perca fluviatilis", "Der Barsch ist ein geselliger Räuber, der oft in Trupps jagt. Wo einer beißt, beißen meist mehrere.",
     "Zwei Rückenflossen, die erste mit Stacheln und schwarzem Fleck; dunkle Querbinden; rote Bauch- und Afterflossen",
     "Flüsse, Seen, Häfen, Steinpackungen, Brückenpfeiler", "Gummifisch 5–8 cm, Spinner, Dropshot, Tauwurm",
     "Ganzjährig; Herbst besonders gut, Dämmerung", "keine Schonzeit, kein Mindestmaß", "meist 15–30 cm, große Exemplare über 40 cm")
fish("Zander", "Sander lucioperca", "Der Zander ist der Brot-und-Butter-Raubfisch am Rhein. Er jagt in der Dämmerung und nachts am Grund.",
     "Schlank, glasige große Augen, Hundszähne, zwei getrennte Rückenflossen, graubraune Querbinden",
     "Großflüsse, Buhnenköpfe, Strömungskanten, Häfen, trübe Seen", "Gummifisch 10–14 cm am Jigkopf, Köderfisch, Wobbler nachts",
     "Herbst und Winter in der Dämmerung", "Schonzeit 01.04.–31.05., Mindestmaß 40 cm", "meist 40–70 cm, bis über 1 m")
fish("Hecht", "Esox lucius", "Der Hecht ist ein Lauerjäger, der aus der Deckung blitzschnell zuschlägt. Stahlvorfach ist Pflicht!",
     "Langgestreckt, entenschnabelförmiges Maul, Rückenflosse weit hinten, grünlich mit hellen Flecken",
     "Krautfelder, Altarme, Seen, ruhige Hafenbecken", "Große Gummifische, Spinnerbaits, Blinker, Köderfisch",
     "Frühjahr nach der Schonzeit und Herbst", "Schonzeit 15.02.–30.04., Mindestmaß 45 cm", "meist 50–90 cm, bis über 1,20 m")
fish("Rapfen", "Leuciscus aspius", "Der einzige Raubfisch unter den Karpfenartigen. Er jagt an der Oberfläche – das Spritzen verrät ihn.",
     "Silbrig, schlank, großes oberständiges Maul ohne Zähne", "Strömungsstarke Flussabschnitte, hinter Buhnen, Wehre",
     "Schlanke Metallköder (Jigspoon, Blinker) schnell geführt, Oberflächenköder", "Sommer und Frühherbst bei Sonne", "kein Mindestmaß in NRW", "meist 50–70 cm")
fish("Wels", "Silurus glanis", "Der größte Süßwasserfisch Europas. Im Rhein inzwischen häufig, beißt vor allem nachts.",
     "Schuppenlos, riesiges Maul, 6 Barteln (2 lange oben, 4 kurze unten), lange Afterflosse",
     "Tiefe Gumpen, Hafenbecken, Buhnenfelder", "Tauwurmbündel, Köderfisch, Clonk-Angeln, große Gummis", "Mai bis Oktober, warme Nächte",
     "kein Mindestmaß in NRW", "oft 1–2 m")
fish("Aal", "Anguilla anguilla", "Der Aal ist stark gefährdet. Im Rheinhauptstrom gilt eine Schonzeit; viele Angler setzen ihn freiwillig zurück.",
     "Schlangenförmig, schleimige Haut, durchgehender Flossensaum", "Grund von Flüssen und Seen, Steinschüttungen",
     "Tauwurm, Fischfetzen", "Warme, schwüle Nächte im Sommer", "Mindestmaß 50 cm; Schonzeit 01.10.–01.03. im Rheinhauptstrom")
fish("Barbe", "Barbus barbus", "Ein kräftiger Strömungsfisch, der am Grund nach Nahrung sucht – sehr kampfstark.",
     "Rüsselartiges Maul mit 4 Barteln, bronzefarben, flacher Bauch", "Kiesige, strömende Flussabschnitte",
     "Maden, Frühstücksfleisch, Käse, Pellets am Feeder", "Sommer bis Herbst, auch tagsüber", "Schonzeit 15.05.–15.06., Mindestmaß 35 cm", "meist 40–70 cm")
fish("Döbel", "Squalius cephalus", "Ein Allesfresser, der von Brot bis Kleinfisch alles nimmt – sehr scheu.",
     "Breiter Kopf, große Schuppen mit dunklem Rand, konvexe (nach außen gewölbte) Afterflosse", "Flüsse und Bäche, unter überhängenden Bäumen",
     "Brotflocke, Kirschen, kleine Wobbler, Spinner", "Ganzjährig", "keine Schonzeit, kein Mindestmaß")
fish("Karpfen", "Cyprinus carpio", "Der Klassiker unter den Friedfischen. Karpfenangeln ist oft Geduld – der Drill entschädigt.",
     "Hochrückig, 4 Barteln, große Schuppen (Schuppen-, Spiegel-, Lederkarpfen)", "Seen, Teiche, ruhige Flussabschnitte",
     "Boilies, Mais, Frolic, Teig", "Mai bis Oktober, morgens und abends", "Mindestmaß 35 cm")
fish("Schleie", "Tinca tinca", "Ein ruhiger Grundfisch der Krautzonen mit grün-goldener Farbe und roten Augen.",
     "Kleine Schuppen, dicke Schleimschicht, abgerundete Flossen, 2 kurze Barteln", "Pflanzenreiche, schlammige Stillgewässer",
     "Wurm, Mais, Maden an der Pose", "Frühsommer, früh morgens", "Mindestmaß 25 cm")
fish("Brassen (Blei)", "Abramis brama", "Brassen ziehen in großen Schwärmen – ideal fürs Feederangeln.",
     "Sehr hochrückig und seitlich abgeflacht, rüsselartiges Maul, bleigrau", "Seen, ruhige Flussabschnitte, Häfen",
     "Maden, Mais, Wurm mit Futterkorb", "Ganzjährig, Sommer am besten", "keine Schonzeit, kein Mindestmaß")
fish("Rotauge (Plötze)", "Rutilus rutilus", "Der häufigste Friedfisch – perfekt für Einsteiger und als Köderfisch.",
     "Silbrig, rote Iris, Rückenflosse beginnt über dem Bauchflossenansatz", "Fast alle Gewässer", "Maden, Brot, Mais an feiner Pose",
     "Ganzjährig", "keine Schonzeit, kein Mindestmaß")
fish("Regenbogenforelle", "Oncorhynchus mykiss", "Der typische Besatzfisch in Forellenteichen wie dem Angelpark Caster.",
     "Rosa-violetter Seitenstreifen, kleine schwarze Punkte bis in die Schwanzflosse, Fettflosse", "Forellenteiche, kühle Bäche",
     "Teig (Powerbait), Bienenmaden, Spoons und Spinner mit Einzelhaken, Tremarella", "Ganzjährig, morgens nach dem Einsatz",
     "In NRW keine gesetzliche Schonzeit; am Teich gilt die Teichordnung")
fish("Lachsforelle", "Oncorhynchus mykiss / Salmo trutta", "Lachsforelle ist kein eigener Fisch: Gemeint sind Forellen mit rosa Fleisch durch besonderes Futter.",
     "Wie Regenbogenforelle, oft kräftiger", "Forellenteiche", "Teig, Bienenmade, Spoon", "Ganzjährig", "Teichordnung beachten")
fish("Bachforelle", "Salmo trutta fario", "Die heimische Forelle kühler, sauerstoffreicher Bäche – in der Eifel zu Hause.",
     "Rote Punkte mit hellem Hof, Fettflosse", "Kühle Bäche und Flüsse", "Spinner, kleine Wobbler, Fliege", "Frühjahr und Sommer",
     "Schonzeit 20.10.–15.03., Mindestmaß 25 cm")
fish("Bachsaibling", "Salvelinus fontinalis", "Ein farbenprächtiger Verwandter der Forelle, beliebt in Forellenteichen.",
     "Weißer Saum an Brust-, Bauch- und Afterflosse, wurmartige Musterung auf dem Rücken", "Kalte Bäche, Forellenteiche",
     "Bienenmade, Teig, kleine Spoons", "Ganzjährig in Teichen", "Teichordnung beachten")
fish("Stör", "Acipenser spec.", "Störe werden in manchen Angelparks eingesetzt. Im Caster sind Störe ab 1 m zurückzusetzen.",
     "Knochenplatten statt Schuppen, Rüssel mit Barteln, haiartige Schwanzflosse", "Angelparks (in freien Gewässern NRW ganzjährig geschützt)",
     "Pellets, Wurm, Fischfetzen am Grund", "Sommer", "In freien Gewässern NRW ganzjährig geschützt")
fish("Schwarzmundgrundel", "Neogobius melanostomus", "Eine eingewanderte Grundelart, die den Rhein massenhaft besiedelt – sie klaut oft die Köder.",
     "Bis 25 cm, schwarzer Fleck in der ersten Rückenflosse, verwachsene Bauchflossen (Saugscheibe)", "Steinpackungen am Rhein",
     "Wurm, kleine Gummis", "Ganzjährig", "Invasive Art – nicht zurücksetzen (Vereinsregeln beachten)")

def add(cat, title, text, facts=None, steps=None, alias=""):
    e = {"cat": cat, "title": title, "text": text}
    if facts: e["facts"] = facts
    if steps: e["steps"] = steps
    if alias: e["alias"] = alias
    E.append(e)

# Köder
add("koeder", "Gummifisch (Shad)", "Der vielseitigste Kunstköder für Zander, Barsch und Hecht. Er wird am Jigkopf über den Grund gehüpft.",
    [["Größe", "Barsch 5–8 cm, Zander 10–14 cm, Hecht 15–25 cm"], ["Farben", "Klares Wasser: natürlich; trübes Wasser: Weiß, Chartreuse, Motoroil"], ["Führung", "Anheben – absinken lassen – Biss kommt meist in der Absinkphase"]])
add("koeder", "Jigkopf", "Bleikopf mit Haken für Gummifische. Das Gewicht hängt von Strömung und Tiefe ab.",
    [["Rhein", "14–28 g je nach Pegel und Strömung"], ["See", "5–14 g"], ["Faustregel", "So leicht wie möglich, so schwer wie nötig – der Köder soll in 2–4 Sekunden am Grund ankommen"]])
add("koeder", "Spinner", "Ein Metallblatt dreht sich um eine Achse und erzeugt Druckwellen. Leicht zu führen – ideal für Einsteiger.",
    [["Für", "Barsch, Forelle, Döbel, Hecht"], ["Größe", "Gr. 1–3 für Barsch/Forelle, 4–5 für Hecht"], ["Tipp", "Am Forellenteich nur mit Einzelhaken erlaubt"]])
add("koeder", "Wobbler", "Fischimitat aus Hartplastik oder Holz mit Tauchschaufel. Schwimmend, schwebend oder sinkend.",
    [["Für", "Barsch, Zander (nachts), Hecht, Döbel, Rapfen"], ["Lauftiefe", "Steht auf der Packung – passend zur Gewässertiefe wählen"]])
add("koeder", "Blinker & Spoon", "Gebogene Metallplatten, die beim Einholen taumeln. Spoons sind kleine, leichte Blinker für Forellen.",
    [["Für", "Hecht, Rapfen, Forelle"], ["Achtung", "Am Angelpark Caster sind Blinker verboten, Spoons nur mit Einzelhaken erlaubt"]])
add("koeder", "Forellenteig (Powerbait)", "Schwimmender, duftender Teig. Er treibt über dem Grund und wird von Forellen gut gefunden.",
    [["Montage", "Grundblei mit langem Vorfach (60–150 cm) oder Sbirolino"], ["Farben", "Gelb, Orange, Grün, Pink – wechseln, bis es beißt"]])
add("koeder", "Bienenmade & Mehlwurm", "Klassische Naturköder für Forellen am Teich – oft einzeln oder zu zweit am feinen Haken.")
add("koeder", "Tauwurm & Rotwurm", "Der universelle Naturköder: Barsch, Aal, Wels, Karpfen, Forelle – fast alles beißt auf Wurm.",
    [["Tipp", "Wurm nicht komplett auffädeln, das Ende soll sich bewegen"]])
add("koeder", "Maden", "Kleine, weiße Fliegenlarven – der Standardköder für Friedfische an Pose und Feeder.")
add("koeder", "Köderfisch", "Natürliche Beute für Raubfische. In NRW nur Köderfische aus dem Fanggewässer verwenden; lebende Köderfische sind tierschutzrechtlich verboten.")
add("koeder", "Boilies", "Gekochte Teigkugeln für Karpfen, meist an der Haarmontage. Größe 15–24 mm.")

# Montagen
add("montagen", "Dropshot", "Finesse-Montage für Barsch und Zander: Das Blei hängt unten, der Köder 20–50 cm darüber und zittert auf der Stelle.",
    steps=["Dropshot-Haken mit Palomar-Knoten binden, Hakenspitze nach oben", "Schnur 20–50 cm unterm Haken lang lassen", "Dropshot-Blei (5–20 g) am Ende einklemmen", "Gummi (5–8 cm) an der Nase anködern", "Auswerfen, Blei am Grund lassen, Köder nur durch Zittern der Rutenspitze bewegen"])
add("montagen", "Jiggen / Faulenzen", "Standardtechnik mit Gummifisch am Jigkopf. Beim Faulenzen wird nur mit der Rolle gearbeitet.",
    steps=["Auswerfen und Köder absinken lassen, bis die Schnur erschlafft", "2–3 schnelle Kurbelumdrehungen – Köder hebt ab", "Stopp: Köder sinkt wieder zum Grund (hier kommt der Biss)", "Wiederholen, bis der Köder am Ufer ist", "Bei jedem 'Tock' oder Zupfen sofort anschlagen"])
add("montagen", "Grundmontage (Laufblei)", "Einfachste Montage für Aal, Wels, Karpfen und Forelle mit Teig.",
    steps=["Laufblei oder Grundblei auf die Hauptschnur fädeln", "Gummiperle als Knotenschutz aufziehen", "Wirbel anknoten", "Vorfach (40–150 cm) mit Haken in den Wirbel", "Schnur nach dem Auswurf leicht straffen, Biss an der Rutenspitze ablesen"])
add("montagen", "Posenmontage", "Klassisch für Friedfische und Forellen: Die Pose zeigt den Biss und hält den Köder in der gewünschten Tiefe.",
    steps=["Stopper und Perle auf die Schnur", "Pose durchfädeln oder fest montieren", "Bleischrot so verteilen, dass nur die Antenne herausschaut", "Haken anbinden, Tiefe über den Stopper einstellen", "Zieht die Pose unter Wasser: anschlagen"])
add("montagen", "Feederangeln", "Grundangeln mit Futterkorb und feiner Spitze – ideal für Brassen, Rotaugen und Barben am Rhein.",
    [["Rute", "Feederrute 3,30–3,90 m, Wurfgewicht bis 120 g für den Rhein"], ["Korb", "Am Rhein schwere Körbe 60–120 g"], ["Biss", "Die bunte Zitterspitze zeigt den Biss"]])
add("montagen", "Sbirolino / Tremarella", "Spezielle Forellenteich-Techniken: Sbirolino ist ein Wurfgewicht für weite Würfe mit leichten Ködern, Tremarella lässt den Köder zittern.",
    [["Vorfach", "1,5–3 m bei Sbirolino"], ["Köder", "Teig, Bienenmade, Gummiwurm"]])
add("montagen", "Stahlvorfach", "Beim Angeln auf Hecht immer ein Stahl- oder Titanvorfach (mind. 30–50 cm) verwenden. Sonst beißt der Hecht die Schnur durch und verendet mit dem Köder.")

# Ausrüstung
add("ausruestung", "Spinnrute", "Die Allround-Rute fürs Kunstköderangeln.",
    [["Barsch", "2,10–2,40 m, Wurfgewicht 5–25 g"], ["Zander Rhein", "2,40–2,70 m, Wurfgewicht 15–50 g, straffe Spitze"], ["Hecht", "2,40–2,70 m, Wurfgewicht 30–80 g"]])
add("ausruestung", "Stationärrolle", "Die Standardrolle für fast alle Methoden.",
    [["Größe", "2500 für Barsch/Forelle, 3000–4000 für Zander/Hecht"], ["Bremse", "So einstellen, dass die Schnur bei starkem Zug Schnur gibt, bevor sie reißt"]])
add("ausruestung", "Geflochtene Schnur", "Dehnt sich kaum – Bisse kommen direkt an. Ideal zum Jiggen.",
    [["Stärke", "0,08–0,10 mm Barsch, 0,12–0,15 mm Zander, 0,15–0,20 mm Hecht"], ["Tipp", "Mit 1–1,5 m Fluorocarbon-Vorfach kombinieren"]])
add("ausruestung", "Monofile Schnur", "Dehnbar und gutmütig, puffert Fluchten ab – gut für Forellenteich, Pose und Grund.",
    [["Stärke", "0,18–0,22 mm Forelle, 0,25–0,30 mm Karpfen"]])
add("ausruestung", "Fluorocarbon", "Unter Wasser fast unsichtbar und abriebfest – als Vorfach für scheue Fische und an Steinpackungen.")
add("ausruestung", "Unterfangkescher", "Pflicht am Angelpark Caster. Fische damit sicher landen statt an der Schnur herauszuheben.")
add("ausruestung", "Hakenlöser & Lösezange", "Zum schonenden Lösen tief sitzender Haken. Für Hecht: lange Lösezange und Maulsperre.")
add("ausruestung", "Betäuber (Fischtöter)", "Pflicht für maßige, entnommene Fische: Erst betäuben (kräftiger Schlag auf den Hinterkopf), dann sofort töten (Herzstich oder Kiemenrundschnitt).")
add("ausruestung", "Checkliste Angeltag", "Was immer in die Tasche gehört.",
    [["Papiere", "Fischereischein, Erlaubnisschein/Tageskarte"], ["Werkzeug", "Hakenlöser, Zange, Messer, Maßband, Betäuber"], ["Landen", "Kescher"], ["Sonst", "Ersatzhaken, Vorfächer, Köder, Kühlbox, Müllbeutel, Regenkleidung, Handy-Akku"]])

# Knoten
add("knoten", "Palomar-Knoten", "Sehr starker, einfacher Knoten für Haken, Wirbel und Dropshot.",
    steps=["Schnur doppelt nehmen und die Schlaufe durchs Hakenöhr führen", "Mit der Doppelschnur einen einfachen Knoten binden (locker lassen)", "Haken durch die Schlaufe stecken", "Knoten anfeuchten und gleichmäßig festziehen", "Überstehendes Ende abschneiden"])
add("knoten", "Clinch-Knoten (verbessert)", "Der Klassiker für Monofil an Haken und Wirbel.",
    steps=["Schnur durchs Öhr ziehen, ca. 15 cm überstehen lassen", "Ende 5–7 Mal um die Hauptschnur wickeln", "Ende durch die kleine Schlaufe direkt am Öhr führen", "Dann durch die neu entstandene große Schlaufe stecken", "Anfeuchten, festziehen, kürzen"])
add("knoten", "Grinner / Uni-Knoten", "Universeller Knoten, auch für geflochtene Schnur geeignet.",
    steps=["Schnur durchs Öhr führen und parallel zurücklegen", "Mit dem Ende eine Schlaufe bilden", "Ende 5–6 Mal durch die Schlaufe um beide Schnüre wickeln", "Anfeuchten und zum Öhr schieben", "Festziehen und kürzen"])
add("knoten", "FG-Knoten / Doppelter Uni", "Verbindet geflochtene Hauptschnur mit Fluorocarbon-Vorfach. Der doppelte Uni-Knoten ist leichter zu lernen.",
    steps=["Beide Schnurenden überlappend nebeneinanderlegen", "Mit dem Geflecht einen Uni-Knoten um das Fluorocarbon binden (8–10 Windungen)", "Mit dem Fluorocarbon einen Uni-Knoten um das Geflecht binden (4–5 Windungen)", "Anfeuchten, beide Knoten zusammenziehen", "Enden kürzen"])

# Recht
add("recht", "Fischereischein", "In NRW braucht man zum Angeln einen staatlichen Fischereischein – dafür ist die Fischerprüfung nötig. Für Kinder und Jugendliche gibt es Sonderregeln (Jugendfischereischein).",
    [["Ausgabe", "Ordnungsamt / Fischereibehörde der Stadt oder des Kreises"], ["Ausnahme", "An privaten Angelteichen gelten teils Sonderregeln – bei Caster vorher fragen"]])
add("recht", "Erlaubnisschein (Angelkarte)", "Zusätzlich zum Fischereischein braucht man für jedes Gewässer die Erlaubnis des Fischereiberechtigten: Vereinskarte, Tages-, Wochen- oder Jahreskarte.",
    [["Rhein", "Rheinkarten gibt es für einzelne Abschnitte in Angelshops in Bonn und Köln"], ["Inhalt", "Auf der Karte stehen erlaubte Strecke, Rutenzahl und Sonderregeln"]])
add("recht", "Entnahme & Tierschutz", "Fische, die mitgenommen werden, müssen sofort betäubt und getötet werden. Untermaßige oder geschonte Fische werden sofort schonend zurückgesetzt.",
    [["Verboten", "Lebende Köderfische, Setzkescher je nach Gewässerordnung, Reißen von Fischen"]])
add("recht", "Nachtangeln", "Nachtangeln ist in NRW grundsätzlich erlaubt, kann aber durch Gewässerordnungen oder den Erlaubnisschein eingeschränkt sein.")

# Begriffe
for t, x in [
    ("Anschlag", "Ruckartiges Anheben der Rute nach dem Biss, damit der Haken greift."),
    ("Buhne", "Steinbuhne quer zum Ufer am Rhein. Am Buhnenkopf (Spitze) entstehen Strömungskanten – Top-Platz für Zander."),
    ("Buhnenfeld", "Das ruhigere Wasser zwischen zwei Buhnen mit Kehrströmung."),
    ("Drill", "Das Ausdrillen eines gehakten Fisches bis zur Landung."),
    ("Kehrströmung", "Rückläufige Strömung hinter Hindernissen – hier warten Raubfische auf Beute."),
    ("Mindestmaß", "Länge von der Kopfspitze bis zum Ende der Schwanzflosse, ab der ein Fisch entnommen werden darf."),
    ("Schonzeit", "Zeitraum, in dem eine Fischart (meist zur Laichzeit) nicht entnommen werden darf."),
    ("Petri Heil", "Gruß unter Anglern – Antwort: 'Petri Dank'."),
    ("Wurfgewicht", "Angabe auf der Rute, für welches Ködergewicht sie gebaut ist."),
    ("Vorfach", "Das letzte Schnurstück zwischen Hauptschnur und Haken bzw. Köder."),
    ("Wirbel", "Drehbares Verbindungsstück, verhindert Schnurdrall."),
    ("Solunar", "Theorie, nach der Fische zu bestimmten Mondständen aktiver sind (Haupt- und Nebenbeißzeiten)."),
    ("Pegel", "Wasserstand an einer Messstelle. Pegel Bonn um 300 cm ist mittleres Wasser."),
    ("Kunstköder", "Künstliche Köder wie Gummifisch, Wobbler, Spinner – Gegenteil: Naturköder."),
    ("Abhaken / Release", "Fisch wieder freilassen (Catch & Release) – in Deutschland nur bei untermaßigen/geschonten Fischen eindeutig erlaubt."),
    ("Besatz", "Fische, die in ein Gewässer eingesetzt werden – am Forellenteich täglich."),
]:
    add("begriffe", t, x)

NRW = [
    {"fish": "Zander", "from": [4, 1], "to": [5, 31], "mm": 40},
    {"fish": "Hecht", "from": [2, 15], "to": [4, 30], "mm": 45},
    {"fish": "Bachforelle", "from": [10, 20], "to": [3, 15], "mm": 25},
    {"fish": "Seeforelle", "from": [10, 20], "to": [3, 15], "mm": 50},
    {"fish": "Seesaibling", "from": [10, 20], "to": [3, 15], "mm": 30},
    {"fish": "Äsche", "from": [3, 1], "to": [4, 30], "mm": 30},
    {"fish": "Nase", "from": [3, 1], "to": [4, 30], "mm": 30},
    {"fish": "Barbe", "from": [5, 15], "to": [6, 15], "mm": 35},
    {"fish": "Aal", "from": [10, 1], "to": [3, 1], "mm": 50, "note": "Schonzeit nur im Rheinhauptstrom"},
    {"fish": "Karpfen", "mm": 35},
    {"fish": "Schleie", "mm": 25},
    {"fish": "Aland", "mm": 25},
    {"fish": "Flussbarsch", "note": "keine Vorgaben"},
]
PROTECTED = ["Stör", "Lachs", "Meerforelle", "Quappe", "Maifisch", "Finte", "Nordseeschnäpel", "Schneider", "Steinbeißer", "Groppe", "Moderlieschen",
             "Schlammpeitzger", "Schmerle", "Elritze", "Zwergstichling", "Bitterling", "Neunaugen", "Edelkrebs", "Steinkrebs", "Großmuscheln"]

out = {"categories": CATS, "entries": E, "nrw": NRW, "protected": PROTECTED, "source": "Eigene Zusammenstellung; Recht: Landesfischereiverordnung NRW"}
p = Path(__file__).resolve().parent.parent / "data" / "lexikon.json"
p.write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
print(len(E), "Einträge")
