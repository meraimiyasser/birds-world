const fs = require("fs");
const L = fs.readFileSync("index.html", "utf8").split(/\r?\n/);
L.forEach((l, i) => { if (/ai_practice|ai_triage:|ai_facts:|PRACNAME/.test(l)) console.log((i + 1) + ": " + l.trim().slice(0, 150)); });
