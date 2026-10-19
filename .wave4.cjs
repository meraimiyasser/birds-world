/* Wave four: append curated care rows to the RAW block in index.html.
   Usage:  .wave4.cjs          -> validate only (dry run)
           .wave4.cjs --apply  -> write them in
   Each row is checked for a duplicate binomial / English name / id, a valid
   group, a size and life span in the house format, five traits in 1..5, and an
   origin phrase that Arabic mode can already translate. */
const fs = require("fs");
const FILE = "index.html";

const ROWS = [
  /* ---- parrots ---- */
  ["Pale-headed Rosella", "Platycercus adscitus", "pa", "Eastern Australia", "26–29 cm", "15–20 years", "Seeds, berries and leafy greens; needs horizontal flight room", [3,3,4,3,3]],
  ["Red-winged Parrot", "Aprosmictus erythropterus", "pa", "Eastern Australia", "28–32 cm", "20–25 years", "Seeds, figs and seeding grasses; seeded pellets as the base", [4,3,4,4,3]],
  ["Blue-headed Parrot", "Pionus menstruus", "pa", "South America", "24–28 cm", "20–30 years", "Pellets, seeds and fruit; calm for a parrot and notably quieter", [3,2,4,3,3]],
  ["Red-fronted Parrot", "Poicephalus gulielmi", "pa", "West African forests", "27–28 cm", "25–30 years", "Figs, seeds and pellets; quiet for a parrot, still needs chewing wood", [4,2,4,4,3]],
  ["Lilith's Lovebird", "Agapornis lilianae", "pa", "Southern and eastern Africa", "13–14 cm", "10–15 years", "Millet and sunflower with cuttlebone; always kept as a pair", [3,3,2,2,5]],
  ["Varied Lorikeet", "Eos versicolor", "pa", "New Guinea and northeast Australia", "28–31 cm", "12–15 years", "Nectar, soft fruit and pollen only; a seed diet is wrong for it", [5,3,4,4,4]],
  ["Moluccan Cockatoo", "Cacatua moluccensis", "pa", "Tanimbar Islands", "46–52 cm", "40–60 years", "Pellets, nuts and vegetables; needs hours of contact every day", [5,5,5,5,5]],
  ["Little Corella", "Cacatua sanguinea", "pa", "Australia and New Guinea", "35–42 cm", "20–40 years", "Seed, nuts and sprouted grain; its flock call carries very far", [4,5,5,4,4]],
  ["Palm Cockatoo", "Probosciger aterrimus", "pa", "New Guinea and the Solomon Islands", "50–60 cm", "35–50 years", "In-shell nuts, seeds and large quantities of wood to chew", [5,4,5,5,2]],
  ["Kaka", "Nestor meridionalis", "pa", "New Zealand", "38–48 cm", "15–20 years", "Seeds, pollen, bark and fungi; protected - licensed captive source only", [5,4,5,5,4]],
  ["Vernal Hanging Parrot", "Loriculus vernalis", "pa", "Indian subcontinent and Southeast Asia", "14–15 cm", "12–15 years", "Fruit, berries and nectar; needs warmth and humidity, not a cold room", [4,2,3,3,3]],
  ["Great Rose-Ringed Parakeet", "Psittacula kramersianus", "pa", "The Himalayas and south-east Asia", "40–43 cm", "20–30 years", "Seeds, nuts and fruit; a strong flier that needs an outdoor aviary", [4,3,5,4,4]],

  /* ---- finches and canaries ---- */
  ["Blue-faced Parrot Finch", "Erythrura trichroa", "fi", "South-east Asia and northern Australia", "12–13 cm", "6–8 years", "Fine seed, seeding grasses and live food in breeding; warmth is critical", [4,2,3,3,3]],
  ["Grassland Yellow-Finch", "Sicalis luteola", "fi", "South America", "11–12 cm", "5–8 years", "Fine seed, greens and live food; sings a thin descending trill", [3,3,2,2,4]],
  ["Javanese Munia", "Lonchura leucogastroides", "fi", "Java, Bali and Borneo", "13–14 cm", "5–8 years", "Millet and panicle millet sprays; hardy when kept dry and warm", [3,2,3,2,4]],
  ["Orange-spotted Waxbill", "Amandava subflava", "fi", "West and central Africa", "10–11 cm", "4–6 years", "Small seeds and green seeding grasses; needs winter warmth", [3,2,2,2,4]],
  ["Green-winged Pytilia", "Pytilia melba", "fi", "West African forests", "12–13 cm", "5–8 years", "Finch mix plus live food; pairs need humidity and a planted cage", [4,2,3,3,3]],
  ["Chestnut-bellied Seedcracker", "Sporophila angolensis", "fi", "South America", "15–17 cm", "6–8 years", "Large grass seeds, rice and greens; its song is surprisingly loud", [3,3,3,3,3]],
  ["Double-coloured Seedeater", "Sporophila caerulescens", "fi", "South America", "10–11 cm", "5–7 years", "Grass seed with live food for the chicks; keep pairs quiet", [3,2,2,2,4]],
  ["Saffron Finch", "Sicalis flaveola", "fi", "Northern South America", "14–15 cm", "6–10 years", "Safflower mix, greens and fruit; sings through most of the year", [2,3,3,2,4]],
  ["Red-crested Cardinal", "Paroaria coronata", "fi", "South America", "17–19 cm", "6–10 years", "Seed, fruit and insects; a robust aviary bird that tames easily", [3,3,3,3,4]],
  ["Yellow-fronted Canary", "Crithagra mozambica", "fi", "Africa south of the Sahara", "12–13 cm", "6–10 years", "Fine seed and greens; hybridises freely with domestic canaries", [3,3,2,2,4]],
  ["Black-throated Canary", "Crithagra atrogularis", "fi", "South and central Africa", "11–12 cm", "6–8 years", "Seed mix and seeding grasses; needs a warm, dry winter room", [3,3,2,2,4]],
  ["European Greenfinch", "Chloris chloris", "fi", "Europe and western Asia", "15–17 cm", "5–10 years", "Seed, greens and grit; crowded aviaries spread mycoplasma quickly", [3,3,3,2,3]],
  ["Linnet", "Linaria cannabina", "fi", "Europe, north Africa and western Asia", "11–13 cm", "5–8 years", "Seed and greens; the male sings from a high perch in spring", [2,3,2,2,3]],
  ["Cape Canary", "Crithagra canicollis", "fi", "Southern Africa", "12–13 cm", "6–10 years", "Fine seed and seeding grasses; hardy but keep the room dry", [3,2,2,2,4]],
  ["Red Bishop", "Euplectes orix", "fi", "Grasslands of South Africa", "10–12 cm", "4–6 years", "Seed plus live food; males need long daylight to colour up", [3,2,3,2,4]],
  ["Yellow-crowned Bishop", "Euplectes afer", "fi", "Sub-Saharan Africa", "10–11 cm", "4–6 years", "Fine seed and insects; breeds readily and hybridises with other bishops", [3,2,2,2,4]],
  ["Rufous-collared Sparrow", "Zonotrichia capensis", "fi", "Central and South America", "14–17 cm", "4–8 years", "Seed, grain and insects; hardy and it tames quickly", [2,2,3,2,4]],
  ["Abyssinian Longclaw", "Cecropis abyssinica", "fi", "Ethiopian highlands", "20–25 cm", "6–8 years", "Seed mix with live food in breeding; needs floor space to run", [3,3,3,2,4]],
  ["Yellow-throated Longclaw", "Macronyx croceus", "fi", "East African dry thornveld", "20–23 cm", "6–8 years", "Grass seed, insects and greens; a ground feeder, not a percher", [3,3,3,2,4]],

  /* ---- doves and pigeons ---- */
  ["Band-tailed Pigeon", "Patagioenas fasciata", "do", "Western North America", "38–43 cm", "8–12 years", "Acorns, maize and grit; needs a large planted aviary", [4,2,5,4,3]],
  ["Pied Imperial Pigeon", "Ducula bicolor", "do", "South-east Asia and northern Australia", "43–48 cm", "15–20 years", "Soft fruit and ripe berries with grit; a big clean aviary bird", [4,2,5,4,3]],
  ["Green Imperial Pigeon", "Ducula aenea", "do", "Indian subcontinent and Southeast Asia", "41–46 cm", "12–15 years", "Figs and soft fruit; a messy feeder, so plan for daily cleaning", [4,2,5,3,3]],
  ["Jambu Fruit Dove", "Ptilinopus jambigena", "do", "Malay Peninsula and Sumatra", "22–24 cm", "10–15 years", "Ripe fruit and berries only; very sensitive to cold and drafts", [4,1,4,4,3]],
  ["African Green Pigeon", "Treron calvus", "do", "Africa south of the Sahara", "24–26 cm", "8–12 years", "Small seeds, fruit and greens; keep it warm through winter", [4,2,4,3,3]],
  ["Common Ground Dove", "Columbina passerina", "do", "Southern United States and Mexico", "15–17 cm", "5–8 years", "Millet and fine seed fed on a flat floor; the quietest dove to keep", [3,1,2,2,4]],
  ["Ruddy Ground Dove", "Columbina talpacoti", "do", "Central and South America", "16–17 cm", "5–8 years", "Fine seed and seeding grasses; breeds readily in a planted aviary", [3,1,2,2,4]],
  ["Bar-shouldered Dove", "Geopelia hummeri", "do", "Eastern Australia", "29–31 cm", "10–15 years", "Small seeds and greens; calm, large and easy to pair", [3,1,4,3,3]],

  /* ---- poultry and gamebirds ---- */
  ["Chestnut-bellied Partridge", "Arborophila javanica", "po", "Java and Bali", "26–29 cm", "5–8 years", "Game crumb, seeds and leafy greens; a floor bird that shies upward", [4,2,3,3,3]],
  ["Sparrow's Pheasant", "Polyplectron bicalcaratum", "po", "Indian subcontinent and Southeast Asia", "55–65 cm", "8–10 years", "Insectivore crumb, seeds and greens; shy and needs planted cover", [4,2,4,4,2]],
  ["Edward's Pheasant", "Lophura edwardsi", "po", "Southeast Asia", "55–65 cm", "6–10 years", "Game crumb, seeds and live food; wild population critical - captive stock only", [5,2,5,5,2]],
  ["Mrs. Hume's Pheasant", "Syrmaticus humiae", "po", "Myanmar and south-west China", "70–90 cm", "6–10 years", "Game crumb, greens and grit; the tail needs room to clear a perch", [4,2,5,4,2]],
  ["Plain Chachalaca", "Ortalis vetula", "po", "Mexico and Central America", "48–61 cm", "8–12 years", "Leaves, fruit and crumb; the flock calls loudly at dawn", [4,5,5,4,4]],
  ["Black Guineafowl", "Agelastes niger", "po", "West African forests", "40–43 cm", "8–12 years", "Insects, seeds and greens; needs warmth, humidity and leaf litter", [4,3,4,4,3]],
  ["Blue-billed Curassow", "Crax alberti", "po", "Northern South America", "80–90 cm", "12–15 years", "Fruit, flowers and invertebrate crumb; endangered, papers required", [5,2,5,5,2]],
  ["Horned Guan", "Oreophasis derbianus", "po", "Mexico and Central America", "80–90 cm", "12–15 years", "Fruit and soft greens; needs high humidity and cool, stable nights", [5,2,5,5,2]],

  /* ---- waterfowl ---- */
  ["Common Shelduck", "Tadorna tadorna", "wa", "Europe, north Africa and western Asia", "58–63 cm", "15–20 years", "Grass, grain and water plants; must be able to dunk its head", [3,3,4,3,3]],
  ["Ruddy Shelduck", "Tadorna ferruginea", "wa", "Europe, Asia and Africa", "62–72 cm", "12–20 years", "Pasture, pellets and greens; hardy but extremely noisy", [3,4,4,3,4]],
  ["Red-crested Pochard", "Netta rufina", "wa", "Europe and western Asia", "53–57 cm", "10–15 years", "Aquatic plants and grain; needs open deep water to feed properly", [3,2,4,3,3]],
  ["Fulvous Whistling Duck", "Dendrocygna bicolor", "wa", "Tropical Africa, Asia and the Americas", "45–53 cm", "10–15 years", "Grain, stems and aquatic plants; loud at dusk, warm housing in winter", [3,5,4,3,4]],
  ["White-headed Duck", "Oxyura leucocephala", "wa", "Europe, north Africa and western Asia", "43–48 cm", "8–12 years", "Aquatic invertebrates and plant matter; endangered - licensed stock only", [4,2,4,4,3]],
  ["Greater White-fronted Goose", "Anser albifrons", "wa", "Northern Hemisphere", "64–79 cm", "15–20 years", "Grass and waterfowl pellets; it will strip any lawn it can reach", [3,4,4,3,4]],
  ["Musk Duck", "Biziura lobata", "wa", "Southern Australia and nearby islands", "50–62 cm", "10–15 years", "Aquatic invertebrates and small fish only; a specialist's bird", [5,2,5,5,2]],

  /* ---- birds of prey ---- */
  ["Northern Goshawk", "Accipiter gentilis", "ra", "Eurasia and North America", "46–63 cm", "12–20 years", "Whole prey; needs a mews, daily flying and a licence", [5,3,5,5,1]],
  ["Black Kite", "Milvus migrans", "ra", "Eurasia and Africa", "55–65 cm", "15–25 years", "Fish, meat and offal as a scavenger; a wild bird, never a house pet", [5,2,5,4,2]],
  ["Western Marsh Harrier", "Circus aeruginosus", "ra", "Europe and Asia", "43–54 cm", "12–18 years", "Rodents, small birds and frogs; requires long open flying space", [5,3,5,5,1]],
  ["Great Horned Owl", "Bubo virginianus", "ra", "North America", "43–64 cm", "15–25 years", "Whole prey only; silent flight and a grip that will break a wrist", [5,2,4,5,1]],
  ["Yellow-headed Caracara", "Milvago chimachima", "ra", "South America", "45–52 cm", "10–15 years", "Meat scraps, insects and ticks; bold and tame but very messy", [4,4,4,3,3]],
  ["King Vulture", "Sarcoramphus papa", "ra", "Northern South America", "65–85 cm", "20–30 years", "Fresh carcass meat only, never processed food; licensed facility", [5,2,5,5,2]],
  ["African Harrier-Hawk", "Polyboroides typus", "ra", "Africa south of the Sahara", "60–78 cm", "15–25 years", "Large prey plus palm fruit; its hinged feet are unique among raptors", [5,2,5,5,1]],

  /* ---- songbirds and softbills ---- */
  ["Southern Hill Myna", "Gracula indica", "so", "Indian subcontinent", "28–31 cm", "15–25 years", "Low-iron softbill crumb, fruit and insects; protected across much of its range", [4,4,4,4,4]],
  ["Yellow-faced Myna", "Mino dumontii", "so", "New Guinea and northern Australia", "28–30 cm", "15–20 years", "Low-iron pellets, fruit and live food; bold and noisier than it looks", [4,4,4,4,4]],
  ["Great Myna", "Acridotheres fuscus", "so", "Indian subcontinent", "22–23 cm", "10–15 years", "Invertebrates, fruit and low-iron crumb; extremely bold with people", [3,4,4,3,4]],
  ["White-rumped Shama", "Copsychus malabaricus", "so", "Indian subcontinent and Southeast Asia", "21–24 cm", "8–12 years", "Live food and low-iron softbill mix; the song carries through the night", [4,4,3,3,2]],
  ["Common Green Magpie", "Cissa chinensis", "so", "South and south-east Asia", "36–41 cm", "10–15 years", "Insects, fruit and small prey; needs a planted walk-in with cover", [5,3,5,4,2]],
  ["Golden-fronted Leafbird", "Chloropsis aurifrons", "so", "Indian subcontinent", "17–19 cm", "8–12 years", "Fruit, nectar and insects; a low-iron diet is essential, not optional", [4,2,4,3,3]],
  ["Village Weaver", "Ploceus cucullatus", "so", "Sub-Saharan Africa", "15–22 cm", "5–8 years", "Seed mix plus live food; the male builds a complete woven nest", [3,4,3,2,4]],
  ["European Roller", "Coracias garrulus", "so", "Europe, Africa and Asia", "29–32 cm", "8–15 years", "Large insects and small mice; needs a long exposed perch and open flight", [5,3,5,4,2]],
  ["White-cheeked Turaco", "Tauraco leucotis", "so", "East Africa", "41–43 cm", "10–15 years", "Fruit, buds and greens; iron-sensitive, so no copper bowls or citrus", [4,2,4,4,3]],
  ["Great Blue Turaco", "Corythaeola cristata", "so", "West African forests", "66–76 cm", "15–20 years", "Fruit, flowers and buds; the largest turaco needs a tall aviary house", [5,2,5,5,3]],

  /* ---- large and wild birds ---- */
  ["Great Egret", "Ardea alba", "wi", "Warm regions worldwide", "80–104 cm", "10–15 years", "Whole fish; minced meat alone causes vitamin and bone problems", [4,2,5,4,2]],
  ["Little Egret", "Egretta garzetta", "wi", "Warm regions worldwide", "55–65 cm", "8–15 years", "Small fish and aquatic insects; a wet, messy enclosure is unavoidable", [4,2,4,3,2]],
  ["Hadada Ibis", "Bostrychia hagedash", "wi", "Africa south of the Sahara", "65–78 cm", "10–20 years", "Invertebrates, small prey and fruit; the flock calls are very loud", [4,4,4,3,4]],
  ["Yellow-billed Stork", "Mycteria ibis", "wi", "Africa south of the Sahara", "85–95 cm", "20–30 years", "Fish and frogs; needs a large ponded aviary to stay sound", [5,2,5,5,2]],
  ["Shoebill", "Balaeniceps rex", "wi", "East Africa", "100–140 cm", "20–30 years", "Whole fish only; a licensed breeding facility, not an enclosure pet", [5,2,5,5,1]],
  ["Australian Pelican", "Pelecanus conspicillatus", "wi", "Australia and New Guinea", "160–190 cm", "20–25 years", "Fish by the kilogram; requires a large deep pond and clean water", [5,3,5,5,3]],
  ["Purple Swamphen", "Porphyrio porphyrio", "wi", "Europe, Africa and Asia", "45–50 cm", "8–15 years", "Reed shoots, pellets and greens; bold and destructive in planted marshes", [4,4,4,3,3]],
  ["Eurasian Coot", "Fulica atra", "wi", "Eurasia and Africa", "36–42 cm", "8–15 years", "Grain, greens and aquatic plants; fiercely territorial in spring", [3,3,3,2,3]],
  ["Black-winged Stilt", "Himantopus himantopus", "wi", "Europe, Africa and Asia", "80–95 cm", "8–15 years", "Insects and small aquatic prey taken from shallow flooded margins", [4,2,4,3,3]],
  ["Little Penguin", "Eudyptula minor", "wi", "Southern Australia and nearby islands", "33–40 cm", "15–20 years", "Small whole fish; needs chilled salt water, shade and a cool burrow", [4,2,4,5,3]],
  ["Black Crowned Crane", "Balearica pavonina", "wi", "Africa north of the Limpopo", "70–95 cm", "20–30 years", "Grain, seeds and insects; declining in the wild, papers required", [5,3,5,5,3]],
  ["Wattled Crane", "Bugeranus carunculatus", "wi", "Africa south of the Sahara", "155–175 cm", "25–40 years", "Grain, greens and invertebrates; a very large licensed aviary", [5,3,5,5,2]],
];

