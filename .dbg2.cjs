const fs=require('fs');const html=fs.readFileSync('index.html','utf8');
const start=html.indexOf('const RAW = ['), end=html.indexOf('\n];',start), marker=html.indexOf('/* Wave three',start);
const head=start+'const RAW = '.length;
const trim=s=>s.replace(/^[\s,]+/,'').replace(/[\s,]+$/,'');
const A=trim(html.slice(head,marker)), B=trim(html.slice(marker,end).replace(/\/\* Wave three[\s\S]*?\*\//,''));
for (const [n,txt] of [['A',A],['B',B]]) {
  const lines=txt.split('\n');
  console.log(n,'lines',lines.length,'first',JSON.stringify(lines[0].slice(0,60)),'last',JSON.stringify(lines[lines.length-1].slice(0,80)));
  try { const r=new Function('return ['+txt+']')(); console.log(n,'ok',r.length); } catch(e){ console.log(n,'ERR',e.message); }
}
