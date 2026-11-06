#!/usr/bin/env python3
"""Erzeugt data/lexikon.json – Angel-Wissen auf Deutsch und Russisch (bei Änderungen erneut ausführen)."""
import json
from pathlib import Path

CATS = [
    {"id": "fische", "name": {"de": "Fischarten", "ru": "Виды рыб"}, "icon": "fish"},
    {"id": "koeder", "name": {"de": "Köder", "ru": "Приманки"}, "icon": "bait"},
    {"id": "montagen", "name": {"de": "Montagen & Methoden", "ru": "Оснастки и способы"}, "icon": "wave"},
    {"id": "ausruestung", "name": {"de": "Ausrüstung", "ru": "Снаряжение"}, "icon": "rod"},
    {"id": "knoten", "name": {"de": "Knoten", "ru": "Узлы"}, "icon": "knot"},
    {"id": "recht", "name": {"de": "Recht & Regeln NRW", "ru": "Законы и правила NRW"}, "icon": "law"},
    {"id": "begriffe", "name": {"de": "Begriffe A–Z", "ru": "Термины А–Я"}, "icon": "book"},
]
E = []

FL_DE = ["Erkennung", "Lebensraum", "Beste Köder", "Beste Zeit", "Regeln NRW", "Größe"]
FL_RU = ["Как узнать", "Где живёт", "Лучшие приманки", "Лучшее время", "Правила NRW", "Размер"]

def fish(latin, de, ru):
    """de/ru: (Titel, Text, Erkennung, Lebensraum, Köder, Zeit, Regeln, [Größe])"""
    def mk(v, labels):
        facts = [[labels[i], v[2 + i]] for i in range(5)]
        if len(v) > 7 and v[7]:
            facts.append([labels[5], v[7]])
        return {"title": v[0], "text": v[1], "facts": facts}
    E.append({"cat": "fische", "latin": latin, "de": mk(de, FL_DE), "ru": mk(ru, FL_RU)})

fish("Perca fluviatilis",
 ("Flussbarsch", "Der Barsch ist ein geselliger Räuber, der oft in Gruppen jagt. Wo einer beißt, beißen meist mehrere.",
  "Zwei Rückenflossen, die erste mit Stacheln und schwarzem Fleck; dunkle Querbinden; rote Bauch- und Afterflossen",
  "Flüsse, Seen, Häfen, Steinpackungen, Brückenpfeiler", "Gummifisch 5–8 cm, Spinner, Senkblei-Montage, Tauwurm",
  "Ganzjährig; Herbst besonders gut, Dämmerung", "keine Schonzeit, kein Mindestmaß", "meist 15–30 cm, große Fische über 40 cm"),
 ("Речной окунь", "Окунь – стайный хищник, часто охотится группой. Где клюнул один, там обычно клюют и другие.",
  "Два спинных плавника, первый колючий с чёрным пятном; тёмные поперечные полосы; красные брюшные и анальный плавники",
  "Реки, озёра, гавани, каменная наброска, опоры мостов", "Виброхвост 5–8 см, вертушка, дропшот, выползок",
  "Круглый год; особенно хорошо осенью, в сумерках", "без запрета и без мин. размера", "обычно 15–30 см, крупные – больше 40 см"))
fish("Sander lucioperca",
 ("Zander", "Der Zander ist der wichtigste Raubfisch am Rhein. Er jagt in der Dämmerung und nachts am Grund.",
  "Schlank, große glasige Augen, Fangzähne, zwei getrennte Rückenflossen, graubraune Querbinden",
  "Große Flüsse, Buhnenköpfe, Strömungskanten, Häfen, trübe Seen", "Gummifisch 10–14 cm am Bleikopf, Köderfisch, Wobbler nachts",
  "Herbst und Winter in der Dämmerung", "Schonzeit 01.04.–31.05., Mindestmaß 40 cm", "meist 40–70 cm, bis über 1 m"),
 ("Судак", "Судак – главный хищник Rhein. Охотится в сумерках и ночью у дна.",
  "Вытянутое тело, большие стеклянные глаза, клыки, два раздельных спинных плавника, серо-бурые полосы",
  "Большие реки, оголовки бун, границы течения, гавани, мутные озёра", "Виброхвост 10–14 см на джиг-головке, рыбка, воблер ночью",
  "Осень и зима в сумерках", "Запрет 01.04.–31.05., мин. размер 40 см", "обычно 40–70 см, бывает больше 1 м"))
fish("Esox lucius",
 ("Hecht", "Der Hecht lauert in der Deckung und schlägt blitzschnell zu. Ein Stahlvorfach ist Pflicht!",
  "Langgestreckt, entenschnabelförmiges Maul, Rückenflosse weit hinten, grünlich mit hellen Flecken",
  "Krautfelder, Altarme, Seen, ruhige Hafenbecken", "Große Gummifische, Blinker, Spinner-Köder, Köderfisch",
  "Frühjahr nach der Schonzeit und Herbst", "Schonzeit 15.02.–30.04., Mindestmaß 45 cm", "meist 50–90 cm, bis über 1,20 m"),
 ("Щука", "Щука подкарауливает добычу в укрытии и атакует молниеносно. Металлический поводок обязателен!",
  "Вытянутое тело, пасть как утиный клюв, спинной плавник далеко сзади, зеленоватая со светлыми пятнами",
  "Заросли водорослей, старицы, озёра, тихие гавани", "Крупная резина, блёсны, спиннербейты, рыбка",
  "Весна после запрета и осень", "Запрет 15.02.–30.04., мин. размер 45 см", "обычно 50–90 см, бывает больше 1,20 м"))
fish("Leuciscus aspius",
 ("Rapfen", "Der einzige Raubfisch unter den Karpfenfischen. Er jagt an der Oberfläche – das Spritzen verrät ihn.",
  "Silbrig, schlank, großes nach oben gerichtetes Maul ohne Zähne", "Strömungsreiche Flussabschnitte, hinter Buhnen, Wehre",
  "Schlanke Metallköder schnell geführt, Oberflächenköder", "Sommer und Frühherbst bei Sonne", "kein Mindestmaß in NRW", "meist 50–70 cm"),
 ("Жерех", "Единственный хищник среди карповых. Охотится у поверхности – выдают его всплески («бой»).",
  "Серебристый, вытянутый, большой верхний рот без зубов", "Участки с сильным течением, за бунами, у плотин",
  "Узкие металлические приманки быстрой проводкой, поверхностные приманки", "Лето и начало осени в солнечную погоду", "без мин. размера в NRW", "обычно 50–70 см"))
