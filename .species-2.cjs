/* Second pass on the expansion:
   1. ORIGIN_AR entries for every origin string the new rows introduced (and one
      wrong existing translation), so Arabic mode never shows half-translated text.
   2. findSpecies: a name written out whole in the sentence now beats a generic
      one-word alias, and several named birds come back in the keeper's own order.
   Run with --write to apply. */
const fs = require("fs");
const F = "index.html";
const write = process.argv.includes("--write");
let src = fs.readFileSync(F, "utf8");
const rep = (a, b, label) => {
  if (!src.includes(a)) throw new Error("anchor missing: " + label);
  if (src.split(a).length > 2) throw new Error("anchor not unique: " + label);
  src = src.replace(a, () => b);
};

/* ------------------------------------------------------------ 1. origins --- */
const ORIG = {
  "Central and South America": "أمريكا الوسطى والجنوبية", /* was wrongly "وسط أمريكا الجنوبية" */
  "South-west Africa": "جنوب غرب إفريقيا",
  "East Africa": "شرق إفريقيا",
  "Lake Victoria region": "منطقة بحيرة فيكتوريا",
  "South-west Zambia": "جنوب غرب زامبيا",
  "West Africa": "غرب إفريقيا",
  "South and central Africa": "جنوب ووسط إفريقيا",
  "New Guinea and the Solomon Islands": "غينيا الجديدة وجزر سليمان",
  "Tanimbar Islands": "جزر تانيمبار",
  "Arid inland Australia": "داخل أستراليا القاحل",
  "North-east South America": "شمال شرق أمريكا الجنوبية",
  "Central South America": "وسط أمريكا الجنوبية",
  "Brazil and the Guianas": "البرازيل وغويانا",
  "Arid and semi-arid Australia": "أستراليا القاحلة وشبه القاحلة",
  "South-east Australia": "جنوب شرق أستراليا",
  "Eastern Australia": "شرق أستراليا",
  "Malay Peninsula and Sumatra": "شبه جزيرة ملايو وسومطرة",
  "North Colombia and Venezuela": "شمال كولومبيا وفنزويلا",
  "Coastal Ecuador and Peru": "ساحل الإكوادور وبيرو",
  "Java and Bali": "جاوة وبالي",
  "India and Sri Lanka": "الهند وسري لانكا",
  "South and south-east Asia": "جنوب وجنوب شرق آسيا",
  "South and east Asia": "جنوب وشرق آسيا",
  "Tropical Asia": "آسيا الاستوائية",
  "South-eastern Australia": "أستراليا الجنوبية الشرقية",
  "Angola and Zambia": "أنغولا وزامبيا",
  "West and central Africa": "غرب ووسط إفريقيا",
  "Eastern and southern Africa": "شرق وجنوب إفريقيا",
  "Africa south of the Sahara": "إفريقيا جنوب الصحراء",
  "Angolan and Zambian highlands": "مرتفعات أنغولا وزامبيا",
  "North Africa and the Middle East": "شمال إفريقيا والشرق الأوسط",
  "Nicobar and Andaman Islands eastwards": "جزر نيكوبار وأندمان وما شرقها",
  "Northern New Guinea": "شمال غينيا الجديدة",
  "North America, domesticated": "أمريكا الشمالية، ومُستأنَس",
  "Indian subcontinent": "شبه القارة الهندية",
  "Domestic breed from East Asia": "سلالة داجنة من شرق آسيا",
  "Domestic breed from China": "سلالة داجنة من الصين",
  "Western North America": "غرب أمريكا الشمالية",
  "South-western North America": "جنوب غرب أمريكا الشمالية",
  "South-east Asia and northern Australia": "جنوب شرق آسيا وشمال أستراليا",
  "Mountains of Eurasia": "جبال أوراسيا",
  "Western Europe and north-west Africa": "غرب أوروبا وشمال غرب إفريقيا",
  "Europe": "أوروبا",
  "South-east Asia": "جنوب شرق آسيا",
  "The Himalayas": "الهيمالايا",
  "Mountains of central China": "جبال وسط الصين",
  "Myanmar and south-west China": "ميانمار وجنوب غرب الصين",
  "Africa north of the Limpopo": "إفريقيا شمال نهر ليمبوبو",
  "North America and Eurasia": "أمريكا الشمالية وأوراسيا",
  "Eurasia and North America": "أوراسيا وأمريكا الشمالية",
  "Europe and Asia": "أوروبا وآسيا",
  "Tropical Africa, Asia and the Americas": "إفريقيا وآسيا والأمريكيتان الاستوائية",
  "North-east Asia": "شمال شرق آسيا",
  "Southern Australia and nearby islands": "جنوب أستراليا وجزر قريبة منه",
  "Amazon and Orinoco basins": "حوضا الأمازون والأورينوكو",
  "Mediterranean, Middle East and south Asia": "المتوسط والشرق الأوسط وجنوب آسيا",
  "New Guinea and northern Australia": "غينيا الجديدة وشمال أستراليا",
  "Central Asia and the steppe": "وسط آسيا والسهب",
  "Eastern Europe into central Asia": "شرق أوروبا امتداداً إلى وسط آسيا",
  "Eurasia and Africa": "أوراسيا وإفريقيا",
  "Africa and south Asia": "إفريقيا وجنوب آسيا",
  "Iberia, central Asia and Africa": "أيبيريا ووسط آسيا وإفريقيا",
  "Africa and the Indian subcontinent": "إفريقيا وشبه القارة الهندية",
  "Eurasia and north Africa": "أوراسيا وشمال إفريقيا",
  "North and South America": "أمريكا الشمالية والجنوبية",
  "The Arctic": "القطب الشمالي",
  "Arabian Peninsula and Iraq": "شبه الجزيرة العربية والعراق",
  "The Himalayas and south-east Asia": "الهيمالايا وجنوب شرق آسيا",
  "Bali only": "جزيرة بالي وحدها",
  "Eurasia, introduced elsewhere": "أوراسيا، وأُدخل في مناطق أخرى",
  "Europe and north Africa into central Asia": "أوروبا وشمال إفريقيا امتداداً إلى وسط آسيا",
  "Europe, Asia and Africa": "أوروبا وآسيا وإفريقيا",
  "Andean South America": "أمريكا الجنوبية الأنديزية",
  "South Asia and northern Australia": "جنوب آسيا وشمال أستراليا",
  "North Africa and central Asia": "شمال إفريقيا ووسط آسيا",
  "Southern and eastern Africa": "جنوب إفريقيا وشرقها",
  "Iberia and the Eurasian steppe": "أيبيريا والسهب الأوراسي",
  "Iberia and central Asia": "أيبيريا ووسط آسيا",
  "North Africa and the Levant": "شمال إفريقيا والمشرق",
  "Africa and the Middle East": "إفريقيا والشرق الأوسط",
  "Warm regions worldwide": "المناطق الدافئة في كل العالم",
};
const entries = Object.entries(ORIG);
const escRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
let fixedInPlace = 0;
const appendList = [];
for (const [k, v] of entries) {
  const re = new RegExp('"' + escRe(k) + '": "[^"]*"');
  if (re.test(src)) { src = src.replace(re, () => JSON.stringify(k) + ": " + JSON.stringify(v)); fixedInPlace++; }
  else appendList.push([k, v]);
}
const tailAnchor = `    "Alpine South Island, New Zealand": "جزيرة الجنوب الألبية، نيوزيلندا"
  },`;
