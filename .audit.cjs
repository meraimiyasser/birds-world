const fs = require("fs");
const s = fs.readFileSync("index.html", "utf8");
const keys = ["atlas_h","atlas_sub","atlas_have","atlas_enrich","photo","atlas_tax","atlas_cap","atlas_start","atlas_stop","atlas_clear","atlas_source","search_ph","atlas_none","atlas_include","yes","atlas_running","atlas_done","atlas_enriched","atlas_cleared","atlas_noimg","atlas_promote","note_saved","no_results","id_h","id_sub","id_rec","id_fromfile","id_test","id_feats","id_lib","id_scope","id_scope_lib","id_scope_fav","id_scope_atlas","id_build","id_clearlib","id_indexed","id_none","id_srclink","id_pitch","id_shape","id_rate2","id_cands","id_conf","id_note","id_mic_no","id_listening","id_noaudio","id_notonal","id_quiet","id_building","id_libempty","open","ai_h","ai_ph","ai_send","ai_reset","ai_cloud","ai_local","ai_cloud_hint","ai_off","ai_triage","ai_recommend","ai_facts","ai_compare","ai_search","ai_strip","ai_thinking","ai_src","ai_fail","ai_empty","nav_atlas","nav_id","nav_ai","search","settings_h"];
const missing = keys.filter(k => !new RegExp("(?:^|[,\\s{])" + k + "\\s*:").test(s));
console.log("MISSING TR KEYS:", missing.join(", ") || "none");
const fns = ["speciesName","logSighting","confirmDlg","audioCtx","isFav","drawBands","renderNav","fuzzyScore","clamp","esc","el","on","toast","tr"];
console.log("FN DEF:", fns.map(f => f + ":" + (new RegExp("(?:function|const|let)[ \\t]+" + f + "\\b").test(s) ? "y" : "N")).join(" "));
const atlas = ["load","stats","count","match","run","stop","clear","get","rows","state"];
console.log("Atlas keys:", atlas.map(a => a + ":" + (new RegExp("(^|\\n)\\s*" + a + "\\s*[(:]").test(s) ? "y" : "?")).join(" "));
const ac = ["entries","quality","identify","analyse","start","finish","supported","synth","build","stopBuild","clearLibrary","removeReference","build"];
console.log("Acoustic keys:", ac.map(a => a + ":" + (new RegExp("\\n\\s*" + a + "\\s*[(:]").test(s) ? "y" : "?")).join(" "));
const ai = ["bi","local","cloudOn","stream","invalidate"];
console.log("AI keys:", ai.map(a => a + ":" + (new RegExp("\\n\\s*" + a + "\\s*[(:]").test(s) ? "y" : "?")).join(" "));
["MAX_CARDS","ATLAS","VOICE","timeoutMs"].forEach(k => console.log("CFG." + k + ":", new RegExp(k + "\\s*:").test(s) ? "y" : "N"));
[".kb",".kv",".bar",".arow",".wave",".rng",".inline",".table-wrap",".spacer",".empty",".chip"].forEach(c =>
  console.log("CSS " + c + ":", new RegExp("\\n\\s*" + c.replace(".", "\\.").replace(/-/g, "\\-") + "\\s*[\\,{]").test(s) ? "y" : "N"));
console.log("SPECIES as array:", /const SPECIES\s*=\s*\[/.test(s) ? "y" : "N", "| map:", /const SPECIES\s*=\s*new Map|SPECIES\s*=\s*[^[]*map/.test(s) ? "y" : "N");
