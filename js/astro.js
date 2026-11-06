/* Sonne/Mond-Berechnung (nach den Formeln von SunCalc, V. Agafonkin, BSD-Lizenz, vereinfacht)
   Liefert Sonnenauf-/untergang, Mondphase, Mondauf-/untergang und Mond-Transit für Beißzeiten. */
(function (g) {
  const rad = Math.PI / 180, dayMs = 864e5, J1970 = 2440588, J2000 = 2451545, e = rad * 23.4397;
  const toDays = d => d.valueOf() / dayMs - 0.5 + J1970 - J2000;
  const rightAsc = (l, b) => Math.atan2(Math.sin(l) * Math.cos(e) - Math.tan(b) * Math.sin(e), Math.cos(l));
  const decl = (l, b) => Math.asin(Math.sin(b) * Math.cos(e) + Math.cos(b) * Math.sin(e) * Math.sin(l));
  const sidereal = (d, lw) => rad * (280.16 + 360.9856235 * d) - lw;
  const altitude = (H, phi, dec) => Math.asin(Math.sin(phi) * Math.sin(dec) + Math.cos(phi) * Math.cos(dec) * Math.cos(H));
  const solarMeanAnomaly = d => rad * (357.5291 + 0.98560028 * d);
  function eclipticLongitude(M) {
    const C = rad * (1.9148 * Math.sin(M) + 0.02 * Math.sin(2 * M) + 0.0003 * Math.sin(3 * M));
    return M + C + rad * 102.9372 + Math.PI;
  }
  function sunCoords(d) { const L = eclipticLongitude(solarMeanAnomaly(d)); return { dec: decl(L, 0), ra: rightAsc(L, 0) }; }
  function moonCoords(d) {
    const L = rad * (218.316 + 13.176396 * d), M = rad * (134.963 + 13.064993 * d), F = rad * (93.272 + 13.22935 * d);
    const l = L + rad * 6.289 * Math.sin(M), b = rad * 5.128 * Math.sin(F), dt = 385001 - 20905 * Math.cos(M);
    return { ra: rightAsc(l, b), dec: decl(l, b), dist: dt };
  }
  function sunAlt(date, lat, lng) {
    const lw = rad * -lng, phi = rad * lat, d = toDays(date), c = sunCoords(d);
    return altitude(sidereal(d, lw) - c.ra, phi, c.dec) / rad;
  }
  function moonAlt(date, lat, lng) {
    const lw = rad * -lng, phi = rad * lat, d = toDays(date), c = moonCoords(d);
    const H = sidereal(d, lw) - c.ra;
    let h = altitude(H, phi, c.dec);
    h = h + rad * 0.017 / Math.tan(h + rad * 10.26 / (h + rad * 5.10)); // Refraktion
    return h / rad;
  }
  function moonIllumination(date) {
    const d = toDays(date || new Date()), s = sunCoords(d), m = moonCoords(d), sdist = 149598000;
    const phi = Math.acos(Math.sin(s.dec) * Math.sin(m.dec) + Math.cos(s.dec) * Math.cos(m.dec) * Math.cos(s.ra - m.ra));
    const inc = Math.atan2(sdist * Math.sin(phi), m.dist - sdist * Math.cos(phi));
    const angle = Math.atan2(Math.cos(s.dec) * Math.sin(s.ra - m.ra), Math.sin(s.dec) * Math.cos(m.dec) - Math.cos(s.dec) * Math.sin(m.dec) * Math.cos(s.ra - m.ra));
    return { fraction: (1 + Math.cos(inc)) / 2, phase: 0.5 + 0.5 * inc * (angle < 0 ? -1 : 1) / Math.PI };
  }
  // Scan des Tages in 5-Minuten-Schritten: Nulldurchgänge = Auf-/Untergang, Maximum/Minimum = Transit
  function scanDay(fn, day, lat, lng, horizon) {
    const start = new Date(day); start.setHours(0, 0, 0, 0);
    const step = 5 * 60000, res = { rise: null, set: null, upper: null, lower: null };
    let prev = fn(start, lat, lng) - horizon, maxV = -99, minV = 99;
    for (let t = step; t <= dayMs; t += step) {
      const dt = new Date(start.valueOf() + t), v = fn(dt, lat, lng) - horizon;
      if (prev < 0 && v >= 0 && !res.rise) res.rise = dt;
      if (prev >= 0 && v < 0 && !res.set) res.set = dt;
      if (v > maxV) { maxV = v; res.upper = dt; }
      if (v < minV) { minV = v; res.lower = dt; }
      prev = v;
    }
    const edge = t => t && (t - start < 15 * 60000 || start.valueOf() + dayMs - t < 15 * 60000);
    if (edge(res.upper)) res.upper = null;
    if (edge(res.lower)) res.lower = null;
    return res;
  }
  function sunTimes(day, lat, lng) {
    const r = scanDay(sunAlt, day, lat, lng, -0.833);
    const dawn = scanDay(sunAlt, day, lat, lng, -6), golden = scanDay(sunAlt, day, lat, lng, 6);
    return { sunrise: r.rise, sunset: r.set, dawn: dawn.rise, dusk: dawn.set, goldenMorning: golden.rise, goldenEvening: golden.set, noon: r.upper };
  }
  function moonTimes(day, lat, lng) { return scanDay(moonAlt, day, lat, lng, 0.133); }
  function phaseName(p) { // liefert Schlüssel, Übersetzung in i18n.js (ph_…)
    if (p < 0.03 || p > 0.97) return "new";
    if (p < 0.22) return "waxc";
    if (p < 0.28) return "fq";
    if (p < 0.47) return "waxg";
    if (p < 0.53) return "full";
    if (p < 0.72) return "wang";
    if (p < 0.78) return "lq";
    return "wanc";
  }
  // Solunar-Beißzeiten: Haupt = Mond oben/unten (±1 h), Neben = Mondauf/-untergang (±30 min)
  function solunar(day, lat, lng) {
    const m = moonTimes(day, lat, lng), out = [];
    const add = (t, half, kind, label) => { if (t) out.push({ start: new Date(t - half), end: new Date(+t + half), kind, label }); };
    add(m.upper, 36e5, "major", "moonUpper");
    add(m.lower, 36e5, "major", "moonLower");
    add(m.rise, 18e5, "minor", "moonrise");
    add(m.set, 18e5, "minor", "moonset");
    return out.sort((a, b) => a.start - b.start);
  }
  g.Astro = { sunTimes, moonTimes, moonIllumination, phaseName, solunar };
})(window);
