const fs = require("fs");
const html = fs.readFileSync("index.html", "utf8");
const start = html.indexOf("const RAW = [");
const end = html.indexOf("\n];", start);
const rows = new Function("return " + html.slice(start + "const RAW = ".length, end + 2))();
console.log("RAW rows:", rows.length);
const bySci = {}, byEn = {}, byId = {};
const slug = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
for (const r of rows) {
  (bySci[r.sci] = bySci[r.sci] || []).push(r.en);
  const e = slug(r.en); (byEn[e] = byEn[e] || []).push(r.sci);
  const i = slug(r.en); (byId[i] = byId[i] || []).push(r.en);
}
const dupSci = Object.entries(bySci).filter(([, v]) => v.length > 1);
console.log("duplicate scientific names:", dupSci.length);
for (const [s, v] of dupSci) console.log("  ", s, "->", v.join(" | "));
const dupEn = Object.entries(byEn).filter(([, v]) => v.length > 1);
console.log("duplicate english-name slugs:", dupEn.length);
for (const [e, v] of dupEn) console.log("  ", e, "->", v.join(" | "));
const blankAr = rows.filter(r => !r.ar).length;
console.log("authored ar:", rows.length - blankAr, "blank ar:", blankAr);
const uniqSci = new Set(rows.map(r => r.sci));
console.log("unique scientific names:", uniqSci.size);
