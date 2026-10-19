/* Scratch: dump every RAW row as "en | sci | g" so a human can eyeball the
   binomials. Rows are read straight out of index.html. */
const fs = require("fs");
const html = fs.readFileSync("index.html", "utf8");
const start = html.indexOf("const RAW = [");
const end = html.indexOf("\n];", start);
const rows = new Function("return " + html.slice(start + "const RAW = ".length, end + 2))();
const L = rows.map(r => r.en + " | " + r.sci + " | " + r.g);
fs.writeFileSync(".sci-list.txt", L.join("\n"), "utf8");
console.log("rows:", rows.length);
