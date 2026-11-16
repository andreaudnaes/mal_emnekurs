/* Quizer: korte flervalgsprøver, for eksempel quizene som er gitt i løpet av semesteret.
   Studenten svarer på alle spørsmålene først og får rettingen til slutt.
   Format per quiz: n = nummer, m = modulen quizen hører til, t = tittel, q = spørsmålene.
   Format per spørsmål: [spørsmål, [riktig, feil, feil, feil], forklaring]. Riktig svar står alltid først og stokkes ved visning. */
(function(){const P=C.pages,$=C.$,$$=C.$$,S=C.S;
const RATS=[
{n:1,m:'m1',t:'Eksempelquiz',q:[
["Her står første spørsmål i quizen.",["Riktig alternativ","Galt alternativ","Galt alternativ","Galt alternativ"],"Her står forklaringen som vises etter rettingen."],
["Her står andre spørsmål i quizen.",["Riktig alternativ","Galt alternativ","Galt alternativ","Galt alternativ"],"Her står forklaringen."],
["Her står tredje spørsmål. En quiz har gjerne ti spørsmål.",["Riktig alternativ","Galt alternativ","Galt alternativ","Galt alternativ"],"Her står forklaringen."]
]},
{n:2,m:'m1',t:'Eksempelquiz nummer to',q:[
["Her står første spørsmål i den andre quizen.",["Riktig alternativ","Galt alternativ","Galt alternativ","Galt alternativ"],"Her står forklaringen."],
["Her står andre spørsmål i den andre quizen.",["Riktig alternativ","Galt alternativ","Galt alternativ","Galt alternativ"],"Her står forklaringen."]
]}
];
C.RATS=RATS;

const hash=s=>{let h=7;for(let i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))%233280;return h||1};
const shuffle=(a,seed)=>{const r=a.slice();let s=seed;for(let i=r.length-1;i>0;i--){s=(s*9301+49297)%233280;const j=Math.floor(s/233280*(i+1));[r[i],r[j]]=[r[j],r[i]]}return r};
const st=n=>{S.rat=S.rat||{};return S.rat[n]=S.rat[n]||{a:{},g:0,t:0}};
const score=r=>{const s=st(r.n);return r.q.filter((_,i)=>s.a[i]===0).length};
C.ratDone=()=>RATS.filter(r=>(S.rat||{})[r.n]&&S.rat[r.n].g).length;

P.rat=el=>{el.innerHTML=`<div class="page wide"><div class="col"><div class="eyebrow">Eksamen</div><h1>Quizer</h1>
<p class="lead">Her skal quizene fra semesteret ligge. Kryss av ett alternativ på hvert spørsmål. Du får ikke vite hva som er riktig før du har svart på alle og trykker «Rett quizen».</p>
<div class="seg" id="rs"></div><div id="rb" style="margin-top:14px"></div></div></div>`;
 let cur=RATS.find(r=>r.n===S.ratN)||RATS[0];
 const seg=()=>{$('#rs').innerHTML=RATS.map(r=>{const s=st(r.n);return `<button class="${r===cur?'on':''}" data-n="${r.n}">RAT ${r.n}${s.g?` (${score(r)}/${r.q.length})`:''}</button>`}).join('');
  $$('#rs button').forEach(b=>b.onclick=()=>{cur=RATS.find(r=>r.n===+b.dataset.n);S.ratN=cur.n;C.save();draw()})};
 const draw=()=>{seg();const r=cur,s=st(r.n),box=$('#rb'),mod=C.mods.find(m=>m.id===r.m);
  const modLink=mod?`<a class="btn" href="#${mod.id}">Modul ${mod.nr}: ${C.esc(mod.short||mod.title)}</a>`:'';
  let h=`<h2 style="margin-bottom:.2em">RAT ${r.n}: ${C.esc(r.t)}</h2><div id="rres"></div><div class="check">`;
  r.q.forEach((q,i)=>{const order=shuffle([0,1,2,3],hash('rat'+r.n+'.'+i+'.'+(s.t||0)));
   h+=`<div class="qq" data-i="${i}"><div class="qk"><span>Flervalg</span><span class="y">Spørsmål ${i+1}</span></div><div class="qt">${C.esc(q[0])}</div><div class="qa">`+
    order.map(k=>`<button class="op" data-k="${k}">${C.esc(q[1][k])}</button>`).join('')+`</div></div>`});
  h+=`</div><div class="ratbar"><span id="rcnt"></span><button class="btn pri" id="rgo">Rett quizen</button><button class="btn" id="rre">Start på nytt</button></div>`;
  box.innerHTML=h;
  const paint=()=>{const n=Object.keys(s.a).length;
   $$('.qq',box).forEach(d=>{const i=+d.dataset.i,v=s.a[i];$$('.op',d).forEach(b=>{const k=+b.dataset.k;b.classList.toggle('sel',!s.g&&v===k);b.classList.toggle('right',!!s.g&&k===0);b.classList.toggle('wrong',!!s.g&&v===k&&k!==0);b.disabled=!!s.g});
    let f=$('.fb',d);if(s.g){if(!f){f=document.createElement('div');f.className='fb';d.append(f)}const ok=v===0;f.innerHTML=`<span class="res ${ok?'okc':'noc'}">${ok?'Riktig.':'Feil.'}</span> ${r.q[i][2]}`}else if(f)f.remove()});
   $('#rcnt').textContent=s.g?`Rettet: ${score(r)} av ${r.q.length} riktige`:`Besvart ${n} av ${r.q.length}`;
   $('#rgo').hidden=!!s.g;$('#rgo').disabled=n<r.q.length;$('#rre').hidden=!s.g&&!n;
   const res=$('#rres');
   if(s.g){const sc=score(r),wrong=r.q.map((_,i)=>i).filter(i=>s.a[i]!==0);
    res.innerHTML=`<div class="exam"><b>Resultat</b><p><b>${sc} av ${r.q.length} riktige.</b> ${wrong.length?`Se over spørsmål ${wrong.map(i=>i+1).join(', ')}. Forklaringen står under hvert spørsmål.`:'Alt riktig.'}</p><p>${modLink}</p></div>`}
   else res.innerHTML=`<p style="margin:.3em 0 0">Hører til ${modLink||'kurset'}</p>`;
   seg()};
  box.onclick=e=>{const b=e.target.closest('.op');if(!b||s.g)return;const i=+b.closest('.qq').dataset.i;s.a[i]=+b.dataset.k;C.save();paint()};
  $('#rgo').onclick=()=>{if(Object.keys(s.a).length<r.q.length)return;s.g=1;C.save();paint();C.sideRefresh&&C.sideRefresh();$('#rres').scrollIntoView({block:'start'})};
  $('#rre').onclick=e=>{const b=e.target;if(!b.dataset.c&&(s.g||Object.keys(s.a).length)){b.dataset.c=1;b.textContent='Sikker? Svarene slettes';setTimeout(()=>{b.textContent='Start på nytt';delete b.dataset.c},3000);return}
   S.rat[r.n]={a:{},g:0,t:(s.t||0)+1};C.save();draw();C.sideRefresh&&C.sideRefresh();scrollTo(0,0)};
  paint()};
 draw()};
})();
