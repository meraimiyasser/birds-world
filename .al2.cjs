const fs = require("fs");
const html = fs.readFileSync("index.html", "utf8");
const s = html.indexOf("ALIAS");
const e = html.indexOf("};", s);
const blk = html.slice(s, e);
console.log("ALIAS keys:", (blk.match(/"[^"]+":\s*\[/g) || []).length);
console.log(blk.split(/\r?\n/).filter(l => /Lonchura|Emberiza|Estrilda/.test(l)).join("\n"));
