/* Fifth pass — the edit-distance matcher was too generous and the "whole name"
   test was ambiguous, both measured in the live app:

   "ما الفرق بين الكوكاتيل والبدجي؟" returned Greater Coucal, because its
   Wikidata-backed Arabic name "كوكال صيني" sat within 2 edits of "كوكاتيل" and
   "صيني" within 1 of the stop word "بين"; and rank() < 0 also caught the merely
   multi-word positional scores, so that wrong bird short-circuited the alias path.

   Name words are now compared on the Arabic stem with the long vowels removed
   ("صقر"/"صقور" both reduce to "صر"), which is what a broken plural does, while
   "كوكال"/"كوكاتيل" and "صيني"/"بين" stay different. The verbatim-name class is
   tested against its own score band. */
const fs = require("fs");
const F = "index.html";
const write = process.argv.includes("--write");
let src = fs.readFileSync(F, "utf8");
const rep = (a, b, label) => {
  if (!src.includes(a)) throw new Error("anchor missing: " + label);
  if (src.split(a).length > 2) throw new Error("anchor not unique: " + label);
  src = src.replace(a, () => b);
};

rep(`    const ed = (a, w) => {
      if (Math.abs(a.length - w.length) > 2) return 9;
      let prev = Array.from({ length: w.length + 1 }, (_, i) => i);
      for (let i = 1; i <= a.length; i++) {
        const cur = [i];
        for (let j = 1; j <= w.length; j++) cur[j] = Math.min(cur[j - 1] + 1, prev[j] + 1,
          prev[j - 1] + (a[i - 1] === w[j - 1] ? 0 : 1));
        prev = cur;
      }
      return prev[w.length];
    };
    const near = (a, w) => a === w || (/[\\u0600-\\u06FF]/.test(a) && Math.min(a.length, w.length) >= 3 &&
      ed(a, w) <= (Math.min(a.length, w.length) >= 5 ? 2 : 1));`,
  `    /* an Arabic broken plural inserts a long vowel inside the root, so compare the
       consonantal frame: "صقر" and "صقور" both reduce to "صر". Two different birds
       whose names differ by a whole syllable ("كوكال" / "كوكاتيل") stay apart, which
       a general edit-distance test did not guarantee. */
    const frame = w => (/^[\\u0600-\\u06FF]+$/.test(w) ? w.replace(/[اوى]/g, "") : w);
    const near = (a, w) => a === w || (a.length >= 3 && w.length >= 3 &&
      Math.abs(a.length - w.length) <= 3 && frame(a) === frame(w) && frame(a).length >= 2);`,
  "stem frame");

rep(`    const whole = named.filter(b => rank(b) < 0);`,
  `    const whole = named.filter(b => rank(b) < -1e5);`, "whole score band");

console.log("ok, lines:", src.split("\n").length);
if (!write) { console.log("DRY RUN"); return; }
fs.writeFileSync(F, src);
console.log("written");
