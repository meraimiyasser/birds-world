/* Inserts the wave-four AI.ALIAS block after the last existing alias line.
   Splices by index (no String.replace) so Arabic text is copied byte for byte. */
const fs = require("fs");
const FILE = "index.html";
const src = fs.readFileSync(FILE, "utf8");
const block = fs.readFileSync(".alias-wave4.txt", "utf8").replace(/\s+$/, "");

if (src.includes('"Cacatua moluccensis": [')) { console.log("ALREADY APPLIED"); process.exit(0); }

const anchor = src.indexOf('"Columba inca": ["');
if (anchor < 0) { console.log("ANCHOR NOT FOUND"); process.exit(1); }
const eol = src.indexOf("\n", anchor);
if (src.slice(anchor, eol).trim().endsWith(",")) { console.log("anchor already has a comma, aborting"); process.exit(1); }

const out = src.slice(0, eol) + ",\n" + block + src.slice(eol);
fs.writeFileSync(FILE, out);
console.log("inserted", block.split("\n").length, "alias lines at index", eol);
console.log("size", src.length, "->", out.length);
