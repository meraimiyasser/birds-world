/* Co-housing questions ("هل يعيش الزرزور مع الكوكاتيل؟") named two birds but fell
   through the group intent because only "together / other birds" were listed. */
const fs = require("fs");
const F = "index.html";
const write = process.argv.includes("--write");
let src = fs.readFileSync(F, "utf8");
const A = "|contagi|quarantin|infect|spread|flock|together|other birds|new bird|human|zoonotic|to people)";
const B = "|contagi|quarantin|infect|spread|flock|together|other birds|new bird|human|zoonotic|to people|" +
  "يعيش مع|يسكن مع|يتعايش|هل يضر|ضار ب|mix with|house with|live with|safe with)";
if (!src.includes(A)) throw new Error("group intent anchor missing");
if (src.split(A).length !== 2) throw new Error("group intent anchor not unique");
src = src.replace(A, () => B);
if (!write) { console.log("DRY RUN"); return; }
fs.writeFileSync(F, src);
console.log("written");
