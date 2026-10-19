const fs = require("fs");
const L = fs.readFileSync("index.html", "utf8").split(/\r?\n/);
const s = L.findIndex(l => /ansPractice\(q\)/.test(l));
let depth = 0, end = -1;
for (let i = s; i < L.length; i++) { depth += (L[i].match(/\{/g) || []).length - (L[i].match(/\}/g) || []).length; if (i > s && depth <= 0) { end = i; break; } }
console.log("ansPractice spans", s + 1, "→", end + 1);
for (let i = end - 14; i <= end; i++) console.log((i + 1) + ": " + L[i].slice(0, 190));
