/* Third pass, from live measurement:
   1. The co-housing words sit on either side of the bird names in a real question
      ("هل يعيش الزرزور مع الكوكاتيل؟"), so the adjacency pattern never fired.
   2. Arabic broken plurals ("صقور" for "صقر") are the same animal to a keeper but
       not to a token comparison, so name matching now accepts a short stem difference. */
const fs = require("fs");
const F = "index.html";
const write = process.argv.includes("--write");
let src = fs.readFileSync(F, "utf8");
const rep = (a, b, label) => {
  if (!src.includes(a)) throw new Error("anchor missing: " + label);
  if (src.split(a).length > 2) throw new Error("anchor not unique: " + label);
  src = src.replace(a, () => b);
};

rep("يعيش مع|يسكن مع|يتعايش|هل يضر|ضار ب|mix with|house with|live with|safe with)",
  "يعيش.{0,40} مع |يسكن.{0,40} مع |يتعايش.{0,40} مع |هل يضر|ضار ب|mix with|house with|live with|safe with)",
  "co-housing pattern");

rep(`    /* market names are direct hits: resolve them before any fuzzy path, and keep
       every one the sentence contains so a comparison has both birds */
    const qset = new Set(this.toks(q));
    const qtoks = this.toks(q);
    /* Clitics differ between "الببغاء" and the stored "ببغاء", so name words are
       compared de-prefixed. rank() is where the sentence itself decides: a name
       written out whole (negative score) beats a generic one-word alias, and two
       named birds come back in the order the keeper wrote them in. */
    const rank = b => {
      let best = 1e6;
      for (const n of [b.en, b.ar].filter(Boolean)) {
        const nt = this.norm(n), ws = this.toks(n);
        if (!ws.length || ws.length > 3) continue;
        const i = qtoks.indexOf(ws[0]);
        if (nt.length > 3 && ws.length > 1 && t.includes(nt)) best = Math.min(best, -1e6 + t.indexOf(nt));
        if (i >= 0 && ws.every(w => qset.has(w))) best = Math.min(best, ws.length > 1 ? i - 1e3 : i);
      }
      return best;
    };`,
  `    const qtoks = this.toks(q);
    /* A keeper writes the plural a word, not a stem: "صقور" is "صقر" with one letter
       more. Two letters of drift still separates that from a genuinely different
       species, so only short Arabic words are compared this loosely. */
    const near = (a, w) => a === w || (/[\\u0600-\\u06FF]/.test(a) && Math.min(a.length, w.length) >= 3 &&
      Math.abs(a.length - w.length) <= 2 && (a.startsWith(w) || w.startsWith(a)));
    /* rank() is where the sentence decides. Clitics differ between "الببغاء" and the
       stored "ببغاء", so name words are compared de-prefixed; a name written out whole
       scores far ahead (negative) so it beats a generic one-word alias, and the score
       is the word position, which keeps two named birds in the order they were asked. */
    const rank = b => {
      let best = 1e6;
      for (const n of [b.en, b.ar].filter(Boolean)) {
        const nt = this.norm(n), ws = this.toks(n);
        if (!ws.length || ws.length > 3) continue;
        if (nt.length > 3 && ws.length > 1 && t.includes(nt)) best = Math.min(best, -1e6 + t.indexOf(nt));
        const at = ws.map(w => qtoks.findIndex(x => near(w, x)));
        if (at.every(i => i >= 0)) best = Math.min(best, Math.min.apply(null, at) + (ws.length > 1 ? -1e3 : 0));
      }
      return best;
    };`, "rank block");

console.log("ok, lines:", src.split("\n").length);
if (!write) { console.log("DRY RUN"); return; }
fs.writeFileSync(F, src);
console.log("written");
