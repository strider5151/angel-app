/* Barsch-Buddy – Angel-Empfehlungen für Bonn + 200 km */
"use strict";

const LOC = {
  bonn: { name: "Bonn", lat: 50.7374, lon: 7.0982 },
  caster: { name: "Angelpark Caster", lat: 50.5896, lon: 6.6745 }
};
const PEGEL = "https://www.pegelonline.wsv.de/webservices/rest-api/v2/stations/";
const SCHONZEITEN = [ // Landesfischereiverordnung NRW § 2
  { fish: "Bach-, Seeforelle & Seesaibling", from: [10, 20], to: [3, 15] },
  { fish: "Aal (nur Rheinhauptstrom)", from: [10, 1], to: [3, 1] },
  { fish: "Äsche & Nase", from: [3, 1], to: [4, 30] },
  { fish: "Zander", from: [4, 1], to: [5, 31] },
  { fish: "Barbe", from: [5, 15], to: [6, 15] },
  { fish: "Hecht", from: [2, 15], to: [4, 30] }
];
const WMO = {0:"Klar",1:"Überwiegend klar",2:"Teils bewölkt",3:"Bedeckt",45:"Nebel",48:"Reifnebel",51:"Leichter Niesel",53:"Niesel",55:"Starker Niesel",56:"Gefrierender Niesel",57:"Gefrierender Niesel",61:"Leichter Regen",63:"Regen",65:"Starker Regen",66:"Gefrierender Regen",67:"Gefrierender Regen",71:"Leichter Schnee",73:"Schnee",75:"Starker Schnee",77:"Schneegriesel",80:"Regenschauer",81:"Regenschauer",82:"Heftige Schauer",85:"Schneeschauer",86:"Schneeschauer",95:"Gewitter",96:"Gewitter mit Hagel",99:"Gewitter mit Hagel"};

const S = { weather: {}, pegel: null, caster: null, shops: null, lex: null, view: "heute", shopFilter: "alle", shopQuery: "", lexCat: null, lexQuery: "", myPos: null };

/* ---------- Hilfen ---------- */
const $ = s => document.querySelector(s);
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const t2 = d => d ? d.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }) : "–";
const dateDE = d => d.toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
const num = (v, d = 0) => v == null || isNaN(v) ? "–" : Number(v).toLocaleString("de-DE", { maximumFractionDigits: d, minimumFractionDigits: d });
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const ICO = {
  alert: '<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18v.01"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7v.01"/>',
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>',
  map: '<path d="M12 21s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/>',
  web: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
  camera: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
  fish: '<path d="M3 12c3-5 9-6 13-3l5-3v12l-5-3c-4 3-10 2-13-3z"/><circle cx="8" cy="11" r="1"/>',
  bait: '<path d="M12 2v8"/><path d="M12 10a4 4 0 1 0 4 4"/>',
  knot: '<path d="M4 12c4-8 12 8 16 0"/><path d="M4 12c4 8 12-8 16 0"/>',
  rod: '<path d="M3 21L20 4"/><circle cx="7" cy="17" r="2"/><path d="M20 4v8"/>',
  wave: '<path d="M2 9c2.5-2 4.5-2 7 0s4.5 2 7 0 3.5-1.5 6 0"/><path d="M2 15c2.5-2 4.5-2 7 0s4.5 2 7 0 3.5-1.5 6 0"/>',
  law: '<path d="M12 3v18M5 7h14M7 7l-3 7a3 3 0 0 0 6 0zM17 7l-3 7a3 3 0 0 0 6 0z"/>',
  book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5"/>',
  pin: '<circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>',
  trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2"/>'
};
const ico = (n, cls = "ico") => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICO[n] || ""}</svg>`;
const chip = (t, k = "") => `<span class="chip ${k}">${t}</span>`;
const notice = (t, k = "") => `<div class="notice ${k}">${ico(k === "info" ? "info" : "alert")}<span>${t}</span></div>`;
const row = (l, r) => `<div class="row"><span class="l">${l}</span><span class="r">${r}</span></div>`;
const stat = (l, v) => `<div class="stat"><span>${l}</span><span>${v}</span></div>`;
const card = (inner, cls = "") => `<section class="card ${cls}">${inner}</section>`;

async function getJSON(url, ms = 12000) {
  const ctl = new AbortController();
  const tm = setTimeout(() => ctl.abort(), ms);
  try {
    const r = await fetch(url, { signal: ctl.signal, cache: "no-store" });
    if (!r.ok) throw new Error(r.status);
    return await r.json();
  } finally { clearTimeout(tm); }
}
const store = {
  get(k, d) { try { const v = localStorage.getItem("bb_" + k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem("bb_" + k, JSON.stringify(v)); return true; } catch { return false; } }
};
function inPeriod(d, from, to) {
  const v = (d.getMonth() + 1) * 100 + d.getDate(), a = from[0] * 100 + from[1], b = to[0] * 100 + to[1];
  return a <= b ? v >= a && v <= b : v >= a || v <= b;
}
function distKm(a, b) {
  const R = 6371, r = Math.PI / 180, dLat = (b.lat - a.lat) * r, dLon = (b.lon - a.lon) * r;
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}
const mapsUrl = (lat, lon, label) => `https://www.google.com/maps/search/?api=1&query=${lat},${lon}${label ? "&query_place_id=" : ""}`;