const src = fs.readFileSync(FILE, "utf8");
const start = src.indexOf("const RAW = [");
if (start < 0) throw new Error("RAW block not found");
const end = src.indexOf("\n];", start);
if (end < 0) throw new Error("RAW block end not found");
const existing = eval(src.slice(start + "const RAW = ".length, end + 2));

/* ORIGIN_AR keys: it lives inside the AI object, so brace-match from its "{". */
const oa = src.indexOf("ORIGIN_AR");
const ob = src.indexOf("{", oa);
let depth = 0, oc = ob;
for (; oc < src.length; oc++) {
  if (src[oc] === "{") depth++;
  else if (src[oc] === "}") { depth--; if (!depth) break; }
}
const origins = new Set([...src.slice(ob, oc).matchAll(/"([^"]+)"\s*:\s*"/g)].map(m => m[1]));
if (origins.size < 100) throw new Error("ORIGIN_AR extraction looks wrong: " + origins.size);

const slug = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const haveSci = new Set(existing.map(r => String(r.sci).toLowerCase()));
const haveEn = new Set(existing.map(r => String(r.en).toLowerCase()));
const haveId = new Set(existing.map(r => slug(r.en)));
const GROUPS = ["pa", "fi", "do", "po", "wa", "ra", "so", "wi"];

