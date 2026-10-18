const fs=require('fs');
const s=fs.readFileSync('index.html','utf8');
const a=s.indexOf('const RAW = ['), b=s.indexOf('\n];',a);
const raw=eval(s.slice(a+'const RAW = '.length,b).trim()+']');
const g={};raw.forEach(r=>{g[r.g]=(g[r.g]||0)+1});
console.log('rows',raw.length,JSON.stringify(g));
console.log('arNamed',raw.filter(r=>r.ar).length);
console.log(raw.map(r=>r.en).join(' | '));
