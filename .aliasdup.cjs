const fs = require("fs");
const L = fs.readFileSync("index.html", "utf8").split(/\r?\n/);
const s = L.findIndex(l => /ALIAS\s*[:=]/.test(l));
let e = s;
for (let i = s + 1; i < L.length; i++) { if (/^\s{0,4}\};?\s*$/.test(L[i])) { e = i; break; } }
const keys = [];
for (let i = s; i <= e; i++) { const m = L[i].match(/"([^"]+)":\s*\[/g); if (m) m.forEach(x => keys.push(x.split('"')[1])); }
const t = new Map(); keys.forEach(k => t.set(k, (t.get(k) || 0) + 1));
console.log("block lines", s + 1, "→", e + 1, "| entries:", keys.length, "| unique:", t.size);
console.log("duplicates:", [...t].filter(([, n]) => n > 1).map(([k, n]) => k + " x" + n).join(", ") || "none");
console.log("malacca:", t.get("Lonchura malacca"), "| gouldiae:", t.get("Chloebia gouldiae"), "| canaria:", t.get("Serinus canaria domestica"));
