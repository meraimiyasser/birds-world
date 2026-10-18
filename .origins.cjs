const fs=require('fs');const s=fs.readFileSync('index.html','utf8');
const a=s.indexOf('const RAW = ['), b=s.indexOf('\n];',a);
const raw=eval(s.slice(a+'const RAW = '.length,b).trim()+']');
const oa=s.indexOf('ORIGIN_AR: {'), ob=s.indexOf('\n  }',oa);
const map=eval('({'+s.slice(oa+'ORIGIN_AR: {'.length,ob)+'})');
const need=[...new Set(raw.map(r=>r.origin))].filter(o=>!map[o]);
console.log('rows',raw.length,'| origins',new Set(raw.map(r=>r.origin)).size,'| missing',need.length);
need.forEach(o=>console.log(JSON.stringify(o)));