/* ---------- Daten laden ---------- */
async function loadWeather(key) {
  const l = LOC[key];
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${l.lat}&longitude=${l.lon}` +
    "&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m,wind_gusts_10m" +
    "&hourly=temperature_2m,pressure_msl,precipitation_probability,wind_speed_10m,weather_code" +
    "&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max" +
    "&timezone=Europe%2FBerlin&past_days=1&forecast_days=7";
  try {
    const d = await getJSON(url);
    d._at = Date.now();
    S.weather[key] = d;
    store.set("w_" + key, d);
  } catch (e) {
    S.weather[key] = store.get("w_" + key, null);
    if (S.weather[key]) S.weather[key]._stale = true;
  }
}
function pressureTrend(w) {
  if (!w || !w.hourly) return null;
  const now = Date.now(), times = w.hourly.time.map(t => new Date(t).valueOf());
  let i = times.findIndex(t => t > now) - 1;
  if (i < 6) return null;
  const p = w.hourly.pressure_msl;
  return { now: p[i], d3: p[i] - p[i - 3], d6: p[i] - p[i - 6], next6: p[Math.min(i + 6, p.length - 1)] - p[i] };
}
function trendText(t) {
  if (!t) return "";
  const d = t.d3;
  if (d <= -2) return "stark fallend ↓";
  if (d < -0.6) return "fallend ↘";
  if (d >= 2) return "stark steigend ↑";
  if (d > 0.6) return "steigend ↗";
  return "stabil →";
}
async function loadPegel() {
  try {
    const st = await getJSON(PEGEL + "BONN.json?includeTimeseries=true&includeCurrentMeasurement=true&includeCharacteristicValues=true");
    const ms = await getJSON(PEGEL + "BONN/W/measurements.json?start=P7D");
    let wt = null;
    const wts = (st.timeseries || []).find(t => t.shortname === "WT");
    if (wts && wts.currentMeasurement) wt = wts.currentMeasurement.value;
    const up = await Promise.allSettled([getJSON(PEGEL + "ANDERNACH/W/currentmeasurement.json"), getJSON(PEGEL + "ANDERNACH/W/measurements.json?start=PT24H")]);
    const W = (st.timeseries || []).find(t => t.shortname === "W") || {};
    S.pegel = {
      live: true, at: Date.now(),
      current: W.currentMeasurement, chars: W.characteristicValues || [],
      series: ms.map(m => ({ t: new Date(m.timestamp).valueOf(), v: m.value })),
      wt, andernach: up[0].status === "fulfilled" ? up[0].value : null,
      andernach24: up[1].status === "fulfilled" ? up[1].value.map(m => m.value) : null
    };
    store.set("pegel", S.pegel);
  } catch (e) {
    // Fallback: von GitHub Actions gespeicherte Daten, sonst letzter Stand
    try {
      const d = await getJSON("data/pegel.json");
      d.live = false;
      S.pegel = d;
    } catch { S.pegel = store.get("pegel", null); if (S.pegel) S.pegel.live = false; }
  }
}
async function loadStatic() {
  const [c, s, l] = await Promise.allSettled([getJSON("data/caster.json"), getJSON("data/shops.json"), getJSON("data/lexikon.json")]);
  S.caster = c.status === "fulfilled" ? c.value : store.get("caster", null);
  S.shops = s.status === "fulfilled" ? s.value : store.get("shops", null);
  S.lex = l.status === "fulfilled" ? l.value : store.get("lex", null);
  if (S.caster) store.set("caster", S.caster);
  if (S.shops) store.set("shops", S.shops);
  if (S.lex) store.set("lex", S.lex);
}

/* ---------- Bewertungen ---------- */
function pegelInfo() {
  const p = S.pegel;
  if (!p || !p.series || !p.series.length) return null;
  const cur = p.current ? p.current.value : p.series[p.series.length - 1].v;
  const now = p.series[p.series.length - 1].t;
  const ago = h => { const t = now - h * 36e5; let best = p.series[0]; for (const m of p.series) { if (m.t <= t) best = m; else break; } return best.v; };
  const d6 = cur - ago(6), d24 = cur - ago(24);
  const mw = (p.chars.find(c => c.shortname === "MW") || {}).value;
  return { cur, d6, d24, mw, at: p.current ? new Date(p.current.timestamp) : new Date(now) };
}
function pegelLevelText(cm) {
  if (cm == null) return "";
  if (cm < 150) return "Niedrigwasser – Buhnen liegen trocken, Fische in der Fahrrinne und an Buhnenköpfen";
  if (cm < 250) return "Eher niedrig – Buhnenköpfe und Strömungskanten sind gut erreichbar";
  if (cm < 400) return "Mittlerer Wasserstand – Buhnenfelder gut befischbar";
  if (cm < 550) return "Erhöht – Fische ziehen ins ruhige Wasser, Hafeneinfahrten und Ufernähe";
  if (cm < 650) return "Hochwasser – nur an sicheren Stellen, viel Treibgut";
  return "Starkes Hochwasser – Angeln nicht empfohlen, Ufer meiden";
}
function scoreRhein() {
  const w = S.weather.bonn, pi = pegelInfo(), t = pressureTrend(w), why = [];
  let s = 6;
  if (t) {
    if (t.d3 < -0.6 && t.d3 > -2.5) { s += 1; why.push("leicht fallender Luftdruck"); }
    else if (t.d3 <= -2.5) { s -= 1; why.push("Druck fällt stark"); }
    else if (t.d3 > 1.5) { s -= 1; why.push("Druck steigt stark"); }
    else why.push("stabiler Luftdruck");
  }
  if (pi) {
    if (pi.cur > 600) { s -= 4; why.push("Hochwasser"); }
    else if (pi.cur > 480) { s -= 2; why.push("hoher Pegel"); }
    if (pi.d24 > 40) { s -= 2; why.push("Pegel steigt schnell"); }
    else if (pi.d24 > 15) { s -= 1; why.push("Pegel steigt"); }
    else if (pi.d24 < -5 && pi.cur < 480) { s += 1; why.push("Pegel fällt"); }
  }
  if (w && w.current) {
    const ws = w.current.wind_speed_10m;
    if (ws > 35) { s -= 2; why.push("starker Wind"); } else if (ws >= 8 && ws <= 22) { s += 0.5; }
    if (w.current.cloud_cover > 60) { s += 0.5; why.push("bewölkt"); }
  }
  const ill = Astro.moonIllumination(new Date());
  if (ill.fraction > 0.95 || ill.fraction < 0.05) { s += 0.5; why.push(ill.fraction > 0.5 ? "Vollmond" : "Neumond"); }
  return { v: Math.round(clamp(s, 1, 10)), why };
}
function casterStatus(d = new Date()) {
  const c = S.caster;
  if (!c) return { open: null, text: "Keine Daten" };
  const m = d.getMonth() + 1, wd = d.getDay(), min = d.getHours() * 60 + d.getMinutes();
  const iso = d.toISOString().slice(0, 10);
  for (const cl of (c.curated.closures || [])) if (iso >= cl.from && iso <= cl.to) return { open: false, text: "Geschlossen: " + cl.note };
  if (wd === 3) return { open: false, text: "Mittwoch Ruhetag" };
  const winter = m >= 10 || m <= 2;
  if (m === 2 && wd !== 0 && wd !== 6) return { open: false, text: "Im Februar nur Sa & So geöffnet" };
  const h = winter ? c.curated.hours.winter : c.curated.hours.summer;
  const [ea, eb] = h.entry, end = h.end;
  if (min < ea) return { open: true, text: `Heute geöffnet · Einlass ${h.entryText}` };
  if (min <= eb) return { open: true, text: `Einlass läuft bis ${h.entryText.split("–")[1]}` };
  if (min < end) return { open: true, text: `Angelzeit bis ${h.endText} (Einlass vorbei)` };
  return { open: false, text: `Heute beendet · morgen Einlass ${h.entryText}` };
}
function scoreCaster() {
  const st = casterStatus(), w = S.weather.caster, t = pressureTrend(w), why = [];
  if (st.open === false && /Ruhetag|Geschlossen|Februar/.test(st.text)) return { v: 0, why: [st.text] };
  let s = 7;
  if (t) { if (Math.abs(t.d3) < 1) { s += 1; why.push("stabiler Luftdruck"); } else if (t.d3 < -2.5) { s -= 1; why.push("Druck fällt stark"); } }
  if (w && w.current) {
    const T = w.current.temperature_2m;
    if (T >= 4 && T <= 16) { s += 0.5; why.push("Forellenwetter"); }
    if (T > 24) { s -= 2; why.push("sehr warm – Forellen träge"); }
    if (w.current.precipitation > 2) { s -= 1; why.push("starker Regen"); }
  }
  why.push("täglicher Besatz");
  return { v: Math.round(clamp(s, 1, 10)), why };
}

/* ---------- Ansichten ---------- */
const VIEWS = {};
const TITLES = { heute: ["Barsch-Buddy", ""], rhein: ["Rhein · Bonn", "Pegel, Zielfische & Spots"], caster: ["Angelpark Caster", "Feyermühle · 53894 Mechernich"], shops: ["Angelshops", "Umkreis 200 km um Bonn"], lexikon: ["Angel-Lexikon", "Fische, Köder, Montagen, Recht"], fangbuch: ["Fangbuch", "Deine Fänge mit Bedingungen"] };

function go(view) {
  S.view = view;
  document.querySelectorAll(".view").forEach(v => v.hidden = v.id !== "view-" + view);
  document.querySelectorAll(".tabs button").forEach(b => b.setAttribute("aria-current", b.dataset.go === view ? "page" : "false"));
  const [t, sub] = TITLES[view];
  $("#pageTitle").textContent = t;
  $("#pageSub").textContent = sub || dateDE(new Date()) + " · Bonn";
  render(view);
  if (location.hash !== "#" + view) history.replaceState(null, "", "#" + view);
  window.scrollTo(0, 0);
}
function render(view) { try { VIEWS[view](); } catch (e) { console.error(e); $("#view-" + view).innerHTML = card(notice("Fehler beim Anzeigen: " + esc(e.message), "bad")); } }

VIEWS.heute = () => {
  const now = new Date(), w = S.weather.bonn, t = pressureTrend(w);
  const sun = Astro.sunTimes(now, LOC.bonn.lat, LOC.bonn.lon), ill = Astro.moonIllumination(now);
  const sol = Astro.solunar(now, LOC.bonn.lat, LOC.bonn.lon);
  const r = scoreRhein(), c = scoreCaster(), cs = casterStatus();
  const scoreBox = (lbl, sc, view) => `<button class="score" data-go="${view}"><span class="lbl">${lbl}</span><span class="val">${sc.v}<small>/10</small></span><span class="bar"><i style="width:${sc.v * 10}%"></i></span><span class="note">${esc(sc.why.slice(0, 3).join(" · "))}</span></button>`;
  const cur = w && w.current;
  const windows = [];
  if (sun.dawn && sun.sunrise) windows.push({ start: new Date(sun.dawn - 0), end: new Date(+sun.sunrise + 90 * 6e4), kind: "top", label: "Morgendämmerung" });
  if (sun.sunset && sun.dusk) windows.push({ start: new Date(+sun.sunset - 90 * 6e4), end: sun.dusk, kind: "top", label: "Abenddämmerung" });
  sol.forEach(s => windows.push({ start: s.start, end: s.end, kind: s.kind === "major" ? "good" : "ok", label: s.label }));
  windows.sort((a, b) => a.start - b.start);
  const active = SCHONZEITEN.filter(s => inPeriod(now, s.from, s.to));
  const pi = pegelInfo();
  const hints = [];
  active.forEach(s => hints.push(notice(`Schonzeit NRW: <b>${s.fish}</b> (${s.from[1]}.${s.from[0]}.–${s.to[1]}.${s.to[0]}.)`)));
  if (pi && pi.cur > 550) hints.push(notice(`Rhein-Hochwasser: Pegel Bonn ${pi.cur} cm – Ufer meiden!`, "bad"));
  if (pi && pi.d24 > 30) hints.push(notice(`Rhein steigt schnell (+${pi.d24} cm in 24 h)`));
  hints.push(notice("Caster: " + esc(cs.text), cs.open ? "info" : ""));
  const stale = w && w._stale ? notice("Offline – zeige zuletzt geladene Wetterdaten", "info") : "";
  $("#view-heute").innerHTML =
    card(`<h2>Angel-Index heute</h2><div class="grid2">${scoreBox("Rhein (Bonn)", r, "rhein")}${scoreBox("Angelpark Caster", c, "caster")}</div>`) +
    card(`<h2>Wetter Bonn${cur ? " · " + esc(WMO[cur.weather_code] || "") : ""}</h2>${stale}${cur ? `<div class="grid3">
      ${stat("Luft", num(cur.temperature_2m, 1) + " °C")}${stat("Luftdruck", num(cur.pressure_msl) + " hPa")}${stat("Tendenz", trendText(t))}
      ${stat("Wind", num(cur.wind_speed_10m) + " km/h")}${stat("Böen", num(cur.wind_gusts_10m) + " km/h")}${stat("Regen heute", num(w.daily.precipitation_probability_max[1]) + " %")}
      ${stat("Sonne", t2(sun.sunrise) + "–" + t2(sun.sunset))}${stat("Mond", Astro.phaseName(ill.phase))}${stat("Beleuchtung", Math.round(ill.fraction * 100) + " %")}</div>` : '<div class="skeleton"></div>'}`) +
    card(`<h2>Beste Beißzeiten</h2>${windows.map(x => `<div class="list-item">${chip(x.kind === "top" ? "Top" : x.kind === "good" ? "Gut" : "Okay", x.kind === "top" ? "solid" : "")}<div class="grow"><b>${t2(x.start)} – ${t2(x.end)}</b><span class="small muted">${x.label}</span></div></div>`).join("")}
      <p class="small muted">Dämmerung ist für Zander & Barsch die stärkste Zeit. Mondzeiten nach Solunar-Theorie.</p>`) +
    card(`<h2>Hinweise für heute</h2>${hints.join("")}`) +
    weekCard() +
    `<div class="btns"><button class="btn primary" data-go="fangbuch">${ico("camera")}Fang eintragen</button><button class="btn" id="settingsBtn">${ico("gear")}Einstellungen</button></div>`;
};
function weekCard() {
  const w = S.weather.bonn;
  if (!w || !w.daily) return "";
  const rows = w.daily.time.slice(1, 8).map((d, i) => {
    const k = i + 1, dt = new Date(d);
    return `<tr><td><b>${dt.toLocaleDateString("de-DE", { weekday: "short" })}</b> ${dt.getDate()}.${dt.getMonth() + 1}.</td><td>${esc(WMO[w.daily.weather_code[k]] || "")}</td><td>${num(w.daily.temperature_2m_min[k])}–${num(w.daily.temperature_2m_max[k])} °C</td><td>${num(w.daily.precipitation_probability_max[k])} %</td><td>${num(w.daily.wind_speed_10m_max[k])}</td></tr>`;
  }).join("");
  return card(`<h2>7-Tage-Planer</h2><div class="tbl-wrap"><table><thead><tr><th>Tag</th><th>Wetter</th><th>Temp.</th><th>Regen</th><th>Wind km/h</th></tr></thead><tbody>${rows}</tbody></table></div>`);
}

function sparkline(series) {
  if (!series || series.length < 2) return "";
  const W = 340, H = 120, P = 8, vs = series.map(s => s.v), mn = Math.min(...vs), mx = Math.max(...vs), span = Math.max(mx - mn, 10);
  const t0 = series[0].t, t1 = series[series.length - 1].t;
  const step = Math.max(1, Math.floor(series.length / 200));
  const pts = series.filter((_, i) => i % step === 0 || i === series.length - 1).map(s => `${(P + (s.t - t0) / (t1 - t0) * (W - 2 * P)).toFixed(1)},${(H - P - (s.v - mn) / span * (H - 2 * P)).toFixed(1)}`).join(" ");
  const last = pts.split(" ").pop().split(",");
  return `<svg class="chart" viewBox="0 0 ${W} ${H + 18}" role="img" aria-label="Pegel Bonn der letzten 7 Tage zwischen ${mn} und ${mx} cm">
    <polyline points="${pts}" fill="none" stroke="#2E7D4F" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
    <circle cx="${last[0]}" cy="${last[1]}" r="5" fill="#1E5B3A"/>
    <text x="${P}" y="${H + 14}" font-size="11" fill="#4A5F52">vor 7 Tagen</text><text x="${W - P}" y="${H + 14}" font-size="11" fill="#4A5F52" text-anchor="end">jetzt</text>
    <text x="${W - P}" y="14" font-size="11" fill="#4A5F52" text-anchor="end">max ${mx} cm</text><text x="${W - P}" y="${H - 2}" font-size="11" fill="#4A5F52" text-anchor="end">min ${mn} cm</text></svg>`;
}
function monthFish(m) {
  const all = [
    { n: "Zander", months: [1,2,3,6,7,8,9,10,11,12], info: "Schonzeit 01.04.–31.05. · Mindestmaß 40 cm", tip: { w: "Gummifisch 10–14 cm langsam am Grund, Buhnenköpfe in der Dämmerung", s: "Nachts und in der Dämmerung, Wobbler und Gummi an Strömungskanten" } },
    { n: "Flussbarsch", months: [1,2,3,4,5,6,7,8,9,10,11,12], info: "keine Schonzeit / kein Mindestmaß in NRW", tip: { w: "Dropshot und kleine Gummis an Steinpackungen, Hafenbecken", s: "Spinner, kleine Wobbler, Jigs in den Buhnenfeldern" } },
    { n: "Rapfen", months: [4,5,6,7,8,9,10], info: "kein Mindestmaß in NRW", tip: { w: "", s: "Schlanke Metallköder weit werfen und schnell führen, Strömung hinter Buhnen" } },
    { n: "Hecht", months: [1,2,5,6,7,8,9,10,11,12], info: "Schonzeit 15.02.–30.04. · Mindestmaß 45 cm", tip: { w: "Ruhige Altarme, Hafeneinfahrten, große Gummis", s: "Krautkanten in Altarmen, Spinnerbaits" } },
    { n: "Barbe", months: [4,5,6,7,8,9,10], info: "Schonzeit 15.05.–15.06. · Mindestmaß 35 cm", tip: { w: "", s: "Grundangeln mit Feeder, Frühstücksfleisch, Maden in der Strömung" } },
    { n: "Wels", months: [5,6,7,8,9,10], info: "kein Mindestmaß in NRW", tip: { w: "", s: "Nachts mit Tauwurmbündel oder Köderfisch, kräftiges Gerät" } },
    { n: "Aal", months: [4,5,6,7,8,9], info: "Rheinhauptstrom geschont 01.10.–01.03. · Mindestmaß 50 cm", tip: { w: "", s: "Nachts mit Tauwurm auf Grund, warme Gewitternächte" } },
    { n: "Brassen & Rotauge", months: [1,2,3,4,5,6,7,8,9,10,11,12], info: "keine Schonzeit", tip: { w: "Feeder in ruhigen Hafenbecken, Maden", s: "Feeder mit Futterkorb in Buhnenfeldern" } }
  ];
  const winter = m >= 10 || m <= 3;
  return all.filter(f => f.months.includes(m)).map(f => ({ ...f, tipNow: winter ? (f.tip.w || f.tip.s) : (f.tip.s || f.tip.w) }));
}
VIEWS.rhein = () => {
  const pi = pegelInfo(), p = S.pegel, now = new Date();
  const ch = (pi && pi.d6 != null) ? (pi.d6 > 0 ? "+" : "") + pi.d6 + " cm / 6 h" : "";
  let upHtml = "";
  if (p && p.andernach) {
    const a24 = p.andernach24 && p.andernach24.length ? p.andernach.value - p.andernach24[0] : null;
    upHtml = row("Oberlauf Andernach", `${p.andernach.value} cm${a24 != null ? ` (${a24 > 0 ? "+" : ""}${a24} cm / 24 h)` : ""}`) +
      `<p class="small muted">Was in Andernach steigt, kommt etwa einen halben Tag später in Bonn an.</p>`;
  }
  const fish = monthFish(now.getMonth() + 1).map(f => {
    const sch = SCHONZEITEN.find(s => s.fish.startsWith(f.n.split(" ")[0]) || (f.n === "Aal" && s.fish.startsWith("Aal")));
    const closed = sch && inPeriod(now, sch.from, sch.to);
    return `<div class="list-item"><div class="grow"><b>${f.n}</b><span class="small muted">${f.info}</span><span class="small">${closed ? "Derzeit Schonzeit – nicht gezielt befischen" : esc(f.tipNow)}</span></div>${closed ? chip("Schonzeit", "warn") : chip("Saison")}</div>`;
  }).join("");
  const spots = [
    ["Bonn · Rheinaue", 50.7135, 7.1532, "Buhnenfelder, viel Platz, gut zu Fuß"],
    ["Bonn-Beuel · Rheinufer", 50.7378, 7.1105, "Steinpackung, Barsch & Zander"],
    ["Bonn · Graurheindorf/Hafen", 50.7590, 7.0910, "Hafeneinfahrt, ruhigeres Wasser bei Hochwasser"],
    ["Königswinter", 50.6735, 7.1925, "Strömungskanten, Buhnen"],
    ["Bad Honnef · Insel Grafenwerth", 50.6440, 7.2120, "Seitenarm, ruhig, Hecht & Barsch"],
    ["Mondorf · Siegmündung", 50.7740, 7.0750, "Mündungsbereich, Rapfen & Barsch"]
  ].map(s => `<div class="list-item">${ico("map")}<div class="grow"><b>${s[0]}</b><span class="small muted">${s[3]}</span></div><a class="small" href="https://www.google.com/maps/search/?api=1&query=${s[1]},${s[2]}" target="_blank" rel="noopener">Route</a></div>`).join("");
  $("#view-rhein").innerHTML =
    card(pi ? `<div style="display:flex;justify-content:space-between;align-items:flex-end;gap:8px"><div><span class="small muted"><b>Pegel Bonn</b> · ${t2(pi.at)} Uhr${p.live ? "" : " (gespeichert)"}</span><div class="big-num">${pi.cur} cm</div></div>${ch ? chip((pi.d6 > 0 ? "↗ " : pi.d6 < 0 ? "↘ " : "→ ") + ch) : ""}</div>
      ${sparkline(p.series)}
      <div class="grid3">${stat("24 h", (pi.d24 > 0 ? "+" : "") + pi.d24 + " cm")}${stat("Mittel (MW)", pi.mw ? pi.mw + " cm" : "–")}${stat("Wasser", p.wt != null ? num(p.wt, 1) + " °C" : "k. A.")}</div>
      ${notice(pegelLevelText(pi.cur), pi.cur > 550 ? "bad" : "info")}${upHtml}`
      : `<h2>Pegel Bonn</h2><div class="skeleton"></div><p class="small muted">Pegeldaten werden geladen …</p>`) +
    card(`<h2>Zielfische im ${now.toLocaleDateString("de-DE", { month: "long" })}</h2>${fish}`) +
    card(`<h2>Spots in der Nähe</h2>${spots}<p class="small muted">Nur an erlaubten, sicheren Uferstellen angeln. Buhnen bei Hochwasser nicht betreten.</p>`) +
    card(`<h2>Was brauche ich?</h2><p>Für den Rhein brauchst du den <b>Fischereischein</b> und zusätzlich einen <b>Erlaubnisschein (Rheinkarte)</b> für den jeweiligen Abschnitt. Die Karten gibt es in Angelshops in Bonn und Köln – siehe Tab <a href="#shops" data-go="shops">Shops</a>.</p>`) +
    `<p class="small muted center">Pegeldaten: PEGELONLINE (WSV), Wetter: Open-Meteo</p>`;
};

VIEWS.caster = () => {
  const c = S.caster;
  if (!c) { $("#view-caster").innerHTML = card('<div class="skeleton"></div>'); return; }
  const cu = c.curated, st = casterStatus(), sc = c.scraped || {};
  const prices = cu.prices.map(p => `<div class="list-item"><div class="grow"><b>${esc(p.teich)}</b><span class="small muted">${esc(p.besatz)}</span></div><b style="font-family:Fredoka,system-ui;font-size:1.25rem;color:${p.locked ? "#4A5F52" : "#1E5B3A"}">${esc(p.preis)}</b></div>`).join("");
  const hrs = (h, t) => `<h3 style="color:#2E7D4F">${t}</h3>` + h.map(x => row(esc(x[0]), esc(x[1]))).join("");
  const news = (sc.notes || []).map(n => notice(esc(n))).join("");
  const changed = sc.changed_at ? `<span class="chip warn">Webseite geändert am ${new Date(sc.changed_at).toLocaleDateString("de-DE")}</span>` : "";
  const live = (sc.sections || []).map(s => `<details class="lex-entry"><summary>${esc(s.title)}</summary><div class="body">${s.lines.map(l => `<p>${esc(l)}</p>`).join("")}</div></details>`).join("");
  $("#view-caster").innerHTML =
    card(`<div class="chips">${chip(st.open ? "Heute geöffnet" : "Geschlossen", st.open ? "solid" : "warn")}${chip(new Date().getMonth() + 1 >= 10 || new Date().getMonth() + 1 <= 2 ? "Winterzeiten" : "Sommerzeiten")}</div>
      <p><b>${esc(st.text)}</b></p>
      <div class="btns"><a class="btn primary" href="tel:+4924432773">${ico("phone")}Anrufen</a><a class="btn" href="https://www.google.com/maps/search/?api=1&query=${LOC.caster.lat},${LOC.caster.lon}" target="_blank" rel="noopener">${ico("map")}Route</a><a class="btn" href="https://www.forellenzucht-caster.de/" target="_blank" rel="noopener">${ico("web")}Webseite</a></div>`) +
    card(`<h2>Aktuelle Hinweise</h2>${cu.notes.map(n => notice(esc(n.text), n.kind || "")).join("")}${news}
      <div class="chips">${changed}</div>
      <p class="small muted">Quelle: forellenzucht-caster.de · automatisch geprüft ${sc.fetched_at ? new Date(sc.fetched_at).toLocaleString("de-DE", { dateStyle: "short", timeStyle: "short" }) : "–"}</p>`) +
    card(`<h2>Preise & Besatz</h2>${prices}<p class="small muted">${esc(cu.pricesNote)}</p>`) +
    card(`<h2>Öffnungszeiten</h2>${hrs(cu.hoursTable.winter, "Winter · 1. Okt – 28. Feb")}${hrs(cu.hoursTable.summer, "Sommer · 1. Mär – 30. Sep")}${cu.hoursTable.extra.map(x => `<p class="small">${esc(x)}</p>`).join("")}`) +
    card(`<h2>Teichordnung – Packliste</h2><div class="chips">${cu.rules.must.map(x => chip("✓ " + esc(x))).join("")}</div><div class="chips">${cu.rules.allowed.map(x => chip(esc(x))).join("")}</div><div class="chips">${cu.rules.forbidden.map(x => chip("✕ " + esc(x), "warn")).join("")}</div>`) +
    card(`<h2>Wetter am Teich</h2>${casterWeather()}`) +
    (live ? card(`<h2>Original-Texte der Webseite</h2><p class="small muted">Automatisch übernommen, täglich aktualisiert.</p>${live}`) : "");
};
function casterWeather() {
  const w = S.weather.caster;
  if (!w || !w.current) return '<div class="skeleton"></div>';
  const c = w.current;
  return `<div class="grid3">${stat("Luft", num(c.temperature_2m, 1) + " °C")}${stat("Wetter", esc(WMO[c.weather_code] || ""))}${stat("Wind", num(c.wind_speed_10m) + " km/h")}${stat("Druck", num(c.pressure_msl) + " hPa")}${stat("Tendenz", trendText(pressureTrend(w)))}${stat("Regen heute", num(w.daily.precipitation_probability_max[1]) + " %")}</div>`;
}

