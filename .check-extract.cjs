const fs = require("fs");
const path = process.argv[2];
const html = fs.readFileSync(path, "utf8");
const m = html.match(/<script>([\s\S]*?)<\/script>/);
if (!m) { console.log("NO SCRIPT FOUND"); process.exit(1); }
fs.writeFileSync(path + ".check.js", m[1]);
console.log("extracted " + m[1].split("\n").length + " lines");
