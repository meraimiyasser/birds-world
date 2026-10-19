/* Repairs the Arabic key insertion: the previous pass anchored on "search_rec:"
   and hit an English line. Now the AR dictionary line is the one whose value
   contains Arabic script, and the stray Arabic line inside the EN block is
   deleted. Asserts the AR line sits after the EN line before writing. */
const fs = require("fs");
const AR = /[؀-ۿ]/;
let lines = fs.readFileSync("index.html", "utf8").split("\n");
const isSynth = l => /^\s*synth:"/.test(l);
const enLine = lines.findIndex(l => isSynth(l) && !AR.test(l));
let stray = -1;
for (let i = 0; i < lines.length; i++) {
  if (/^\s*hear:"/.test(lines[i]) && AR.test(lines[i]) && (enLine < 0 || i < enLine)) stray = i;
}
const enHas = lines[enLine].includes('hear:"Hear this bird"');
lines = lines.filter((_, i) => i !== stray);
const arLine = lines.findIndex((l, i) => isSynth(l) && AR.test(l) && i > enLine);
if (enLine < 0 || arLine < 0 || !enHas) throw new Error("locate failed en=" + enLine + " ar=" + arLine + " enHas=" + enHas);
const already = lines.slice(arLine, arLine + 3).some(l => /^\s*hear:"/.test(l) && AR.test(l));
if (!already) {
  lines.splice(arLine + 1, 0,
    '    hear:"استمع إلى هذا الطائر", aud_real:"تسجيل حقيقي · {s}", ' +
    'aud_synth:"لا تسجيل حرّ لهذا النوع — ما سمعته نداءً مُحاكى مُولَّدًا من حجمه وفصيلته، وليس صوته.",');
}
fs.writeFileSync("index.html", lines.join("\n"), "utf8");
const ins = lines[arLine + 1];
console.log("stray removed:", stray >= 0 ? "line " + (stray + 1) : "none",
  "| en line", enLine + 1, "| ar line", arLine + 1, "| inserted:", ins.slice(0, 12));
console.log("arabic codepoints:", Array.from(ins).slice(10, 16).map(c => c.codePointAt(0).toString(16)).join(" "));
