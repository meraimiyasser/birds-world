"use strict";
/* Birds World — app shell + API/media caching */
/* Bump SHELL whenever index.html changes in a way an offline copy must not miss
   (a new species wave, a rebuilt Sound ID screen). Activation deletes every
   other bw-shell-* cache, so installed copies re-fetch the shell once online. */
const SHELL = "bw-shell-v7";
const RUNTIME = "bw-runtime-v1";
const ASSETS = ["./", "./index.html", "./manifest.webmanifest", "./icon.svg"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(SHELL).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== SHELL && k !== RUNTIME) await caches.delete(k);
    await self.clients.claim();
  })());
});

self.addEventListener("message", e => {
  if (e.data && e.data.type === "SKIP_WAITING") self.skipWaiting();
});

const HOSTS = ["en.wikipedia.org", "commons.wikimedia.org", "xeno-canto.org", "upload.wikimedia.org",
  "sonomorpho.academy", "api.gbif.org", "query.wikidata.org", "www.wikidata.org"];
const isAPI = url => HOSTS.includes(url.hostname);
const MAX_RUNTIME = 500;

/* Keep the image/API cache bounded: entries are stored oldest-first. */
async function stash(cache, req, res) {
  await cache.put(req, res).catch(() => null);
  const keys = await cache.keys();
  if (keys.length > MAX_RUNTIME) {
    for (const k of keys.slice(0, keys.length - MAX_RUNTIME)) await cache.delete(k);
  }
}

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  if (req.mode === "navigate") {
    e.respondWith((async () => {
      try { return await fetch(req); }
      catch { return await caches.match("./index.html") || Response.error(); }
    })());
    return;
  }

  /* stale-while-revalidate for remote reference data and imagery */
  if (isAPI(url) || url.protocol === "https:") {
    e.respondWith((async () => {
      const cache = await caches.open(RUNTIME);
      const hit = await cache.match(req);
      const refresh = fetch(req).then(res => {
        if (res && (res.ok || res.type === "opaque")) stash(cache, req, res.clone());
        return res;
      }).catch(() => null);
      if (hit) { e.waitUntil(refresh); return hit; }
      const net = await refresh;
      if (net) return net;
      if (req.destination === "image") {
        const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4 3"><rect width="4" height="3" fill="%23e2e8f0"/></svg>';
        return new Response(svg, { headers: { "Content-Type": "image/svg+xml" } });
      }
      return Response.error();
    })());
    return;
  }

  /* app shell: network-first so edits appear immediately, cache keeps it offline */
  e.respondWith((async () => {
    const cache = await caches.open(SHELL);
    const fresh = await fetch(req).then(res => {
      if (res && res.ok) cache.put(req, res.clone()).catch(() => null);
      return res;
    }).catch(() => null);
    if (fresh) return fresh;
    const hit = await cache.match(req);
    if (hit) return hit;
    if (req.mode === "navigate") { const shell = await cache.match("./index.html"); if (shell) return shell; }
    return Response.error();
  })());
});
