const fs = require("fs");
const L = fs.readFileSync("index.html", "utf8").split(/\r?\n/);
L.forEach((l, i) => {
  if (/class="kv"|stat_seen|SPECIES\.length|how_many|ai_count|كم نوع|breedOf|isDomesticForm/.test(l)) console.log((i + 1) + ": " + l.trim().slice(0, 170));
});
