const b={sci:"X"},esc=s=>s,tr=(k,o)=>k+JSON.stringify(o),breedOf=()=>null,sciBase=s=>s,isDomesticForm=()=>true;
const out=`<div>${isDomesticForm(b) ? `<span title="${esc(tr("breed_of", { n: (breedOf(b) || { sci: sciBase(b.sci) }).sci }))">${esc(tr("breed_chip"))}</span>` : ""}</div>`;
console.log(out);
