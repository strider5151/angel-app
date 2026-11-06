/* Barsch-Buddy – Angel-Empfehlungen für Bonn + 200 km */
"use strict";

const t = (k, v) => I18N.t(k, v);
const LOC = {
  bonn: { name: "Bonn", lat: 50.7374, lon: 7.0982 },
  caster: { name: "Angelpark Caster", lat: 50.5896, lon: 6.6745, address: "Forellenzucht & Angelpark Caster, Feyermühle, 53894 Mechernich" }
};
const PEGEL = "https://www.pegelonline.wsv.de/webservices/rest-api/v2/stations/";
const SCHONZEITEN = [ // Landesfischereiverordnung NRW § 2
  { fish: { de: "Bach-, Seeforelle & Seesaibling", ru: "Ручьевая и озёрная форель, арктический голец" }, key: "Forelle", from: [10, 20], to: [3, 15] },
  { fish: { de: "Aal (nur Rheinhauptstrom)", ru: "Угорь (только основное русло Rhein)" }, key: "Aal", from: [10, 1], to: [3, 1] },
  { fish: { de: "Äsche & Nase", ru: "Хариус и подуст" }, key: "Äsche", from: [3, 1], to: [4, 30] },
  { fish: { de: "Zander", ru: "Судак" }, key: "Zander", from: [4, 1], to: [5, 31] },
  { fish: { de: "Barbe", ru: "Усач" }, key: "Barbe", from: [5, 15], to: [6, 15] },
  { fish: { de: "Hecht", ru: "Щука" }, key: "Hecht", from: [2, 15], to: [4, 30] }
];

const S = { weather: {}, pegel: null, caster: null, shops: null, lex: null, view: "heute", shopFilter: "alle", shopQuery: "", lexCat: null, lexQuery: "", myPos: null };

