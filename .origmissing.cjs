/* Scratch: every RAW origin phrase that has no ORIGIN_AR entry, because locVal
   can only translate a whole phrase it knows. */
const fs = require("fs");
const html = fs.readFileSync("index.html", "utf8");
const start = html.indexOf("const RAW = [");
const end = html.indexOf("\n];", start);
const rows = new Function("return " + html.slice(start + "const RAW = ".length, end + 2))();
const b = html.indexOf("ORIGIN_AR");
const blk = html.slice(b, html.indexOf("\n  };", b));
const known = new Set([...blk.matchAll(/"([^"]+)":/g)].map(m => m[1]));
const missing = [...new Set(rows.map(r => r.origin))].filter(o => !known.has(o));
fs.writeFileSync(".origmissing.txt", missing.join("\n"), "utf8");
console.log("distinct origins:", new Set(rows.map(r => r.origin)).size, "| untranslated:", missing.length);
