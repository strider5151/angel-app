/* Übersetzungen Deutsch / Russisch. Eigennamen (Rhein, Caster, Orte, Läden) bleiben unverändert. */
(function (g) {
  const D = {
    de: {
      appName: "Barsch-Buddy", kmh: "km/h",
      tab_heute: "Heute", tab_rhein: "Rhein", tab_caster: "Caster", tab_shops: "Läden", tab_lexikon: "Lexikon",
      nav: "Hauptnavigation", refresh: "Daten aktualisieren", openLog: "Fangbuch öffnen", options: "Optionen", close: "Schließen",
      sub_rhein: "Wasserstand, Zielfische & Angelstellen", sub_caster: "Feyermühle · 53894 Mechernich",
      title_shops: "Angelläden", sub_shops: "Umkreis 200 km um Bonn", title_lexikon: "Angel-Lexikon", sub_lexikon: "Fische, Köder, Montagen, Recht",
      title_fangbuch: "Fangbuch", sub_fangbuch: "Deine Fänge mit Bedingungen", title_rhein: "Rhein · Bonn",
      loading: "Lade …", errorShow: "Fehler beim Anzeigen:",
      // Heute
      index: "Angel-Index heute", rheinBonn: "Rhein (Bonn)", casterName: "Angelpark Caster",
      weatherBonn: "Wetter Bonn", air: "Luft", pressure: "Luftdruck", trend: "Tendenz", wind: "Wind", gusts: "Böen", rainToday: "Regen heute",
      sun: "Sonne", moon: "Mond", lit: "Beleuchtung", offlineWeather: "Keine Verbindung – zeige zuletzt geladene Wetterdaten",
      biteTimes: "Beste Beißzeiten", q_top: "Sehr gut", q_good: "Gut", q_ok: "Mäßig",
      dawn: "Morgendämmerung", dusk: "Abenddämmerung", moonUpper: "Mond am höchsten", moonLower: "Mond am tiefsten", moonrise: "Mondaufgang", moonset: "Monduntergang",
      biteNote: "Die Dämmerung ist für Zander und Barsch die stärkste Zeit. Die Mondzeiten folgen der Mond-Beißzeiten-Lehre (Solunar).",
      hintsToday: "Hinweise für heute", closedSeason: "Schonzeit NRW", flood: "Rhein-Hochwasser: Pegel Bonn {cm} cm – Ufer meiden!",
      riseFast: "Rhein steigt schnell (+{cm} cm in 24 Stunden)", week: "7-Tage-Planer", day: "Tag", wx: "Wetter", temp: "Temp.", rain: "Regen", windKmh: "Wind km/h",
      logCatch: "Fang eintragen",
      tr_strongFall: "stark fallend ↓", tr_fall: "fallend ↘", tr_strongRise: "stark steigend ↑", tr_rise: "steigend ↗", tr_stable: "gleichbleibend →",
      w_pressFallSlight: "leicht fallender Luftdruck", w_pressFallStrong: "Luftdruck fällt stark", w_pressRiseStrong: "Luftdruck steigt stark", w_pressStable: "gleichbleibender Luftdruck",
      w_flood: "Hochwasser", w_high: "hoher Pegel", w_riseFast: "Pegel steigt schnell", w_rise: "Pegel steigt", w_fall: "Pegel fällt",
      w_wind: "starker Wind", w_cloudy: "bewölkt", w_full: "Vollmond", w_new: "Neumond", w_trout: "Forellenwetter", w_hot: "sehr warm – Forellen träge", w_rainHeavy: "starker Regen", w_stock: "täglicher Besatz",
      // Caster Status
      c_noData: "Keine Daten", c_closed: "Geschlossen: {x}", c_wed: "Mittwoch Ruhetag", c_feb: "Im Februar nur Samstag und Sonntag geöffnet",
      c_openToday: "Heute geöffnet · Einlass {x}", c_entryUntil: "Einlass noch bis {x}", c_fishUntil: "Angelzeit bis {x} (Einlass vorbei)", c_over: "Heute beendet · morgen Einlass {x}",
      c_open: "Heute geöffnet", c_closedChip: "Geschlossen", winterTimes: "Winterzeiten", summerTimes: "Sommerzeiten",
      call: "Anrufen", route: "Route", website: "Webseite", findNumber: "Nummer suchen", searchWeb: "Im Internet suchen",
      newsTitle: "Aktuelle Hinweise", siteChanged: "Webseite geändert am {x}", sourceChecked: "Quelle: forellenzucht-caster.de · automatisch geprüft {x}",
      prices: "Preise & Besatz", hours: "Öffnungszeiten", winter: "Winter · 1. Okt – 28. Feb", summer: "Sommer · 1. Mär – 30. Sep",
      rulesTitle: "Teichordnung – Packliste", weatherPond: "Wetter am Teich", origTexts: "Original-Texte der Webseite", origNote: "Automatisch übernommen, täglich aktualisiert.",
      // Rhein
      pegelBonn: "Pegel Bonn", saved: "gespeichert", oclock: "Uhr", h24: "24 Stunden", mean: "Mittelwasser", water: "Wasser", na: "k. A.",
      upstream: "Oberlauf Andernach", upstreamNote: "Was in Andernach steigt, kommt etwa einen halben Tag später in Bonn an.",
      pegelLoading: "Wasserstand wird geladen …", targetFish: "Zielfische im {m}", inSeason: "Fangzeit", closedNow: "Derzeit Schonzeit – nicht gezielt befischen", closedChip: "Schonzeit",
      spots: "Angelstellen in der Nähe", spotsNote: "Nur an erlaubten, sicheren Uferstellen angeln. Buhnen bei Hochwasser nicht betreten.",
      need: "Was brauche ich?", needText: "Für den Rhein brauchst du den <b>Fischereischein</b> und zusätzlich einen <b>Erlaubnisschein (Rheinkarte)</b> für den jeweiligen Abschnitt. Die Karten gibt es in Angelläden in Bonn und Köln – siehe Reiter <a href=\"#shops\" data-go=\"shops\">Läden</a>.",
      dataRhein: "Wasserstand: PEGELONLINE (WSV) · Wetter: Open-Meteo", sevenAgo: "vor 7 Tagen", now: "jetzt", max: "höchster", min: "tiefster",
      lv1: "Niedrigwasser – Buhnen liegen trocken, Fische in der Fahrrinne und an den Buhnenköpfen", lv2: "Eher niedrig – Buhnenköpfe und Strömungskanten sind gut erreichbar",
      lv3: "Mittlerer Wasserstand – Buhnenfelder gut befischbar", lv4: "Erhöht – Fische ziehen ins ruhige Wasser, Hafeneinfahrten und Ufernähe",
      lv5: "Hochwasser – nur an sicheren Stellen, viel Treibgut", lv6: "Starkes Hochwasser – Angeln nicht empfohlen, Ufer meiden",
      // Läden
      searchShop: "Laden oder Ort suchen", f_all: "Alle (200 km)", f_open: "Jetzt offen", f_25: "bis 25 km", f_50: "bis 50 km", f_rhein: "Rheinkarten",
      myPos: "Mein Standort statt Bonn", myPosOn: "Entfernung ab meinem Standort", found: "{n} Läden gefunden · sortiert nach Entfernung ab {x}", fromMe: "deinem Standort",
      hoursBelow: "Zeiten siehe unten", hoursUnknown: "Zeiten unbekannt", hoursMissing: "Öffnungszeiten nicht hinterlegt – bitte vorher anrufen.",
      rheinCards: "Rheinkarten", outdoor: "Freizeit- & Angelbedarf", addrMap: "Adresse siehe Karte", noHits: "Keine Treffer für diese Auswahl.",
      shopsData: "Daten: © OpenStreetMap-Mitwirkende · Stand {x} · wöchentlich aktualisiert", posFail: "Standort nicht verfügbar.",
      oh_until: "Geöffnet bis {t}", oh_today: "Öffnet heute {t}", oh_day: "Öffnet {d} {t}", oh_closed: "Geschlossen", oh_closedDay: "geschlossen",
      // Lexikon
      searchLex: "z. B. Zander, Gummifisch, Palomar", entries: "{n} Einträge", results: "Suchergebnisse", nothing: "Nichts gefunden.", fishOfDay: "FISCH DES TAGES",
      lawTitle: "Schonzeiten & Mindestmaße NRW", fish: "Fisch", closedSeasonCol: "Schonzeit", minSize: "Mindestmaß", nowChip: "jetzt", protectedAll: "Ganzjährig geschützt:",
      lawSource: "Quelle: Landesfischereiverordnung NRW (Stand 2026). Vereins- und Gewässerordnungen können strenger sein.",
      // Fangbuch
      newCatch: "Neuer Fang", takePhoto: "Foto aufnehmen", pickPhoto: "Aus Galerie wählen", fishType: "Fischart", waterBody: "Gewässer", otherWater: "Anderes Gewässer",
      length: "Länge (cm)", weight: "Gewicht (g)", bait: "Köder / Montage", baitPh: "z. B. Gummifisch 12 cm", note: "Notiz", notePh: "Stelle, Besonderheiten",
      autoCond: "Wetter, Luftdruck, Wasserstand und Mondphase werden automatisch mitgespeichert.", saveCatch: "Fang speichern", stats: "Auswertung",
      catches: "Fänge", topFish: "Häufigster Fisch", topBait: "Bester Köder", topWater: "Bestes Gewässer", topHour: "Beste Uhrzeit", avgPress: "Ø Luftdruck",
      myCatches: "Meine Fänge", noCatches: "Noch keine Fänge eingetragen. Petri Heil!", exportLog: "Fangbuch sichern (Datei)", localOnly: "Das Fangbuch wird nur auf diesem Handy gespeichert.",
      delCatch: "Fang löschen", confirmDel: "Diesen Fang wirklich löschen?", storeFull: "Speicher voll – bitte alte Fänge sichern und löschen.", storeNoPhoto: "Speicher fast voll – Fang ohne Foto gespeichert.",
      photoSaved: "Foto zusätzlich im Ordner „Download“ gespeichert – in der Galerie unter „Download“ zu finden.", preview: "Vorschau",
      // Optionen
      optTitle: "Optionen", language: "Sprache", bigFont: "Große Schrift", savePhotos: "Kamera-Fotos zusätzlich auf dem Handy speichern",
      savePhotosNote: "Eine App aus dem Browser darf nicht direkt in den Kamera-Ordner schreiben. Das Foto wird deshalb in den Ordner „Download“ gespeichert und erscheint in der Galerie im Album „Download“.",
      install: "App installieren", installText: "In Chrome auf dem Handy: Menü ⋮ → <b>„App installieren“</b> bzw. <b>„Zum Startbildschirm hinzufügen“</b>. Danach startet die App wie eine normale App, auch ohne Internet mit den zuletzt geladenen Daten.",
      sources: "Datenquellen", sourcesText: "Wetter: Open-Meteo · Wasserstand: PEGELONLINE (WSV) · Angelpark: forellenzucht-caster.de (täglich) · Läden: © OpenStreetMap-Mitwirkende (wöchentlich) · Recht: Landesfischereiverordnung NRW.",
      disclaimer: "Alle Angaben ohne Gewähr – vor Ort gelten die Gewässerordnung und dein Erlaubnisschein.", refreshNow: "Jetzt aktualisieren",
      lang_de: "Deutsch", lang_ru: "Русский (Russisch)",
      // Mond
      ph_new: "Neumond", ph_waxc: "Zunehmende Sichel", ph_fq: "Erstes Viertel", ph_waxg: "Zunehmender Mond", ph_full: "Vollmond", ph_wang: "Abnehmender Mond", ph_lq: "Letztes Viertel", ph_wanc: "Abnehmende Sichel",
      fileName: "Fang"
    },
    ru: {
      appName: "Barsch-Buddy", kmh: "км/ч",
      tab_heute: "Сегодня", tab_rhein: "Rhein", tab_caster: "Caster", tab_shops: "Магазины", tab_lexikon: "Справочник",
      nav: "Главное меню", refresh: "Обновить данные", openLog: "Открыть журнал уловов", options: "Настройки", close: "Закрыть",
      sub_rhein: "Уровень воды, целевая рыба и места ловли", sub_caster: "Feyermühle · 53894 Mechernich",
      title_shops: "Рыболовные магазины", sub_shops: "В радиусе 200 км от Bonn", title_lexikon: "Справочник рыболова", sub_lexikon: "Рыба, приманки, оснастки, правила",
      title_fangbuch: "Журнал уловов", sub_fangbuch: "Твои уловы и условия ловли", title_rhein: "Rhein · Bonn",
      loading: "Загрузка …", errorShow: "Ошибка отображения:",
      index: "Индекс клёва на сегодня", rheinBonn: "Rhein (Bonn)", casterName: "Angelpark Caster",
      weatherBonn: "Погода в Bonn", air: "Воздух", pressure: "Давление", trend: "Тенденция", wind: "Ветер", gusts: "Порывы", rainToday: "Дождь сегодня",
      sun: "Солнце", moon: "Луна", lit: "Освещённость", offlineWeather: "Нет связи – показаны последние загруженные данные",
      biteTimes: "Лучшее время клёва", q_top: "Отлично", q_good: "Хорошо", q_ok: "Средне",
      dawn: "Утренние сумерки", dusk: "Вечерние сумерки", moonUpper: "Луна в зените", moonLower: "Луна в надире", moonrise: "Восход луны", moonset: "Заход луны",
      biteNote: "Сумерки – лучшее время для судака и окуня. Лунное время рассчитано по солунарной теории.",
      hintsToday: "На что обратить внимание сегодня", closedSeason: "Запрет на вылов (NRW)", flood: "Паводок на Rhein: уровень в Bonn {cm} см – держись подальше от берега!",
      riseFast: "Rhein быстро поднимается (+{cm} см за 24 часа)", week: "Прогноз на 7 дней", day: "День", wx: "Погода", temp: "Темп.", rain: "Дождь", windKmh: "Ветер км/ч",
      logCatch: "Записать улов",
      tr_strongFall: "сильно падает ↓", tr_fall: "падает ↘", tr_strongRise: "сильно растёт ↑", tr_rise: "растёт ↗", tr_stable: "стабильно →",
      w_pressFallSlight: "давление слегка падает", w_pressFallStrong: "давление сильно падает", w_pressRiseStrong: "давление сильно растёт", w_pressStable: "стабильное давление",
      w_flood: "паводок", w_high: "высокий уровень воды", w_riseFast: "вода быстро прибывает", w_rise: "вода прибывает", w_fall: "вода спадает",
      w_wind: "сильный ветер", w_cloudy: "облачно", w_full: "полнолуние", w_new: "новолуние", w_trout: "погода для форели", w_hot: "очень тепло – форель вялая", w_rainHeavy: "сильный дождь", w_stock: "ежедневное зарыбление",
      c_noData: "Нет данных", c_closed: "Закрыто: {x}", c_wed: "Среда – выходной", c_feb: "В феврале открыто только в субботу и воскресенье",
      c_openToday: "Сегодня открыто · вход {x}", c_entryUntil: "Вход ещё до {x}", c_fishUntil: "Ловля до {x} (вход закрыт)", c_over: "На сегодня закрыто · завтра вход {x}",
      c_open: "Сегодня открыто", c_closedChip: "Закрыто", winterTimes: "Зимний режим", summerTimes: "Летний режим",
      call: "Позвонить", route: "Маршрут", website: "Сайт", findNumber: "Найти номер", searchWeb: "Искать в интернете",
      newsTitle: "Актуальные сообщения", siteChanged: "Сайт изменён {x}", sourceChecked: "Источник: forellenzucht-caster.de · проверено {x}",
      prices: "Цены и зарыбление", hours: "Часы работы", winter: "Зима · 1 окт – 28 фев", summer: "Лето · 1 мар – 30 сен",
      rulesTitle: "Правила пруда – что взять с собой", weatherPond: "Погода у пруда", origTexts: "Оригинальные тексты сайта (на немецком)", origNote: "Взяты автоматически, обновляются ежедневно.",
      pegelBonn: "Уровень воды Bonn", saved: "сохранено", oclock: "", h24: "24 часа", mean: "Средний уровень", water: "Вода", na: "н/д",
      upstream: "Выше по течению: Andernach", upstreamNote: "Подъём воды в Andernach доходит до Bonn примерно через полдня.",
      pegelLoading: "Загрузка уровня воды …", targetFish: "Целевая рыба: {m}", inSeason: "Сезон", closedNow: "Сейчас запрет – целенаправленно не ловить", closedChip: "Запрет",
      spots: "Места ловли поблизости", spotsNote: "Ловить только в разрешённых и безопасных местах. В паводок не заходить на буны.",
      need: "Что нужно?", needText: "Для ловли на Rhein нужен <b>рыболовный билет (Fischereischein)</b> и дополнительно <b>разрешение (Rheinkarte)</b> на нужный участок. Разрешения продаются в рыболовных магазинах в Bonn и Köln – см. вкладку <a href=\"#shops\" data-go=\"shops\">Магазины</a>.",
      dataRhein: "Уровень воды: PEGELONLINE (WSV) · Погода: Open-Meteo", sevenAgo: "7 дней назад", now: "сейчас", max: "макс.", min: "мин.",
      lv1: "Низкая вода – буны на суше, рыба в фарватере и у оголовков бун", lv2: "Уровень ниже среднего – оголовки бун и границы течения легко доступны",
      lv3: "Средний уровень – хорошо ловить между бунами", lv4: "Повышенный уровень – рыба уходит в тихую воду, ко входам в гавани и к берегу",
      lv5: "Паводок – только в безопасных местах, много мусора в воде", lv6: "Сильный паводок – ловить не рекомендуется, держись подальше от берега",
      searchShop: "Поиск магазина или города", f_all: "Все (200 км)", f_open: "Открыто сейчас", f_25: "до 25 км", f_50: "до 50 км", f_rhein: "Разрешения на Rhein",
      myPos: "От моего местоположения", myPosOn: "Расстояние от моего местоположения", found: "Найдено магазинов: {n} · по расстоянию от {x}", fromMe: "тебя",
      hoursBelow: "Часы см. ниже", hoursUnknown: "Часы неизвестны", hoursMissing: "Часы работы не указаны – лучше заранее позвонить.",
      rheinCards: "Разрешения на Rhein", outdoor: "Товары для отдыха и рыбалки", addrMap: "Адрес см. на карте", noHits: "Ничего не найдено по этому фильтру.",
      shopsData: "Данные: © участники OpenStreetMap · от {x} · обновляется еженедельно", posFail: "Местоположение недоступно.",
      oh_until: "Открыто до {t}", oh_today: "Откроется сегодня в {t}", oh_day: "Откроется {d} в {t}", oh_closed: "Закрыто", oh_closedDay: "закрыто",
      searchLex: "напр. судак, виброхвост, паломар", entries: "Записей: {n}", results: "Результаты поиска", nothing: "Ничего не найдено.", fishOfDay: "РЫБА ДНЯ",
      lawTitle: "Запреты и минимальные размеры (NRW)", fish: "Рыба", closedSeasonCol: "Запрет", minSize: "Мин. размер", nowChip: "сейчас", protectedAll: "Охраняются круглый год:",
      lawSource: "Источник: Положение о рыболовстве земли NRW (2026). Правила клубов и водоёмов могут быть строже.",
      newCatch: "Новый улов", takePhoto: "Сфотографировать", pickPhoto: "Выбрать из галереи", fishType: "Вид рыбы", waterBody: "Водоём", otherWater: "Другой водоём",
      length: "Длина (см)", weight: "Вес (г)", bait: "Приманка / оснастка", baitPh: "напр. виброхвост 12 см", note: "Заметка", notePh: "Место, особенности",
      autoCond: "Погода, давление, уровень воды и фаза луны сохраняются автоматически.", saveCatch: "Сохранить улов", stats: "Статистика",
      catches: "Уловы", topFish: "Чаще всего", topBait: "Лучшая приманка", topWater: "Лучший водоём", topHour: "Лучшее время", avgPress: "Ср. давление",
      myCatches: "Мои уловы", noCatches: "Уловов пока нет. Ни хвоста, ни чешуи!", exportLog: "Сохранить журнал (файл)", localOnly: "Журнал хранится только на этом телефоне.",
      delCatch: "Удалить улов", confirmDel: "Точно удалить этот улов?", storeFull: "Память заполнена – сохрани и удали старые уловы.", storeNoPhoto: "Память почти заполнена – улов сохранён без фото.",
      photoSaved: "Фото также сохранено в папку «Download» – в галерее в альбоме «Download».", preview: "Предпросмотр",
      optTitle: "Настройки", language: "Язык", bigFont: "Крупный шрифт", savePhotos: "Дополнительно сохранять фото с камеры на телефоне",
      savePhotosNote: "Приложению из браузера нельзя писать прямо в папку камеры. Поэтому фото сохраняется в папку «Download» и появляется в галерее в альбоме «Download».",
      install: "Установить приложение", installText: "В Chrome на телефоне: меню ⋮ → <b>«Установить приложение»</b> или <b>«Добавить на главный экран»</b>. После этого приложение запускается как обычное, даже без интернета – с последними загруженными данными.",
      sources: "Источники данных", sourcesText: "Погода: Open-Meteo · Уровень воды: PEGELONLINE (WSV) · Пруд: forellenzucht-caster.de (ежедневно) · Магазины: © участники OpenStreetMap (еженедельно) · Правила: Положение о рыболовстве NRW.",
      disclaimer: "Все данные без гарантии – на месте действуют правила водоёма и твоё разрешение.", refreshNow: "Обновить сейчас",
      lang_de: "Deutsch (Немецкий)", lang_ru: "Русский",
      ph_new: "Новолуние", ph_waxc: "Растущий серп", ph_fq: "Первая четверть", ph_waxg: "Растущая луна", ph_full: "Полнолуние", ph_wang: "Убывающая луна", ph_lq: "Последняя четверть", ph_wanc: "Убывающий серп",
      fileName: "Ulov"
    }
  };
  const WMO = {
    de: {0:"Klar",1:"Überwiegend klar",2:"Teils bewölkt",3:"Bedeckt",45:"Nebel",48:"Reifnebel",51:"Leichter Niesel",53:"Niesel",55:"Starker Niesel",56:"Gefrierender Niesel",57:"Gefrierender Niesel",61:"Leichter Regen",63:"Regen",65:"Starker Regen",66:"Gefrierender Regen",67:"Gefrierender Regen",71:"Leichter Schnee",73:"Schnee",75:"Starker Schnee",77:"Schneegriesel",80:"Regenschauer",81:"Regenschauer",82:"Heftige Schauer",85:"Schneeschauer",86:"Schneeschauer",95:"Gewitter",96:"Gewitter mit Hagel",99:"Gewitter mit Hagel"},
    ru: {0:"Ясно",1:"Преимущественно ясно",2:"Переменная облачность",3:"Пасмурно",45:"Туман",48:"Туман с изморозью",51:"Слабая морось",53:"Морось",55:"Сильная морось",56:"Ледяная морось",57:"Ледяная морось",61:"Небольшой дождь",63:"Дождь",65:"Сильный дождь",66:"Ледяной дождь",67:"Ледяной дождь",71:"Небольшой снег",73:"Снег",75:"Сильный снег",77:"Снежная крупа",80:"Ливень",81:"Ливень",82:"Сильный ливень",85:"Снегопад",86:"Снегопад",95:"Гроза",96:"Гроза с градом",99:"Гроза с градом"}
  };
  // Einfache Wortersetzung für Texte aus Daten (Preise, Besatz) ins Russische
  const RU_WORDS = [
    ["Großer Teich", "Большой пруд"], ["VIP-Teich", "VIP-пруд"], ["VIP Teich", "VIP-пруд"], ["Teiche", "Пруды"], ["Teich", "Пруд"],
    ["Täglicher Mischbesatz", "Ежедневное смешанное зарыбление"], ["täglich Mischbesatz", "ежедневное смешанное зарыбление"], ["Mischbesatz", "смешанное зарыбление"],
    ["Regenbogenforellen", "радужная форель"], ["Regenbogenforelle", "радужная форель"], ["Regenbogen-", "радужная, "], ["Lachsforellen", "лососевая форель"], ["Lachsforelle", "лососевая форель"], ["Lachs-", "лососевая, "],
    ["Goldforellen", "золотая форель"], ["Goldforelle", "золотая форель"], ["Bachforelle", "ручьевая форель"], ["Saiblinge", "гольцы"], ["Saibling", "голец"], ["Rotfedern", "краснопёрка"], ["Rotfeder", "краснопёрка"],
    ["Zander", "судак"], ["Aale", "угорь"], ["Aal", "угорь"], ["Karpfen", "карп"], ["Störe", "осётр"], ["Stör", "осётр"], ["gesperrt", "закрыт"], ["und", "и"]
  ];
  let lang = "de";
  try { lang = localStorage.getItem("bb_lang") ? JSON.parse(localStorage.getItem("bb_lang")) : "de"; } catch {}
  if (!D[lang]) lang = "de";
  function t(k, v) {
    let s = (D[lang] && D[lang][k]) != null ? D[lang][k] : (D.de[k] != null ? D.de[k] : k);
    if (v) for (const [a, b] of Object.entries(v)) s = s.split("{" + a + "}").join(b);
    return s;
  }
  function ruText(s) {
    if (lang !== "ru" || !s) return s;
    let o = s;
    for (const [a, b] of RU_WORDS) o = o.split(a).join(b);
    return o;
  }
  g.I18N = {
    t, ruText,
    get lang() { return lang; },
    set(l) { lang = D[l] ? l : "de"; try { localStorage.setItem("bb_lang", JSON.stringify(lang)); } catch {} document.documentElement.lang = lang; },
    locale() { return lang === "ru" ? "ru-RU" : "de-DE"; },
    wmo(c) { return (WMO[lang] || WMO.de)[c] || ""; },
    pick(o) { return o && typeof o === "object" ? (o[lang] != null ? o[lang] : o.de) : o; }
  };
  document.documentElement.lang = lang;
})(window);
