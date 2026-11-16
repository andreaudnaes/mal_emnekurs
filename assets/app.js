/* Kursmotor: ruting, margdefinisjoner, tester, fremgang og verktøy for interaktive figurer. */
(function(){
/* ---------- OPPSETT: fyll inn for emnet ---------- */
const EMNE={
 kode:'EMNEKODE',                        // vises øverst i menyen og på forsiden
 navn:'Emnenavn',                        // fullt navn på emnet
 semester:'Semester og år',              // for eksempel «Høst 2026»
 eksamen:'2027-06-01T09:00:00+02:00',    // dato og klokkeslett for eksamen. Styrer nedtellingen og taket i spaced repetition.
 lagring:'emnekurs.mal.v1'               // nøkkelen fremgangen lagres under i nettleseren. Gi hvert kurs sin egen.
};
const KEY=EMNE.lagring;
const C=window.C={mods:[],W:{},F:{},G:[],pages:{},extra:{},EMNE};
document.title=EMNE.kode+' Eksamenskurs';
let S={q:{}};
try{S=Object.assign(S,JSON.parse(localStorage.getItem(KEY)||'{}'))}catch(e){}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}};
C.S=S;C.save=save;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
C.$=$;C.$$=$$;
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
C.esc=esc;
C.add=m=>{C.mods.push(m)};

/* ---------- matematikk ---------- */
function math(el){if(window.renderMathInElement)renderMathInElement(el,{delimiters:[{left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false}],throwOnError:false,ignoredClasses:['nomath']})}
C.math=math;

/* ---------- fremgang ---------- */
const allQ=m=>{const r=[];m.sections.forEach(s=>(s.quiz||[]).forEach((q,i)=>r.push({q,id:`${m.id}.${s.id}.${i}`,m,s})));return r};
C.allQ=allQ;
function prog(list){let done=0,sum=0;list.forEach(x=>{const st=S.q[x.id];if(st&&st.d){done++;sum+=st.s}});return{n:list.length,done,sum,pct:list.length?Math.round(100*done/list.length):0,acc:done?Math.round(100*sum/done):0}}
C.prog=prog;

/* ---------- meny ---------- */
function side(route){
 const[r,sec]=route;let h=`<a class="brand" href="#hjem">${esc(EMNE.kode)}<small>${esc(EMNE.navn)} · eksamenskurs</small></a>`;
 const link=(id,i,t,p)=>`<a class="n ${r===id?'on':''}" href="#${id}"><span class="i">${i}</span><span>${t}</span><span class="p">${p}</span></a>`;
 const grp=label=>{h+=`<h4>${label}</h4>`;C.mods.forEach(m=>{const p=prog(allQ(m));h+=link(m.id,m.nr,m.short||m.title,p.done?p.pct+'%':'');
  if(r===m.id){h+='<div class="sub">';m.sections.forEach(s=>{const sp=prog(allQ(m).filter(x=>x.s===s));h+=`<a href="#${m.id}/${s.id}" data-s="${s.id}"><span>${s.title}</span><i class="${sp.n&&sp.done===sp.n?'full':''}">${sp.done}/${sp.n}</i></a>`});h+='</div>'}})};
 grp('Moduler');
 h+=`<h4>Eksamen</h4>`+link('eksamen','E','Slik er eksamen','')+link('bank','B','Oppgavebank','')+link('rat','Q','Quizer',C.ratDone&&C.ratDone()?C.ratDone()+'/'+C.RATS.length:'')+link('tegn','T','Tegneoppgaver','')+link('prove','P','Prøveeksamen','')+`<h4>Flashcards</h4>`+link('kort','F','Flashcards',C.fcDue&&C.fcDue()?C.fcDue():'')+link('laer','L','Lær',C.lnPct&&C.lnPct()?C.lnPct()+'%':'')+`<h4>Oppslag</h4>`+link('feil','!','Repeter feil','')+link('formler','Σ','Formler','')+link('ordliste','Aa','Ordliste','');
 h+=`<div class="tools"><button id="rsBtn">Nullstill</button></div>`;
 const n=$('#side');n.innerHTML=h;
 $('#rsBtn').onclick=e=>{if(e.target.dataset.c){S.q={};S.rat={};save();route_()}else{e.target.dataset.c=1;e.target.textContent='Sikker?';setTimeout(()=>{e.target.textContent='Nullstill';delete e.target.dataset.c},3000)}};
}

