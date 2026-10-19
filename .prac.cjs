const fs = require("fs");
const L = fs.readFileSync("index.html", "utf8").split(/\r?\n/);
const s = L.findIndex(l => /PRAC\s*[:=]\s*\[/.test(l));
for (let i = s; i < s + 30; i++) console.log((i + 1) + ": " + L[i].trim().slice(0, 210));