VIEWS.shops = () => {
  const d = S.shops, from = S.myPos || LOC.bonn;
  const head = `<label class="search">${ico("search")}<span class="sr">Shop oder Ort suchen</span><input id="shopSearch" type="search" placeholder="Shop oder Ort suchen" value="${esc(S.shopQuery)}"></label>
    <div class="filters">${[["alle", "Alle (200 km)"], ["offen", "Jetzt offen"], ["25", "≤ 25 km"], ["50", "≤ 50 km"], ["rhein", "Rheinkarten"]].map(([k, l]) => `<button class="filter" data-shopf="${k}" aria-pressed="${S.shopFilter === k}">${l}</button>`).join("")}</div>
    <div class="btns"><button class="btn" id="locBtn">${ico("pin")}${S.myPos ? "Entfernung ab meinem Standort" : "Mein Standort statt Bonn"}</button></div>`;
  if (!d || !d.shops) { $("#view-shops").innerHTML = head + card('<div class="skeleton"></div>'); bindShopInputs(); return; }
  let list = d.shops.map(s => ({ ...s, km: distKm(from, s), st: OH.status(s.opening_hours) }));
  const q = S.shopQuery.trim().toLowerCase();
  if (q) list = list.filter(s => (s.name + " " + (s.city || "") + " " + (s.street || "")).toLowerCase().includes(q));
  if (S.shopFilter === "offen") list = list.filter(s => s.st && s.st.open);
  if (S.shopFilter === "25") list = list.filter(s => s.km <= 25);
  if (S.shopFilter === "50") list = list.filter(s => s.km <= 50);
  if (S.shopFilter === "rhein") list = list.filter(s => s.rheinkarte);
  list.sort((a, b) => a.km - b.km);
  const items = list.slice(0, 150).map(s => {
    const status = s.st ? chip(s.st.text, s.st.open ? "solid" : "") : chip(s.opening_hours ? "Zeiten siehe unten" : "Zeiten unbekannt", "warn");
    const addr = [s.street, [s.postcode, s.city].filter(Boolean).join(" ")].filter(Boolean).join(", ");
    return card(`<div style="display:flex;justify-content:space-between;gap:8px"><div class="grow" style="display:flex;flex-direction:column;gap:2px"><b>${esc(s.name)}</b><span class="small muted">${esc(addr || "Adresse siehe Karte")}</span></div><b class="small muted" style="white-space:nowrap">${num(s.km)} km</b></div>
      <div class="chips">${status}${s.rheinkarte ? chip("Rheinkarten") : ""}${s.kind === "outdoor" ? chip("Outdoor/Angeln") : ""}</div>
      ${s.opening_hours ? `<p class="small">${esc(OH.pretty(s.opening_hours))}</p>` : `<p class="small muted">Öffnungszeiten nicht hinterlegt – bitte vorher anrufen.</p>`}
      <div class="btns">${s.phone ? `<a class="btn" href="tel:${esc(s.phone.replace(/[^+\d]/g, ""))}">${ico("phone")}Anrufen</a>` : ""}<a class="btn" href="https://www.google.com/maps/search/?api=1&query=${s.lat},${s.lon}" target="_blank" rel="noopener">${ico("map")}Route</a>${s.website ? `<a class="btn" href="${esc(s.website)}" target="_blank" rel="noopener">${ico("web")}Web</a>` : ""}</div>`);
  }).join("");
  $("#view-shops").innerHTML = head + `<p class="small muted">${list.length} Shops gefunden · sortiert nach Entfernung ab ${S.myPos ? "deinem Standort" : "Bonn"}</p>` + (items || card("<p>Keine Treffer für diese Filter.</p>")) +
    `<p class="small muted center">Daten: © OpenStreetMap-Mitwirkende · Stand ${d.updated ? new Date(d.updated).toLocaleDateString("de-DE") : "–"} · wöchentlich aktualisiert</p>`;
  bindShopInputs();
};
function bindShopInputs() {
  const i = $("#shopSearch");
  if (i) i.addEventListener("input", e => { S.shopQuery = e.target.value; clearTimeout(i._t); i._t = setTimeout(() => { VIEWS.shops(); const n = $("#shopSearch"); n.focus(); n.setSelectionRange(n.value.length, n.value.length); }, 250); });
}