fish("Silurus glanis",
 ("Wels", "Der größte Süßwasserfisch Europas. Im Rhein inzwischen häufig, beißt vor allem nachts.",
  "Ohne Schuppen, riesiges Maul, 6 Barteln (2 lange oben, 4 kurze unten), lange Afterflosse", "Tiefe Gumpen, Hafenbecken, Buhnenfelder",
  "Tauwurmbündel, Köderfisch, Wallerholz (Klopfen), große Gummifische", "Mai bis Oktober, warme Nächte", "kein Mindestmaß in NRW", "oft 1–2 m"),
 ("Сом", "Самая крупная пресноводная рыба Европы. В Rhein встречается часто, клюёт в основном ночью.",
  "Без чешуи, огромная пасть, 6 усов (2 длинных сверху, 4 коротких снизу), длинный анальный плавник", "Глубокие ямы, гавани, участки между бунами",
  "Пучок выползков, рыбка, квок, крупная резина", "С мая по октябрь, тёплые ночи", "без мин. размера в NRW", "часто 1–2 м"))
fish("Anguilla anguilla",
 ("Aal", "Der Aal ist stark gefährdet. Im Rheinhauptstrom gilt eine Schonzeit; viele Angler setzen ihn freiwillig zurück.",
  "Schlangenförmig, schleimige Haut, durchgehender Flossensaum", "Grund von Flüssen und Seen, Steinschüttungen",
  "Tauwurm, Fischfetzen", "Warme, schwüle Sommernächte", "Mindestmaß 50 cm; Schonzeit 01.10.–01.03. im Rheinhauptstrom"),
 ("Угорь", "Угорь находится под серьёзной угрозой. В основном русле Rhein действует запрет; многие рыбаки отпускают его добровольно.",
  "Змеевидное тело, слизистая кожа, сплошная плавниковая кайма", "Дно рек и озёр, каменная наброска",
  "Выползок, кусочки рыбы", "Тёплые душные летние ночи", "Мин. размер 50 см; запрет 01.10.–01.03. в основном русле Rhein"))
fish("Barbus barbus",
 ("Barbe", "Ein kräftiger Strömungsfisch, der am Grund nach Nahrung sucht – sehr kampfstark.",
  "Rüsselartiges Maul mit 4 Barteln, bronzefarben, flacher Bauch", "Kiesige, strömende Flussabschnitte",
  "Maden, Frühstücksfleisch, Käse, Fischfutter-Pellets am Futterkorb", "Sommer bis Herbst, auch tagsüber", "Schonzeit 15.05.–15.06., Mindestmaß 35 cm", "meist 40–70 cm"),
 ("Усач", "Сильная рыба течения, кормится у дна – очень упорно сопротивляется.",
  "Хоботообразный рот с 4 усиками, бронзовый цвет, плоское брюхо", "Галечные участки с течением",
  "Опарыш, ветчина, сыр, пеллетс на фидер", "С лета до осени, и днём", "Запрет 15.05.–15.06., мин. размер 35 см", "обычно 40–70 см"))
fish("Squalius cephalus",
 ("Döbel", "Ein Allesfresser, der von Brot bis Kleinfisch alles nimmt – aber sehr scheu.",
  "Breiter Kopf, große Schuppen mit dunklem Rand, nach außen gewölbte Afterflosse", "Flüsse und Bäche, unter überhängenden Bäumen",
  "Brotflocke, Kirschen, kleine Wobbler, Spinner", "Ganzjährig", "keine Schonzeit, kein Mindestmaß"),
 ("Голавль", "Всеядная рыба: берёт всё – от хлеба до мелкой рыбки, но очень осторожна.",
  "Широкая голова, крупная чешуя с тёмной каймой, выпуклый анальный плавник", "Реки и ручьи, под нависающими деревьями",
  "Хлеб, вишня, мелкие воблеры, вертушки", "Круглый год", "без запрета и мин. размера"))
fish("Cyprinus carpio",
 ("Karpfen", "Der Klassiker unter den Friedfischen. Karpfenangeln braucht Geduld – der Drill entschädigt.",
  "Hochrückig, 4 Barteln, große Schuppen (Schuppen-, Spiegel-, Lederkarpfen)", "Seen, Teiche, ruhige Flussabschnitte",
  "Boilies (Karpfenkugeln), Mais, Teig", "Mai bis Oktober, morgens und abends", "Mindestmaß 35 cm"),
 ("Карп", "Классика среди мирной рыбы. Ловля карпа требует терпения – вываживание того стоит.",
  "Высокая спина, 4 уса, крупная чешуя (чешуйчатый, зеркальный, голый карп)", "Озёра, пруды, тихие участки рек",
  "Бойлы, кукуруза, тесто", "С мая по октябрь, утром и вечером", "Мин. размер 35 см"))
fish("Tinca tinca",
 ("Schleie", "Ein ruhiger Grundfisch der Krautzonen mit grün-goldener Farbe und roten Augen.",
  "Kleine Schuppen, dicke Schleimschicht, abgerundete Flossen, 2 kurze Barteln", "Pflanzenreiche, schlammige Stillgewässer",
  "Wurm, Mais, Maden an der Pose", "Frühsommer, früh morgens", "Mindestmaß 25 cm"),
 ("Линь", "Спокойная донная рыба зарослей, зелёно-золотистого цвета с красными глазами.",
  "Мелкая чешуя, толстый слой слизи, округлые плавники, 2 коротких уса", "Заросшие, илистые стоячие водоёмы",
  "Червь, кукуруза, опарыш на поплавок", "Начало лета, рано утром", "Мин. размер 25 см"))