/* ---------- Hilfen ---------- */
const $ = s => document.querySelector(s);
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const L = () => I18N.locale();
const t2 = d => d ? d.toLocaleTimeString(L(), { hour: "2-digit", minute: "2-digit" }) : "–";
const dateLong = d => d.toLocaleDateString(L(), { weekday: "long", day: "numeric", month: "long", year: "numeric" });
const num = (v, d = 0) => v == null || isNaN(v) ? "–" : Number(v).toLocaleString(L(), { maximumFractionDigits: d, minimumFractionDigits: d });
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const pick = o => I18N.pick(o);
const ICO = {
  alert: '<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18v.01"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7v.01"/>',
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>',
  map: '<path d="M12 21s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/>',
  web: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
  camera: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
  image: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-8 8"/>',
  fish: '<path d="M3 12c3-5 9-6 13-3l5-3v12l-5-3c-4 3-10 2-13-3z"/><circle cx="8" cy="11" r="1"/>',
  bait: '<path d="M12 2v8"/><path d="M12 10a4 4 0 1 0 4 4"/>',
  knot: '<path d="M4 12c4-8 12 8 16 0"/><path d="M4 12c4 8 12-8 16 0"/>',
  rod: '<path d="M3 21L20 4"/><circle cx="7" cy="17" r="2"/><path d="M20 4v8"/>',
  wave: '<path d="M2 9c2.5-2 4.5-2 7 0s4.5 2 7 0 3.5-1.5 6 0"/><path d="M2 15c2.5-2 4.5-2 7 0s4.5 2 7 0 3.5-1.5 6 0"/>',
  law: '<path d="M12 3v18M5 7h14M7 7l-3 7a3 3 0 0 0 6 0zM17 7l-3 7a3 3 0 0 0 6 0z"/>',
  book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5"/>',
  pin: '<circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>',
  trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
  check: '<path d="M5 12l5 5 9-10"/>'
};
const ico = (n, cls = "ico") => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICO[n] || ""}</svg>`;
const chip = (x, k = "") => `<span class="chip ${k}">${x}</span>`;
const notice = (x, k = "") => `<div class="notice ${k}">${ico(k === "info" ? "info" : "alert")}<span>${x}</span></div>`;
const row = (l, r) => `<div class="row"><span class="l">${l}</span><span class="r">${r}</span></div>`;
const stat = (l, v) => `<div class="stat"><span>${l}</span><span>${v}</span></div>`;
const card = (inner, cls = "") => `<section class="card ${cls}">${inner}</section>`;
const FLAG = {
  de: '<svg class="flag" viewBox="0 0 30 20" aria-hidden="true"><rect width="30" height="6.67" fill="#000"/><rect y="6.67" width="30" height="6.67" fill="#DD0000"/><rect y="13.33" width="30" height="6.67" fill="#FFCE00"/></svg>',
  ru: '<svg class="flag" viewBox="0 0 30 20" aria-hidden="true"><rect width="30" height="6.67" fill="#fff"/><rect y="6.67" width="30" height="6.67" fill="#0039A6"/><rect y="13.33" width="30" height="6.67" fill="#D52B1E"/></svg>'
};
// Navigation mit Klarnamen + Adresse (Google Maps zeigt dann den Namen statt Koordinaten)
function routeUrl(name, address, lat, lon) {
  const q = [name, address].filter(Boolean).join(", ");
  const dest = q && address ? q : (lat != null ? `${lat},${lon}` : q);
  return "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(dest);
}
// Nur echte Web-Adressen zulassen (Schutz vor manipulierten Links aus OpenStreetMap, z. B. "javascript:")
function safeUrl(u) {
  if (!u) return "";
  let x = String(u).trim();
  if (!/^[a-z]+:/i.test(x)) x = "https://" + x;
  try { const p = new URL(x); return (p.protocol === "https:" || p.protocol === "http:") ? p.href : ""; } catch { return ""; }
}
const searchUrl = q => "https://www.google.com/search?q=" + encodeURIComponent(q);
const btnA = (href, icon, label, primary = false, ext = true) => `<a class="btn${primary ? " primary" : ""}" href="${esc(href)}"${ext ? ' target="_blank" rel="noopener"' : ""}>${ico(icon)}${label}</a>`;

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
const period = (f, to) => `${f[1]}.${f[0]}.–${to[1]}.${to[0]}.`;
function distKm(a, b) {
  const R = 6371, r = Math.PI / 180, dLat = (b.lat - a.lat) * r, dLon = (b.lon - a.lon) * r;
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}

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
  const now = Date.now(), times = w.hourly.time.map(x => new Date(x).valueOf());
  const i = times.findIndex(x => x > now) - 1;
  if (i < 6) return null;
  const p = w.hourly.pressure_msl;
  return { now: p[i], d3: p[i] - p[i - 3], d6: p[i] - p[i - 6] };
}
function trendText(tr) {
  if (!tr) return "–";
  const d = tr.d3;
  if (d <= -2) return t("tr_strongFall");
  if (d < -0.6) return t("tr_fall");
  if (d >= 2) return t("tr_strongRise");
  if (d > 0.6) return t("tr_rise");
  return t("tr_stable");
}
async function loadPegel() {
  try {
    const st = await getJSON(PEGEL + "BONN.json?includeTimeseries=true&includeCurrentMeasurement=true&includeCharacteristicValues=true");
    const ms = await getJSON(PEGEL + "BONN/W/measurements.json?start=P7D");
    let wt = null;
    const wts = (st.timeseries || []).find(x => x.shortname === "WT");
    if (wts && wts.currentMeasurement) wt = wts.currentMeasurement.value;
    const up = await Promise.allSettled([getJSON(PEGEL + "ANDERNACH/W/currentmeasurement.json"), getJSON(PEGEL + "ANDERNACH/W/measurements.json?start=PT24H")]);
    const W = (st.timeseries || []).find(x => x.shortname === "W") || {};
    S.pegel = {
      live: true, at: Date.now(), current: W.currentMeasurement, chars: W.characteristicValues || [],
      series: ms.map(m => ({ t: new Date(m.timestamp).valueOf(), v: m.value })), wt,
      andernach: up[0].status === "fulfilled" ? up[0].value : null,
      andernach24: up[1].status === "fulfilled" ? up[1].value.map(m => m.value) : null
    };
    store.set("pegel", S.pegel);
  } catch (e) {
    try { const d = await getJSON("data/pegel.json"); d.live = false; S.pegel = d; }
    catch { S.pegel = store.get("pegel", null); if (S.pegel) S.pegel.live = false; }
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
  const ago = h => { const x = now - h * 36e5; let best = p.series[0]; for (const m of p.series) { if (m.t <= x) best = m; else break; } return best.v; };
  const mw = ((p.chars || []).find(c => c.shortname === "MW") || {}).value;
  return { cur, d6: cur - ago(6), d24: cur - ago(24), mw, at: p.current ? new Date(p.current.timestamp) : new Date(now) };
}
function pegelLevelText(cm) {
  if (cm == null) return "";
  return t(cm < 150 ? "lv1" : cm < 250 ? "lv2" : cm < 400 ? "lv3" : cm < 550 ? "lv4" : cm < 650 ? "lv5" : "lv6");
}
function scoreRhein() {
  const w = S.weather.bonn, pi = pegelInfo(), tr = pressureTrend(w), why = [];
  let s = 6;
  if (tr) {
    if (tr.d3 < -0.6 && tr.d3 > -2.5) { s += 1; why.push("w_pressFallSlight"); }
    else if (tr.d3 <= -2.5) { s -= 1; why.push("w_pressFallStrong"); }
    else if (tr.d3 > 1.5) { s -= 1; why.push("w_pressRiseStrong"); }
    else why.push("w_pressStable");
  }
  if (pi) {
    if (pi.cur > 600) { s -= 4; why.push("w_flood"); }
    else if (pi.cur > 480) { s -= 2; why.push("w_high"); }
    if (pi.d24 > 40) { s -= 2; why.push("w_riseFast"); }
    else if (pi.d24 > 15) { s -= 1; why.push("w_rise"); }
    else if (pi.d24 < -5 && pi.cur < 480) { s += 1; why.push("w_fall"); }
  }
  if (w && w.current) {
    const ws = w.current.wind_speed_10m;
    if (ws > 35) { s -= 2; why.push("w_wind"); } else if (ws >= 8 && ws <= 22) { s += 0.5; }
    if (w.current.cloud_cover > 60) { s += 0.5; why.push("w_cloudy"); }
  }
  const ill = Astro.moonIllumination(new Date());
  if (ill.fraction > 0.95) { s += 0.5; why.push("w_full"); } else if (ill.fraction < 0.05) { s += 0.5; why.push("w_new"); }
  return { v: Math.round(clamp(s, 1, 10)), why: why.map(k => t(k)) };
}
function casterStatus(d = new Date()) {
  const c = S.caster;
  if (!c) return { open: null, text: t("c_noData") };
  const m = d.getMonth() + 1, wd = d.getDay(), min = d.getHours() * 60 + d.getMinutes();
  const iso = `${d.getFullYear()}-${String(m).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  for (const cl of (c.curated.closures || [])) if (iso >= cl.from && iso <= cl.to) return { open: false, hard: true, text: t("c_closed", { x: cl.note }) };
  if (wd === 3) return { open: false, hard: true, text: t("c_wed") };
  if (m === 2 && wd !== 0 && wd !== 6) return { open: false, hard: true, text: t("c_feb") };
  const h = (m >= 10 || m <= 2) ? c.curated.hours.winter : c.curated.hours.summer;
  if (min < h.entry[0]) return { open: true, text: t("c_openToday", { x: h.entryText }) };
  if (min <= h.entry[1]) return { open: true, text: t("c_entryUntil", { x: h.entryText.split("–")[1] }) };
  if (min < h.end) return { open: true, text: t("c_fishUntil", { x: h.endText }) };
  return { open: false, text: t("c_over", { x: h.entryText }) };
}
function scoreCaster() {
  const st = casterStatus(), w = S.weather.caster, tr = pressureTrend(w), why = [];
  if (st.hard) return { v: 0, why: [st.text] };
  let s = 7;
  if (tr) { if (Math.abs(tr.d3) < 1) { s += 1; why.push(t("w_pressStable")); } else if (tr.d3 < -2.5) { s -= 1; why.push(t("w_pressFallStrong")); } }
  if (w && w.current) {
    const T = w.current.temperature_2m;
    if (T >= 4 && T <= 16) { s += 0.5; why.push(t("w_trout")); }
    if (T > 24) { s -= 2; why.push(t("w_hot")); }
    if (w.current.precipitation > 2) { s -= 1; why.push(t("w_rainHeavy")); }
  }
  why.push(t("w_stock"));
  return { v: Math.round(clamp(s, 1, 10)), why };
}

