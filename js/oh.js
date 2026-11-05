/* Einfacher Parser für OpenStreetMap-opening_hours (häufige Formate wie "Mo-Fr 09:00-18:00; Sa 09:00-13:00").
   Gibt null zurück, wenn das Format nicht verstanden wird – dann zeigt die App den Rohtext. */
(function (g) {
  const DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
  const DE = { Mo: "Mo", Tu: "Di", We: "Mi", Th: "Do", Fr: "Fr", Sa: "Sa", Su: "So" };
  function parseDays(s) {
    const set = new Set();
    for (const part of s.split(",")) {
      const m = part.trim().match(/^(Mo|Tu|We|Th|Fr|Sa|Su)(?:-(Mo|Tu|We|Th|Fr|Sa|Su))?$/);
      if (!m) return null;
      let a = DAYS.indexOf(m[1]), b = m[2] ? DAYS.indexOf(m[2]) : a;
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
      if (/^PH\b/.test(rule)) continue; // Feiertage ignorieren
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
  function status(str, now) {
    now = now || new Date();
    const w = parse(str);
    if (!w) return null;
    const d = (now.getDay() + 6) % 7, min = now.getHours() * 60 + now.getMinutes();
    for (const [a, b] of (w[d] || [])) if (min >= a && min < b) return { open: true, text: "Geöffnet bis " + fmt(b) };
    for (const [a] of (w[d] || [])) if (min < a) return { open: false, text: "Öffnet heute " + fmt(a) };
    for (let i = 1; i < 7; i++) {
      const dd = (d + i) % 7;
      if ((w[dd] || []).length) return { open: false, text: "Öffnet " + DE[DAYS[dd]] + " " + fmt(w[dd][0][0]) };
    }
    return { open: false, text: "Geschlossen" };
  }
  function pretty(str) {
    const w = parse(str);
    if (!w) return str || "";
    const lines = [];
    for (let i = 0; i < 7; i++) {
      const t = w[i];
      lines.push(DE[DAYS[i]] + " " + (t && t.length ? t.map(([a, b]) => fmt(a) + "–" + fmt(b)).join(", ") : "geschlossen"));
    }
    return lines.join(" · ");
  }
  g.OH = { parse, status, pretty };
})(window);