fish("Abramis brama",
 ("Brassen (Blei)", "Brassen ziehen in großen Schwärmen – ideal fürs Angeln mit Futterkorb.",
  "Sehr hochrückig und seitlich abgeflacht, rüsselartiges Maul, bleigrau", "Seen, ruhige Flussabschnitte, Häfen",
  "Maden, Mais, Wurm mit Futterkorb", "Ganzjährig, Sommer am besten", "keine Schonzeit, kein Mindestmaß"),
 ("Лещ", "Лещи ходят большими стаями – идеальная рыба для ловли с кормушкой.",
  "Очень высокое, сжатое с боков тело, выдвижной рот, свинцово-серый", "Озёра, тихие участки рек, гавани",
  "Опарыш, кукуруза, червь с кормушкой", "Круглый год, лучше летом", "без запрета и мин. размера"))
fish("Rutilus rutilus",
 ("Rotauge (Plötze)", "Der häufigste Friedfisch – ideal für Einsteiger und als Köderfisch.",
  "Silbrig, rote Iris, Rückenflosse beginnt über dem Ansatz der Bauchflossen", "Fast alle Gewässer", "Maden, Brot, Mais an feiner Pose",
  "Ganzjährig", "keine Schonzeit, kein Mindestmaß"),
 ("Плотва", "Самая распространённая мирная рыба – идеальна для начинающих и как живец.",
  "Серебристая, красная радужка глаза, спинной плавник начинается над брюшными", "Почти все водоёмы", "Опарыш, хлеб, кукуруза на лёгкий поплавок",
  "Круглый год", "без запрета и мин. размера"))
fish("Oncorhynchus mykiss",
 ("Regenbogenforelle", "Der typische Besatzfisch in Forellenteichen wie dem Angelpark Caster.",
  "Rosa-violetter Seitenstreifen, kleine schwarze Punkte bis in die Schwanzflosse, Fettflosse", "Forellenteiche, kühle Bäche",
  "Forellenteig, Bienenmaden, Löffelblinker und Spinner mit Einzelhaken", "Ganzjährig, morgens nach dem Einsetzen",
  "In NRW keine gesetzliche Schonzeit; am Teich gilt die Teichordnung"),
 ("Радужная форель", "Типичная рыба для зарыбления в форелевых прудах, как в Angelpark Caster.",
  "Розово-фиолетовая полоса на боку, мелкие чёрные точки до хвоста, жировой плавник", "Форелевые пруды, холодные ручьи",
  "Форелевое тесто, личинки восковой моли, колебалки и вертушки с одинарным крючком", "Круглый год, утром после зарыбления",
  "В NRW нет законного запрета; на пруду действуют его правила"))
fish("Oncorhynchus mykiss / Salmo trutta",
 ("Lachsforelle", "Die Lachsforelle ist keine eigene Art: Gemeint sind Forellen mit rosa Fleisch durch besonderes Futter.",
  "Wie Regenbogenforelle, oft kräftiger", "Forellenteiche", "Teig, Bienenmade, Löffelblinker", "Ganzjährig", "Teichordnung beachten"),
 ("Лососевая форель", "Это не отдельный вид: так называют форель с розовым мясом благодаря особому корму.",
  "Как радужная форель, часто крупнее", "Форелевые пруды", "Тесто, личинка моли, колебалка", "Круглый год", "Соблюдать правила пруда"))
fish("Salmo trutta fario",
 ("Bachforelle", "Die heimische Forelle kühler, sauerstoffreicher Bäche – in der Eifel zu Hause.",
  "Rote Punkte mit hellem Hof, Fettflosse", "Kühle Bäche und Flüsse", "Spinner, kleine Wobbler, Fliege", "Frühjahr und Sommer",
  "Schonzeit 20.10.–15.03., Mindestmaß 25 cm"),
 ("Ручьевая форель", "Местная форель холодных, богатых кислородом ручьёв – водится в Eifel.",
  "Красные точки со светлым ободком, жировой плавник", "Холодные ручьи и реки", "Вертушки, мелкие воблеры, мушка", "Весна и лето",
  "Запрет 20.10.–15.03., мин. размер 25 см"))
fish("Salvelinus fontinalis",
 ("Bachsaibling", "Ein farbenprächtiger Verwandter der Forelle, beliebt in Forellenteichen.",
  "Weißer Saum an Brust-, Bauch- und Afterflosse, wurmartige Musterung auf dem Rücken", "Kalte Bäche, Forellenteiche",
  "Bienenmade, Teig, kleine Löffelblinker", "Ganzjährig in Teichen", "Teichordnung beachten"),
 ("Ручьевой голец", "Яркий родственник форели, популярен в форелевых прудах.",
  "Белая кайма на грудных, брюшных и анальном плавниках, червеобразный узор на спине", "Холодные ручьи, форелевые пруды",
  "Личинка моли, тесто, мелкие колебалки", "Круглый год в прудах", "Соблюдать правила пруда"))
fish("Acipenser spec.",
 ("Stör", "Störe werden in manchen Angelparks eingesetzt. Am Angelpark Caster sind Störe ab 1 m zurückzusetzen.",
  "Knochenplatten statt Schuppen, Rüssel mit Barteln, haiähnliche Schwanzflosse", "Angelparks (in freien Gewässern NRW ganzjährig geschützt)",
  "Pellets, Wurm, Fischfetzen am Grund", "Sommer", "In freien Gewässern NRW ganzjährig geschützt"),
 ("Осётр", "Осетров выпускают в некоторые платные пруды. В Angelpark Caster осетров от 1 м нужно отпускать.",
  "Костные пластины вместо чешуи, рыло с усиками, хвост как у акулы", "Платные пруды (в открытых водоёмах NRW охраняется круглый год)",
  "Пеллетс, червь, кусочки рыбы на дне", "Лето", "В открытых водоёмах NRW охраняется круглый год"))
fish("Neogobius melanostomus",
 ("Schwarzmundgrundel", "Eine eingewanderte Grundelart, die den Rhein massenhaft besiedelt – sie stiehlt oft die Köder.",
  "Bis 25 cm, schwarzer Fleck in der ersten Rückenflosse, verwachsene Bauchflossen (Saugscheibe)", "Steinpackungen am Rhein",
  "Wurm, kleine Gummiköder", "Ganzjährig", "Eingewanderte Art – nicht zurücksetzen (Vereinsregeln beachten)"),
 ("Бычок-кругляк", "Вселенец, массово заселивший Rhein – часто объедает наживку.",
  "До 25 см, чёрное пятно на первом спинном плавнике, сросшиеся брюшные плавники (присоска)", "Каменная наброска на Rhein",
  "Червь, мелкая резина", "Круглый год", "Чужеродный вид – не отпускать (смотри правила клуба)"))

