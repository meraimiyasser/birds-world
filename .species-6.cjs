/* Sixth pass, measured: the bare consonant frame let "كناري" match "كونور"
   (both frame to كنر), so a noise question about a Sun Conure also named a
   Canary. The frame must agree AND the shorter word have to sit inside the
   longer one letter for letter — which is exactly what a broken plural does:
   صقر is inside صقور, while كناري is not inside كونور. */
const fs = require("fs");
const F = "index.html";
const write = process.argv.includes("--write");
let src = fs.readFileSync(F, "utf8");
const A = `    const frame = w => (/^[\\u0600-\\u06FF]+$/.test(w) ? w.replace(/[اوى]/g, "") : w);
    const near = (a, w) => a === w || (a.length >= 3 && w.length >= 3 &&
      Math.abs(a.length - w.length) <= 3 && frame(a) === frame(w) && frame(a).length >= 2);`;
const B = `    const frame = w => (/^[\\u0600-\\u06FF]+$/.test(w) ? w.replace(/[اوى]/g, "") : w);
    const inside = (s, t) => { let i = 0; for (const c of t) { if (i < s.length && s[i] === c) i++; } return i === s.length; };
    const near = (a, w) => a === w || (a.length >= 3 && w.length >= 3 &&
      Math.abs(a.length - w.length) <= 3 && frame(a) === frame(w) && frame(a).length >= 2 &&
      (inside(a, w) || inside(w, a)));`;
if (!src.includes(A)) throw new Error("near anchor missing");
if (src.split(A).length > 2) throw new Error("near anchor not unique");
src = src.replace(A, () => B);

const C = `       whose names differ by a whole syllable ("كوكال" / "كوكاتيل") stay apart, which
       a general edit-distance test did not guarantee. */`;
const D = `       whose names differ by a whole syllable ("كوكال" / "كوكاتيل") stay apart, which
       a general edit-distance test did not guarantee. The frame is still not enough on
       its own — كناري and كونور share one — so the shorter word must also sit inside
       the longer, letter for letter. */`;
if (src.includes(C)) src = src.replace(C, () => D); else console.log("note: frame comment not found");
console.log("ok, lines:", src.split("\n").length);
if (!write) { console.log("DRY RUN"); return; }
fs.writeFileSync(F, src);
console.log("written");
