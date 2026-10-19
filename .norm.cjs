const fs = require("fs");
const html = fs.readFileSync("index.html", "utf8");
const i = html.indexOf("norm(q)");
console.log(html.slice(i - 60, i + 700));
