const fs = require("fs");
const html = fs.readFileSync("index.html", "utf8");
const i = html.indexOf("function cardHTML(b)");
console.log(html.slice(i, i + 700));
