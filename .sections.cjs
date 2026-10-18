/* Section map for index.html. A section header is a line of: slash-star, a long
   dash run, the label, then star-slash — dashes come first and the label last,
   so one regex finds them and each label owns the lines up to the next header.
   Handy when the file is five and a half thousand lines and you want to say
   "atlas view, lines 5098-5213". Run: ELECTRON_RUN_AS_NODE=1 Qoder.exe .sections.cjs */
const fs = require("fs"), path = require("path");
const file = process.argv[2] || "index.html";
const L = fs.readFileSync(path.join(__dirname, file), "utf8").split("\n");
const RE = /^\/\* -+ (.+?) \*\/$/;
const marks = [];
L.forEach((l, i) => { const m = l.match(RE); if (m) marks.push({ n: i + 1, label: m[1].trim() }); });
const rows = marks.map((m, i) => {
  const to = i + 1 < marks.length ? marks[i + 1].n - 1 : L.length;
  return { from: m.n, to, lines: to - m.n + 1, label: m.label };
});
const w = String(rows[0] ? rows[0].to : 0).length;
console.log(file + ": " + L.length + " lines, " + fs.statSync(path.join(__dirname, file)).size + " B, " + rows.length + " sections\n");
for (const r of rows) console.log(String(r.from).padStart(w) + "-" + String(r.to).padEnd(w) + "  " + String(r.lines).padStart(w) + "  " + r.label);