VIEWS.lexikon = () => {
  const L = S.lex;
  if (!L) { $("#view-lexikon").innerHTML = card('<div class="skeleton"></div>'); return; }
  const cats = L.categories.map(c => `<button class="cat" data-lexcat="${c.id}" aria-pressed="${S.lexCat === c.id}">${ico(c.icon)}<b>${esc(c.name)}</b><span class="small muted">${L.entries.filter(e => e.cat === c.id).length} Einträge</span></button>`).join("");
  const q = S.lexQuery.trim().toLowerCase();
  let list = L.entries;
  if (S.lexCat) list = list.filter(e => e.cat === S.lexCat);
  if (q) list = list.filter(e => (e.title + " " + (e.alias || "") + " " + e.text + " " + (e.facts || []).map(f => f.join(" ")).join(" ")).toLowerCase().includes(q));
  const day = Math.floor(Date.now() / 864e5), fishes = L.entries.filter(e => e.cat === "fische"), fod = fishes[day % fishes.length];
  const entry = e => `<details class="lex-entry"${q && list.length < 4 ? " open" : ""}><summary><span>${esc(e.title)}${e.latin ? ` <i class="small muted">${esc(e.latin)}</i>` : ""}</span></summary><div class="body"><p>${esc(e.text)}</p>${(e.facts || []).map(f => row(esc(f[0]), esc(f[1]))).join("")}${e.steps ? `<ol style="margin:0;padding-left:20px;display:flex;flex-direction:column;gap:4px">${e.steps.map(s => `<li>${esc(s)}</li>`).join("")}</ol>` : ""}</div></details>`;
  const showList = S.lexCat || q;
  $("#view-lexikon").innerHTML =
    `<label class="search">${ico("search")}<span class="sr">Lexikon durchsuchen</span><input id="lexSearch" type="search" placeholder="z. B. Dropshot, Zander, Palomar" value="${esc(S.lexQuery)}"></label>
    <div class="grid2">${cats}</div>` +
    (showList ? card(`<h2>${S.lexCat ? esc(L.categories.find(c => c.id === S.lexCat).name) : "Suchergebnisse"} <span class="small muted">(${list.length})</span></h2>${list.map(entry).join("") || "<p>Nichts gefunden.</p>"}`)
      : card(`<div style="display:flex;gap:12px;align-items:center"><img src="icons/perch.svg" alt="" width="90" height="63"><div><span class="small" style="color:#2E7D4F;font-weight:800">FISCH DES TAGES</span><h2>${esc(fod.title)}</h2><i class="small muted">${esc(fod.latin || "")}</i></div></div><p>${esc(fod.text)}</p>${(fod.facts || []).map(f => row(esc(f[0]), esc(f[1]))).join("")}`) + schonCard());
  const i = $("#lexSearch");
  i.addEventListener("input", e => { S.lexQuery = e.target.value; clearTimeout(i._t); i._t = setTimeout(() => { VIEWS.lexikon(); const n = $("#lexSearch"); n.focus(); n.setSelectionRange(n.value.length, n.value.length); }, 300); });
};
function schonCard() {
  const L = S.lex, now = new Date();
  const rows = L.nrw.map(r => { const act = r.from && inPeriod(now, r.from, r.to); return `<tr><td><b>${esc(r.fish)}</b></td><td>${r.from ? `${r.from[1]}.${r.from[0]}.–${r.to[1]}.${r.to[0]}.` : "–"}${act ? " " + chip("jetzt", "warn") : ""}${r.note ? `<br><span class="small muted">${esc(r.note)}</span>` : ""}</td><td>${r.mm ? r.mm + " cm" : "–"}</td></tr>`; }).join("");
  return card(`<h2>Schonzeiten & Mindestmaße NRW</h2><div class="tbl-wrap"><table><thead><tr><th>Fisch</th><th>Schonzeit</th><th>Mindestmaß</th></tr></thead><tbody>${rows}</tbody></table></div>
    <p class="small"><b>Ganzjährig geschützt:</b> ${esc(L.protected.join(", "))}</p>
    <p class="small muted">Quelle: Landesfischereiverordnung NRW (Stand 2026). Vereins- und Gewässerordnungen können strenger sein.</p>`);
}

