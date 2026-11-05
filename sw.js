/* Service Worker: App-Dateien offline, Daten immer zuerst aus dem Netz */
const VERSION = "bb-v1";
const SHELL = ["./", "index.html", "css/style.css", "js/app.js", "js/astro.js", "js/oh.js", "manifest.webmanifest",
  "icons/icon.svg", "icons/perch.svg", "icons/icon-192.png", "icons/icon-512.png", "icons/apple-touch-icon.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL))); self.skipWaiting(); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return; // externe APIs nicht cachen
  // Netz zuerst (damit Updates sofort ankommen), offline aus dem Cache
  e.respondWith(fetch(e.request).then(r => {
    if (r.ok) { const copy = r.clone(); caches.open(VERSION).then(c => c.put(e.request, copy)); }
    return r;
  }).catch(() => caches.match(e.request).then(r => r || caches.match("index.html"))));
});