/* ---------- sidemeny og lesefremdrift ---------- */
const narrow=()=>matchMedia('(max-width:860px)').matches;
/* Knappen skjuler menyen på brede skjermer og husker valget. På mobil åpner den menyen som et lag oppå siden. */
function syncSide(){const n=narrow(),open=n?$('#side').classList.contains('open'):!S.noside,b=$('#menuBtn');
 document.body.classList.toggle('noside',!!S.noside);document.body.classList.toggle('side-open',n&&open);
 b.textContent=open?'‹':'☰';b.title=open?'Skjul meny':'Vis meny';b.setAttribute('aria-label',b.title);b.setAttribute('aria-expanded',open)}
const maxScroll=()=>document.documentElement.scrollHeight-innerHeight;
function toggleSide(){if(narrow()){$('#side').classList.toggle('open');syncSide();return}
 const r=maxScroll()>0?scrollY/maxScroll():0;S.noside=!S.noside;save();syncSide();layoutNotes();scrollTo(0,r*maxScroll());updateBar()}
let barQueued=false;
function updateBar(){const bar=$('#readBar');bar.hidden=!$('#main section.sec');if(bar.hidden)return;const m=maxScroll();$('i',bar).style.transform=`scaleX(${m>0?Math.min(1,scrollY/m):0})`}
function queueBar(){if(barQueued)return;barQueued=true;requestAnimationFrame(()=>{barQueued=false;updateBar()})}