def add(cat, de, ru):
    """de/ru: dict mit title, text, optional facts, steps"""
    E.append({"cat": cat, "de": de, "ru": ru})

# ---- Köder ----
add("koeder", {"title": "Gummifisch", "text": "Der vielseitigste Kunstköder für Zander, Barsch und Hecht. Er wird am Bleikopf über den Grund gehüpft.",
  "facts": [["Größe", "Barsch 5–8 cm, Zander 10–14 cm, Hecht 15–25 cm"], ["Farben", "Klares Wasser: natürliche Farben; trübes Wasser: Weiß, Neongelb, Braun-Grün"], ["Führung", "Anheben – absinken lassen – der Biss kommt meist beim Absinken"]]},
 {"title": "Виброхвост (резина)", "text": "Самая универсальная искусственная приманка для судака, окуня и щуки. Ведётся на джиг-головке прыжками по дну.",
  "facts": [["Размер", "окунь 5–8 см, судак 10–14 см, щука 15–25 см"], ["Цвета", "прозрачная вода: естественные; мутная: белый, кислотно-жёлтый, коричнево-зелёный"], ["Проводка", "подбросить – дать упасть – поклёвка обычно на падении"]]})
add("koeder", {"title": "Bleikopf (Jigkopf)", "text": "Haken mit Bleikopf für Gummifische. Das Gewicht hängt von Strömung und Tiefe ab.",
  "facts": [["Rhein", "14–28 g je nach Wasserstand und Strömung"], ["See", "5–14 g"], ["Faustregel", "So leicht wie möglich, so schwer wie nötig – der Köder soll in 2–4 Sekunden am Grund sein"]]},
 {"title": "Джиг-головка", "text": "Крючок с грузом-головкой для резины. Вес зависит от течения и глубины.",
  "facts": [["Rhein", "14–28 г в зависимости от уровня воды и течения"], ["Озеро", "5–14 г"], ["Правило", "Как можно легче, но так тяжело, как нужно – приманка должна достигать дна за 2–4 секунды"]]})
add("koeder", {"title": "Spinner", "text": "Ein Metallblatt dreht sich um eine Achse und erzeugt Druckwellen. Leicht zu führen – ideal für Einsteiger.",
  "facts": [["Für", "Barsch, Forelle, Döbel, Hecht"], ["Größe", "Gr. 1–3 für Barsch und Forelle, 4–5 für Hecht"], ["Tipp", "Am Forellenteich nur mit Einzelhaken erlaubt"]]},
 {"title": "Вертушка (вращающаяся блесна)", "text": "Лепесток вращается вокруг оси и создаёт колебания. Проста в проводке – идеальна для новичков.",
  "facts": [["Для", "окунь, форель, голавль, щука"], ["Размер", "№ 1–3 для окуня и форели, 4–5 для щуки"], ["Совет", "На форелевом пруду только с одинарным крючком"]]})
add("koeder", {"title": "Wobbler", "text": "Fischnachbildung aus Hartplastik oder Holz mit Tauchschaufel. Schwimmend, schwebend oder sinkend.",
  "facts": [["Für", "Barsch, Zander (nachts), Hecht, Döbel, Rapfen"], ["Lauftiefe", "Steht auf der Packung – passend zur Gewässertiefe wählen"]]},
 {"title": "Воблер", "text": "Имитация рыбки из пластика или дерева с лопаткой. Плавающий, суспендер или тонущий.",
  "facts": [["Для", "окунь, судак (ночью), щука, голавль, жерех"], ["Заглубление", "Указано на упаковке – выбирать по глубине водоёма"]]})
add("koeder", {"title": "Blinker & Löffelblinker", "text": "Gebogene Metallplatten, die beim Einholen taumeln. Löffelblinker sind kleine, leichte Blinker für Forellen.",
  "facts": [["Für", "Hecht, Rapfen, Forelle"], ["Achtung", "Am Angelpark Caster sind Blinker verboten, Löffelblinker nur mit Einzelhaken erlaubt"]]},
 {"title": "Блесна и колебалка", "text": "Изогнутые металлические пластины, которые играют при проводке. Микроколебалки – маленькие лёгкие блёсны для форели.",
  "facts": [["Для", "щука, жерех, форель"], ["Внимание", "В Angelpark Caster блёсны запрещены, колебалки – только с одинарным крючком"]]})
add("koeder", {"title": "Forellenteig", "text": "Schwimmender, duftender Teig. Er treibt über dem Grund und wird von Forellen gut gefunden.",
  "facts": [["Montage", "Grundblei mit langem Vorfach (60–150 cm) oder Wurfpose (Sbirolino)"], ["Farben", "Gelb, Orange, Grün, Rosa – wechseln, bis es beißt"]]},
 {"title": "Форелевое тесто", "text": "Плавающее ароматное тесто. Парит над дном, форель его легко находит.",
  "facts": [["Оснастка", "Донный груз с длинным поводком (60–150 см) или сбирулино"], ["Цвета", "жёлтый, оранжевый, зелёный, розовый – менять, пока не клюнет"]]})
add("koeder", {"title": "Bienenmade & Mehlwurm", "text": "Klassische Naturköder für Forellen am Teich – einzeln oder zu zweit am feinen Haken."},
 {"title": "Личинка моли и мучной червь", "text": "Классические натуральные наживки для форели на пруду – по одной или по две на тонком крючке."})
add("koeder", {"title": "Tauwurm & Rotwurm", "text": "Der Allround-Naturköder: Barsch, Aal, Wels, Karpfen, Forelle – fast alles beißt auf Wurm.", "facts": [["Tipp", "Wurm nicht ganz auffädeln, das Ende soll sich bewegen"]]},
 {"title": "Выползок и навозный червь", "text": "Универсальная натуральная наживка: окунь, угорь, сом, карп, форель – на червя клюёт почти всё.", "facts": [["Совет", "Не надевать червя целиком – кончик должен шевелиться"]]})
add("koeder", {"title": "Maden", "text": "Kleine weiße Fliegenlarven – der Standardköder für Friedfische an Pose und Futterkorb."},
 {"title": "Опарыш", "text": "Маленькие белые личинки мух – стандартная наживка для мирной рыбы на поплавок и фидер."})
