const fs = require("fs");
const html = fs.readFileSync("index.html", "utf8");
console.log("count PRAC entry:", /\["count",\s*\//.test(html));
console.log("count branch:", /hits\[0\] === "count"|includes\("count"\)/.test(html));
const i = html.indexOf('hits[0] === "count"');
if (i > 0) console.log(html.slice(i - 200, i + 1500));
console.log("AI_KIND_KEY count:", /count:\s*"ai_count"/.test(html));
