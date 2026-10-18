const fs = require("fs");
const html = fs.readFileSync("index.html", "utf8");
const i = html.indexOf("ORIGIN_AR");
const blk = html.slice(i, html.indexOf("};", i));
const keys = [...blk.matchAll(/"([^"]+)"\s*:/g)].map(m => m[1]);
console.log(keys.length);
console.log(keys.filter(k => /south|india|asia|sri lanka/i.test(k)).join("\n"));
