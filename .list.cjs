const fs = require("fs");
const html = fs.readFileSync("index.html", "utf8");
const start = html.indexOf("const RAW = [");
const end = html.indexOf("\n];", start);
const rows = new Function("return " + html.slice(start + "const RAW = ".length, end + 2))();
const marker = html.indexOf("/* Wave three", start);
rows.forEach((r, i) => {
  const off = html.indexOf('"' + r.en + '"', start);
  const w3 = off > marker;
  console.log((i + 1) + (w3 ? "*" : " ") + " " + r.g.padEnd(3) + " " + r.en.padEnd(30) + " " + r.sci.padEnd(32) + " " + (r.ar || "-"));
});