add("koeder", {"title": "Köderfisch", "text": "Natürliche Beute für Raubfische. In NRW nur Köderfische aus dem Fanggewässer verwenden; lebende Köderfische sind verboten."},
 {"title": "Рыбка (насадка)", "text": "Естественная добыча хищников. В NRW использовать только рыбку из того же водоёма; живец запрещён."})
add("koeder", {"title": "Boilies (Karpfenkugeln)", "text": "Gekochte Teigkugeln für Karpfen, meist an der Haar-Montage. Größe 15–24 mm."},
 {"title": "Бойлы", "text": "Варёные шарики из теста для карпа, обычно на волосяной оснастке. Размер 15–24 мм."})

# ---- Montagen ----
add("montagen", {"title": "Senkblei-Montage (Dropshot)", "text": "Feine Montage für Barsch und Zander: Das Blei hängt unten, der Köder 20–50 cm darüber und zittert auf der Stelle.",
  "steps": ["Dropshot-Haken mit dem Palomar-Knoten binden, Hakenspitze nach oben", "Schnur 20–50 cm unter dem Haken lang lassen", "Dropshot-Blei (5–20 g) ans Ende klemmen", "Gummiköder (5–8 cm) an der Nase anködern", "Auswerfen, Blei am Grund lassen, Köder nur durch Zittern der Rutenspitze bewegen"]},
 {"title": "Дропшот (отводной поводок снизу)", "text": "Тонкая оснастка на окуня и судака: груз внизу, приманка на 20–50 см выше и дрожит на месте.",
  "steps": ["Привязать крючок узлом паломар, жалом вверх", "Оставить 20–50 см лески ниже крючка", "Закрепить груз (5–20 г) на конце", "Насадить резину (5–8 см) за нос", "Забросить, груз держать на дне, приманку шевелить лишь дрожанием кончика удилища"]})
add("montagen", {"title": "Faulenzen (Gummifisch am Grund)", "text": "Standardtechnik mit Gummifisch am Bleikopf. Beim Faulenzen wird nur mit der Rolle gearbeitet.",
  "steps": ["Auswerfen und Köder absinken lassen, bis die Schnur erschlafft", "2–3 schnelle Kurbelumdrehungen – der Köder hebt ab", "Stopp: Köder sinkt wieder zum Grund (hier kommt der Biss)", "Wiederholen, bis der Köder am Ufer ist", "Bei jedem Ruck oder Zupfen sofort anschlagen"]},
 {"title": "Ступенчатая проводка (джиг)", "text": "Основная техника с резиной на джиг-головке. Работаем только катушкой.",
  "steps": ["Забросить и дать приманке упасть, пока леска не ослабнет", "2–3 быстрых оборота катушки – приманка поднимается", "Пауза: приманка снова падает на дно (здесь поклёвка)", "Повторять до самого берега", "При любом ударе или подёргивании сразу подсекать"]})
add("montagen", {"title": "Grundmontage (Laufblei)", "text": "Einfachste Montage für Aal, Wels, Karpfen und Forelle mit Teig.",
  "steps": ["Laufblei oder Grundblei auf die Hauptschnur fädeln", "Gummiperle als Knotenschutz aufziehen", "Wirbel anknoten", "Vorfach (40–150 cm) mit Haken in den Wirbel einhängen", "Schnur nach dem Wurf leicht straffen, Biss an der Rutenspitze ablesen"]},
 {"title": "Донная оснастка (скользящий груз)", "text": "Самая простая оснастка на угря, сома, карпа и форель на тесто.",
  "steps": ["Надеть скользящий груз на основную леску", "Надеть резиновую бусину для защиты узла", "Привязать вертлюжок", "Прицепить поводок (40–150 см) с крючком", "После заброса слегка натянуть леску, поклёвку видно по кончику"]})
add("montagen", {"title": "Posenmontage", "text": "Klassisch für Friedfische und Forellen: Die Pose zeigt den Biss und hält den Köder in der gewünschten Tiefe.",
  "steps": ["Stopper und Perle auf die Schnur", "Pose durchfädeln oder fest montieren", "Bleischrot so verteilen, dass nur die Antenne herausschaut", "Haken anbinden, Tiefe über den Stopper einstellen", "Zieht die Pose unter Wasser: anschlagen"]},
 {"title": "Поплавочная оснастка", "text": "Классика для мирной рыбы и форели: поплавок показывает поклёвку и держит наживку на нужной глубине.",
  "steps": ["Надеть стопор и бусину на леску", "Продеть или жёстко закрепить поплавок", "Распределить дробинки так, чтобы торчала только антенна", "Привязать крючок, глубину выставить стопором", "Поплавок ушёл под воду – подсекать"]})
add("montagen", {"title": "Futterkorbangeln (Feeder)", "text": "Grundangeln mit Futterkorb und feiner Zitterspitze – ideal für Brassen, Rotaugen und Barben am Rhein.",
  "facts": [["Rute", "Futterkorbrute 3,30–3,90 m, bis 120 g Wurfgewicht für den Rhein"], ["Korb", "Am Rhein schwere Körbe 60–120 g"], ["Biss", "Die bunte Zitterspitze zeigt den Biss"]]},
 {"title": "Фидер (ловля с кормушкой)", "text": "Донная ловля с кормушкой и чувствительной вершинкой – идеально для леща, плотвы и усача на Rhein.",
  "facts": [["Удилище", "фидер 3,30–3,90 м, тест до 120 г для Rhein"], ["Кормушка", "на Rhein тяжёлые 60–120 г"], ["Поклёвка", "видна по цветному кончику (квивертипу)"]]})
add("montagen", {"title": "Wurfpose (Sbirolino)", "text": "Spezielle Forellenteich-Technik: Die Wurfpose ermöglicht weite Würfe mit leichten Ködern, die langsam eingeholt werden.",
  "facts": [["Vorfach", "1,5–3 m"], ["Köder", "Teig, Bienenmade, Gummiwurm"]]},
 {"title": "Сбирулино", "text": "Особая техника для форелевых прудов: дальний заброс лёгких приманок с медленной проводкой.",
  "facts": [["Поводок", "1,5–3 м"], ["Насадка", "тесто, личинка моли, резиновый червь"]]})