/* ---------- Grundgerüst / Navigation ---------- */
const VIEWS = {};
function titles(v) {
  return {
    heute: [t("appName"), dateLong(new Date()) + " · Bonn"], rhein: [t("title_rhein"), t("sub_rhein")], caster: ["Angelpark Caster", t("sub_caster")],
    shops: [t("title_shops"), t("sub_shops")], lexikon: [t("title_lexikon"), t("sub_lexikon")], fangbuch: [t("title_fangbuch"), t("sub_fangbuch")]
  }[v];
}
function applyStatic() {
  document.querySelectorAll("[data-i18n]").forEach(el => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll("[data-i18n-label]").forEach(el => { el.setAttribute("aria-label", t(el.dataset.i18nLabel)); });
}
function go(view) {
  if (!titles(view)) view = "heute";
  S.view = view;
  document.querySelectorAll(".view").forEach(v => v.hidden = v.id !== "view-" + view);
  document.querySelectorAll(".tabs button").forEach(b => b.setAttribute("aria-current", b.dataset.go === view ? "page" : "false"));
  const [ti, sub] = titles(view);
  $("#pageTitle").textContent = ti;
  $("#pageSub").textContent = sub;
  render(view);
  if (location.hash !== "#" + view) history.replaceState(null, "", "#" + view);
  window.scrollTo(0, 0);
}
function render(view) { try { VIEWS[view](); } catch (e) { console.error(e); $("#view-" + view).innerHTML = card(notice(t("errorShow") + " " + esc(e.message), "bad")); } }

/* ---------- Heute ---------- */
VIEWS.heute = () => {
  const now = new Date(), w = S.weather.bonn, tr = pressureTrend(w);
  const sun = Astro.sunTimes(now, LOC.bonn.lat, LOC.bonn.lon), ill = Astro.moonIllumination(now);
  const sol = Astro.solunar(now, LOC.bonn.lat, LOC.bonn.lon);
  const r = scoreRhein(), c = scoreCaster(), cs = casterStatus();
  const scoreBox = (lbl, sc, view) => `<button class="score" data-go="${view}"><span class="lbl">${lbl}</span><span class="val">${sc.v}<small>/10</small></span><span class="bar"><i style="width:${sc.v * 10}%"></i></span><span class="note">${esc(sc.why.slice(0, 3).join(" · "))}</span></button>`;
  const cur = w && w.current;
  const win = [];
  if (sun.dawn && sun.sunrise) win.push({ start: sun.dawn, end: new Date(+sun.sunrise + 90 * 6e4), q: "top", label: t("dawn") });
  if (sun.sunset && sun.dusk) win.push({ start: new Date(+sun.sunset - 90 * 6e4), end: sun.dusk, q: "top", label: t("dusk") });
  sol.forEach(s => win.push({ start: s.start, end: s.end, q: s.kind === "major" ? "good" : "ok", label: t(s.label) }));
  win.sort((a, b) => a.start - b.start);
  const pi = pegelInfo(), hints = [];
  SCHONZEITEN.filter(s => inPeriod(now, s.from, s.to)).forEach(s => hints.push(notice(`${t("closedSeason")}: <b>${esc(pick(s.fish))}</b> (${period(s.from, s.to)})`)));
  if (pi && pi.cur > 550) hints.push(notice(t("flood", { cm: pi.cur }), "bad"));
  if (pi && pi.d24 > 30) hints.push(notice(t("riseFast", { cm: pi.d24 })));
  hints.push(notice("Caster: " + esc(cs.text), cs.open ? "info" : ""));
  const stale = w && w._stale ? notice(t("offlineWeather"), "info") : "";
  $("#view-heute").innerHTML =
    card(`<h2>${t("index")}</h2><div class="grid2">${scoreBox(t("rheinBonn"), r, "rhein")}${scoreBox(t("casterName"), c, "caster")}</div>`) +
    card(`<h2>${t("weatherBonn")}${cur ? " · " + esc(I18N.wmo(cur.weather_code)) : ""}</h2>${stale}${cur ? `<div class="grid3">
      ${stat(t("air"), num(cur.temperature_2m, 1) + " °C")}${stat(t("pressure"), num(cur.pressure_msl) + " hPa")}${stat(t("trend"), trendText(tr))}
      ${stat(t("wind"), num(cur.wind_speed_10m) + " " + t("kmh"))}${stat(t("gusts"), num(cur.wind_gusts_10m) + " " + t("kmh"))}${stat(t("rainToday"), num(w.daily.precipitation_probability_max[1]) + " %")}
      ${stat(t("sun"), t2(sun.sunrise) + "–" + t2(sun.sunset))}${stat(t("moon"), t("ph_" + Astro.phaseName(ill.phase)))}${stat(t("lit"), Math.round(ill.fraction * 100) + " %")}</div>` : '<div class="skeleton"></div>'}`) +
    card(`<h2>${t("biteTimes")}</h2>${win.map(x => `<div class="list-item">${chip(t("q_" + x.q), x.q === "top" ? "solid" : "")}<div class="grow"><b>${t2(x.start)} – ${t2(x.end)}</b><span class="small muted">${esc(x.label)}</span></div></div>`).join("")}
      <p class="small muted">${t("biteNote")}</p>`) +
    card(`<h2>${t("hintsToday")}</h2>${hints.join("")}`) +
    weekCard() +
    `<div class="btns"><button class="btn primary" data-go="fangbuch">${ico("camera")}${t("logCatch")}</button></div>`;
};
function weekCard() {
  const w = S.weather.bonn;
  if (!w || !w.daily) return "";
  const rows = w.daily.time.slice(1, 8).map((d, i) => {
    const k = i + 1, dt = new Date(d);
    return `<tr><td><b>${dt.toLocaleDateString(L(), { weekday: "short" })}</b> ${dt.getDate()}.${dt.getMonth() + 1}.</td><td>${esc(I18N.wmo(w.daily.weather_code[k]))}</td><td>${num(w.daily.temperature_2m_min[k])}–${num(w.daily.temperature_2m_max[k])} °C</td><td>${num(w.daily.precipitation_probability_max[k])} %</td><td>${num(w.daily.wind_speed_10m_max[k])}</td></tr>`;
  }).join("");
  return card(`<h2>${t("week")}</h2><div class="tbl-wrap"><table><thead><tr><th>${t("day")}</th><th>${t("wx")}</th><th>${t("temp")}</th><th>${t("rain")}</th><th>${t("windKmh")}</th></tr></thead><tbody>${rows}</tbody></table></div>`);
}

/* ---------- Rhein ---------- */
function sparkline(series) {
  if (!series || series.length < 2) return "";
  const W = 340, H = 120, P = 8, vs = series.map(s => s.v), mn = Math.min(...vs), mx = Math.max(...vs), span = Math.max(mx - mn, 10);
  const t0 = series[0].t, t1 = series[series.length - 1].t;
  const step = Math.max(1, Math.floor(series.length / 200));
  const pts = series.filter((_, i) => i % step === 0 || i === series.length - 1).map(s => `${(P + (s.t - t0) / (t1 - t0) * (W - 2 * P)).toFixed(1)},${(H - P - (s.v - mn) / span * (H - 2 * P)).toFixed(1)}`).join(" ");
  const last = pts.split(" ").pop().split(",");
  return `<svg class="chart" viewBox="0 0 ${W} ${H + 18}" role="img" aria-label="${t("pegelBonn")}: ${mn}–${mx} cm">
    <polyline points="${pts}" fill="none" stroke="#2E7D4F" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
    <circle cx="${last[0]}" cy="${last[1]}" r="5" fill="#1E5B3A"/>
    <text x="${P}" y="${H + 14}" font-size="11" fill="#4A5F52">${t("sevenAgo")}</text><text x="${W - P}" y="${H + 14}" font-size="11" fill="#4A5F52" text-anchor="end">${t("now")}</text>
    <text x="${W - P}" y="14" font-size="11" fill="#4A5F52" text-anchor="end">${t("max")} ${mx} cm</text><text x="${W - P}" y="${H - 2}" font-size="11" fill="#4A5F52" text-anchor="end">${t("min")} ${mn} cm</text></svg>`;
}
const MONTH_FISH = [
  { key: "Zander", n: { de: "Zander", ru: "Судак" }, months: [1,2,3,6,7,8,9,10,11,12], info: { de: "Schonzeit 01.04.–31.05. · Mindestmaß 40 cm", ru: "Запрет 01.04.–31.05. · мин. размер 40 см" },
    w: { de: "Gummifisch 10–14 cm langsam am Grund führen, Buhnenköpfe in der Dämmerung", ru: "Виброхвост 10–14 см медленно по дну, оголовки бун в сумерках" },
    s: { de: "Nachts und in der Dämmerung, Wobbler und Gummifisch an Strömungskanten", ru: "Ночью и в сумерках, воблеры и виброхвосты на границе течения" } },
  { key: "Barsch", n: { de: "Flussbarsch", ru: "Речной окунь" }, months: [1,2,3,4,5,6,7,8,9,10,11,12], info: { de: "keine Schonzeit, kein Mindestmaß in NRW", ru: "без запрета и мин. размера в NRW" },
    w: { de: "Senkblei-Montage (Dropshot) und kleine Gummifische an Steinpackungen und in Hafenbecken", ru: "Дропшот и мелкая резина у каменной наброски и в гаванях" },
    s: { de: "Spinner, kleine Wobbler und Gummiköder in den Buhnenfeldern", ru: "Вертушки, мелкие воблеры и резина между бунами" } },
  { key: "Rapfen", n: { de: "Rapfen", ru: "Жерех" }, months: [4,5,6,7,8,9,10], info: { de: "kein Mindestmaß in NRW", ru: "без мин. размера в NRW" },
    s: { de: "Schlanke Metallköder weit werfen und schnell einholen, Strömung hinter den Buhnen", ru: "Узкие металлические приманки далеко и быстро, течение за бунами" } },
  { key: "Hecht", n: { de: "Hecht", ru: "Щука" }, months: [1,2,5,6,7,8,9,10,11,12], info: { de: "Schonzeit 15.02.–30.04. · Mindestmaß 45 cm", ru: "Запрет 15.02.–30.04. · мин. размер 45 см" },
    w: { de: "Ruhige Altarme und Hafeneinfahrten, große Gummifische", ru: "Тихие старицы и входы в гавани, крупная резина" },
    s: { de: "Krautkanten in Altarmen, Spinner-Köder", ru: "Края водорослей в старицах, спиннербейты" } },
  { key: "Barbe", n: { de: "Barbe", ru: "Усач" }, months: [4,5,6,7,8,9,10], info: { de: "Schonzeit 15.05.–15.06. · Mindestmaß 35 cm", ru: "Запрет 15.05.–15.06. · мин. размер 35 см" },
    s: { de: "Grundangeln mit Futterkorb, Frühstücksfleisch oder Maden in der Strömung", ru: "Донная ловля с кормушкой, ветчина или опарыш на течении" } },
  { key: "Wels", n: { de: "Wels", ru: "Сом" }, months: [5,6,7,8,9,10], info: { de: "kein Mindestmaß in NRW", ru: "без мин. размера в NRW" },
    s: { de: "Nachts mit Tauwurmbündel oder Köderfisch, kräftiges Gerät", ru: "Ночью на пучок выползков или рыбку, мощная снасть" } },
  { key: "Aal", n: { de: "Aal", ru: "Угорь" }, months: [4,5,6,7,8,9], info: { de: "Rheinhauptstrom geschont 01.10.–01.03. · Mindestmaß 50 cm", ru: "Запрет в русле Rhein 01.10.–01.03. · мин. размер 50 см" },
    s: { de: "Nachts mit Tauwurm auf Grund, warme Gewitternächte", ru: "Ночью на выползка на дне, тёплые грозовые ночи" } },
  { key: "Brassen", n: { de: "Brassen & Rotauge", ru: "Лещ и плотва" }, months: [1,2,3,4,5,6,7,8,9,10,11,12], info: { de: "keine Schonzeit", ru: "без запрета" },
    w: { de: "Futterkorb in ruhigen Hafenbecken, Maden", ru: "Кормушка в тихих гаванях, опарыш" },
    s: { de: "Futterkorb in den Buhnenfeldern", ru: "Кормушка между бунами" } }
];
const SPOTS = [
  { n: "Bonn · Rheinaue", addr: "Rheinaue, Bonn", note: { de: "Buhnenfelder, viel Platz, gut zu Fuß", ru: "Буны, много места, удобно пешком" } },
  { n: "Bonn-Beuel · Rheinufer", addr: "Rheinufer Beuel, 53225 Bonn", note: { de: "Steinpackung, Barsch & Zander", ru: "Каменная наброска, окунь и судак" } },
  { n: "Bonn · Graurheindorf", addr: "Graurheindorf, 53117 Bonn", note: { de: "Hafeneinfahrt, ruhiges Wasser bei Hochwasser", ru: "Вход в гавань, тихая вода в паводок" } },
  { n: "Königswinter", addr: "Rheinallee, 53639 Königswinter", note: { de: "Strömungskanten, Buhnen", ru: "Границы течения, буны" } },
  { n: "Bad Honnef · Insel Grafenwerth", addr: "Insel Grafenwerth, 53604 Bad Honnef", note: { de: "Seitenarm, ruhig, Hecht & Barsch", ru: "Протока, тихо, щука и окунь" } },
  { n: "Mondorf · Siegmündung", addr: "Siegmündung, 53859 Niederkassel-Mondorf", note: { de: "Mündungsbereich, Rapfen & Barsch", ru: "Устье, жерех и окунь" } }
];
VIEWS.rhein = () => {
  const pi = pegelInfo(), p = S.pegel, now = new Date(), m = now.getMonth() + 1, winter = m >= 10 || m <= 3;
  const ch = pi ? (pi.d6 > 0 ? "+" : "") + pi.d6 + " cm / 6 h" : "";
  let upHtml = "";
  if (p && p.andernach) {
    const a24 = p.andernach24 && p.andernach24.length ? p.andernach.value - p.andernach24[0] : null;
    upHtml = row(t("upstream"), `${p.andernach.value} cm${a24 != null ? ` (${a24 > 0 ? "+" : ""}${a24} cm / 24 h)` : ""}`) + `<p class="small muted">${t("upstreamNote")}</p>`;
  }
  const fish = MONTH_FISH.filter(f => f.months.includes(m)).map(f => {
    const sch = SCHONZEITEN.find(s => s.key === f.key);
    const closed = sch && inPeriod(now, sch.from, sch.to);
    const tip = pick(winter ? (f.w || f.s) : (f.s || f.w));
    return `<div class="list-item"><div class="grow"><b>${esc(pick(f.n))}</b><span class="small muted">${esc(pick(f.info))}</span><span class="small">${closed ? t("closedNow") : esc(tip)}</span></div>${closed ? chip(t("closedChip"), "warn") : chip(t("inSeason"))}</div>`;
  }).join("");
  const spots = SPOTS.map(s => `<div class="list-item">${ico("map")}<div class="grow"><b>${esc(s.n)}</b><span class="small muted">${esc(pick(s.note))}</span></div><a class="btn" style="flex:0 0 auto;min-height:40px" href="${esc(routeUrl("", s.addr))}" target="_blank" rel="noopener">${t("route")}</a></div>`).join("");
  $("#view-rhein").innerHTML =
    card(pi ? `<div style="display:flex;justify-content:space-between;align-items:flex-end;gap:8px"><div><span class="small muted"><b>${t("pegelBonn")}</b> · ${t2(pi.at)} ${t("oclock")}${p.live ? "" : " (" + t("saved") + ")"}</span><div class="big-num">${pi.cur} cm</div></div>${chip((pi.d6 > 0 ? "↗ " : pi.d6 < 0 ? "↘ " : "→ ") + ch)}</div>
      ${sparkline(p.series)}
      <div class="grid3">${stat(t("h24"), (pi.d24 > 0 ? "+" : "") + pi.d24 + " cm")}${stat(t("mean"), pi.mw ? pi.mw + " cm" : "–")}${stat(t("water"), p.wt != null ? num(p.wt, 1) + " °C" : t("na"))}</div>
      ${notice(pegelLevelText(pi.cur), pi.cur > 550 ? "bad" : "info")}${upHtml}`
      : `<h2>${t("pegelBonn")}</h2><div class="skeleton"></div><p class="small muted">${t("pegelLoading")}</p>`) +
    card(`<h2>${t("targetFish", { m: now.toLocaleDateString(L(), { month: "long" }) })}</h2>${fish}`) +
    card(`<h2>${t("spots")}</h2>${spots}<p class="small muted">${t("spotsNote")}</p>`) +
    card(`<h2>${t("need")}</h2><p>${t("needText")}</p>`) +
    `<p class="small muted center">${t("dataRhein")}</p>`;
};

/* ---------- Caster ---------- */
VIEWS.caster = () => {
  const c = S.caster;
  if (!c) { $("#view-caster").innerHTML = card('<div class="skeleton"></div>'); return; }
  const ru = I18N.lang === "ru", cu = c.curated, st = casterStatus(), sc = c.scraped || {}, m = new Date().getMonth() + 1;
  const prices = cu.prices.map(p => `<div class="list-item"><div class="grow"><b>${esc(I18N.ruText(p.teich))}</b><span class="small muted">${esc(I18N.ruText(p.besatz))}</span></div><b style="font-family:Fredoka,system-ui;font-size:1.25rem;color:${p.locked ? "#4A5F52" : "#1E5B3A"}">${esc(p.preis)}</b></div>`).join("");
  const ht = (ru && cu.hoursTable_ru) || cu.hoursTable;
  const hrs = (h, x) => `<h3 style="color:#2E7D4F">${x}</h3>` + h.map(r => row(esc(r[0]), esc(r[1]))).join("");
  const rules = (ru && cu.rules_ru) || cu.rules;
  const news = (sc.notes || []).map(n => notice(esc(n))).join("");
  const fmtD = x => new Date(x).toLocaleDateString(L());
  const changed = sc.changed_at ? chip(t("siteChanged", { x: fmtD(sc.changed_at) }), "warn") : "";
  const live = (sc.sections || []).map(s => `<details class="lex-entry"><summary>${esc(s.title)}</summary><div class="body">${s.lines.map(l => `<p>${esc(l)}</p>`).join("")}</div></details>`).join("");
  $("#view-caster").innerHTML =
    card(`<div class="chips">${chip(st.open ? t("c_open") : t("c_closedChip"), st.open ? "solid" : "warn")}${chip(m >= 10 || m <= 2 ? t("winterTimes") : t("summerTimes"))}</div>
      <p><b>${esc(st.text)}</b></p>
      <div class="btns">${btnA("tel:+4924432773", "phone", t("call"), true, false)}${btnA(routeUrl("", LOC.caster.address), "map", t("route"))}${btnA("https://www.forellenzucht-caster.de/", "web", t("website"))}</div>`) +
    card(`<h2>${t("newsTitle")}</h2>${cu.notes.map(n => notice(esc(ru && n.text_ru ? n.text_ru : n.text), n.kind || "")).join("")}${news}
      <div class="chips">${changed}</div>
      <p class="small muted">${t("sourceChecked", { x: sc.fetched_at ? new Date(sc.fetched_at).toLocaleString(L(), { dateStyle: "short", timeStyle: "short" }) : "–" })}</p>`) +
    card(`<h2>${t("prices")}</h2>${prices}<p class="small muted">${esc(ru && cu.pricesNote_ru ? cu.pricesNote_ru : cu.pricesNote)}</p>`) +
    card(`<h2>${t("hours")}</h2>${hrs(ht.winter, t("winter"))}${hrs(ht.summer, t("summer"))}${ht.extra.map(x => `<p class="small">${esc(x)}</p>`).join("")}`) +
    card(`<h2>${t("rulesTitle")}</h2><div class="chips">${rules.must.map(x => chip("✓ " + esc(x))).join("")}</div><div class="chips">${rules.allowed.map(x => chip(esc(x))).join("")}</div><div class="chips">${rules.forbidden.map(x => chip("✕ " + esc(x), "warn")).join("")}</div>`) +
    card(`<h2>${t("weatherPond")}</h2>${casterWeather()}`) +
    (live ? card(`<h2>${t("origTexts")}</h2><p class="small muted">${t("origNote")}</p>${live}`) : "");
};
function casterWeather() {
  const w = S.weather.caster;
  if (!w || !w.current) return '<div class="skeleton"></div>';
  const c = w.current;
  return `<div class="grid3">${stat(t("air"), num(c.temperature_2m, 1) + " °C")}${stat(t("wx"), esc(I18N.wmo(c.weather_code)))}${stat(t("wind"), num(c.wind_speed_10m) + " " + t("kmh"))}${stat(t("pressure"), num(c.pressure_msl) + " hPa")}${stat(t("trend"), trendText(pressureTrend(w)))}${stat(t("rainToday"), num(w.daily.precipitation_probability_max[1]) + " %")}</div>`;
}

/* ---------- Läden ---------- */
VIEWS.shops = () => {
  const d = S.shops, from = S.myPos || LOC.bonn;
  const head = `<label class="search">${ico("search")}<span class="sr">${t("searchShop")}</span><input id="shopSearch" type="search" placeholder="${t("searchShop")}" value="${esc(S.shopQuery)}"></label>
    <div class="filters">${[["alle", "f_all"], ["offen", "f_open"], ["25", "f_25"], ["50", "f_50"], ["rhein", "f_rhein"]].map(([k, l]) => `<button class="filter" data-shopf="${k}" aria-pressed="${S.shopFilter === k}">${t(l)}</button>`).join("")}</div>
    <div class="btns"><button class="btn" id="locBtn">${ico("pin")}${S.myPos ? t("myPosOn") : t("myPos")}</button></div>`;
  if (!d || !d.shops) { $("#view-shops").innerHTML = head + card('<div class="skeleton"></div>'); bindSearch("shopSearch", v => S.shopQuery = v, VIEWS.shops); return; }
  let list = d.shops.map(s => ({ ...s, km: distKm(from, s), st: OH.status(s.opening_hours, new Date(), I18N.lang) }));
  const q = S.shopQuery.trim().toLowerCase();
  if (q) list = list.filter(s => (s.name + " " + (s.city || "") + " " + (s.street || "")).toLowerCase().includes(q));
  if (S.shopFilter === "offen") list = list.filter(s => s.st && s.st.open);
  if (S.shopFilter === "25") list = list.filter(s => s.km <= 25);
  if (S.shopFilter === "50") list = list.filter(s => s.km <= 50);
  if (S.shopFilter === "rhein") list = list.filter(s => s.rheinkarte);
  list.sort((a, b) => a.km - b.km);
  const items = list.slice(0, 150).map(s => {
    const status = s.st ? chip(t(s.st.key, { t: s.st.t || "", d: s.st.d || "" }), s.st.open ? "solid" : "") : chip(s.opening_hours ? t("hoursBelow") : t("hoursUnknown"), "warn");
    const addr = [s.street, [s.postcode, s.city].filter(Boolean).join(" ")].filter(Boolean).join(", ");
    const who = [s.name, s.city].filter(Boolean).join(" ");
    // Immer drei Knöpfe: fehlt Telefon oder Webseite, wird im Internet danach gesucht
    const tel = (s.phone || "").split(/[;,]/)[0].replace(/[^+\d]/g, "");
    const phoneBtn = tel.length >= 5 ? btnA("tel:" + tel, "phone", t("call"), false, false) : btnA(searchUrl(who + " Telefon"), "phone", t("findNumber"));
    const web = safeUrl(s.website);
    const webBtn = web ? btnA(web, "web", t("website")) : btnA(searchUrl(who), "search", t("searchWeb"));
    return card(`<div style="display:flex;justify-content:space-between;gap:8px"><div class="grow" style="display:flex;flex-direction:column;gap:2px"><b>${esc(s.name)}</b><span class="small muted">${esc(addr || t("addrMap"))}</span></div><b class="small muted" style="white-space:nowrap">${num(s.km)} km</b></div>
      <div class="chips">${status}${s.rheinkarte ? chip(t("rheinCards")) : ""}${s.kind === "outdoor" ? chip(t("outdoor")) : ""}</div>
      ${s.opening_hours ? `<p class="small">${esc(OH.pretty(s.opening_hours, I18N.lang, t("oh_closedDay")))}</p>` : `<p class="small muted">${t("hoursMissing")}</p>`}
      <div class="btns">${phoneBtn}${btnA(routeUrl(s.name, addr, s.lat, s.lon), "map", t("route"))}${webBtn}</div>`);
  }).join("");
  $("#view-shops").innerHTML = head + `<p class="small muted">${t("found", { n: list.length, x: S.myPos ? t("fromMe") : "Bonn" })}</p>` + (items || card(`<p>${t("noHits")}</p>`)) +
    `<p class="small muted center">${t("shopsData", { x: d.updated ? new Date(d.updated).toLocaleDateString(L()) : "–" })}</p>`;
  bindSearch("shopSearch", v => S.shopQuery = v, VIEWS.shops);
};
function bindSearch(id, set, rerender) {
  const i = $("#" + id);
  if (!i) return;
  i.addEventListener("input", e => { set(e.target.value); clearTimeout(i._t); i._t = setTimeout(() => { rerender(); const n = $("#" + id); n.focus(); n.setSelectionRange(n.value.length, n.value.length); }, 300); });
}

/* ---------- Lexikon ---------- */
const lx = (e, k) => { const o = e[I18N.lang] || e.de; return o[k] != null ? o[k] : e.de[k]; };
VIEWS.lexikon = () => {
  const Lx = S.lex;
  if (!Lx) { $("#view-lexikon").innerHTML = card('<div class="skeleton"></div>'); return; }
  const cats = Lx.categories.map(c => `<button class="cat" data-lexcat="${c.id}" aria-pressed="${S.lexCat === c.id}">${ico(c.icon)}<b>${esc(pick(c.name))}</b><span class="small muted">${t("entries", { n: Lx.entries.filter(e => e.cat === c.id).length })}</span></button>`).join("");
  const q = S.lexQuery.trim().toLowerCase();
  let list = Lx.entries;
  if (S.lexCat) list = list.filter(e => e.cat === S.lexCat);
  if (q) list = list.filter(e => JSON.stringify(e).toLowerCase().includes(q));
  const day = Math.floor(Date.now() / 864e5), fishes = Lx.entries.filter(e => e.cat === "fische"), fod = fishes[day % fishes.length];
  const facts = e => (lx(e, "facts") || []).map(f => row(esc(f[0]), esc(f[1]))).join("");
  const entry = e => { const st = lx(e, "steps"); return `<details class="lex-entry"${q && list.length < 4 ? " open" : ""}><summary><span>${esc(lx(e, "title"))}${e.latin ? ` <i class="small muted">${esc(e.latin)}</i>` : ""}</span></summary><div class="body"><p>${esc(lx(e, "text"))}</p>${facts(e)}${st ? `<ol style="margin:0;padding-left:20px;display:flex;flex-direction:column;gap:4px">${st.map(s => `<li>${esc(s)}</li>`).join("")}</ol>` : ""}</div></details>`; };
  const showList = S.lexCat || q;
  $("#view-lexikon").innerHTML =
    `<label class="search">${ico("search")}<span class="sr">${t("searchLex")}</span><input id="lexSearch" type="search" placeholder="${t("searchLex")}" value="${esc(S.lexQuery)}"></label>
    <div class="grid2">${cats}</div>` +
    (showList ? card(`<h2>${S.lexCat ? esc(pick(Lx.categories.find(c => c.id === S.lexCat).name)) : t("results")} <span class="small muted">(${list.length})</span></h2>${list.map(entry).join("") || `<p>${t("nothing")}</p>`}`)
      : card(`<div style="display:flex;gap:12px;align-items:center"><img src="icons/perch.svg" alt="" width="90" height="63"><div><span class="small" style="color:#2E7D4F;font-weight:800">${t("fishOfDay")}</span><h2>${esc(lx(fod, "title"))}</h2><i class="small muted">${esc(fod.latin || "")}</i></div></div><p>${esc(lx(fod, "text"))}</p>${facts(fod)}`) + lawCard());
  bindSearch("lexSearch", v => S.lexQuery = v, VIEWS.lexikon);
};
function lawCard() {
  const Lx = S.lex, now = new Date();
  const rows = Lx.nrw.map(r => { const act = r.from && inPeriod(now, r.from, r.to); return `<tr><td><b>${esc(pick(r.fish))}</b></td><td>${r.from ? period(r.from, r.to) : "–"}${act ? " " + chip(t("nowChip"), "warn") : ""}${r.note ? `<br><span class="small muted">${esc(pick(r.note))}</span>` : ""}</td><td>${r.mm ? r.mm + " cm" : "–"}</td></tr>`; }).join("");
  return card(`<h2>${t("lawTitle")}</h2><div class="tbl-wrap"><table><thead><tr><th>${t("fish")}</th><th>${t("closedSeasonCol")}</th><th>${t("minSize")}</th></tr></thead><tbody>${rows}</tbody></table></div>
    <p class="small"><b>${t("protectedAll")}</b> ${esc(pick(Lx.protected).join(", "))}</p><p class="small muted">${t("lawSource")}</p>`);
}

/* ---------- Fangbuch ---------- */
const FISH_OPTS = [["Flussbarsch", "Речной окунь"], ["Zander", "Судак"], ["Hecht", "Щука"], ["Regenbogenforelle", "Радужная форель"], ["Lachsforelle", "Лососевая форель"], ["Bachsaibling", "Ручьевой голец"],
  ["Karpfen", "Карп"], ["Rapfen", "Жерех"], ["Barbe", "Усач"], ["Wels", "Сом"], ["Aal", "Угорь"], ["Döbel", "Голавль"], ["Brassen", "Лещ"], ["Rotauge", "Плотва"], ["Schleie", "Линь"], ["Stör", "Осётр"], ["Sonstiges", "Другое"]];
const WATERS = [["Rhein", "Rhein"], ["Angelpark Caster", "Angelpark Caster"], ["Anderes Gewässer", "Другой водоём"]];
const fishName = de => { const f = FISH_OPTS.find(x => x[0] === de); return f && I18N.lang === "ru" ? f[1] : de; };
const waterName = de => { const f = WATERS.find(x => x[0] === de); return f && I18N.lang === "ru" ? f[1] : de; };
VIEWS.fangbuch = () => {
  const list = store.get("catches", []);
  const stats = (() => {
    if (!list.length) return "";
    const by = k => { const m = {}; list.forEach(c => { if (c[k]) m[c[k]] = (m[c[k]] || 0) + 1; }); return Object.entries(m).sort((a, b) => b[1] - a[1])[0]; };
    const bf = by("fish"), bb = by("bait"), bw = by("water");
    const pr = list.filter(c => c.cond && c.cond.pressure).map(c => c.cond.pressure);
    const hrs = {}; list.forEach(c => { const h = new Date(c.at).getHours(); hrs[h] = (hrs[h] || 0) + 1; });
    const bh = Object.entries(hrs).sort((a, b) => b[1] - a[1])[0];
    return card(`<h2>${t("stats")}</h2><div class="grid2">${stat(t("catches"), list.length)}${stat(t("topFish"), bf ? esc(fishName(bf[0])) : "–")}${stat(t("topBait"), bb ? esc(bb[0]) : "–")}${stat(t("topWater"), bw ? esc(waterName(bw[0])) : "–")}${stat(t("topHour"), bh ? bh[0] + ":00–" + (+bh[0] + 1) + ":00" : "–")}${stat(t("avgPress"), pr.length ? num(pr.reduce((a, b) => a + b, 0) / pr.length) + " hPa" : "–")}</div>`);
  })();
  const items = list.slice().reverse().map(c => `<div class="list-item">${c.photo ? `<img class="catch-img" src="${c.photo}" alt="${esc(fishName(c.fish))}">` : `<div class="catch-img" style="display:flex;align-items:center;justify-content:center">${ico("fish")}</div>`}<div class="grow"><b>${esc(fishName(c.fish))}${c.len ? " · " + esc(c.len) + " cm" : ""}${c.weight ? " · " + esc(c.weight) + " g" : ""}</b><span class="small muted">${new Date(c.at).toLocaleString(L(), { dateStyle: "medium", timeStyle: "short" })} · ${esc(waterName(c.water || ""))}</span><span class="small">${esc(c.bait || "")}${c.cond ? ` · ${c.cond.temp != null ? num(c.cond.temp, 1) + " °C · " : ""}${c.cond.pressure ? num(c.cond.pressure) + " hPa" : ""}${c.cond.pegel ? " · " + c.cond.pegel + " cm" : ""}${c.cond.moonKey ? " · " + t("ph_" + c.cond.moonKey) : ""}` : ""}</span>${c.note ? `<span class="small muted">${esc(c.note)}</span>` : ""}</div><button class="icon-btn" style="background:#FDECEA" data-del="${c.id}" aria-label="${t("delCatch")}"><svg viewBox="0 0 24 24" style="stroke:#A3271A" aria-hidden="true">${ICO.trash}</svg></button></div>`).join("");
  $("#view-fangbuch").innerHTML =
    card(`<h2>${t("newCatch")}</h2>
      <div class="photo-drop" id="photoDrop"><span id="photoPh">${ico("camera")}</span></div>
      <div class="btns"><label class="btn primary">${ico("camera")}${t("takePhoto")}<input type="file" accept="image/*" capture="environment" id="photoCam" class="sr"></label><label class="btn">${ico("image")}${t("pickPhoto")}<input type="file" accept="image/*" id="photoGal" class="sr"></label></div>
      <div class="grid2"><label class="f">${t("fishType")}<select id="fFish">${FISH_OPTS.map(f => `<option value="${f[0]}">${I18N.lang === "ru" ? f[1] : f[0]}</option>`).join("")}</select></label>
      <label class="f">${t("waterBody")}<select id="fWater">${WATERS.map(w => `<option value="${w[0]}">${I18N.lang === "ru" ? w[1] : w[0]}</option>`).join("")}</select></label>
      <label class="f">${t("length")}<input id="fLen" type="number" inputmode="decimal" min="0"></label>
      <label class="f">${t("weight")}<input id="fWeight" type="number" inputmode="numeric" min="0"></label></div>
      <label class="f">${t("bait")}<input id="fBait" type="text" placeholder="${t("baitPh")}"></label>
      <label class="f">${t("note")}<input id="fNote" type="text" placeholder="${t("notePh")}"></label>
      ${notice(t("autoCond"), "info")}
      <div id="photoMsg"></div>
      <div class="btns"><button class="btn primary" id="saveCatch">${t("saveCatch")}</button></div>`) +
    stats +
    card(`<h2>${t("myCatches")}</h2>${items || `<p class="muted">${t("noCatches")}</p>`}${list.length ? `<div class="btns"><button class="btn" id="exportCatch">${t("exportLog")}</button></div>` : ""}`) +
    `<p class="small muted center">${t("localOnly")}</p>`;
  let photo = null;
  const onPhoto = fromCamera => async e => {
    const f = e.target.files[0]; if (!f) return;
    photo = await shrink(f, 640);
    if (photo) $("#photoDrop").innerHTML = `<img src="${photo}" alt="${t("preview")}">`;
    if (fromCamera && store.get("savePhotos", true)) {
      savePhotoCopy(f);
      $("#photoMsg").innerHTML = notice(t("photoSaved"), "info");
    }
  };
  $("#photoCam").addEventListener("change", onPhoto(true));
  $("#photoGal").addEventListener("change", onPhoto(false));
  $("#saveCatch").addEventListener("click", () => {
    const water = $("#fWater").value, w = water === "Angelpark Caster" ? S.weather.caster : S.weather.bonn, pi = pegelInfo();
    const c = { id: Date.now(), at: new Date().toISOString(), fish: $("#fFish").value, water, len: $("#fLen").value, weight: $("#fWeight").value, bait: $("#fBait").value.trim(), note: $("#fNote").value.trim(), photo,
      cond: { temp: w && w.current ? w.current.temperature_2m : null, pressure: w && w.current ? w.current.pressure_msl : null, wind: w && w.current ? w.current.wind_speed_10m : null, pegel: water === "Rhein" && pi ? pi.cur : null, moonKey: Astro.phaseName(Astro.moonIllumination(new Date()).phase) } };
    const l = store.get("catches", []); l.push(c);
    if (!store.set("catches", l)) { c.photo = null; l[l.length - 1] = c; if (!store.set("catches", l)) { alert(t("storeFull")); return; } alert(t("storeNoPhoto")); }
    VIEWS.fangbuch();
  });
  document.querySelectorAll("[data-del]").forEach(b => b.addEventListener("click", () => {
    if (!confirm(t("confirmDel"))) return;
    store.set("catches", store.get("catches", []).filter(c => String(c.id) !== b.dataset.del)); VIEWS.fangbuch();
  }));
  const ex = $("#exportCatch");
  if (ex) ex.addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(store.get("catches", []), null, 1)], { type: "application/json" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "fangbuch-" + new Date().toISOString().slice(0, 10) + ".json"; a.click();
  });
};
// Originalfoto zusätzlich herunterladen -> landet im Ordner "Download" und in der Galerie
function savePhotoCopy(file) {
  try {
    const d = new Date(), p = n => String(n).padStart(2, "0");
    const ext = (file.name && file.name.includes(".")) ? file.name.split(".").pop() : "jpg";
    const a = document.createElement("a");
    a.href = URL.createObjectURL(file);
    a.download = `${t("fileName")}_${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}_${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}.${ext}`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 60000);
  } catch (e) { console.warn(e); }
}
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