/* ---------- Fangbuch ---------- */
VIEWS.fangbuch = () => {
  const list = store.get("catches", []);
  const fishOpts = ["Flussbarsch", "Zander", "Hecht", "Regenbogenforelle", "Lachsforelle", "Bachsaibling", "Karpfen", "Rapfen", "Barbe", "Wels", "Aal", "Döbel", "Brassen", "Rotauge", "Schleie", "Stör", "Sonstiges"];
  const stats = (() => {
    if (!list.length) return "";
    const by = k => { const m = {}; list.forEach(c => { if (c[k]) m[c[k]] = (m[c[k]] || 0) + 1; }); return Object.entries(m).sort((a, b) => b[1] - a[1])[0]; };
    const bf = by("fish"), bb = by("bait"), bw = by("water");
    const pr = list.filter(c => c.cond && c.cond.pressure).map(c => c.cond.pressure);
    const hrs = {}; list.forEach(c => { const h = new Date(c.at).getHours(); hrs[h] = (hrs[h] || 0) + 1; });
    const bh = Object.entries(hrs).sort((a, b) => b[1] - a[1])[0];
    return card(`<h2>Auswertung</h2><div class="grid2">${stat("Fänge", list.length)}${stat("Häufigster Fisch", bf ? esc(bf[0]) : "–")}${stat("Bester Köder", bb ? esc(bb[0]) : "–")}${stat("Bestes Gewässer", bw ? esc(bw[0]) : "–")}${stat("Beste Uhrzeit", bh ? bh[0] + ":00–" + (+bh[0] + 1) + ":00" : "–")}${stat("Ø Luftdruck", pr.length ? num(pr.reduce((a, b) => a + b, 0) / pr.length) + " hPa" : "–")}</div>`);
  })();
  const items = list.slice().reverse().map(c => `<div class="list-item">${c.photo ? `<img class="catch-img" src="${c.photo}" alt="Foto ${esc(c.fish)}">` : `<div class="catch-img" style="display:flex;align-items:center;justify-content:center">${ico("fish")}</div>`}<div class="grow"><b>${esc(c.fish)}${c.len ? " · " + esc(c.len) + " cm" : ""}${c.weight ? " · " + esc(c.weight) + " g" : ""}</b><span class="small muted">${new Date(c.at).toLocaleString("de-DE", { dateStyle: "medium", timeStyle: "short" })} · ${esc(c.water || "")}</span><span class="small">${esc(c.bait || "")}${c.cond ? ` · ${c.cond.temp != null ? num(c.cond.temp, 1) + " °C · " : ""}${c.cond.pressure ? num(c.cond.pressure) + " hPa" : ""}${c.cond.pegel ? " · Pegel " + c.cond.pegel + " cm" : ""} · ${esc(c.cond.moon || "")}` : ""}</span>${c.note ? `<span class="small muted">${esc(c.note)}</span>` : ""}</div><button class="icon-btn" style="background:#FDECEA" data-del="${c.id}" aria-label="Fang löschen"><svg viewBox="0 0 24 24" style="stroke:#A3271A" aria-hidden="true">${ICO.trash}</svg></button></div>`).join("");
  $("#view-fangbuch").innerHTML =
    card(`<h2>Neuer Fang</h2>
      <label class="photo-drop" id="photoDrop">${ico("camera")}<span>Foto aufnehmen oder wählen</span><input type="file" accept="image/*" capture="environment" id="photoIn" aria-label="Foto aufnehmen"></label>
      <div class="grid2"><label class="f">Fischart<select id="fFish">${fishOpts.map(f => `<option>${f}</option>`).join("")}</select></label>
      <label class="f">Gewässer<select id="fWater"><option>Rhein</option><option>Angelpark Caster</option><option>Anderes Gewässer</option></select></label>
      <label class="f">Länge (cm)<input id="fLen" type="number" inputmode="decimal" min="0"></label>
      <label class="f">Gewicht (g)<input id="fWeight" type="number" inputmode="numeric" min="0"></label></div>
      <label class="f">Köder / Montage<input id="fBait" type="text" placeholder="z. B. Gummifisch 12 cm, Dropshot"></label>
      <label class="f">Notiz<input id="fNote" type="text" placeholder="Stelle, Besonderheiten"></label>
      ${notice("Wetter, Luftdruck, Pegel und Mondphase werden automatisch mitgespeichert.", "info")}
      <div class="btns"><button class="btn primary" id="saveCatch">Fang speichern</button></div>`) +
    stats +
    card(`<h2>Meine Fänge</h2>${items || '<p class="muted">Noch keine Fänge eingetragen. Petri Heil!</p>'}${list.length ? `<div class="btns"><button class="btn" id="exportCatch">Fangbuch sichern (Datei)</button></div>` : ""}`) +
    `<p class="small muted center">Das Fangbuch wird nur auf diesem Handy gespeichert.</p>`;
  let photo = null;
  $("#photoIn").addEventListener("change", async e => {
    const f = e.target.files[0]; if (!f) return;
    photo = await shrink(f, 640);
    $("#photoDrop").querySelector("span").outerHTML = `<img src="${photo}" alt="Vorschau">`;
  });
  $("#saveCatch").addEventListener("click", () => {
    const water = $("#fWater").value, w = water === "Angelpark Caster" ? S.weather.caster : S.weather.bonn, pi = pegelInfo();
    const c = { id: Date.now(), at: new Date().toISOString(), fish: $("#fFish").value, water, len: $("#fLen").value, weight: $("#fWeight").value, bait: $("#fBait").value.trim(), note: $("#fNote").value.trim(), photo,
      cond: { temp: w && w.current ? w.current.temperature_2m : null, pressure: w && w.current ? w.current.pressure_msl : null, wind: w && w.current ? w.current.wind_speed_10m : null, pegel: water === "Rhein" && pi ? pi.cur : null, moon: Astro.phaseName(Astro.moonIllumination(new Date()).phase) } };
    const l = store.get("catches", []); l.push(c);
    if (!store.set("catches", l)) { c.photo = null; l[l.length - 1] = c; if (!store.set("catches", l)) { alert("Speicher voll – bitte alte Fänge sichern und löschen."); return; } alert("Speicher fast voll – Fang ohne Foto gespeichert."); }
    VIEWS.fangbuch();
  });
  document.querySelectorAll("[data-del]").forEach(b => b.addEventListener("click", () => {
    if (!confirm("Diesen Fang wirklich löschen?")) return;
    store.set("catches", store.get("catches", []).filter(c => String(c.id) !== b.dataset.del)); VIEWS.fangbuch();
  }));
  const ex = $("#exportCatch");
  if (ex) ex.addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(store.get("catches", []), null, 1)], { type: "application/json" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "fangbuch-" + new Date().toISOString().slice(0, 10) + ".json"; a.click();
  });
};
function shrink(file, max) {
  return new Promise(res => {
    const img = new Image(), url = URL.createObjectURL(file);
    img.onload = () => {
      const s = Math.min(1, max / Math.max(img.width, img.height)), cv = document.createElement("canvas");
      cv.width = Math.round(img.width * s); cv.height = Math.round(img.height * s);
      cv.getContext("2d").drawImage(img, 0, 0, cv.width, cv.height);
      URL.revokeObjectURL(url); res(cv.toDataURL("image/jpeg", 0.7));
    };
    img.onerror = () => res(null);
    img.src = url;
  });
}