add("montagen", {"title": "Stahlvorfach", "text": "Beim Angeln auf Hecht immer ein Stahl- oder Titanvorfach (mindestens 30–50 cm) verwenden. Sonst beißt der Hecht die Schnur durch und verendet mit dem Köder."},
 {"title": "Металлический поводок", "text": "При ловле щуки всегда использовать стальной или титановый поводок (минимум 30–50 см). Иначе щука перекусит леску и погибнет с приманкой."})

# ---- Ausrüstung ----
add("ausruestung", {"title": "Spinnrute", "text": "Die Allzweck-Rute für das Angeln mit Kunstködern.",
  "facts": [["Barsch", "2,10–2,40 m, Wurfgewicht 5–25 g"], ["Zander Rhein", "2,40–2,70 m, Wurfgewicht 15–50 g, straffe Spitze"], ["Hecht", "2,40–2,70 m, Wurfgewicht 30–80 g"]]},
 {"title": "Спиннинг", "text": "Универсальное удилище для ловли на искусственные приманки.",
  "facts": [["Окунь", "2,10–2,40 м, тест 5–25 г"], ["Судак Rhein", "2,40–2,70 м, тест 15–50 г, жёсткий кончик"], ["Щука", "2,40–2,70 м, тест 30–80 г"]]})
add("ausruestung", {"title": "Stationärrolle", "text": "Die Standardrolle für fast alle Methoden.",
  "facts": [["Größe", "2500 für Barsch und Forelle, 3000–4000 für Zander und Hecht"], ["Bremse", "So einstellen, dass bei starkem Zug Schnur abgegeben wird, bevor sie reißt"]]},
 {"title": "Безынерционная катушка", "text": "Стандартная катушка почти для всех способов ловли.",
  "facts": [["Размер", "2500 для окуня и форели, 3000–4000 для судака и щуки"], ["Фрикцион", "Настроить так, чтобы при сильном рывке леска стравливалась раньше, чем порвётся"]]})
add("ausruestung", {"title": "Geflochtene Schnur", "text": "Dehnt sich kaum – Bisse kommen direkt an. Ideal für Gummifisch am Grund.",
  "facts": [["Stärke", "0,08–0,10 mm Barsch, 0,12–0,15 mm Zander, 0,15–0,20 mm Hecht"], ["Tipp", "Mit 1–1,5 m Vorfach aus Fluorocarbon kombinieren"]]},
 {"title": "Плетёный шнур", "text": "Почти не тянется – поклёвка передаётся сразу. Идеален для джига.",
  "facts": [["Толщина", "0,08–0,10 мм окунь, 0,12–0,15 мм судак, 0,15–0,20 мм щука"], ["Совет", "Использовать с поводком из флюорокарбона 1–1,5 м"]]})
add("ausruestung", {"title": "Monofile Schnur", "text": "Dehnbar und gutmütig, federt Fluchten ab – gut für Forellenteich, Pose und Grund.",
  "facts": [["Stärke", "0,18–0,22 mm Forelle, 0,25–0,30 mm Karpfen"]]},
 {"title": "Монофильная леска", "text": "Растяжимая и прощающая ошибки, гасит рывки – хороша для пруда, поплавка и донки.",
  "facts": [["Толщина", "0,18–0,22 мм форель, 0,25–0,30 мм карп"]]})
add("ausruestung", {"title": "Fluorocarbon", "text": "Unter Wasser fast unsichtbar und abriebfest – als Vorfach für scheue Fische und an Steinpackungen."},
 {"title": "Флюорокарбон", "text": "Почти невидим под водой и устойчив к истиранию – для поводков на осторожную рыбу и у камней."})
add("ausruestung", {"title": "Unterfangkescher", "text": "Pflicht am Angelpark Caster. Fische damit sicher landen, statt sie an der Schnur herauszuheben."},
 {"title": "Подсачек", "text": "Обязателен в Angelpark Caster. Рыбу вынимать подсачеком, а не поднимать за леску."})
add("ausruestung", {"title": "Hakenlöser & Lösezange", "text": "Zum schonenden Lösen tief sitzender Haken. Für Hecht: lange Lösezange und Maulsperre."},
 {"title": "Экстрактор и зажим", "text": "Для бережного извлечения глубоко сидящего крючка. Для щуки: длинный зажим и зевник."})
add("ausruestung", {"title": "Betäuber (Fischtöter)", "text": "Pflicht für maßige, entnommene Fische: erst betäuben (kräftiger Schlag auf den Hinterkopf), dann sofort töten (Herzstich oder Kiemenschnitt)."},
 {"title": "Колотушка", "text": "Обязательна для изымаемой рыбы: сначала оглушить (сильный удар по затылку), затем сразу умертвить (укол в сердце или надрез жабр)."})
add("ausruestung", {"title": "Packliste Angeltag", "text": "Was immer in die Tasche gehört.",
  "facts": [["Papiere", "Fischereischein, Erlaubnisschein oder Tageskarte"], ["Werkzeug", "Hakenlöser, Zange, Messer, Maßband, Betäuber"], ["Landen", "Kescher"], ["Sonst", "Ersatzhaken, Vorfächer, Köder, Kühlbox, Müllbeutel, Regenkleidung, Handy-Akku"]]},
 {"title": "Что взять на рыбалку", "text": "Что всегда должно быть в сумке.",
  "facts": [["Документы", "рыболовный билет, разрешение или дневная карта"], ["Инструменты", "экстрактор, плоскогубцы, нож, рулетка, колотушка"], ["Вываживание", "подсачек"], ["Прочее", "запасные крючки, поводки, приманки, холодильник, пакет для мусора, дождевик, заряд телефона"]]})

# ---- Knoten ----
add("knoten", {"title": "Palomar-Knoten", "text": "Sehr starker, einfacher Knoten für Haken, Wirbel und Senkblei-Montage.",
  "steps": ["Schnur doppelt nehmen und die Schlaufe durchs Hakenöhr führen", "Mit der doppelten Schnur einen einfachen Knoten binden (locker lassen)", "Haken durch die Schlaufe stecken", "Knoten anfeuchten und gleichmäßig festziehen", "Überstehendes Ende abschneiden"]},
 {"title": "Узел паломар", "text": "Очень прочный и простой узел для крючков, вертлюжков и дропшота.",
  "steps": ["Сложить леску вдвое и продеть петлю в ушко крючка", "Сдвоенной леской завязать простой узел (не затягивать)", "Пропустить крючок через петлю", "Смочить узел и равномерно затянуть", "Обрезать кончик"]})
