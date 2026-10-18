/* Adds curated species rows to RAW in index.html (same row shape as the 45
   originals) and makes every hardcoded "45" count-driven.
   Run: ELECTRON_RUN_AS_NODE=1 Qoder.exe .add-species.cjs            (dry run)
         ELECTRON_RUN_AS_NODE=1 Qoder.exe .add-species.cjs --write    (apply) */
const fs = require("fs");
const F = "index.html";
const write = process.argv.includes("--write");

/* t = [difficulty, noise, space, cost, sociability]  (1..5 each) */
const R = [
  /* ---- pa: parrots ---- */
  { en:"Rosy-faced Lovebird", ar:"حبيل وردي الوجه", sci:"Agapornis roseicollis", g:"pa", origin:"South-west Africa", size:"15–17 cm", life:"10–15 years", tip:"Pellets and seed with a cuttlebone; give nesting material and a dry aviary", t:[2,3,1,2,4] },
  { en:"Yellow-collared Lovebird", ar:"حبيل أصفر الطوق", sci:"Agapornis personatus", g:"pa", origin:"East Africa", size:"14–15 cm", life:"10–15 years", tip:"Seed mix with seeding grasses; breeds readily in pairs", t:[2,3,1,2,5] },
  { en:"Fischer's Lovebird", ar:"", sci:"Agapornis fischeri", g:"pa", origin:"Lake Victoria region", size:"14–15 cm", life:"10–15 years", tip:"Pellets, seed and greens; keep pairs off excess condition", t:[3,3,1,2,5] },
  { en:"Black-headed Lovebird", ar:"", sci:"Agapornis nigrigenis", g:"pa", origin:"South-west Zambia", size:"13–14 cm", life:"10–15 years", tip:"Fine seed mix, greens and live food while rearing", t:[3,3,1,2,5] },
  { en:"Quaker Parrot", ar:"ببغاء الراهب", sci:"Myiopsitta monachus", g:"pa", origin:"South America", size:"29–33 cm", life:"15–20 years", tip:"Pellets, vegetables and limited seed; builds stick nests in colonies", t:[3,4,2,2,4] },
  { en:"Senegal Parrot", ar:"ببغاء سنغالي", sci:"Poicephalus senegalus", g:"pa", origin:"West Africa", size:"22–26 cm", life:"25–30 years", tip:"Pellets and vegetables; watch weight, lipomas are common", t:[3,3,2,3,4] },
  { en:"Meyer's Parrot", ar:"ببغاء ماير", sci:"Poicephalus meyeri", g:"pa", origin:"South and central Africa", size:"22–25 cm", life:"25–30 years", tip:"Low-fat pellets and vegetables; quiet for a parrot", t:[3,2,2,3,4] },
  { en:"Timneh Grey Parrot", ar:"ببغاء رمادي تيمني", sci:"Psittacus timneh", wiki:"Timneh Parrot", g:"pa", origin:"West Africa", size:"28–33 cm", life:"40–60 years", tip:"Pellets, nuts and vegetables; calcium and foraging daily", t:[5,3,3,5,5] },
  { en:"Eclectus Parrot", ar:"ببغاء إكليكتوس", sci:"Eclectus roratus", g:"pa", origin:"New Guinea and the Solomon Islands", size:"33–38 cm", life:"30–40 years", tip:"Pellets, fruit and vegetables; keep iron low and vitamin A up", t:[4,3,3,4,4] },
  { en:"Goffin's Cockatoo", ar:"كوكاتو غوفين", sci:"Cacatua goffiniana", g:"pa", origin:"Tanimbar Islands", size:"30–33 cm", life:"25–40 years", tip:"Pellets, nuts and fresh browse; needs chewing time every day", t:[4,4,3,4,5] },
  { en:"Major Mitchell's Cockatoo", ar:"كوكاتو ميتشل", sci:"Cacatua leadbeateri", wiki:"Pink Cockatoo", g:"pa", origin:"Arid inland Australia", size:"35–40 cm", life:"40–60 years", tip:"Pellets, nuts and vegetables sparingly with seed; very attention-hungry", t:[5,5,4,5,5] },
  { en:"Green-cheeked Conure", ar:"كونور أخضر الخد", sci:"Pyrrhura molinae", g:"pa", origin:"South America", size:"24–26 cm", life:"20–30 years", tip:"Pellets with fruit and vegetables; quieter than most conures", t:[2,3,1,2,4] },
  { en:"Sun Conure", ar:"كونور شمسي", sci:"Aratinga solstitialis", g:"pa", origin:"North-east South America", size:"28–32 cm", life:"20–30 years", tip:"Pellets, fruit and vegetables; loud contact calls at dawn and dusk", t:[4,5,3,3,5] },
  { en:"Nanday Conure", ar:"نانداي", sci:"Aratinga nenday", g:"pa", origin:"Central South America", size:"40–45 cm", life:"20–30 years", tip:"Pellets, seed and legumes; very loud and strong-billed", t:[4,5,4,3,5] },
  { en:"Scarlet Macaw", ar:"أرا قرمزي", sci:"Ara macao", g:"pa", origin:"Central and South America", size:"80–90 cm", life:"40–50 years", tip:"Nuts, pellets and sprouted seed; heavy chew toys daily", t:[5,5,5,5,5] },
  { en:"Hahn's Macaw", ar:"أرا هان", sci:"Diopsittaca nobilis", wiki:"Red-shouldered Macaw", g:"pa", origin:"Brazil and the Guianas", size:"15–17 cm", life:"25–30 years", tip:"Pellets, nuts and vegetables; needs real flight space", t:[3,4,2,3,4] },
  { en:"Bourke's Parrot", ar:"ببغاء بوركي", sci:"Neophema bourkii", g:"pa", origin:"Arid and semi-arid Australia", size:"24–28 cm", life:"10–20 years", tip:"Seed and pellets with greens; quiet and most active at dusk", t:[3,1,2,2,3] },
  { en:"Eastern Rosella", ar:"روزيللا شرقية", sci:"Platycercus eximius", g:"pa", origin:"South-east Australia", size:"28–33 cm", life:"15–20 years", tip:"Rosella mix, seeding grasses and greens", t:[3,3,2,2,3] },
  { en:"Crimson Rosella", ar:"روزيللا قرمزية", sci:"Platycercus elegans", g:"pa", origin:"Eastern Australia", size:"28–35 cm", life:"20–30 years", tip:"Pellets, seed and vegetables; avoid an all-seed diet", t:[3,3,3,2,3] },
  { en:"Alexandrine Parakeet", ar:"ببغاء إسكندراني", sci:"Psittacula eupatria", g:"pa", origin:"South Asia", size:"56–66 cm", life:"20–30 years", tip:"Pellets, nuts and vegetables; needs tall perching room", t:[3,4,4,3,4] },
  { en:"Blue-crowned Hanging Parrot", ar:"", sci:"Loriculus galgulus", g:"pa", origin:"Malay Peninsula and Sumatra", size:"12–15 cm", life:"15–20 years", tip:"Nectar, soft food and fruit; needs warmth and humidity", t:[4,2,2,3,3] },
  { en:"Spectacled Parrotlet", ar:"", sci:"Forpus conspicillatus", g:"pa", origin:"North Colombia and Venezuela", size:"11–13 cm", life:"15–20 years", tip:"Small seed mix, greens and egg food; house pairs separately", t:[3,2,1,2,3] },
  { en:"Pacific Parrotlet", ar:"", sci:"Forpus coelestis", g:"pa", origin:"Coastal Ecuador and Peru", size:"12–14 cm", life:"15–20 years", tip:"Pellets and small seed; territorial, so house singly", t:[3,2,1,2,3] },

  /* ---- fi: finches ---- */
  { en:"Java Sparrow", ar:"عصفور جافا", sci:"Padda oryzivora", g:"fi", origin:"Java and Bali", size:"15–17 cm", life:"5–10 years", tip:"Rice-based mix plus greens; needs grit and warmth", t:[2,3,2,1,4] },
  { en:"Indian Silverbill", ar:"", sci:"Lonchura malabarica", g:"fi", origin:"India and Sri Lanka", size:"10–13 cm", life:"5–8 years", tip:"Fine seed mix, seeding grasses and grit always available", t:[1,2,1,1,5] },
  { en:"Chestnut Munia", ar:"", sci:"Lonchura atricapilla", g:"fi", origin:"South and south-east Asia", size:"10–12 cm", life:"5–8 years", tip:"Small seed mix and greens; hardy but damp-sensitive", t:[2,2,1,1,5] },
  { en:"White-rumped Munia", ar:"", sci:"Lonchura striata", g:"fi", origin:"South and east Asia", size:"10–12 cm", life:"5–8 years", tip:"Finch mix and sprouting seed; often used to foster other finches", t:[1,2,1,1,5] },
  { en:"Scaly-breasted Munia", ar:"", sci:"Lonchura punctulata", g:"fi", origin:"Tropical Asia", size:"11–13 cm", life:"5–8 years", tip:"Seed, greens and live food during breeding", t:[2,2,1,1,5] },
  { en:"Masked Finch", ar:"", sci:"Poephila personata", g:"fi", origin:"Northern Australia", size:"14–16 cm", life:"6–10 years", tip:"Finch mix and seeding grasses; warm dry housing", t:[3,2,2,2,4] },
  { en:"Diamond Firetail", ar:"", sci:"Stagonopleura guttata", g:"fi", origin:"South-eastern Australia", size:"10–12 cm", life:"6–10 years", tip:"Finch mix plus live food; very stress-sensitive", t:[3,2,2,2,4] },
  { en:"Red-billed Firefinch", ar:"", sci:"Lagonosticta senegala", g:"fi", origin:"Sub-Saharan Africa", size:"9–10 cm", life:"5–8 years", tip:"Fine seed, greens and live food for rearing", t:[2,2,1,1,4] },
  { en:"Orange-cheeked Waxbill", ar:"", sci:"Estrilda muleta", g:"fi", origin:"Angola and Zambia", size:"10–11 cm", life:"5–8 years", tip:"Seed with plenty of sprouting feed and live food; damp-sensitive", t:[3,2,2,2,4] },
  { en:"Common Waxbill", ar:"", sci:"Estrilda astrild", g:"fi", origin:"Sub-Saharan Africa", size:"10–12 cm", life:"5–8 years", tip:"Finch mix, sprouted seed and egg food", t:[2,2,1,1,5] },
  { en:"Black-rumped Waxbill", ar:"", sci:"Estrilda troglodytes", g:"fi", origin:"West and central Africa", size:"9–10 cm", life:"5–8 years", tip:"Fine seed and live food; quiet and easily startled", t:[2,1,1,1,4] },
  { en:"Red-cheeked Cordon-bleu", ar:"", sci:"Uraeginthus bengalus", g:"fi", origin:"Sub-Saharan Africa", size:"12–15 cm", life:"5–8 years", tip:"Seed, greens and live food; needs warmth", t:[2,2,2,1,4] },
  { en:"Blue-breasted Cordon-bleu", ar:"", sci:"Uraeginthus angolensis", g:"fi", origin:"Eastern and southern Africa", size:"12–15 cm", life:"5–8 years", tip:"Finch mix plus constant live food or egg food", t:[2,2,2,1,4] },
  { en:"Purple Grenadier", ar:"", sci:"Granatina ianthinogaster", g:"fi", origin:"East Africa", size:"12–14 cm", life:"5–8 years", tip:"Seed, sprouting mix and insects in a calm aviary", t:[3,2,2,2,4] },
  { en:"African Quailfinch", ar:"", sci:"Ortalis galeata", g:"fi", origin:"Sub-Saharan Africa", size:"10–12 cm", life:"5–8 years", tip:"Fine seed and grit; a floor-nester needing dense cover", t:[3,2,2,1,5] },
  { en:"Cut-throat Finch", ar:"", sci:"Amadina fasciata", g:"fi", origin:"Africa south of the Sahara", size:"10–12 cm", life:"5–8 years", tip:"Finch mix and seeding grasses; quarantine new birds", t:[3,2,2,1,5] },
  { en:"Star Finch", ar:"", sci:"Neochmia ruficauda", g:"fi", origin:"Northern Australia", size:"10–12 cm", life:"5–8 years", tip:"Small seed and live food; gentle planted aviary", t:[3,2,2,2,4] },
  { en:"Red-faced Crimsonwing", ar:"", sci:"Cryptospiza reichenovii", g:"fi", origin:"Angolan and Zambian highlands", size:"12–15 cm", life:"5–8 years", tip:"Sprouting seed, fine greens and live food", t:[3,2,2,2,3] },
  { en:"Pin-tailed Whydah", ar:"", sci:"Vidua macroura", g:"fi", origin:"Sub-Saharan Africa", size:"8–16 cm", life:"2–5 years", tip:"Small seed and live food; needs host finches to breed", t:[3,2,2,2,3] },

  /* ---- do: doves and pigeons ---- */
  { en:"Emerald Dove", ar:"", sci:"Chalcophaps indica", g:"do", origin:"South and south-east Asia", size:"22–25 cm", life:"5–10 years", tip:"Small grain and millets; needs dense planting and warmth", t:[3,1,3,2,3] },
  { en:"Spotted Dove", ar:"يمامة منقطة", sci:"Streptopelia chinensis", g:"do", origin:"South and south-east Asia", size:"27–33 cm", life:"6–12 years", tip:"Grain and millet mix with grit always available", t:[2,2,3,2,4] },
  { en:"Laughing Dove", ar:"يمامة ضاحكة", sci:"Streptopelia senensis", g:"do", origin:"North Africa and the Middle East", size:"24–29 cm", life:"6–12 years", tip:"Small seeds and grain; drinks deep so open water is needed", t:[2,2,3,1,4] },
  { en:"Peaceful Dove", ar:"", sci:"Geopelia strenua", g:"do", origin:"Australia", size:"22–25 cm", life:"8–12 years", tip:"Fine seed and grass seeds; very dry housing", t:[2,1,2,1,4] },
  { en:"Nicobar Pigeon", ar:"حمام نيكوبار", sci:"Caloenas nicobarica", g:"do", origin:"Nicobar and Andaman Islands eastwards", size:"38–42 cm", life:"15–20 years", tip:"Pellets, grain and berries; roosts out of sight", t:[4,2,4,3,3] },
  { en:"Victoria Crowned Pigeon", ar:"حمامة فيكتوريا المتوجة", sci:"Goura victoria", g:"do", origin:"Northern New Guinea", size:"40–46 cm", life:"15–25 years", tip:"Pellets, grain, fruit and greens; needs a large walk-in", t:[4,2,5,4,3] },

  /* ---- po: poultry and gamebirds ---- */
  { en:"Turkey", ar:"ديك رومي", sci:"Meleagris gallopavo", g:"po", origin:"North America, domesticated", size:"100–125 cm", life:"6–10 years", tip:"Complete poultry feed, greens and grit; room to dust-bathe", t:[3,5,5,3,3] },
  { en:"Red Junglefowl", ar:"", sci:"Gallus gallus", g:"po", origin:"South and south-east Asia", size:"60–75 cm", life:"10–15 years", tip:"Poultry feed, grain and greens; a very active flier", t:[3,3,4,2,3] },
  { en:"Grey Junglefowl", ar:"", sci:"Gallus sonneratii", g:"po", origin:"Indian subcontinent", size:"60–75 cm", life:"8–12 years", tip:"Game-bird feed and grain; flighty, so handle as little as possible", t:[3,3,4,2,3] },
  { en:"Silkie", ar:"", sci:"Gallus gallus domesticus", g:"po", origin:"Domestic breed from East Asia", size:"35–45 cm", life:"5–10 years", tip:"Layer feed with grit; broody and easy around children", t:[1,2,2,1,3] },
  { en:"Cochin Chicken", ar:"", sci:"Gallus gallus domesticus", g:"po", origin:"Domestic breed from China", size:"45–55 cm", life:"5–10 years", tip:"Layer feed and scratch; calm but prone to obesity", t:[1,2,2,1,3] },
  { en:"Bobwhite Quail", ar:"", sci:"Colinus virginianus", wiki:"Northern Bobwhite", g:"po", origin:"North America", size:"20–25 cm", life:"3–6 years", tip:"High-protein quail crumb; keep the room quiet to stop panic injuries", t:[3,3,3,2,3] },
  { en:"California Quail", ar:"", sci:"Callipepla californica", g:"po", origin:"Western North America", size:"24–26 cm", life:"3–6 years", tip:"Quail crumb, grain and greens; needs a covered flight", t:[3,3,4,2,3] },
  { en:"Gambel's Quail", ar:"", sci:"Callipepla gambelii", g:"po", origin:"South-western North America", size:"24–28 cm", life:"3–6 years", tip:"Quail crumb with grit; dry sandy enclosure", t:[3,3,4,2,3] },
  { en:"King Quail", ar:"", sci:"Excalfactoria chinensis", g:"po", origin:"South-east Asia and northern Australia", size:"11–13 cm", life:"2–4 years", tip:"Crumb and fine seed; the smallest quail and easy to overfeed", t:[2,1,1,1,3] },
  { en:"Chukar", ar:"", sci:"Alectoris chukar", g:"po", origin:"Mountains of Eurasia", size:"32–36 cm", life:"5–10 years", tip:"Game feed and greens; needs a tall covered aviary", t:[3,3,4,2,3] },
  { en:"Red-legged Partridge", ar:"حجل أحمر الأرجل", sci:"Alectoris rufa", g:"po", origin:"Western Europe and north-west Africa", size:"32–35 cm", life:"4–8 years", tip:"Game-bird grain, greens and grit", t:[3,2,3,2,3] },
  { en:"Grey Partridge", ar:"", sci:"Perdix perdix", g:"po", origin:"Europe", size:"28–32 cm", life:"4–8 years", tip:"Partridge crumb and greens; a quiet ground bird", t:[3,2,3,2,3] },
  { en:"Green Peafowl", ar:"طاووس أخضر", sci:"Pavo muticus", g:"po", origin:"South-east Asia", size:"180–230 cm", life:"15–25 years", tip:"Poultry feed, grain and greens; extremely loud at dawn", t:[4,5,5,4,3] },
  { en:"Kalij Pheasant", ar:"", sci:"Lophura leucomelanos", g:"po", origin:"The Himalayas", size:"60–90 cm", life:"5–10 years", tip:"Game feed, greens and fruit in a heavily planted aviary", t:[3,3,4,3,2] },
  { en:"Golden Pheasant", ar:"", sci:"Chrysolophus pictus", g:"po", origin:"Mountains of central China", size:"90–110 cm", life:"5–10 years", tip:"Grain, game feed and greens; covered aviary only", t:[3,3,4,3,2] },
  { en:"Lady Amherst's Pheasant", ar:"", sci:"Chrysolophus amherstiae", g:"po", origin:"Myanmar and south-west China", size:"100–180 cm", life:"6–10 years", tip:"Game-bird feed and seeding grasses; very shy", t:[4,2,4,3,2] },

  /* ---- wa: waterfowl ---- */
  { en:"Egyptian Goose", ar:"إوز مصري", sci:"Alopochen aegyptiaca", g:"wa", origin:"Africa north of the Limpopo", size:"66–78 cm", life:"15–25 years", tip:"Goose pellets, grass and greens; guards the other birds", t:[3,4,5,3,4] },
  { en:"Black Swan", ar:"بجعة سوداء", sci:"Cygnus atratus", g:"wa", origin:"Australia", size:"110–140 cm", life:"20–30 years", tip:"Aquatic plants and swan pellets; never bread", t:[4,3,5,4,4] },
  { en:"Mandarin Duck", ar:"بط صيني", sci:"Aix galericulata", g:"wa", origin:"East Asia", size:"45–50 cm", life:"8–12 years", tip:"Waterfowl pellets, greens and insects; low safe perches", t:[3,2,4,2,3] },
  { en:"Wood Duck", ar:"", sci:"Aix sponsa", g:"wa", origin:"North America", size:"47–54 cm", life:"8–15 years", tip:"Waterfowl pellets and mast; nest boxes over water", t:[3,2,4,2,3] },
  { en:"Northern Shoveler", ar:"", sci:"Anas clypeata", g:"wa", origin:"North America and Eurasia", size:"48–56 cm", life:"5–10 years", tip:"Waterfowl pellets plus shallow muddy water to filter feed in", t:[3,2,4,2,3] },
  { en:"Eurasian Teal", ar:"", sci:"Anas crecca", g:"wa", origin:"Eurasia and North America", size:"36–39 cm", life:"5–10 years", tip:"Pellets, seeds and greens; a small shallow pond", t:[3,2,4,2,3] },
  { en:"Garganey", ar:"", sci:"Anas querquedula", g:"wa", origin:"Europe and Asia", size:"35–40 cm", life:"5–10 years", tip:"Fine pellets and plant matter; calm water away from big ducks", t:[3,2,4,2,3] },
  { en:"Comb Duck", ar:"", sci:"Sarkidiornis melanotos", g:"wa", origin:"Tropical Africa, Asia and the Americas", size:"55–66 cm", life:"8–15 years", tip:"Waterfowl pellets and greens; loves heat", t:[3,2,5,2,3] },
  { en:"Chinese Goose", ar:"إوز صيني", sci:"Anser cygnoides", g:"wa", origin:"North-east Asia", size:"70–90 cm", life:"15–25 years", tip:"Grass, pellets and hay; noisy and watchful", t:[3,5,5,3,4] },
  { en:"Cape Barren Goose", ar:"", sci:"Cereopsis novaehollandiae", g:"wa", origin:"Southern Australia and nearby islands", size:"75–90 cm", life:"20–30 years", tip:"Grass and greens; a grazing bird that needs little pelleted feed", t:[3,2,5,3,3] },
  { en:"Magpie Goose", ar:"", sci:"Anseranas semipalmata", g:"wa", origin:"Australia and New Guinea", size:"86–94 cm", life:"15–25 years", tip:"Grass, pellets and greens; needs a large pond", t:[4,3,5,3,4] },
  { en:"Crested Screamer", ar:"", sci:"Anhima cornuta", g:"wa", origin:"Amazon and Orinoco basins", size:"90–100 cm", life:"20–30 years", tip:"Pellets, greens and grass; calls loudly through the night", t:[4,5,5,3,3] },
  { en:"Marbled Duck", ar:"", sci:"Marmaronetta angustirostris", g:"wa", origin:"Mediterranean, Middle East and south Asia", size:"38–42 cm", life:"8–12 years", tip:"Fine pellets and plant matter; shallow planted water", t:[4,2,4,3,3] },
  { en:"Cotton Pygmy Goose", ar:"", sci:"Nettapus coromandelianus", g:"wa", origin:"South and south-east Asia", size:"30–36 cm", life:"8–12 years", tip:"Pellets, greens and small aquatic life; warm water", t:[3,2,3,2,4] },
  { en:"Radjah Shelduck", ar:"", sci:"Tadorna radjah", g:"wa", origin:"New Guinea and northern Australia", size:"46–53 cm", life:"10–15 years", tip:"Waterfowl pellets and greens; safe roosting posts", t:[3,3,4,3,3] },

  /* ---- ra: raptors ---- */
  { en:"Saker Falcon", ar:"الصقر الأشقر", sci:"Falco cherrug", g:"ra", origin:"Central Asia and the steppe", size:"42–60 cm", life:"15–25 years", tip:"Whole prey: quail, rats and gerbils; weathered daily in a mews", t:[5,3,4,5,1] },
  { en:"Laggar Falcon", ar:"", sci:"Falco jugger", g:"ra", origin:"Indian subcontinent", size:"48–60 cm", life:"15–20 years", tip:"Whole prey with variety; needs daily flying exercise", t:[5,3,4,4,1] },
  { en:"Red-footed Falcon", ar:"", sci:"Falco vespertinus", g:"ra", origin:"Eastern Europe into central Asia", size:"27–33 cm", life:"8–12 years", tip:"Small prey: insects, moths and small birds", t:[5,2,3,3,1] },
  { en:"Merlin", ar:"", sci:"Falco columbarius", wiki:"Merlin (bird)", g:"ra", origin:"Northern Hemisphere", size:"24–33 cm", life:"8–12 years", tip:"Small birds and mice; the fastest falcon of its size", t:[5,2,3,3,1] },
  { en:"Eurasian Sparrowhawk", ar:"", sci:"Accipiter nisus", g:"ra", origin:"Eurasia and Africa", size:"28–38 cm", life:"8–12 years", tip:"Small birds weighed to condition; a very quiet mews", t:[5,2,4,4,1] },
  { en:"Red-tailed Hawk", ar:"", sci:"Buteo jamaicensis", g:"ra", origin:"North America", size:"45–65 cm", life:"15–25 years", tip:"Rats and quail; a large mews with daily flights", t:[5,3,5,4,1] },
  { en:"Common Buzzard", ar:"", sci:"Buteo buteo", g:"ra", origin:"Europe and western Asia", size:"50–60 cm", life:"15–25 years", tip:"Whole prey; avoids overfeeding because it bulks quickly", t:[4,3,4,3,1] },
  { en:"Black-winged Kite", ar:"", sci:"Elanus caeruleus", g:"ra", origin:"Africa and south Asia", size:"31–37 cm", life:"10–15 years", tip:"Small rodents; calm in a walk-in but feeds often", t:[5,2,4,4,1] },
  { en:"Osprey", ar:"", sci:"Pandion haliaetus", g:"ra", origin:"Worldwide", size:"50–60 cm", life:"15–20 years", tip:"Whole fish only; needs a large pool and a high perch", t:[5,3,5,5,1] },
  { en:"Booted Eagle", ar:"", sci:"Hieraaetus pennatus", g:"ra", origin:"Iberia, central Asia and Africa", size:"45–55 cm", life:"15–25 years", tip:"Rats, rabbits and quail; mews plus daily flying", t:[5,3,4,4,1] },
  { en:"Tawny Eagle", ar:"", sci:"Aquila rapax", g:"ra", origin:"Africa and the Indian subcontinent", size:"65–75 cm", life:"20–30 years", tip:"Rabbits, rats and large quail; a big mews", t:[5,3,5,5,1] },
  { en:"Pharaoh Eagle-Owl", ar:"", sci:"Bubo ascalaphus", g:"ra", origin:"North Africa and the Middle East", size:"46–57 cm", life:"15–25 years", tip:"Rats and rabbits; a quiet nocturnal mews", t:[5,2,4,4,1] },
  { en:"Little Owl", ar:"", sci:"Athene noctua", g:"ra", origin:"Eurasia and north Africa", size:"21–28 cm", life:"10–15 years", tip:"Mice, day-old chicks and insects; needs a daylight cycle", t:[4,2,3,3,1] },
  { en:"Burrowing Owl", ar:"", sci:"Athene cunicularia", g:"ra", origin:"North and South America", size:"21–28 cm", life:"10–15 years", tip:"Mice and insects; must have a burrow to dig into", t:[4,3,3,3,2] },
  { en:"Snowy Owl", ar:"بومة ثلجية", sci:"Bubo scandiacus", g:"ra", origin:"The Arctic", size:"52–71 cm", life:"15–20 years", tip:"Rats and mice only; needs a cold enclosure with wind", t:[5,2,5,5,1] },

  /* ---- so: softbills and songbirds ---- */
  { en:"White-eared Bulbul", ar:"", sci:"Pycnonotus leucotis", g:"so", origin:"Arabian Peninsula and Iraq", size:"18–20 cm", life:"8–12 years", tip:"Softbill mix, fruit and insects; sensitive to iron overload", t:[3,3,3,2,4] },
  { en:"Red-vented Bulbul", ar:"", sci:"Pycnonotus cafer", g:"so", origin:"South Asia", size:"19–20 cm", life:"8–12 years", tip:"Low-iron softbill food, fruit and live food", t:[3,4,3,2,4] },
  { en:"Black Bulbul", ar:"", sci:"Hypsipetes leucocephalus", g:"so", origin:"The Himalayas and south-east Asia", size:"22–25 cm", life:"8–12 years", tip:"Fruit, softbill pellets and insects; a messy eater", t:[3,3,3,2,3] },
  { en:"Common Hill Myna", ar:"", sci:"Gracula religiosa", g:"so", origin:"South and south-east Asia", size:"25–30 cm", life:"15–25 years", tip:"Low-iron softbill food and fruit; a large airy cage", t:[4,4,4,3,4] },
  { en:"Bali Myna", ar:"", sci:"Leucopsar rothschildi", g:"so", origin:"Bali only", size:"25–30 cm", life:"15–25 years", tip:"Low-iron pellets, fruit and insects; captive-bred birds only", t:[5,3,4,4,3] },
  { en:"Rosy Starling", ar:"", sci:"Pastor roseus", g:"so", origin:"Europe and western Asia", size:"19–23 cm", life:"8–15 years", tip:"Softbill pellets, fruit and insects; keep iron low", t:[3,3,3,2,4] },
  { en:"Common Starling", ar:"زرزور", sci:"Sturnus vulgaris", g:"so", origin:"Eurasia, introduced elsewhere", size:"20–23 cm", life:"8–15 years", tip:"Softbill food and fruit; strong, messy and very social", t:[2,3,3,2,5] },
  { en:"Common Nightingale", ar:"عندليب شائع", sci:"Luscinia megarhynchos", g:"so", origin:"Europe and western Asia", size:"15–17 cm", life:"3–5 years", tip:"Insect-rich softbill food; a quiet, dim, calm cage", t:[4,2,2,2,1] },
  { en:"Song Thrush", ar:"", sci:"Turdus philomelos", g:"so", origin:"Europe and western Asia", size:"20–23 cm", life:"5–10 years", tip:"Thrush pellets, fruit and mealworms", t:[3,2,3,2,2] },
  { en:"Common Blackbird", ar:"شحرور", sci:"Turdus merula", g:"so", origin:"Eurasia, introduced elsewhere", size:"22–28 cm", life:"5–10 years", tip:"Thrush mix, fruit and worms; needs bath water", t:[3,3,3,2,2] },
  { en:"Eurasian Skylark", ar:"", sci:"Alauda arvensis", g:"so", origin:"Europe and north Africa into central Asia", size:"16–18 cm", life:"5–8 years", tip:"Seed and live food; floor space and a long light cycle", t:[4,2,3,2,2] },
  { en:"Oriental Magpie-Robin", ar:"", sci:"Copsychus saularis", g:"so", origin:"South and south-east Asia", size:"17–20 cm", life:"8–12 years", tip:"Insect and fruit diet; a tall cage with perch stages", t:[3,3,3,2,3] },
  { en:"Greater Coucal", ar:"", sci:"Centropus sinensis", g:"so", origin:"South and south-east Asia", size:"42–48 cm", life:"8–12 years", tip:"Insects, small prey and softbill food; a planted walk-in", t:[3,2,4,3,1] },
  { en:"Eurasian Hoopoe", ar:"الهدهد", sci:"Upupa epops", g:"so", origin:"Europe, Asia and Africa", size:"25–32 cm", life:"5–10 years", tip:"Insect-rich softbill food and live prey; needs bare soil to probe", t:[4,2,4,3,2] },

  /* ---- wi: wild and large species ---- */
  { en:"Emu", ar:"إيمو", sci:"Dromaius novaehollandiae", g:"wi", origin:"Australia", size:"150–190 cm", life:"10–20 years", tip:"Ratite pellets, lucerne and browse; strong fencing needed", t:[5,3,5,4,3] },
  { en:"Greater Rhea", ar:"", sci:"Rhea americana", g:"wi", origin:"South America", size:"125–175 cm", life:"10–20 years", tip:"Ratite pellets and high-fibre greens; keep them in a group", t:[5,3,5,4,4] },
  { en:"Lesser Rhea", ar:"", sci:"Rhea pennata", g:"wi", origin:"Andean South America", size:"90–100 cm", life:"10–15 years", tip:"Ratite feed, greens and grit; open running ground", t:[5,3,5,4,4] },
  { en:"Sarus Crane", ar:"كركي ساروس", sci:"Grus antigone", g:"wi", origin:"South Asia and northern Australia", size:"180–200 cm", life:"30–50 years", tip:"Crane pellets, grain and greens; a large wet enclosure", t:[5,3,5,5,3] },
  { en:"Demoiselle Crane", ar:"", sci:"Anthropoides virgo", g:"wi", origin:"North Africa and central Asia", size:"85–90 cm", life:"15–25 years", tip:"Insects, grain and crane pellets; dry running space", t:[4,3,5,3,4] },
  { en:"Brolga", ar:"", sci:"Grus rubicunda", g:"wi", origin:"Northern Australia", size:"100–130 cm", life:"20–30 years", tip:"Crane pellets, grain and greens; pair bonds last for years", t:[5,3,5,4,3] },
  { en:"Indian Grey Hornbill", ar:"قرنس هندي رمادي", sci:"Ocyceros birostris", g:"wi", origin:"Indian subcontinent", size:"43–50 cm", life:"15–20 years", tip:"Fruit, pellets and insects; low-iron diet with live food", t:[4,3,5,3,3] },
  { en:"Southern Ground Hornbill", ar:"", sci:"Bucorvus leadbeateri", g:"wi", origin:"Southern and eastern Africa", size:"100–130 cm", life:"30–60 years", tip:"Whole prey and fruit; a large planted walk-in", t:[5,3,5,5,3] },
  { en:"Great Bustard", ar:"حبارى", sci:"Otis tarda", g:"wi", origin:"Iberia and the Eurasian steppe", size:"100–125 cm", life:"15–20 years", tip:"Insects, grain and greens; open undisturbed grassland", t:[5,2,5,4,2] },
  { en:"Little Bustard", ar:"", sci:"Tetrax tetrax", g:"wi", origin:"Iberia and central Asia", size:"42–50 cm", life:"8–12 years", tip:"Insects and fine grain in a quiet grass aviary", t:[4,2,5,3,3] },
  { en:"Northern Bald Ibis", ar:"", sci:"Geronticus eremita", g:"wi", origin:"North Africa and the Levant", size:"70–80 cm", life:"15–20 years", tip:"Insects, small prey and softbill pellets; deep sand for digging", t:[5,2,5,4,3] },
  { en:"Sacred Ibis", ar:"أبو منجل المقدس", sci:"Threskiornis aethiopicus", g:"wi", origin:"Africa and the Middle East", size:"65–81 cm", life:"15–25 years", tip:"Insects, small fish and soft food; a messy wading bird", t:[4,3,5,4,4] },
  { en:"Glossy Ibis", ar:"", sci:"Plegadis falcinellus", g:"wi", origin:"Warm regions worldwide", size:"50–65 cm", life:"10–20 years", tip:"Insects, small aquatic life and softbill food", t:[4,2,5,3,4] },
  { en:"Eurasian Spoonbill", ar:"", sci:"Platalea leucorodia", g:"wi", origin:"Eurasia and north Africa", size:"80–95 cm", life:"15–25 years", tip:"Small fish and crustaceans; shallow planted water", t:[5,2,5,5,3] },
  { en:"Andean Condor", ar:"", sci:"Vultur gryphus", g:"wi", origin:"Andean South America", size:"110–130 cm", life:"40–50 years", tip:"Large carcasses and whole prey; a very tall, cold enclosure", t:[5,2,5,5,2] },
];

