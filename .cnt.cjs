const fs = require("fs");
const html = fs.readFileSync("index.html", "utf8");
const s = html.indexOf("  norm(s) {");
const n = html.slice(s, html.indexOf("\n  },", s));
const mk = n.slice(n.indexOf("{") + 1, n.lastIndexOf("return") >= 0 ? n.length : n.length);
const norm = t => String(t).toLowerCase()
  .replace(/[`\u064B-\u0652\u0670\u0640]/g, "")
  .replace(/[أإآ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه")
  .replace(/[ئء]/g, "ي")
  .replace(/[٠-٩]/g, d => "٠١٢٣٤٥٦٧٨٩".indexOf(d));
const i = html.indexOf('["count",');
const line = html.slice(i, html.indexOf("],", i) + 2);
const re = eval("[" + line + "]")[0][1];
const tests = ["كم نوعاً في الدليل؟", "كم طائراً عندك في الدليل", "عدد الأنواع", "how many species are in the guide",
  "كم فيه أنواع؟", "كم يطعم ٤ طيور وزنها ٤٥ غ في الشهر؟", "كم طيور تضع الأنثى؟", "ما مقاس قفص الكوكاتيل؟",
  "how many birds do I need a cage for", "كم يحتاج طائر من الماء؟", "كم نوعاً في الأطلس؟", "عدد الأصناف في التطبيق"];
for (const t of tests) console.log((re.test(norm(t)) ? "COUNT  " : "  --   ") + t);
