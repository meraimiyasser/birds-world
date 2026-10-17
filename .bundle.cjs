/* Build the single-file edition: same app, manifest inlined as a data URI,
   service worker registration removed so it works from file:// with no siblings. */
const fs = require("fs"), path = require("path");
const root = __dirname;
let html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const man = fs.readFileSync(path.join(root, "manifest.webmanifest"), "utf8");
const data = "data:application/manifest+json," + encodeURIComponent(man.replace(/\s+/g, " ").trim());

const before = html.length;
html = html.replace('<link rel="manifest" href="manifest.webmanifest">',
  '<link rel="manifest" href="' + data + '">');

html = html.replace(/if \("serviceWorker" in navigator[\s\S]*?\n  \}\n/,
  '/* single-file edition: no service worker, no sibling files */\n');

if (html.length === before) { console.log("NOTHING CHANGED — check the anchors"); process.exit(1); }
if (/serviceWorker" in navigator/.test(html)) { console.log("SW block still present"); process.exit(1); }

const out = path.join(root, "birds-world-standalone.html");
fs.writeFileSync(out, html);
console.log("wrote " + path.basename(out) + " " + html.length + " B / " + html.split("\n").length + " lines");