const line = r => {
  const p = [];
  p.push(`en:"${r.en}"`, `ar:"${r.ar || ""}"`, `sci:"${r.sci}"`);
  if (r.wiki) p.push(`wiki:"${r.wiki}"`);
  p.push(`g:"${r.g}"`, `origin:"${r.origin}"`, `size:"${r.size}"`, `life:"${r.life}"`,
    `tip:"${r.tip}"`, `file:""`, `t:[${r.t.join(",")}]`);
  return "  { " + p.join(", ") + " },\n";
};

const ORDER = ["pa", "fi", "do", "po", "wa", "ra", "so", "wi"];
let block = "";
for (const g of ORDER) {
  const rows = R.filter(r => r.g === g);
  if (!rows.length) continue;
  block += "\n" + rows.map(line).join("");
}

const src = fs.readFileSync(F, "utf8");
const L = src.split("\n");

/* --- patch 1: append the new rows inside RAW, after the Kea line ---------- */
const kea = L.findIndex(l => l.includes('sci:"Nestor notabilis"'));
if (kea < 0) throw new Error("Kea anchor missing");
let close = kea;
while (L[close].trim() !== "];") close++;
if (close - kea > 2) throw new Error("unexpected structure after Kea row");

/* duplicate guard against the existing 45 and inside the new block */
const existing = src.match(/\{ en:"([^"]+)"/g).map(s => s.match(/"([^"]+)"/)[1]);
const dups = R.map(r => r.en).filter(n => existing.includes(n));
if (dups.length) throw new Error("duplicate species name: " + dups.join(", "));
const ids = R.map(r => r.en.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
const idDups = ids.filter((x, i) => ids.indexOf(x) !== i);
if (idDups.length) throw new Error("slug collision: " + idDups.join(", "));

/* --- patch 2: kestrel arabic name ---------------------------------------- */
const kestrelOld = '  { en:"Common Kestrel", ar:"", sci:"Falco tinnunculus"';
const kestrelNew = '  { en:"Common Kestrel", ar:"العوسق", sci:"Falco tinnunculus"';

/* --- patch 3: wiki title fallback ---------------------------------------- */
const mapOld = "tip: r.tip, wiki: r.en, file: r.file || \"\",";
const mapNew = "tip: r.tip, wiki: wikiTitle(r.wiki || r.en), file: r.file || \"\",";

/* --- patch 4: wikiTitle helper next to parseRange ------------------------- */
const prAnchor = "const parseRange = str =>";
const prLine = L.find(l => l.startsWith(prAnchor));
if (!prLine) throw new Error("parseRange not found");
const helper = "/* Wikipedia titles sentence-case bird names: \"Blue-fronted Amazon\" becomes\n" +
  "   \"Blue-fronted amazon\". An explicit r.wiki wins, and is normalised the same way. */\n" +
  "const wikiTitle = s => { const t = String(s).trim(); return t.charAt(0).toUpperCase() + t.slice(1).toLowerCase(); };";

/* --- patch 5/6: count-driven copy ---------------------------------------- */
const subs = [
  ['home_sub:"45 care guides plus a world atlas', 'home_sub:"{n} care guides plus a world atlas'],
  ['id_scope_lib:"My guide (45 species)"', 'id_scope_lib:"My guide ({n} species)"'],
  ['home_sub:"٤٥ دليلاً للعناية', 'home_sub:"{n} دليلاً للعناية'],
  ['id_scope_lib:"مرشدي (٤٥ نوعاً)"', 'id_scope_lib:"مرشدي ({n} نوعاً)"'],
  ['<p>${esc(tr("home_sub"))}</p>', '<p>${esc(tr("home_sub", { n: SPECIES.length }))}</p>'],
  ['${esc(tr("id_scope_lib"))}', '${esc(tr("id_scope_lib", { n: SPECIES.length }))}'],
  ['content="Field guide to 45 bird species with care calculators',
   'content="Bird care guides with feed and incubation calculators'],
];
const missing = subs.filter(([a]) => !src.includes(a)).map(([a]) => a);
if (missing.length) throw new Error("anchor missing: " + JSON.stringify(missing));

/* --- patch 7: pooled photo hydration ------------------------------------- */
const hydrOld = `  const ids = uniq($$("[data-id]", root).map(n => n.dataset.id));
  for (const id of ids) {
    const b = byId(id), box = root.querySelector('.spec[data-id="' + id + '"] .thumb');
    if (b && box) loadPhoto(box, b);
  }`;
const hydrNew = `  const ids = uniq($$("[data-id]", root).map(n => n.dataset.id));
  /* A guide of 150 species means 150 photo lookups. Six at a time keeps the first
     paint ahead of the browser's per-host stream limit instead of queueing behind it. */
  let i = 0;
  const worker = async () => {
    while (i < ids.length) {
      if (!root.isConnected) return;
      const id = ids[i++];
      const b = byId(id), box = root.querySelector('.spec[data-id="' + id + '"] .thumb');
      if (b && box) await loadPhoto(box, b);
    }
  };
  await Promise.all(Array.from({ length: Math.min(6, ids.length) }, worker));`;
if (!src.includes(hydrOld)) throw new Error("hydrateCards body changed");

let out = L.slice(0, close).join("\n") + "\n" + block + L.slice(close).join("\n");
subs.forEach(([a, b]) => { out = out.split(a).join(b); });
out = out.replace(kestrelOld, kestrelNew);
out = out.replace(mapOld, mapNew);
out = out.replace(prLine, helper + "\n" + prLine);
out = out.replace(hydrOld, hydrNew);

const before = (src.match(/\{ en:"/g) || []).length;
const after = (out.match(/\{ en:"/g) || []).length;
console.log("rows before:", before, "added:", R.length, "rows after:", after);
console.log("bytes:", src.length, "->", out.length, "| lines:", src.split("\n").length, "->", out.split("\n").length);
if (!write) { console.log("DRY RUN — nothing written"); return; }
fs.writeFileSync(F, out);
console.log("written");
