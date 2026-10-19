/* Checks AI.ALIAS: every scientific name must exist in RAW, no alias string may
   point at two different species, and every wave-four species should have at least
   one short keeper word. Usage: node .aliascheck.cjs [fileWithProposedEntries] */
const fs = require("fs");
const src = fs.readFileSync("index.html", "utf8");

function braceSlice(from) {
  let d = 0, i = from;
  for (; i < src.length; i++) {
    const c = src[i];
    if (c === "{") d++;
    else if (c === "}") { d--; if (!d) return src.slice(from, i + 1); }
  }
  return "";
}

const aStart = src.indexOf("ALIAS: {") + "ALIAS:".length;
const ALIAS = (0, eval)("(" + braceSlice(aStart) + ")");
const rStart = src.indexOf("const RAW = ") + "const RAW = ".length;
const RAW = (0, eval)(src.slice(rStart, src.indexOf("\n];", rStart) + 2));

const sci = new Set(RAW.map(r => r.sci));
const byStr = {};
for (const [s, list] of Object.entries(ALIAS)) {
  for (const a of list) (byStr[a] = byStr[a] || []).push(s);
}
const collisions = Object.entries(byStr).filter(([, v]) => v.length > 1);
const missingSci = Object.keys(ALIAS).filter(s => !sci.has(s));

console.log("RAW rows:", RAW.length, "| ALIAS keys:", Object.keys(ALIAS).length,
  "| alias strings:", Object.keys(byStr).length);
console.log("collisions:", collisions.length, JSON.stringify(collisions));
console.log("alias keys not in RAW:", missingSci.length, JSON.stringify(missingSci));

if (process.argv[2]) {
  const prop = fs.readFileSync(process.argv[2], "utf8");
  const P = (0, eval)("({" + prop + "})");
  const dup = Object.entries(P).filter(([s]) => ALIAS[s]);
  console.log("proposed:", Object.keys(P).length, "| already present:", dup.map(([s]) => s));
  const clash = [];
  const merged = { ...byStr };
  for (const [s, list] of Object.entries(P)) {
    for (const a of list) {
      const cur = merged[a] || [];
      if (cur.length && cur[0] !== s) clash.push([a, cur[0], s]);
      merged[a] = cur.concat(s);
    }
    if (!sci.has(s)) console.log("PROPOSED SCI NOT IN RAW:", s);
  }
  console.log("proposed collisions:", clash.length, JSON.stringify(clash));
  const noAr = Object.entries(P).filter(([, l]) => !l.some(a => /[\u0600-\u06FF]/.test(a)));
  console.log("proposed with no Arabic alias:", noAr.length, JSON.stringify(noAr.map(([s]) => s)));
}
