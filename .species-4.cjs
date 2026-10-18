/* Fourth pass, from live measurement:
   1. Arabic broken plurals change an internal vowel ("صقر" -> "صقور"), which a
      prefix test cannot see, so name words are now compared by edit distance.
   2. "هل تصيب الببائيات الكناري؟" asks about contagion but the group intent only
      listed nouns (عدوى، ينتقل، ناقل…), so the answer lost the disease section. */
const fs = require("fs");
const F = "index.html";
const write = process.argv.includes("--write");
let src = fs.readFileSync(F, "utf8");
const rep = (a, b, label) => {
  if (!src.includes(a)) throw new Error("anchor missing: " + label);
  if (src.split(a).length > 2) throw new Error("anchor not unique: " + label);
  src = src.replace(a, () => b);
};

rep(`    const near = (a, w) => a === w || (/[\\u0600-\\u06FF]/.test(a) && Math.min(a.length, w.length) >= 3 &&
      Math.abs(a.length - w.length) <= 2 && (a.startsWith(w) || w.startsWith(a)));`,
  `    const ed = (a, w) => {
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
      ed(a, w) <= (Math.min(a.length, w.length) >= 5 ? 2 : 1));`, "near matcher");

rep("|يعيش.{0,40} مع |يسكن.{0,40} مع |يتعايش.{0,40} مع |هل يضر|ضار ب|mix with|house with|live with|safe with)",
  "|يعيش.{0,40} مع |يسكن.{0,40} مع |يتعايش.{0,40} مع |هل يضر|ضار ب|تصيب|يصيب|بمرض|mix with|house with|live with|safe with)",
  "contagion words");

console.log("ok, lines:", src.split("\n").length);
if (!write) { console.log("DRY RUN"); return; }
fs.writeFileSync(F, src);
console.log("written");