/* ---------- termer ---------- */
let RX=null,MAP={};
function buildRx(){const alts=[];C.G.forEach(g=>{(g.a||[g.t]).forEach(a=>{MAP[a.toLowerCase()]=MAP[a.toLowerCase()]||g;alts.push(a)})});alts.sort((a,b)=>b.length-a.length);
 RX=new RegExp('(?<![\\p{L}\\p{N}-])('+alts.map(a=>a.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|')+')(?![\\p{L}\\p{N}])','giu')}
function matchG(txt){const g=MAP[txt.toLowerCase()];if(!g)return null;
 const a=(g.a||[g.t]).find(x=>x.toLowerCase()===txt.toLowerCase());
 if(a&&/[A-Z]/.test(a)&&a!==txt)return null; /* forkortelser er case-sensitive */
 return g}
/* Engelsk fagbegrep i parentes første gang begrepet brukes i hver seksjon, og i hver tabell det står i. */
const WORD=/^[-–\/\p{L}\p{N}]+/u;
/* Ord der den generelle regelen gir feil engelsk. Tom streng betyr at teksten allerede er engelsk. */
/* Fyll inn ved behov, på formen 'norsk ord':'english term'. */
const ALT={};
function enFor(g,surf,tail,after){const k=surf+tail;let en=k in ALT?ALT[k]:surf in ALT?ALT[surf]:null;
 if(en===null){const m=g.en.match(/^(.*?)\s*\(([^)]*)\)$/),base=m?m[1]:g.en,acr=m?m[2]:'';
  if(g.t.toLowerCase()===g.en.toLowerCase())return '';
  const s=surf.toLowerCase(),l=base.toLowerCase();
  if(s===l||s===g.en.toLowerCase())return '';
  if(!/[A-Z]/.test(surf)&&l.includes(s))return '';
  en=!acr||acr.split(/,\s*/).includes(surf)?base:base+', '+acr}
 if(/^\s*\(/.test(after))return ''; /* teksten har allerede en parentes rett etter ordet */
 if(!en||after.slice(0,90).toLowerCase().includes(en.split(',')[0].toLowerCase()))return '';
 return en}
function linkTerms(root,seen,optical){
 const secs=$$('section.sec',root);
 secs.forEach(sec=>{const local=new Set();
  const walker=document.createTreeWalker(sec,NodeFilter.SHOW_TEXT,{acceptNode(n){const p=n.parentElement;if(!p||p.closest('h1,h2,h3,.katex,svg,.wg,.check,code,.term,.term2,.nomath,button,a,.ana,.enp,figcaption,.why>b:first-child,.exam>b:first-child,.trap>b:first-child,.ex>b:first-child,.key>b:first-child'))return NodeFilter.FILTER_REJECT;return n.nodeValue.trim()?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT}});
  const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
  const tsets=new Map();
  nodes.forEach(n=>{const txt=n.nodeValue;let last=0,m,frag=null;RX.lastIndex=0;
   /* Tabeller har egen huskeliste, slik at begrepet får engelsk i parentes i hver tabell selv om det er forklart før. */
   const tb=n.parentElement.closest('table');let ts=null;if(tb){ts=tsets.get(tb);if(!ts){ts=new Set();tsets.set(tb,ts)}}
   const put=(g,surf,start)=>{const first=!seen.has(g.k),fresh=!local.has(g.k),tf=!!ts&&!ts.has(g.k);if(!first&&!fresh&&!tf)return;
    frag=frag||document.createDocumentFragment();frag.append(txt.slice(last,start));
    const sp=document.createElement('span');sp.className=first?('term'+(optical?' opt':'')):'term2';sp.dataset.k=g.k;sp.textContent=surf;frag.append(sp);last=start+surf.length;seen.add(g.k);local.add(g.k);if(ts)ts.add(g.k);
    const tail=(txt.slice(last).match(WORD)||[''])[0],en=enFor(g,surf,tail,txt.slice(last+tail.length));
    if(en){if(tail){frag.append(tail);last+=tail.length;RX.lastIndex=last}
     const e=document.createElement('span');e.className='enp';e.textContent=' ('+en+')';frag.append(e)}};
   /* En tabellcelle som bare inneholder tittelen på et begrep, regnes som begrepet selv om ordet ellers er for flertydig til å lenkes. */
   const cell=tb&&n.parentElement.closest('td'),bare=txt.trim();
   const whole=cell&&cell.textContent.trim()===bare&&!matchG(bare)?C.G.find(g=>g.t.toLowerCase()===bare.toLowerCase()):null;
   if(whole)put(whole,bare,txt.indexOf(bare));
   else while((m=RX.exec(txt))){const g=matchG(m[1]);if(g)put(g,m[1],m.index)}
   if(frag){if(last<txt.length)frag.append(txt.slice(last));const par=n.parentElement;n.replaceWith(frag);
    /* står begrepet sist i <b> eller <i>, flyttes parentesen ut av uthevingen */
    if(/^(B|I|STRONG|EM)$/.test(par.tagName)&&par.lastChild&&par.lastChild.classList&&par.lastChild.classList.contains('enp')){const e=par.lastChild,nx=((par.nextSibling&&par.nextSibling.nodeValue)||'').slice(0,90).toLowerCase(),key=e.textContent.slice(2,-1).split(',')[0].toLowerCase();
     /* står det engelske allerede rett etter uthevingen, trengs ingen ny parentes */
     if(nx.includes(key))e.remove();else par.after(e)}}})})}
function byK(k){return C.G.find(g=>g.k===k)}
/* Tospråklig definisjon: engelsk begrep og definisjon først, så norsk. */
const capEn=s=>/^(mmWave|[a-z][A-Z])/.test(s)?s:s.charAt(0).toUpperCase()+s.slice(1);C.capEn=capEn;
function defHtml(g){const same=g.t.toLowerCase()===g.en.toLowerCase();return `<b>${esc(capEn(g.en))}</b>${same?'':`<i>${esc(g.t)}</i>`}<span class="de" lang="en">${g.de}</span><span class="dn">${g.d}</span>`}
C.defHtml=defHtml;
function layoutNotes(){const col=$('.mcol');if(!col||getComputedStyle(col).display==='none')return;
 const base=col.getBoundingClientRect().top,GAP=9;
 /* Notater som ville overlappe, samles i grupper. Hver gruppe sentreres rundt ordene sine, slik at avstanden til ordet blir så liten som mulig. */
 const groups=[];$$('.mn',col).forEach(n=>{const t=$(`.term[data-k="${n.dataset.k}"]`);if(!t)return;const a=t.getBoundingClientRect().top-base,h=n.offsetHeight+GAP;
  let g={items:[{n,h,off:0,a}],H:h,top:a};
  while(groups.length){const p=groups[groups.length-1];if(p.top+p.H<=g.top)break;groups.pop();
   g.items.forEach(i=>{i.off+=p.H});const items=p.items.concat(g.items),H=p.H+g.H;
   g={items,H,top:Math.max(0,items.reduce((s,i)=>s+i.a-i.off,0)/items.length)}}
  groups.push(g)});
 groups.forEach(g=>g.items.forEach(i=>{i.n.style.top=g.top+i.off+'px'}))}
function notes(root){const col=$('.mcol',root);if(!col)return;let h='';$$('.term',root).forEach(t=>{const g=byK(t.dataset.k);h+=`<div class="mn" data-k="${g.k}">${defHtml(g)}</div>`});col.innerHTML=h;math(col);
 $$('.term',root).forEach(t=>{const n=$(`.mn[data-k="${t.dataset.k}"]`,col);t.onmouseenter=()=>n.classList.add('hot');t.onmouseleave=()=>n.classList.remove('hot')});
 layoutNotes();if(document.fonts&&document.fonts.ready)document.fonts.ready.then(layoutNotes)}
function far(t){const n=$(`.mn[data-k="${t.dataset.k}"]`);return !n||Math.abs(n.getBoundingClientRect().top-t.getBoundingClientRect().top)>70}
function popFor(t){const g=byK(t.dataset.k);if(!g)return;const p=$('#pop');p.innerHTML=defHtml(g);math(p);p.hidden=false;const r=t.getBoundingClientRect();p.style.left=Math.max(8,Math.min(r.left+scrollX,innerWidth-335))+'px';p.style.top=(r.bottom+scrollY+6)+'px'}
document.addEventListener('mouseover',e=>{const t=e.target.closest&&e.target.closest('.term2,.term');if(t&&(t.classList.contains('term2')||getComputedStyle($('.mcol')||document.body).display==='none'||far(t)))popFor(t);else if(!e.target.closest||!e.target.closest('#pop'))$('#pop').hidden=true});
document.addEventListener('click',e=>{const t=e.target.closest&&e.target.closest('.term2,.term');if(t){popFor(t);e.stopPropagation()}else if(!e.target.closest('#pop'))$('#pop').hidden=true});

/* ---------- tester ---------- */
function shuffle(a,seed){const r=a.slice();let s=seed||1;for(let i=r.length-1;i>0;i--){s=(s*9301+49297)%233280;const j=Math.floor(s/233280*(i+1));[r[i],r[j]]=[r[j],r[i]]}return r}
const hash=s=>{let h=7;for(const c of s)h=(h*31+c.charCodeAt(0))%100003;return h+1};
const parseNum=t=>{t=String(t).trim().replace(/\s/g,'').replace(',','.').replace(/[x×·*]10\^?/i,'e');const v=parseFloat(t);return isFinite(v)?v:NaN};
const LABEL={mc:'Flervalg',num:'Tallsvar',ref:'Refleksjon',ex:'Eksamensoppgave'};
/* Oppgaver er på norsk. Sett en:1 på en oppgave for engelske merkelapper, for eksempel når eksamen er på engelsk. */
function renderQ(host,q,id,onchange){
 const st=()=>S.q[id]||(S.q[id]={});
 const set=(s,extra)=>{Object.assign(st(),{d:1,s},extra||{});save();onchange&&onchange()};
 const div=document.createElement('div');div.className='qq';
 const eng=!!q.en,lab=q.en?{mc:'Multiple choice',ref:'Drawing task',ex:'Exam task'}[q.t]||LABEL[q.t]:LABEL[q.t];const tag=`<div class="qk"><span>${lab}</span>${q.y?`<span class="y">${/^\d/.test(q.y)?(eng?'Exam ':'Eksamen '):''}${q.y}</span>`:''}${q.pts?`<span>${q.pts} ${eng?'points':'poeng'}</span>`:''}</div>`;
 div.innerHTML=tag+`<div class="qt">${q.q}</div><div class="qa"></div>`;
 const qa=$('.qa',div);
 const fb=(ok,html)=>{let f=$('.fb',div);if(!f){f=document.createElement('div');f.className='fb';qa.after(f)}f.innerHTML=(ok===null?'':`<span class="res ${ok?'okc':'noc'}">${ok?'Riktig.':'Ikke helt.'}</span> `)+html;math(f)};
 if(q.t==='mc'){
  const order=q.fix?q.o.map((_,i)=>i):shuffle(q.o.map((_,i)=>i),hash(id));
  order.forEach(i=>{const b=document.createElement('button');b.className='op';b.innerHTML=q.o[i];b.dataset.i=i;qa.append(b)});
  const lock=i=>{$$('.op',qa).forEach(b=>{b.disabled=true;const k=+b.dataset.i;if(k===q.a||(q.a2!==undefined&&k===q.a2))b.classList.add('right');else if(k===i)b.classList.add('wrong')})};
  const again=()=>{const b=document.createElement('button');b.className='btn';b.textContent='Prøv på nytt';b.style.marginTop='7px';b.onclick=()=>{delete S.q[id];save();const n=renderQ(null,q,id,onchange);div.replaceWith(n);math(n);onchange&&onchange()};$('.fb',div).append(document.createElement('br'),b)};
  qa.onclick=e=>{const b=e.target.closest('.op');if(!b||b.disabled)return;const i=+b.dataset.i,ok=i===q.a||i===q.a2;lock(i);fb(ok,q.e||'');if(!ok)again();set(ok?1:0,{v:i})};
  const s=S.q[id];if(s&&s.d){lock(s.v);const ok=s.s===1;fb(ok,q.e||'');if(!ok)again()}
 }else if(q.t==='num'){
  qa.innerHTML=`<div class="nin"><input inputmode="decimal" aria-label="Svar" placeholder="Svar"><span>${q.u||''}</span><button class="btn pri">Sjekk</button>${q.h?'<button class="btn hint">Hint</button>':''}<button class="btn sh">Vis løsning</button></div>`;
  const inp=$('input',qa);const s0=S.q[id];
  const sol=()=>`Fasit: <b>${q.av||q.a} ${q.u||''}</b>. ${q.e||''}`;
  const check=()=>{const v=parseNum(inp.value);if(isNaN(v)){fb(null,'Skriv et tall. Du kan bruke komma, punktum eller 2e6.');return}const tol=q.tol===undefined?.02:q.tol;const ok=Math.abs(v-q.a)<=Math.abs(q.a)*tol+1e-12;if(ok)fb(true,sol());else{const r=q.a!==0&&Math.abs(v/q.a);const hint=r&&[1e3,1e6,1e9,1e-3,1e-6,1e-9,8,.125].some(f=>Math.abs(r/f-1)<.03)?' Sjekk enheten: svaret ditt er riktig bortsett fra en faktor.':'';fb(false,'Prøv igjen.'+hint+(st().t>=1?' Bruk gjerne hint eller vis løsningen.':''))}st().t=(st().t||0)+1;if(ok||!st().d)set(ok?1:0,{v:inp.value,t:st().t});else if(ok)set(1)};
  /* Løsningsknappen veksler: et nytt trykk tar løsningen bort igjen. */
  const sh=$('.sh',qa);let solOn=false;const solOff=()=>{solOn=false;sh.textContent='Vis løsning'};
  $('.pri',qa).onclick=()=>{solOff();check()};inp.onkeydown=e=>{if(e.key==='Enter'){solOff();check()}};
  const hb=$('.hint',qa);if(hb)hb.onclick=()=>{solOff();fb(null,q.h)};
  sh.onclick=()=>{if(solOn){const f=$('.fb',div);if(f)f.remove();solOff();return}fb(null,sol());solOn=true;sh.textContent='Skjul løsning';if(!st().d)set(0)};
  if(s0&&s0.d){inp.value=s0.v||'';if(s0.s===1)fb(true,sol())}
 }else if(q.t==='ref'||q.t==='ex'){
  const pts=q.pts||0;const s0=S.q[id]||{};
  qa.innerHTML=(q.t==='ref'?`<textarea placeholder="Skriv med egne ord før du ser modellsvaret."></textarea>`:`<textarea placeholder="Løs på papir eller her, slik du ville gjort på eksamen."></textarea>`)+`<button class="btn pri" style="margin-top:6px">Vis ${q.t==='ref'?'modellsvar':'løsning'}</button>`;
  const ta=$('textarea',qa);ta.value=s0.v||'';ta.oninput=()=>{st().v=ta.value;save()};
  const reveal=()=>{const k=q.k||[];const cks=k.map((x,i)=>`<label class="ck"><input type="checkbox" data-i="${i}" ${(s0.c||[]).includes(i)?'checked':''}><span>${x}</span></label>`).join('');
   const sc=q.t==='ex'?`<div class="ctl" style="margin-top:8px"><label>Gi deg selv poeng (etter fasiten) <output>${s0.p||0} / ${pts}</output></label><input type="range" min="0" max="${pts}" step="0.5" value="${s0.p||0}"></div>`:'';
   fb(null,`${q.m||q.s||''}${k.length?`<div style="margin-top:8px"><b>Dette bør svaret inneholde. Kryss av det du fikk med:</b>${cks}</div>`:''}${sc}`);
   const f=$('.fb',div);$$('input[type=checkbox]',f).forEach(c=>c.onchange=()=>{const on=$$('input[type=checkbox]:checked',f).map(x=>+x.dataset.i);s0.c=on;set(k.length?on.length/k.length:1,{c:on,v:ta.value})});
   const rg=$('input[type=range]',f);if(rg)rg.oninput=()=>{$('output',f).textContent=`${rg.value} / ${pts}`;s0.p=+rg.value;set(pts?rg.value/pts:1,{p:+rg.value,v:ta.value})};
   if(!st().d)set(0,{v:ta.value});};
  /* Knappen veksler mellom vis og skjul. Valget huskes, så en skjult løsning holder seg skjult neste gang. */
  const pb=$('.pri',qa),lbl=q.t==='ref'?'modellsvar':'løsning';
  const show=()=>{reveal();pb.textContent='Skjul '+lbl;if(st().h){delete st().h;save()}};
  pb.onclick=()=>{const f=$('.fb',div);if(f){f.remove();pb.textContent='Vis '+lbl;st().h=1;save()}else show()};
  if(s0.d&&!s0.h)show();
 }
 if(host)host.append(div);return div}
C.renderQ=renderQ;
function mountQuiz(el,sec,mod,after){if(!sec.quiz||!sec.quiz.length)return;
 const box=document.createElement('div');box.className='check';
 const list=allQ(mod).filter(x=>x.s===sec);
 const head=()=>{const p=prog(list);return `${sec.quizTitle||'Sjekkpunkt'}<span>${p.done}/${p.n}${p.done?` · ${p.acc}%`:''}</span>`};
 box.innerHTML=`<h3>${head()}</h3>`;
 list.forEach(x=>renderQ(box,x.q,x.id,()=>{$('h3',box).innerHTML=head();after&&after()}));
 el.append(box)}

/* ---------- moduler ---------- */
function expand(html){return html
 .replace(/\[\[w:([a-z0-9_]+)(?:\|([^\]]*))?\]\]/gi,(m,n,o)=>`<div class="wg" data-w="${n}" data-o="${o||''}"></div>`)
 .replace(/\[\[f:([a-z0-9_]+)\|([^\]]*)\]\]/gi,(m,n,c)=>`<figure data-f="${n}"><figcaption>${c}</figcaption></figure>`)}
