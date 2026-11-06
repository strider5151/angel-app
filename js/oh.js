/* Einfacher Parser für OpenStreetMap-opening_hours (häufige Formate wie "Mo-Fr 09:00-18:00; Sa 09:00-13:00").
   Gibt null zurück, wenn das Format nicht verstanden wird – dann zeigt die App den Rohtext. */
(function (g) {
  const DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
  const NAMES = { de: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"], ru: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"] };
  function parseDays(s) {
    const set = new Set();
    for (const part of s.split(",")) {
      const m = part.trim().match(/^(Mo|Tu|We|Th|Fr|Sa|Su)(?:-(Mo|Tu|We|Th|Fr|Sa|Su))?$/);
      if (!m) return null;
      const a = DAYS.indexOf(m[1]), b = m[2] ? DAYS.indexOf(m[2]) : a;
      for (let i = a; ; i = (i + 1) % 7) { set.add(i); if (i === b) break; }
    }
    return set;
  }
  function parseTimes(s) {
    if (/^off$|^closed$/i.test(s.trim())) return [];
    const out = [];
    for (const part of s.split(",")) {
      const m = part.trim().match(/^(\d{1,2}):(\d{2})-(\d{1,2}):(\d{2})\+?$/);
      if (!m) return null;
      out.push([+m[1] * 60 + +m[2], +m[3] * 60 + +m[4]]);
    }
    return out;
  }
  function parse(str) {
    if (!str) return null;
    str = str.trim();
    if (str === "24/7") { const w = {}; for (let i = 0; i < 7; i++) w[i] = [[0, 1440]]; return w; }
    const week = {};
    for (let rule of str.split(";")) {
      rule = rule.trim();
      if (!rule) continue;
      if (/^PH\b/.test(rule)) continue;
      const m = rule.match(/^((?:Mo|Tu|We|Th|Fr|Sa|Su)(?:[-,](?:Mo|Tu|We|Th|Fr|Sa|Su))*)(?:,PH)?\s+(.+)$/);
      let days, times;
      if (m) { days = parseDays(m[1]); times = parseTimes(m[2]); }
      else { days = new Set([0, 1, 2, 3, 4, 5, 6]); times = parseTimes(rule); }
      if (!days || !times) return null;
      for (const d of days) week[d] = times;
    }
    return Object.keys(week).length ? week : null;
  }
  const fmt = m => String(Math.floor(m / 60)).padStart(2, "0") + ":" + String(m % 60).padStart(2, "0");
  // Ergebnis: {open, key, t, d} – Text baut die App über I18N
  function status(str, now, lang) {
    now = now || new Date();
    const w = parse(str), N = NAMES[lang] || NAMES.de;
    if (!w) return null;
    const d = (now.getDay() + 6) % 7, min = now.getHours() * 60 + now.getMinutes();
    for (const [a, b] of (w[d] || [])) if (min >= a && min < b) return { open: true, key: "oh_until", t: fmt(b) };
    for (const [a] of (w[d] || [])) if (min < a) return { open: false, key: "oh_today", t: fmt(a) };
    for (let i = 1; i < 7; i++) {
      const dd = (d + i) % 7;
      if ((w[dd] || []).length) return { open: false, key: "oh_day", d: N[dd], t: fmt(w[dd][0][0]) };
    }
    return { open: false, key: "oh_closed" };
  }
  function pretty(str, lang, closedWord) {
    const w = parse(str), N = NAMES[lang] || NAMES.de;
    if (!w) return str || "";
    const lines = [];
    for (let i = 0; i < 7; i++) {
      const t = w[i];
      lines.push(N[i] + " " + (t && t.length ? t.map(([a, b]) => fmt(a) + "–" + fmt(b)).join(", ") : (closedWord || "geschlossen")));
    }
    return lines.join(" · ");
  }
  g.OH = { parse, status, pretty };
})(window);