add("knoten", {"title": "Klammerknoten (verbessert)", "text": "Der Klassiker für monofile Schnur an Haken und Wirbel.",
  "steps": ["Schnur durchs Öhr ziehen, etwa 15 cm überstehen lassen", "Ende 5–7 Mal um die Hauptschnur wickeln", "Ende durch die kleine Schlaufe direkt am Öhr führen", "Dann durch die neu entstandene große Schlaufe stecken", "Anfeuchten, festziehen, kürzen"]},
 {"title": "Улучшенный клинч", "text": "Классический узел для монофила на крючок и вертлюжок.",
  "steps": ["Продеть леску в ушко, оставить около 15 см", "Обмотать конец 5–7 раз вокруг основной лески", "Пропустить конец в маленькую петлю у ушка", "Затем – в образовавшуюся большую петлю", "Смочить, затянуть, обрезать"]})
add("knoten", {"title": "Uni-Knoten", "text": "Vielseitiger Knoten, auch für geflochtene Schnur geeignet.",
  "steps": ["Schnur durchs Öhr führen und parallel zurücklegen", "Mit dem Ende eine Schlaufe bilden", "Ende 5–6 Mal durch die Schlaufe um beide Schnüre wickeln", "Anfeuchten und zum Öhr schieben", "Festziehen und kürzen"]},
 {"title": "Узел юни (гриннер)", "text": "Универсальный узел, подходит и для плетёнки.",
  "steps": ["Продеть леску в ушко и сложить параллельно", "Концом сделать петлю", "Обмотать конец 5–6 раз через петлю вокруг обеих лесок", "Смочить и сдвинуть к ушку", "Затянуть и обрезать"]})
add("knoten", {"title": "Schnurverbinder (doppelter Uni-Knoten)", "text": "Verbindet geflochtene Hauptschnur mit dem Vorfach aus Fluorocarbon.",
  "steps": ["Beide Schnurenden überlappend nebeneinanderlegen", "Mit der geflochtenen Schnur einen Uni-Knoten um das Fluorocarbon binden (8–10 Windungen)", "Mit dem Fluorocarbon einen Uni-Knoten um die geflochtene Schnur binden (4–5 Windungen)", "Anfeuchten, beide Knoten zusammenziehen", "Enden kürzen"]},
 {"title": "Соединение лесок (двойной юни)", "text": "Соединяет плетёный шнур с поводком из флюорокарбона.",
  "steps": ["Положить концы лесок внахлёст рядом", "Плетёнкой завязать узел юни вокруг флюорокарбона (8–10 витков)", "Флюорокарбоном завязать узел юни вокруг плетёнки (4–5 витков)", "Смочить, стянуть оба узла вместе", "Обрезать концы"]})

# ---- Recht ----
add("recht", {"title": "Fischereischein", "text": "In NRW braucht man zum Angeln einen staatlichen Fischereischein – dafür ist die Fischerprüfung nötig. Für Kinder und Jugendliche gibt es Sonderregeln (Jugendfischereischein).",
  "facts": [["Ausgabe", "Ordnungsamt bzw. Fischereibehörde der Stadt oder des Kreises"], ["Ausnahme", "An privaten Angelteichen gelten teils Sonderregeln – beim Angelpark Caster vorher fragen"]]},
 {"title": "Рыболовный билет (Fischereischein)", "text": "В NRW для рыбалки нужен государственный рыболовный билет – для него сдают экзамен (Fischerprüfung). Для детей и подростков есть особые правила.",
  "facts": [["Где получить", "в Ordnungsamt или рыболовном ведомстве города/района"], ["Исключение", "На частных прудах иногда особые правила – в Angelpark Caster уточнить заранее"]]})
add("recht", {"title": "Erlaubnisschein (Angelkarte)", "text": "Zusätzlich zum Fischereischein braucht man für jedes Gewässer die Erlaubnis des Fischereiberechtigten: Vereinskarte, Tages-, Wochen- oder Jahreskarte.",
  "facts": [["Rhein", "Rheinkarten für einzelne Abschnitte gibt es in Angelläden in Bonn und Köln"], ["Inhalt", "Auf der Karte stehen erlaubte Strecke, Rutenzahl und besondere Regeln"]]},
 {"title": "Разрешение (Erlaubnisschein)", "text": "Кроме билета, для каждого водоёма нужно разрешение арендатора: клубная, дневная, недельная или годовая карта.",
  "facts": [["Rhein", "Разрешения на отдельные участки продаются в рыболовных магазинах Bonn и Köln"], ["Что указано", "Разрешённый участок, число удочек и особые правила"]]})
add("recht", {"title": "Entnahme & Tierschutz", "text": "Fische, die mitgenommen werden, müssen sofort betäubt und getötet werden. Untermaßige oder geschonte Fische werden sofort schonend zurückgesetzt.",
  "facts": [["Verboten", "Lebende Köderfische, Reißen von Fischen, Setzkescher je nach Gewässerordnung"]]},
 {"title": "Изъятие и защита животных", "text": "Рыбу, которую забирают, нужно сразу оглушить и умертвить. Маломерную или запретную рыбу сразу бережно отпускают.",
  "facts": [["Запрещено", "Живец, багрение рыбы, садок – в зависимости от правил водоёма"]]})
add("recht", {"title": "Nachtangeln", "text": "Nachtangeln ist in NRW grundsätzlich erlaubt, kann aber durch Gewässerordnung oder Erlaubnisschein eingeschränkt sein."},
 {"title": "Ночная рыбалка", "text": "Ночная рыбалка в NRW в принципе разрешена, но может быть ограничена правилами водоёма или разрешением."})