function mountAll(root){
 $$('figure[data-f]',root).forEach(f=>{const svg=C.F[f.dataset.f];if(svg)f.insertAdjacentHTML('afterbegin',typeof svg==='function'?svg():svg);else f.insertAdjacentHTML('afterbegin','<p class="noc">Mangler figur '+f.dataset.f+'</p>')});
 $$('.wg[data-w]',root).forEach(w=>{const fn=C.W[w.dataset.w];if(fn){try{fn(w,w.dataset.o)}catch(e){console.error(w.dataset.w,e);w.textContent='Figurfeil: '+w.dataset.w}}else{w.textContent='Mangler widget '+w.dataset.w;console.error('mangler',w.dataset.w)}})}
C.mountAll=mountAll;C.expand=expand;
function renderMod(m,sec){
 const opt=m.part==='op';const main=$('#main');
 const i=C.mods.indexOf(m),prev=C.mods[i-1],next=C.mods[i+1];
 main.innerHTML=`<div class="page"><div class="col"><header><div class="eyebrow ${opt?'opt':''}">Modul ${m.nr} · ${m.src||''}</div><h1>${m.title}</h1><p class="lead">${m.lead}</p>${m.goals?`<div class="goal"><b>Etter denne modulen kan du</b><ul>${m.goals.map(g=>`<li>${g}</li>`).join('')}</ul></div>`:''}</header>
 ${m.sections.map((s,n)=>`<section class="sec" id="${s.id}"><h2><span class="no">${m.nr}.${n+1}</span>${s.title}</h2>${expand(s.html||'')}<div class="qhost"></div></section>`).join('')}
 <div class="nav2">${prev?`<a class="btn" href="#${prev.id}">← ${prev.short||prev.title}</a>`:'<span></span>'}${next?`<a class="btn pri" href="#${next.id}">${next.short||next.title} →</a>`:`<a class="btn pri" href="#eksamen">Til eksamensdelen →</a>`}</div>
 </div><aside class="mcol" aria-label="Definisjoner"></aside></div>`;
 const col=$('.col',main);
 mountAll(col);
 m.sections.forEach(s=>mountQuiz($(`#${s.id} .qhost`,col),s,m,()=>sideRefresh()));
 math(col);linkTerms(col,new Set(),opt);notes(main);
 if(window._ro)_ro.disconnect();window._ro=new ResizeObserver(()=>{layoutNotes();queueBar()});_ro.observe(col);
 const links=()=>$$('#side .sub a');
 window._io&&_io.disconnect();window._io=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){links().forEach(a=>a.classList.toggle('on',a.dataset.s===e.target.id))}})},{rootMargin:'-10% 0px -80% 0px'});
 $$('section.sec',col).forEach(s=>_io.observe(s));
 if(sec){const t=document.getElementById(sec);if(t)t.scrollIntoView()}else scrollTo(0,0);updateBar()}