const problems = [];
const news = [];
for (const [en, sci, g, origin, size, life, tip, t] of ROWS) {
  const bad = [];
  const key = sci.toLowerCase();
  if (haveSci.has(key)) bad.push("duplicate binomial " + sci);
  if (haveEn.has(en.toLowerCase())) bad.push("duplicate English name " + en);
  if (haveId.has(slug(en))) bad.push("duplicate id " + slug(en));
  if (!GROUPS.includes(g)) bad.push("bad group " + g);
  if (!origins.has(origin)) bad.push("origin not in ORIGIN_AR: " + origin);
  if (t.length !== 5 || t.some(v => !Number.isInteger(v) || v < 1 || v > 5)) bad.push("bad traits");
  if (!/^\d+(–\d+)? cm$/.test(size)) bad.push("bad size " + size);
  if (!/^\d+(–\d+)? years$/.test(life)) bad.push("bad life " + life);
  if (!/^[\x20-\x7E]+$/.test(tip)) bad.push("non-ascii tip");
  if (!/^[\x20-\x7E]+$/.test(en)) bad.push("non-ascii name");
  if (bad.length) { problems.push(en + ": " + bad.join(", ")); continue; }
  haveSci.add(key); haveEn.add(en.toLowerCase()); haveId.add(slug(en));
  news.push({ en, sci, g, origin, size, life, tip, t });
}