/* ---------- Einstellungen ---------- */
function openModal(html) { $("#modalBody").innerHTML = html; $("#modal").hidden = false; $("#modalClose").focus(); }
function closeModal() { $("#modal").hidden = true; }
function settings() {
  openModal(`<h2>Einstellungen</h2>
    <label class="toggle"><span>Große Schrift</span><input type="checkbox" id="bigToggle" ${document.body.classList.contains("big") ? "checked" : ""}></label>
    <h3>App installieren</h3><p class="small">In Chrome auf dem Handy: Menü ⋮ → <b>„Zum Startbildschirm hinzufügen“</b> bzw. <b>„App installieren“</b>. Danach startet Barsch-Buddy wie eine normale App, auch offline mit den zuletzt geladenen Daten.</p>
    <h3>Datenquellen</h3><p class="small">Wetter: Open-Meteo · Pegel: PEGELONLINE (WSV) · Angelpark: forellenzucht-caster.de (täglich) · Shops: © OpenStreetMap-Mitwirkende (wöchentlich) · Recht: Landesfischereiverordnung NRW.</p>
    <p class="small muted">Alle Angaben ohne Gewähr – vor Ort gelten die Gewässerordnung und dein Erlaubnisschein.</p>`);
  $("#bigToggle").addEventListener("change", e => { document.body.classList.toggle("big", e.target.checked); store.set("big", e.target.checked); });
}