/* ---------- Optionen (Zahnrad) ---------- */
function openModal(html) { $("#modalBody").innerHTML = html; $("#modal").hidden = false; $("#modalClose").focus(); }
function closeModal() { $("#modal").hidden = true; }
function options() {
  const langBtn = (code, label) => `<button class="lang-btn" data-lang="${code}" aria-pressed="${I18N.lang === code}">${FLAG[code]}<span>${label}</span>${I18N.lang === code ? ico("check", "ico chk") : ""}</button>`;
  openModal(`<h2>${t("optTitle")}</h2>
    <h3>${t("language")}</h3>
    <div class="lang-list">${langBtn("de", t("lang_de"))}${langBtn("ru", t("lang_ru"))}</div>
    <label class="toggle"><span>${t("bigFont")}</span><input type="checkbox" id="bigToggle" ${document.body.classList.contains("big") ? "checked" : ""}></label>
    <label class="toggle"><span>${t("savePhotos")}</span><input type="checkbox" id="photoToggle" ${store.get("savePhotos", true) ? "checked" : ""}></label>
    <p class="small muted">${t("savePhotosNote")}</p>
    <div class="btns"><button class="btn" id="optRefresh">${t("refreshNow")}</button></div>
    <h3>${t("install")}</h3><p class="small">${t("installText")}</p>
    <h3>${t("sources")}</h3><p class="small">${t("sourcesText")}</p>
    <p class="small muted">${t("disclaimer")}</p>`);
  $("#bigToggle").addEventListener("change", e => { document.body.classList.toggle("big", e.target.checked); store.set("big", e.target.checked); });
  $("#photoToggle").addEventListener("change", e => store.set("savePhotos", e.target.checked));
  $("#optRefresh").addEventListener("click", () => { closeModal(); refresh(); });
}
function setLang(code) {
  I18N.set(code);
  applyStatic();
  go(S.view);
  options(); // Menü in neuer Sprache neu zeichnen, Auswahl markiert
}