let curRoute=['hjem'];
function sideRefresh(){const y=$('#side').scrollTop;side(curRoute);$('#side').scrollTop=y}
function route_(){const h=(location.hash||'#hjem').slice(1).split('/');
 if(curRoute[0]===h[0]&&h[1]&&$('#main section.sec')){curRoute=h;const t=document.getElementById(h[1]);if(t)t.scrollIntoView();$('#side').classList.remove('open');syncSide();return}
 curRoute=h;side(h);$('#side').classList.remove('open');syncSide();$('#pop').hidden=true;
 const m=C.mods.find(x=>x.id===h[0]);
 if(m){renderMod(m,h[1]);document.title=EMNE.kode+' · '+(m.short||m.title);return}
 window._ro&&_ro.disconnect();window._io&&_io.disconnect();
 const pg=C.pages[h[0]]||C.pages.hjem;$('#main').innerHTML='';pg($('#main'),h);scrollTo(0,0);updateBar();document.title=EMNE.kode+' Eksamenskurs'}
C.route=route_;C.sideRefresh=sideRefresh;
C.start=()=>{buildRx();addEventListener('hashchange',route_);addEventListener('resize',()=>{syncSide();layoutNotes();queueBar()});addEventListener('scroll',queueBar,{passive:true});$('#menuBtn').onclick=toggleSide;syncSide();route_()};