/* ---------- Start ---------- */
document.addEventListener("click", e => {
  const g = e.target.closest("[data-go]");
  if (g) { e.preventDefault(); go(g.dataset.go); return; }
  const f = e.target.closest("[data-shopf]");
  if (f) { S.shopFilter = f.dataset.shopf; VIEWS.shops(); return; }
  const lc = e.target.closest("[data-lexcat]");
  if (lc) { S.lexCat = S.lexCat === lc.dataset.lexcat ? null : lc.dataset.lexcat; VIEWS.lexikon(); return; }
  if (e.target.closest("#settingsBtn")) { settings(); return; }
  if (e.target.closest("#locBtn")) {
    if (S.myPos) { S.myPos = null; VIEWS.shops(); return; }
    navigator.geolocation && navigator.geolocation.getCurrentPosition(p => { S.myPos = { lat: p.coords.latitude, lon: p.coords.longitude }; VIEWS.shops(); }, () => alert("Standort nicht verfügbar."), { timeout: 10000 });
    return;
  }
  if (e.target.closest("#modalClose") || e.target === $("#modal")) closeModal();
});
document.addEventListener("keydown", e => { if (e.key === "Escape" && !$("#modal").hidden) closeModal(); });

async function refresh() {
  const b = $("#refreshBtn"); b.classList.add("spin");
  await Promise.allSettled([loadWeather("bonn"), loadWeather("caster"), loadPegel(), loadStatic()]);
  b.classList.remove("spin");
  render(S.view);
}
$("#refreshBtn").addEventListener("click", refresh);

(async function init() {
  if (store.get("big", false)) document.body.classList.add("big");
  const start = (location.hash || "#heute").slice(1);
  S.pegel = store.get("pegel", null);
  ["bonn", "caster"].forEach(k => { S.weather[k] = store.get("w_" + k, null); });
  S.caster = store.get("caster", null); S.shops = store.get("shops", null); S.lex = store.get("lex", null);
  go(TITLES[start] ? start : "heute");
  await refresh();
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});
  setInterval(() => { if (document.visibilityState === "visible") refresh(); }, 30 * 60000);
})();
