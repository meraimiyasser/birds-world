/* Replace the pooled (but still timeout-bound) card hydration with lazy
   viewport-driven hydration: 168 guide cards must not mean 168 photo lookups
   before the first card is even visible.

   Also repairs the flattened "$$" in this function: String.replace treats "$$"
   in a replacement string as an escaped dollar sign, so the previous patch wrote
   a single $ here. A function replacer is used below to keep replacements literal. */
const fs = require("fs");
const F = "index.html";
const write = process.argv.includes("--write");
const src = fs.readFileSync(F, "utf8");

const OLD = `async function hydrateCards(root) {
  if (!root) return;
  const ids = uniq($("[data-id]", root).map(n => n.dataset.id));
  /* A guide of 150 species means 150 photo lookups. Six at a time keeps the first
     paint ahead of the browser's per-host stream limit instead of queueing behind it. */
  let i = 0;
  const worker = async () => {
    while (i < ids.length) {
      if (!root.isConnected) return;
      const id = ids[i++];
      const b = byId(id), box = root.querySelector('.spec[data-id="' + id + '"] .thumb');
      if (b && box) await loadPhoto(box, b);
    }
  };
  await Promise.all(Array.from({ length: Math.min(6, ids.length) }, worker));
}`;

const NEW = `let photoIO = null;
function hydrateCards(root) {
  if (!root) return;
  if (photoIO) { photoIO.disconnect(); photoIO = null; }
  const ids = uniq($$("[data-id]", root).map(n => n.dataset.id));
  const want = [];
  for (const id of ids) {
    const b = byId(id), box = root.querySelector('.spec[data-id="' + id + '"] .thumb');
    if (b && box) want.push([box, b]);
  }
  if (!want.length) return;
  /* A guide of 168 species is 168 photo lookups, each of which can wait on a network
     timeout. Resolve only what the keeper can see, plus a screen of margin, and let
     the rest load as they scroll in. */
  if (!("IntersectionObserver" in window)) { want.forEach(([box, b]) => loadPhoto(box, b)); return; }
  photoIO = new IntersectionObserver((entries, obs) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      obs.unobserve(e.target);
      const hit = want.find(w => w[0] === e.target);
      if (hit && hit[0].isConnected) loadPhoto(hit[0], hit[1]).catch(() => {});
    }
  }, { rootMargin: "600px 0px" });
  want.forEach(([box]) => photoIO.observe(box));
}`;

if (!src.includes(OLD)) throw new Error("hydrateCards block not found");
const out = src.replace(OLD, () => NEW);
console.log("lines:", src.split("\n").length, "->", out.split("\n").length,
  "| double-dollar:", (out.match(/\$\$/g) || []).length);
if (!write) { console.log("DRY RUN"); return; }
fs.writeFileSync(F, out);
console.log("written");