/* ---------- verktøy for interaktive figurer ---------- */
const uid=(()=>{let i=0;return()=>'c'+(++i)})();
/* Tekst oppå mørke felt i figurene blir hvit, slik at den alltid er lett å lese. */
function textContrast(root){const rs=$$('svg rect',root);if(!rs.length)return;const bx=rs.map(r=>({r,b:r.getBoundingClientRect()}));
 $$('svg text',root).forEach(t=>{const q=t.getBoundingClientRect(),x=q.left+q.width/2,y=q.top+q.height/2;
  for(let i=bx.length-1;i>=0;i--){const{r,b}=bx[i];if(x<b.left||x>b.right||y<b.top||y>b.bottom)continue;
   const m=getComputedStyle(r).fill.match(/[\d.]+/g);if(!m||getComputedStyle(r).fill==='none')continue;if(m.length>3&&+m[3]===0)continue;
   const op=+(r.getAttribute('opacity')||1),ch=m.slice(0,3).map(v=>(v*op+255*(1-op))/255).map(c=>c<=.03928?c/12.92:((c+.055)/1.055)**2.4);
   if(.2126*ch[0]+.7152*ch[1]+.0722*ch[2]<.17)t.style.fill='#fff';break}})}
C.ui=(root,title,note)=>{root.innerHTML=`<div class="wg-h"><b>${title}</b><span>${note||'Interaktiv'}</span></div><div class="wg-c"></div><div class="wg-s"></div><div class="wg-r"></div>`;
 const c=$('.wg-c',root),s=$('.wg-s',root),r=$('.wg-r',root);const V={};let draw=()=>{};
 const u={c,s,r,V,
  svg(h){s.innerHTML=h;textContrast(s)},html(h){s.innerHTML=h;math(s);textContrast(s)},out(h){r.innerHTML=h;math(r)},
  params(def,fn){draw=()=>fn(V);Object.keys(def).forEach(k=>{const d=def[k],box=document.createElement('div');box.className='ctl';if(d.w)box.style.flexBasis=d.w;
    if(d.opt){V[k]=d.v===undefined?d.opt[0][0]:d.v;box.innerHTML=`<label>${d.l||''}</label><div class="seg">${d.opt.map(o=>`<button type="button" data-v="${o[0]}" class="${o[0]==V[k]?'on':''}">${o[1]}</button>`).join('')}</div>`;
     $$('button',box).forEach(b=>b.onclick=()=>{const raw=b.dataset.v;V[k]=isNaN(+raw)||raw===''?raw:+raw;$$('button',box).forEach(x=>x.classList.toggle('on',x===b));draw()})}
    else if(d.text!==undefined){V[k]=d.text;const id=uid();box.innerHTML=`<label for="${id}">${d.l}</label><input id="${id}" type="text" value="${esc(d.text)}">`;$('input',box).oninput=e=>{V[k]=e.target.value;draw()}}
    else{const fmt=d.f||(x=>x);const id=uid();const tov=x=>d.log?Math.pow(10,x):x;const tox=x=>d.log?Math.log10(x):x;V[k]=d.v;
     box.innerHTML=`<label for="${id}">${d.l}<output>${fmt(d.v)}</output></label><input id="${id}" type="range" min="${tox(d.min)}" max="${tox(d.max)}" step="${d.step||(d.log?.01:1)}" value="${tox(d.v)}">`;
     $('input',box).oninput=e=>{V[k]=tov(+e.target.value);$('output',box).textContent=fmt(V[k]);draw()}}
    c.append(box)});draw();return u},
  btn(label,fn,pri){const b=document.createElement('button');b.type='button';b.className='btn'+(pri?' pri':'');b.textContent=label;b.onclick=fn;const w=document.createElement('div');w.className='ctl';w.style.flex='0 0 auto';w.style.alignSelf='end';w.append(b);c.append(w);return b},
  redraw(){draw()}};return u};
