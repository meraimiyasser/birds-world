/* Builds the review sheet the keeper fills in: the species still without an
   Arabic name (with the Wikidata label as a suggestion, never as an answer) and
   every diet tip that is still English-only. Reads the data straight out of
   index.html so the sheet can never drift from the file. */
const fs = require("fs");

const html = fs.readFileSync("index.html", "utf8");
const start = html.indexOf("const RAW = [");
if (start < 0) throw new Error("RAW block not found");
const end = html.indexOf("\n];", start);
const rows = new Function("return " + html.slice(start + "const RAW = ".length, end + 2))();

const cand = {};
for (const [sci, ar] of JSON.parse(fs.readFileSync(".ar-candidates.json", "utf8"))) cand[sci] = ar;

const gblock = html.slice(html.indexOf("const GROUPS = {"), html.indexOf("const RAW = ["));
const gAr = {};
for (const m of gblock.matchAll(/(\w+):\s*\{[\s\S]*?ar:\s*"([^"]+)"/g)) if (!gAr[m[1]]) gAr[m[1]] = m[2];

const unnamed = rows.filter(r => !r.ar);
/* The sheet has to separate names the keeper already approved from names the
   app authored in the latest wave — the second group is the one to check. */
const marker = html.indexOf("/* Wave three", start);
const head = start + "const RAW = [".length;   /* past the opening bracket */
const trim = s => s.replace(/^[\s,]+/, "").replace(/[\s,]+$/, "");
const rowsBefore = marker > 0 ? new Function("return [" + trim(html.slice(head, marker)) + "]")() : rows;
const rowsAfter = marker > 0 ? new Function("return [" +
  trim(html.slice(marker, end).replace(/\/\* Wave three[\s\S]*?\*\//, "")) + "]")() : [];
if (rowsBefore.length + rowsAfter.length !== rows.length)
  throw new Error("wave split lost rows: " + rowsBefore.length + " + " + rowsAfter.length + " != " + rows.length);
const newNamed = rowsAfter.filter(r => r.ar);
/* Same rule the app uses: a row is not a species. Chicken breeds, the Indian
   runner and the society finch are separate rows over one wild species each. */
const DOM = /^(?:domestic|domestica|domesticus)$/i;
const base = s => {
  const w = String(s).replace(/\s*\([^)]*\)/, "").trim().split(/\s+/);
  return w.length >= 3 && DOM.test(w[w.length - 1]) ? w.slice(0, -1).join(" ") : w.join(" ");
};
const units = new Set(rows.map(r => base(r.sci))).size;
const breeds = rows.filter(r => {
  const w = String(r.sci).trim().split(/\s+/);
  return /\((?:domestic|domestica|domesticus)\)/i.test(r.sci) || (w.length >= 3 && DOM.test(w[w.length - 1]));
});
const L = [];
L.push("# مراجعة بيانات الدليل — " + rows.length + " صفاً (" + units + " نوعاً)", "");
L.push("العددان مقصودان: **" + rows.length + " صفاً** للعناية (سطر في `RAW`) مقابل **" + units +
  " نوعاً** مستقلاً، لأن " + breeds.length + "اً من الصفوف أصناف مستأنسة لا أنواع — " +
  breeds.map(b => b.en).join("، ") + ". لا تحذفها؛ صحّح اسمها فقط.", "");
L.push("الملف مُولَّد من `index.html` مباشرة. **لا تغيّر السطور الإنجليزية ولا الأسماء العلمية** — اكتب فقط بعد علامة `اسمي:` و`عربي:`، ثم أرسل الملف لي (أو الصقه في المحادثة) وسأُدخله في `RAW` وأعيد الفحص والتجميع.", "");
L.push("الترشيح المكتوب بين قوسين مسحوب من تسمية ويكيبيديا العربية للنوع نفسه؛ مقبول فقط إن وافق ما يسمّيه المربّون في منطقتك، وإلا فاكتب اسمه الصحيح.", "");
L.push("", "## ١) أنواع بلا اسم عربي (" + unnamed.length + ")", "");
unnamed.forEach((r, i) => {
  L.push((i + 1) + ". " + r.en + " — *" + r.sci + "* — " + (gAr[r.g] || r.g) +
    " — ترشيح: (" + (cand[r.sci] || "لا يوجد") + ") — **اسمي:** ____");
});
L.push("", "## ٢) أسماء وصَفها التطبيق في الموجة الأخيرة (" + newNamed.length + ") — صحّح ما خالف اسم المربّين", "");
L.push("هذه الأسماء مبنية على وصف النوع بعربية الفصحى وليست منقولة عن سوق؛ إن كان تربيتك له اسم آخر فاكتبه فوق الاسم الحالي.");
newNamed.forEach((r, i) => {
  L.push((i + 1) + ". " + r.en + " — *" + r.sci + "* — الاسم في التطبيق: " + r.ar + " — **اسمي:** ____");
});
L.push("", "## ٣) نصائح التغذية (" + rows.length + " صفاً، كلها إنجليزية حتى الآن)", "");
rows.forEach((r, i) => {
  L.push((i + 1) + ". " + r.en + (r.ar ? " (" + r.ar + ")" : "") + " — EN: " + r.tip + " — **عربي:** ____");
});
L.push("", "## ٤) ملاحظات تحتاج قرارك", "");
L.push("- عدد من الأسماء العامة تحتمل أكثر من نوع في الدليل (حجل: ٤ أنواع، سلوى: ٥، بومة: ٤، كركي: ٣). اكتب الكلمة التي تستخدمها أنت لكل نوع وسأضيفها كاسم مرادف ذكي بدل الافتراض الخاطئ.");
L.push("- أنواع لها سجلات صوت حقيقية في الأطلس لكن لا ذكر لها في الدليل: أخبر أيها تربّيه فعلياً لأُدرجة في الدليل بخصائصه.");
L.push("- أسعار التشغيل لا تُكتب في التطبيق إطلاقاً (استهلاك بالغرامات فقط)؛ إن أردت جدول أسعار محلياً فسيكون طبقة منفصلة عن الأدلة.");
L.push("");

fs.writeFileSync("مراجعة-الأسماء-والنصائح.md", L.join("\n"), "utf8");
console.log("rows:", rows.length, "| species:", units, "| breed rows:", breeds.length,
  "| unnamed:", unnamed.length, "| unnamed with a Wikidata suggestion:",
  unnamed.filter(r => cand[r.sci]).length, "| lines:", L.length);
