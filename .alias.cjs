const fs = require("fs");
const html = fs.readFileSync("index.html", "utf8");
const i = html.indexOf("Lonchura atricapilla");
console.log(html.slice(i - 260, i + 260));