# ---- Begriffe ----
TERMS = [
    ("Anschlag", "Ruckartiges Anheben der Rute nach dem Biss, damit der Haken greift.", "Подсечка", "Резкий подъём удилища после поклёвки, чтобы крючок засел."),
    ("Buhne", "Steinbuhne quer zum Ufer am Rhein. Am Buhnenkopf (Spitze) entstehen Strömungskanten – bester Platz für Zander.", "Буна", "Каменная дамба поперёк берега на Rhein. У оголовка буны возникают границы течения – лучшее место для судака."),
    ("Buhnenfeld", "Das ruhigere Wasser zwischen zwei Buhnen mit Rückströmung.", "Межбунье", "Более спокойная вода между двумя бунами с обратным течением."),
    ("Drill", "Das Ausdrillen eines gehakten Fisches bis zur Landung.", "Вываживание", "Борьба с засечённой рыбой до момента, когда её вынут из воды."),
    ("Rückströmung (Kehrwasser)", "Rückläufige Strömung hinter Hindernissen – hier warten Raubfische auf Beute.", "Обратное течение (улово)", "Течение за препятствиями в обратную сторону – здесь хищник поджидает добычу."),
    ("Mindestmaß", "Länge von der Kopfspitze bis zum Ende der Schwanzflosse, ab der ein Fisch entnommen werden darf.", "Минимальный размер", "Длина от кончика головы до конца хвоста, начиная с которой рыбу можно забрать."),
    ("Schonzeit", "Zeitraum, in dem eine Fischart (meist zur Laichzeit) nicht entnommen werden darf.", "Запретный период", "Время (обычно нерест), когда рыбу этого вида нельзя забирать."),
    ("Petri Heil", "Gruß unter Anglern – Antwort: „Petri Dank“.", "Petri Heil", "Немецкое приветствие рыбаков («ни хвоста, ни чешуи») – ответ: «Petri Dank»."),
    ("Wurfgewicht", "Angabe auf der Rute, für welches Ködergewicht sie gebaut ist.", "Тест удилища", "Указание на удилище, на какой вес приманки оно рассчитано."),
    ("Vorfach", "Das letzte Schnurstück zwischen Hauptschnur und Haken bzw. Köder.", "Поводок", "Последний отрезок лески между основной леской и крючком или приманкой."),
    ("Wirbel", "Drehbares Verbindungsstück, verhindert verdrallte Schnur.", "Вертлюжок", "Вращающееся соединение, не даёт леске закручиваться."),
    ("Mond-Beißzeiten (Solunar)", "Lehre, nach der Fische zu bestimmten Mondständen aktiver sind (Haupt- und Nebenbeißzeiten).", "Солунарная теория", "Теория, по которой рыба активнее при определённом положении луны (основные и второстепенные периоды)."),
    ("Pegel", "Wasserstand an einer Messstelle. Pegel Bonn um 300 cm ist mittleres Wasser.", "Уровень воды (Pegel)", "Уровень воды на гидропосту. Около 300 см в Bonn – средний уровень."),
    ("Kunstköder", "Künstliche Köder wie Gummifisch, Wobbler, Spinner – Gegenteil: Naturköder.", "Искусственная приманка", "Резина, воблеры, вертушки и т. п. – в отличие от натуральной наживки."),
    ("Zurücksetzen", "Fisch schonend wieder freilassen – in Deutschland vor allem bei untermaßigen oder geschonten Fischen.", "Отпуск рыбы", "Бережно отпустить рыбу – в Германии прежде всего маломерную или запретную."),
    ("Besatz", "Fische, die in ein Gewässer eingesetzt werden – am Forellenteich täglich.", "Зарыбление", "Рыба, которую выпускают в водоём – на форелевом пруду ежедневно."),
]
for de_t, de_x, ru_t, ru_x in TERMS:
    add("begriffe", {"title": de_t, "text": de_x}, {"title": ru_t, "text": ru_x})

NRW = [
    {"fish": {"de": "Zander", "ru": "Судак"}, "from": [4, 1], "to": [5, 31], "mm": 40},
    {"fish": {"de": "Hecht", "ru": "Щука"}, "from": [2, 15], "to": [4, 30], "mm": 45},
    {"fish": {"de": "Bachforelle", "ru": "Ручьевая форель"}, "from": [10, 20], "to": [3, 15], "mm": 25},
    {"fish": {"de": "Seeforelle", "ru": "Озёрная форель"}, "from": [10, 20], "to": [3, 15], "mm": 50},
    {"fish": {"de": "Seesaibling", "ru": "Арктический голец"}, "from": [10, 20], "to": [3, 15], "mm": 30},
    {"fish": {"de": "Äsche", "ru": "Хариус"}, "from": [3, 1], "to": [4, 30], "mm": 30},
    {"fish": {"de": "Nase", "ru": "Подуст"}, "from": [3, 1], "to": [4, 30], "mm": 30},
    {"fish": {"de": "Barbe", "ru": "Усач"}, "from": [5, 15], "to": [6, 15], "mm": 35},
    {"fish": {"de": "Aal", "ru": "Угорь"}, "from": [10, 1], "to": [3, 1], "mm": 50, "note": {"de": "Schonzeit nur im Rheinhauptstrom", "ru": "Запрет только в основном русле Rhein"}},
    {"fish": {"de": "Karpfen", "ru": "Карп"}, "mm": 35},
    {"fish": {"de": "Schleie", "ru": "Линь"}, "mm": 25},
    {"fish": {"de": "Aland", "ru": "Язь"}, "mm": 25},
    {"fish": {"de": "Flussbarsch", "ru": "Речной окунь"}, "note": {"de": "keine Vorgaben", "ru": "ограничений нет"}},
]
PROTECTED = {
    "de": ["Stör", "Lachs", "Meerforelle", "Quappe", "Maifisch", "Finte", "Nordseeschnäpel", "Schneider", "Steinbeißer", "Groppe", "Moderlieschen", "Schlammpeitzger", "Schmerle", "Elritze", "Zwergstichling", "Bitterling", "Neunaugen", "Edelkrebs", "Steinkrebs", "Großmuscheln"],
    "ru": ["осётр", "лосось", "кумжа", "налим", "алоза", "финта", "сиг-пыжьян", "быстрянка", "щиповка", "подкаменщик", "верховка", "вьюн", "голец усатый", "гольян", "малая колюшка", "горчак", "миноги", "широкопалый рак", "каменный рак", "крупные пресноводные моллюски"],
}

out = {"categories": CATS, "entries": E, "nrw": NRW, "protected": PROTECTED, "source": "Eigene Zusammenstellung; Recht: Landesfischereiverordnung NRW"}
p = Path(__file__).resolve().parent.parent / "data" / "lexikon.json"
p.write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
print(len(E), "Einträge")
