const fs = require("fs");
const L = fs.readFileSync("index.html", "utf8").split(/\r?\n/);
const s = L.findIndex(l => /ansPractice\(q\)/.test(l));
for (let i = s + 130; i < s + 175; i++) console.log((i + 1) + ": " + L[i].slice(0, 190));