/* ---------- Start ---------- */
document.addEventListener("click", e => {
  const lb = e.target.closest("[data-lang]");
  if (lb) { setLang(lb.dataset.lang); return; }
  const g = e.target.closest("[data-go]");
  if (g) { e.preventDefault(); closeModal(); go(g.dataset.go); return; }
  const f = e.target.closest("[data-shopf]");
  if (f) { S.shopFilter = f.dataset.shopf; VIEWS.shops(); return; }
  const lc = e.target.closest("[data-lexcat]");
  if (lc) { S.lexCat = S.lexCat === lc.dataset.lexcat ? null : lc.dataset.lexcat; VIEWS.lexikon(); return; }
  if (e.target.closest("#optionsBtn")) { options(); return; }
  if (e.target.closest("#locBtn")) {
    if (S.myPos) { S.myPos = null; VIEWS.shops(); return; }
    navigator.geolocation && navigator.geolocation.getCurrentPosition(p => { S.myPos = { lat: p.coords.latitude, lon: p.coords.longitude }; VIEWS.shops(); }, () => alert(t("posFail")), { timeout: 10000 });
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
  applyStatic();
  const start = (location.hash || "#heute").slice(1);
  S.pegel = store.get("pegel", null);
  ["bonn", "caster"].forEach(k => { S.weather[k] = store.get("w_" + k, null); });
  S.caster = store.get("caster", null); S.shops = store.get("shops", null); S.lex = store.get("lex", null);
  go(start);
  await refresh();
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});
  setInterval(() => { if (document.visibilityState === "visible") refresh(); }, 30 * 60000);
})();
