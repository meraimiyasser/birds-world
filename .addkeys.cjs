/* Adds the three Arabic keys for the card-level "hear this bird" button.
   Insertion by line index instead of an Arabic match string: hand-typed Arabic
   anchors have silently missed (or worse, hit the wrong line) before. */
const fs = require("fs");
const src = fs.readFileSync("index.html", "utf8");
const lines = src.split("\n");
const en = lines.findIndex(l => l.includes('synth:"Modelled call'));
let idx = -1;
for (let i = en + 1; i < lines.length; i++) {
  if (lines[i].includes("search_rec:") && lines[i].includes("synth:")) { idx = i; break; }
}
if (idx < 0 || idx === en) throw new Error("AR synth line not located (en=" + en + " idx=" + idx + ")");
const add = '    hear:"استمع إلى هذا الطائر", aud_real:"تسجيل حقيقي · {s}", ' +
  'aud_synth:"لا تسجيل حرّ لهذا النوع — ما سمعته نداءً مُحاكى مُولَّدًا من حجمه وفصيلته، وليس صوته.",';
lines.splice(idx + 1, 0, add);
fs.writeFileSync("index.html", lines.join("\n"), "utf8");
console.log("en line", en + 1, "| ar line", idx + 1, "| inserted after it");
console.log("codepoints of first word:", [...add.match(/"[^"]+"/)[1]].slice(0, 6).map(c => c.codePointAt(0).toString(16)).join(" "));