/* linjeplott */
C.plot=o=>{const W=o.w||640,H=o.h||240,l=o.l===undefined?46:o.l,r=12,t=10,b=o.xl?38:24;const[x0,x1]=o.x,[y0,y1]=o.y;
 const lx=o.logx,ly=o.logy,f=v=>lx?Math.log10(v):v,g=v=>ly?Math.log10(v):v;
 const X=v=>l+(f(v)-f(x0))/(f(x1)-f(x0))*(W-l-r),Y=v=>H-b-(g(v)-g(y0))/(g(y1)-g(y0))*(H-t-b);
 let h=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${o.aria||'Graf'}">`;
 (o.yt||[]).forEach(v=>{h+=`<line class="gr" x1="${l}" x2="${W-r}" y1="${Y(v)}" y2="${Y(v)}"/><text class="axt" x="${l-5}" y="${Y(v)+4}" text-anchor="end">${o.yf?o.yf(v):v}</text>`});
 (o.xt||[]).forEach(v=>{h+=`<text class="axt" x="${X(v)}" y="${H-b+15}" text-anchor="middle">${o.xf?o.xf(v):v}</text><line class="ax" x1="${X(v)}" x2="${X(v)}" y1="${H-b}" y2="${H-b+4}"/>`});
 h+=`<line class="ax" x1="${l}" x2="${W-r}" y1="${H-b}" y2="${H-b}"/><line class="ax" x1="${l}" x2="${l}" y1="${t}" y2="${H-b}"/>`;
 if(o.xl)h+=`<text class="axt" x="${(l+W-r)/2}" y="${H-5}" text-anchor="middle">${o.xl}</text>`;
 if(o.yl)h+=`<text class="axt" transform="translate(11 ${(t+H-b)/2}) rotate(-90)" text-anchor="middle">${o.yl}</text>`;
 h+=(o.pre?o.pre(X,Y):'');
 /* Linjetype skiller hovedkurvene. Svake referansekurver og kurver med egen linjetype teller ikke. */const DASH=['','7 4','2 4','9 3 2 3'];let dk=0;(o.s||[]).forEach(s=>{const dd=s.d||(s.c==='var(--c5)'?'':DASH[dk++%4]);const d=s.p.filter(p=>isFinite(p[0])&&isFinite(p[1])).map(p=>`${X(p[0]).toFixed(1)},${Y(Math.max(ly?y0:-1e99,p[1])).toFixed(1)}`).join(' ');h+=`<polyline fill="none" stroke="${s.c||'var(--c1)'}" stroke-width="${s.w||2}" ${dd?`stroke-dasharray="${dd}"`:''} points="${d}"/>`});
 h+=(o.post?o.post(X,Y):'')+`</svg>`;return h};
C.range=(a,b,n)=>Array.from({length:n+1},(_,i)=>a+(b-a)*i/n);
C.fmt=(v,d=2)=>{if(!isFinite(v))return '∞';const a=Math.abs(v);if(a>=1e9)return(v/1e9).toFixed(d)+' G';if(a>=1e6)return(v/1e6).toFixed(d)+' M';if(a>=1e3)return(v/1e3).toFixed(d)+' k';return v.toFixed(d)+' '};
/* Tall inne i formler: tx gir desimalkomma, sci gir tierpotens */
C.tx=(v,d=2)=>String(Number((+v).toFixed(d))).replace('.','{,}');
C.sci=v=>{const[m,e]=(+v).toExponential(2).split('e');return m.replace(/\.?0+$/,'').replace('.','{,}')+'\\cdot10^{'+(+e)+'}'};
C.nb=(v,d=2)=>Number(v.toFixed(d)).toLocaleString('nb-NO');
})();
