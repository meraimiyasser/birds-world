/* Scratch: which RAW rows collapse onto one scientific species? Mirrors the
   app's sciBase/isDomesticForm rule and prints every base that has more than
   one row, so a claimed species count can be checked by hand. */
const fs = require("fs");
const html = fs.readFileSync("index.html", "utf8");
const start = html.indexOf("const RAW = [");
const end = html.indexOf("\n];", start);
const rows = new Function("return " + html.slice(start + "const RAW = ".length, end + 2))();
const DOM_WORD = /^(?:domestic|domestica|domesticus)$/i;
const DOM_PAREN = /\s*\((?:domestic|domestica|domesticus)\)/i;
const words = s => String(s).replace(/\s+/g, " ").trim().split(" ");
const isForm = s => DOM_PAREN.test(s) || (words(s).length >= 3 && DOM_WORD.test(words(s).slice(-1)[0]));
const sciBase = s => {
  if (DOM_PAREN.test(s)) return s.replace(DOM_PAREN, "").trim();
  const w = words(s);
  return w.length >= 3 && DOM_WORD.test(w[w.length - 1]) ? w.slice(0, -1).join(" ") : w.join(" ");
};
const m = new Map();
for (const r of rows) {
  const k = sciBase(r.sci).toLowerCase();
  if (!m.has(k)) m.set(k, []);
  m.get(k).push(r.en + " [" + r.sci + "]");
}
const dup = [...m].filter(([, v]) => v.length > 1);
const out = ["rows: " + rows.length, "unique sci strings: " + new Set(rows.map(r => r.sci.toLowerCase())).size,
  "distinct bases: " + m.size, "domestic-form rows: " + rows.filter(r => isForm(r.sci)).length, "",
  "bases with more than one row:"];
for (const [k, v] of dup) out.push("  " + k + "  <-  " + v.join(" / "));
fs.writeFileSync(".bases.txt", out.join("\n"), "utf8");
console.log(out.slice(0, 4).join(" | "));
