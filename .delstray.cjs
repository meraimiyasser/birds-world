/* Deletes the Arabic key line that landed inside the ENGLISH dictionary: the
   earlier pass anchored on "search_rec:" and matched an English line, so the
   Arabic block was spliced in at the wrong place. Duplicate keys take the last
   value, which would have shown Arabic strings in English mode. */
const fs = require("fs");
const AR = /[؀-ۿ]/;
let lines = fs.readFileSync("index.html", "utf8").split("\n");
const arSynth = lines.findIndex(l => /^\s*synth:"/.test(l) && AR.test(l));
const bad = [];
lines.forEach((l, i) => { if (i < arSynth && /^\s*hear:"/.test(l) && AR.test(l)) bad.push(i); });
if (bad.length !== 1) throw new Error("expected exactly one stray line, found " + bad.length + " (ar synth " + arSynth + ")");
lines.splice(bad[0], 1);
fs.writeFileSync("index.html", lines.join("\n"), "utf8");
console.log("removed stray EN line", bad[0] + 1, "| AR block starts at", arSynth);
