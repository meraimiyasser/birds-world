const fs=require('fs');
const s=fs.readFileSync('index.html','utf8');
const a=s.indexOf('const RAW = ['), b=s.indexOf('\n];',a);
const raw=eval(s.slice(a+'const RAW = '.length,b).trim()+']');
raw.filter(r=>r.ar&&r.g==='pa').forEach(r=>console.log(r.g,'|',r.en,'=>',r.ar));
console.log('---so/fi/other named---');
raw.filter(r=>r.ar&&r.g!=='pa').forEach(r=>console.log(r.g,'|',r.en,'=>',r.ar));