if (!src.includes(tailAnchor)) throw new Error("ORIGIN_AR tail anchor missing");
src = src.replace(tailAnchor, () =>
  `    "Alpine South Island, New Zealand": "جزيرة الجنوب الألبية، نيوزيلندا",\n` +
  appendList.map(([k, v]) => `    ${JSON.stringify(k)}: ${JSON.stringify(v)}`).join(",\n") + `\n  },`);

/* -------------------------------------------------- 2. findSpecies ordering --- */
const OLD = `    const byAlias = this.aliasAll(t).map(sci =>
      SPECIES.find(x => x.sci === sci) || (Atlas.get ? Atlas.get(sci) : null)).filter(Boolean);
    if (byAlias.length) return byAlias.slice(0, 3);
    const hit = SPECIES.filter(b => (b.en && t.includes(this.norm(b.en))) ||
      (b.ar && this.norm(b.ar).length > 3 && t.includes(this.norm(b.ar))) ||
      (b.sci && this.norm(b.sci).length > 5 && t.includes(this.norm(b.sci))));
    if (hit.length) return hit.slice(0, 2);
    /* clitics differ between "الببغاء" and the stored "ببغاء", so compare
       de-prefixed name words instead of raw substrings */
    const qset = new Set(this.toks(q));
    const phrase = SPECIES.filter(b => [b.ar, b.en].filter(Boolean)
      .some(n => { const ws = this.toks(n); return ws.length && ws.length <= 3 && ws.every(w => qset.has(w)); }));
    if (phrase.length) return phrase.slice(0, 2);`;

const NEW = `    const qset = new Set(this.toks(q));
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
    };
    const dedupe = a => Array.from(new Map(a.map(x => [x.id, x])).values());
    const ordered = a => dedupe(a).sort((x, y) => rank(x) - rank(y));
    const named = SPECIES.filter(b => rank(b) < 1e6);
    const whole = named.filter(b => rank(b) < 0);
    if (whole.length) return ordered(whole).slice(0, 3);
    const bySci = SPECIES.filter(b => b.sci && this.norm(b.sci).length > 5 && t.includes(this.norm(b.sci)));
    if (bySci.length) return bySci.slice(0, 2);
    const byAlias = this.aliasAll(t).map(sci =>
      SPECIES.find(x => x.sci === sci) || (Atlas.get ? Atlas.get(sci) : null)).filter(Boolean);
    if (byAlias.length) return ordered(byAlias.concat(named)).slice(0, 3);
    if (named.length) return ordered(named).slice(0, 3);`;

rep(OLD, NEW, "findSpecies head");

console.log("origin entries:", entries.length, "| already present (replaced in place):", fixedInPlace,
  "| appended:", appendList.length);
console.log("lines:", src.split("\n").length);
if (!write) { console.log("DRY RUN"); return; }
fs.writeFileSync(F, src);
console.log("written");