const byGroup = {};
for (const r of news) byGroup[r.g] = (byGroup[r.g] || 0) + 1;
console.log("existing:", existing.length, "| proposed:", ROWS.length, "| accepted:", news.length, "|", JSON.stringify(byGroup));
if (problems.length) console.log("REJECTED:\n  " + problems.join("\n  "));
if (!process.argv.includes("--apply")) { console.log("dry run: nothing written"); process.exit(0); }
if (problems.length) { console.log("refusing to apply while anything is rejected"); process.exit(1); }

const block = "\n  /* Wave four — aviary, game, water and raptor species, added on request.\n     ar is left blank on purpose: the keeper reviews each Arabic name in\n     the review sheet rather than the app shipping a machine translation. */\n" +
  news.map(r => "  { en:" + JSON.stringify(r.en) + ', ar:"", sci:' + JSON.stringify(r.sci) + ", g:" + JSON.stringify(r.g) +
    ", origin:" + JSON.stringify(r.origin) + ", size:" + JSON.stringify(r.size) + ", life:" + JSON.stringify(r.life) +
    ", tip:" + JSON.stringify(r.tip) + ', file:"", t:[' + r.t.join(",") + "] }").join(",\n") + "\n";

fs.writeFileSync(FILE, src.slice(0, end) + block + src.slice(end));
console.log("applied | RAW now", existing.length + news.length, "rows");
