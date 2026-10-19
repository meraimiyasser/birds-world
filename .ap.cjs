const fs = require("fs");
const L = fs.readFileSync("index.html", "utf8").split(/\r?\n/);
const s = L.findIndex(l => /ansPractice\(q\)/.test(l));
for (let i = s; i < s + 58; i++) console.log((i + 1) + ": " + L[i].replace(/^/, "").slice(0, 200));
