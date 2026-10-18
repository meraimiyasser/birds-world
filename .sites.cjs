const fs = require("fs");
const html = fs.readFileSync("index.html", "utf8").split(/\r?\n/);
html.forEach((l, i) => {
  if (/SPECIES\.length|srcCount|home_sub|browse_h|id_scope|guide_h|atlas_pick|"241/.test(l)) console.log((i + 1) + ": " + l.trim().slice(0, 190));
});
