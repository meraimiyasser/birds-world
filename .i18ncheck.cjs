/* i18n parity + duplicate-key check for the two language dicts.
   Quoted values are stripped first, otherwise text like "Import failed:" inside
   a value reads as a key. Run: ELECTRON_RUN_AS_NODE=1 Qoder.exe .i18ncheck.cjs */
const fs = require("fs"), path = require("path");
const L = fs.readFileSync(path.join(__dirname, "index.html"), "utf8").split("\n");
const find = re => L.findIndex(l => re.test(l));
const e = find(/^\s*en:\s*\{/), a = find(/^\s*ar:\s*\{/);
const end = L.findIndex((l, i) => i > a && /^\};/.test(l));
const scrub = t => t.replace(/"(?:\\.|[^"\\])*"/g, '""').replace(/'(?:\\.|[^'\\])*'/g, "''");
const keyRe = /([A-Za-z_][A-Za-z0-9_]*):/g;
const count = t => { const m = [...scrub(t).matchAll(keyRe)].map(x => x[1]); const c = new Map(); m.forEach(k => c.set(k, (c.get(k) || 0) + 1)); return c; };
const EN = count(L.slice(e + 1, a).join("\n")), AR = count(L.slice(a + 1, end).join("\n"));
const dup = m => [...m].filter(x => x[1] > 1).map(x => x[0] + " x" + x[1]);
console.log("en line " + (e + 1) + ", ar line " + (a + 1) + ", dict end " + (end + 1));
console.log("EN keys " + EN.size + "  dupes: " + (JSON.stringify(dup(EN)) || "[]"));
console.log("AR keys " + AR.size + "  dupes: " + (JSON.stringify(dup(AR)) || "[]"));
const eo = [...EN.keys()].filter(k => !AR.has(k)), ao = [...AR.keys()].filter(k => !EN.has(k));
console.log("EN-only: " + (eo.join(", ") || "none"));
console.log("AR-only: " + (ao.join(", ") || "none"));
/* every tr("k") in the source must exist in both dicts */
const used = [...new Set([...L.join("\n").matchAll(/tr\("([a-z0-9_]+)"/gi)].map(x => x[1]))];
console.log("tr() calls: " + used.length + " | missing in EN: " + (used.filter(k => !EN.has(k)).join(", ") || "none") +
  " | missing in AR: " + (used.filter(k => !AR.has(k)).join(", ") || "none"));
