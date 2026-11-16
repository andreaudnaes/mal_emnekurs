/* Flashcards og Lær. Kortene ligger i cards.js.
   Flashcards har to sorteringer: vanlig (kan / kan ikke, kort du ikke kan stokkes inn igjen i bunken)
   og spaced repetition (fire vurderinger som bestemmer når kortet kommer tilbake).
   Lær følger Quizlet Learn: runder på sju nye kort, først flervalg på alle, så skriver du svaret og vurderer selv.
   Begge sidene kan vises i fullskjerm, der menyen og valgene skjules. */
(function(){const P=C.pages,$=C.$,$$=C.$$,S=C.S,esc=C.esc,B=C.cards;
/* Lagret tilstand: sr = spaced repetition per kort, ba = vanlig sortering per bolk, lv = nivå i Lær per kort, ms = bommet i Lær. */
const F=S.fc=S.fc||{};['sr','ba','lv','ms'].forEach(k=>F[k]=F[k]||{});
const ALL='alle',DAY=864e5,MIN=6e4,EXAM=new Date(C.EMNE.eksamen);
const deck=b=>{const r=[];B.forEach(x=>{if(b===ALL||x.id===b)x.c.forEach((c,i)=>r.push({id:x.id+'.'+i,f:c[0],b:c[1],g:x}))});return r};
const byId={};deck(ALL).forEach(c=>byId[c.id]=c);
const rnd=n=>Math.floor(Math.random()*n);
const shuf=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=rnd(i+1);[a[i],a[j]]=[a[j],a[i]]}return a};
const day0=t=>{const d=new Date(t);d.setHours(0,0,0,0);return d};
const validBolk=b=>b===ALL||B.some(x=>x.id===b)?b:B[0].id;
const segH=(opts,cur)=>opts.map(o=>`<button type="button" data-v="${o[0]}" class="${o[0]===cur?'on':''}">${o[1]}</button>`).join('');
const segBind=(root,fn)=>$$('button',root).forEach(b=>b.onclick=()=>fn(b.dataset.v));
const bolkOpts=()=>B.map(x=>[x.id,`${x.nr}. ${esc(x.t)} (${x.c.length})`]).concat([[ALL,`Alle bolker (${deck(ALL).length})`]]);
/* Knapp som må trykkes to ganger før den sletter noe */
const confirmBtn=(b,fn)=>{const t=b.textContent;b.onclick=()=>{if(b.dataset.c){fn();return}b.dataset.c=1;b.textContent='Sikker? Fremgangen slettes';setTimeout(()=>{b.textContent=t;delete b.dataset.c},3000)}};
/* Kortet med for- og bakside. first = 'f' viser forsiden først, 'b' baksiden. */
const cardH=(c,first)=>{const a=first==='b'?[c.b,'Bakside',c.f,'Forside']:[c.f,'Forside',c.b,'Bakside'];
 const tx=s=>`<div class="tx${s.length>60?' long':''}">${esc(s)}</div>`;
 return `<div class="fcard" id="fc" tabindex="0" role="button" aria-label="Snu kortet"><div class="fin"><div class="fface"><small>${a[1]}</small>${tx(a[0])}<em>Klikk på kortet eller trykk mellomrom for å snu</em></div><div class="fface fbk"><small>${a[3]}</small>${tx(a[2])}</div></div></div>`};
/* Tastatur: siden som vises setter keyH. Returnerer den true, er tasten brukt. */
let keyH=null;
addEventListener('keydown',e=>{if(!keyH||!$('#fcRoot')||e.metaKey||e.ctrlKey||e.altKey||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;if(keyH(e.key))e.preventDefault()});

/* Fullskjerm: skjuler meny, overskrift og valg, slik at bare kortene vises. Esc lukker. */
const bolkName=b=>b===ALL?'Alle bolker':(x=>x.nr+'. '+x.t)(B.find(x=>x.id===b));
const topH=`<div class="ftop"><span id="fTi"></span><button type="button" class="btn" id="fFull"></button></div>`;
const isFull=()=>document.body.classList.contains('fcfull');
const setFull=on=>{document.body.classList.toggle('fcfull',on);const b=$('#fFull');if(b)b.textContent=on?'Lukk fullskjerm (Esc)':'Fullskjerm';scrollTo(0,0)};
const topBind=title=>{$('#fTi').textContent=title;const b=$('#fFull');b.textContent=isFull()?'Lukk fullskjerm (Esc)':'Fullskjerm';b.onclick=()=>{setFull(!isFull());b.blur()}};
addEventListener('hashchange',()=>{if(!/^#(kort|laer)/.test(location.hash))setFull(false)});
addEventListener('keydown',e=>{if(e.key==='Escape'&&isFull()&&$('#fcRoot'))setFull(false)});

/* ---------- spaced repetition ---------- */
/* Tilstand per kort: i = siste intervall i dager (0 = aldri lært eller glemt), e = letthetsfaktor, d = forfall (ms),
   s = 1 mens kortet er på korte steg i samme økt, h = 1 etter «Vanskelig». Intervallene får et tak slik at alt kommer tilbake før eksamen. */
function nextSR(c,g,now){c=c||{};const base=c.i||0;let e=c.e||2.5;
 if(g===0)return{i:0,e:Math.max(1.3,e-.2),d:now+5*MIN,s:1};
 if(g===1)return{i:base,e:Math.max(1.3,e-.15),d:now+10*MIN,s:1,h:1};
 let i;
 if(g===2)i=!base?2:c.h?Math.max(2,Math.round(base*1.2)):Math.max(base+1,Math.round(base*e));
 else{i=!base?3:Math.max(base+2,Math.round(base*e*1.3));e+=.15}
 const left=Math.round((day0(EXAM)-day0(now))/DAY)-1;
 if(left>=1&&i>left)i=left;
 const d=day0(now);d.setDate(d.getDate()+i);
 return{i,e,d:d.getTime()}}
const srLabel=(c,g,now)=>{if(g===0)return '≤5 min';if(g===1)return '≤10 min';const i=nextSR(c,g,now).i;return i+(i===1?' dag':' dager')};
function srCount(cards,now){const n={ny:0,laer:0,due:0,later:0,next:0};cards.forEach(c=>{const s=F.sr[c.id];if(!s)n.ny++;else if(s.s)n.laer++;else if(s.d<=now)n.due++;else{n.later++;if(!n.next||s.d<n.next)n.next=s.d}});return n}
/* Rekkefølge: kort på korte steg som har forfalt, så repetisjoner som har forfalt, så nye kort. Er bare ventende kort igjen, vises det som forfaller først. */
function srPick(cards,now){let learn=null,rev=null,nw=null,wait=null;const d=c=>F.sr[c.id].d;
 cards.forEach(c=>{const s=F.sr[c.id];
  if(!s){nw=nw||c}
  else if(s.s){if(s.d<=now){if(!learn||s.d<d(learn))learn=c}else if(!wait||s.d<d(wait))wait=c}
  else if(s.d<=now&&(!rev||s.d<d(rev)))rev=c});
 return learn||rev||nw||wait}
C.fcDue=()=>{const now=Date.now();let n=0;Object.keys(F.sr).forEach(id=>{const s=F.sr[id];if(byId[id]&&(s.s||s.d<=now))n++});return n};
C.lnPct=()=>{const n=Object.keys(F.lv).filter(id=>byId[id]&&F.lv[id]>=2).length;return n?Math.round(100*n/deck(ALL).length):0};

/* ---------- Flashcards ---------- */
P.kort=el=>{F.b=validBolk(F.b);F.m=F.m==='sr'?'sr':'ba';F.side=F.side==='b'?'b':'f';
 el.innerHTML=`<div class="page wide"><div class="col" id="fcRoot"><div class="eyebrow">Flashcards</div><h1>Flashcards</h1>
<p class="lead">Snu kortet og vurder selv om du kunne det. Velg bolk og hvordan kortene skal sorteres.</p>
<div class="fopt"><div><label>Bolk</label><div class="seg" id="fB"></div></div><div><label>Sortering</label><div class="seg" id="fM"></div></div><div><label>Vis først</label><div class="seg" id="fS"></div></div></div>
<p class="fhelp" id="fH"></p>${topH}<div class="fwrap" id="fx"></div></div></div>`;
 const box=$('#fx');let undo=null;
 const opts=()=>{$('#fB').innerHTML=segH(bolkOpts(),F.b);$('#fM').innerHTML=segH([['ba','Vanlig sortering'],['sr','Spaced repetition']],F.m);$('#fS').innerHTML=segH([['f','Forside'],['b','Bakside']],F.side);
  segBind($('#fB'),v=>{F.b=v;undo=null;C.save();draw()});segBind($('#fM'),v=>{F.m=v;C.save();draw()});segBind($('#fS'),v=>{F.side=v;C.save();draw()});
  topBind(bolkName(F.b)+' · '+(F.m==='sr'?'Spaced repetition':'Vanlig sortering'));
  $('#fH').innerHTML=F.m==='sr'?'<b>Spaced repetition:</b> gi kortet en av fire vurderinger. «Gjenta» og «Vanskelig» henter kortet tilbake i samme økt. «Greit» og «Lett» sender det flere dager frem, og lenger for hver gang du kan det. Alt kommer tilbake før eksamen.':'<b>Vanlig sortering:</b> kort du ikke kan stokkes inn igjen lenger bak i bunken og kan dukke opp når som helst. Bunken er ferdig når du kan alle.'};
 const flipper=on=>{const fc=$('#fc');let fl=false;const flip=()=>{fc.classList.toggle('flip');if(!fl){fl=true;on&&on()}};fc.onclick=flip;return flip};

 const basic=()=>{const cards=deck(F.b);let st=F.ba[F.b];
  const fresh=()=>{st=F.ba[F.b]={q:cards.map(c=>c.id),k:[],w:[],n:cards.length};undo=null;C.save()};
  if(!st||st.n!==cards.length||st.q.concat(st.k).some(id=>!byId[id]))fresh();
  const show=()=>{const tot=cards.length;
   let h=`<div class="fstat"><span>Kan <b>${st.k.length}</b></span><span>Øver fortsatt <b>${st.w.length}</b></span><span>Igjen i bunken <b>${st.q.length}</b></span></div><div class="bar opt"><i style="width:${100*st.k.length/tot}%"></i></div>`;
   if(!st.q.length){box.innerHTML=h+`<div class="fdone"><b>Du kan alle ${tot} kortene i bolken.</b><p>Start på nytt for å gå gjennom bunken en gang til.</p><button class="btn pri" id="bR">Start på nytt</button></div>`;
    $('#bR').onclick=()=>{fresh();show()};keyH=null;return}
   const c=byId[st.q[0]];
   box.innerHTML=h+cardH(c,F.side)+`<div class="fact"><button class="btn fno" id="bN">✗ Kan ikke ennå</button><button class="btn fyes" id="bY">✓ Kan</button></div>
<div class="ftools"><span>Taster: mellomrom snur, ← kan ikke, → kan</span><button class="btn" id="bU"${undo?'':' disabled'}>Angre</button><button class="btn" id="bS">Stokk</button><button class="btn" id="bR">Start på nytt</button></div>`;
   const flip=flipper();
   const ans=ok=>{undo=JSON.stringify(st);const id=st.q.shift();
    if(ok){st.k.push(id);st.w=st.w.filter(x=>x!==id)}
    else{if(!st.w.includes(id))st.w.push(id);const lo=Math.min(3,st.q.length);st.q.splice(lo+rnd(st.q.length-lo+1),0,id)}
    C.save();show()};
   $('#bN').onclick=()=>ans(false);$('#bY').onclick=()=>ans(true);
   $('#bU').onclick=()=>{if(!undo)return;st=F.ba[F.b]=JSON.parse(undo);undo=null;C.save();show()};
   $('#bS').onclick=()=>{st.q=shuf(st.q);undo=null;C.save();show()};
   confirmBtn($('#bR'),()=>{fresh();show()});
   keyH=k=>{if(k===' '){flip();return true}if(k==='ArrowLeft'||k==='1'){ans(false);return true}if(k==='ArrowRight'||k==='2'){ans(true);return true}}};
  show()};

 const sr=()=>{const cards=deck(F.b);
  const show=()=>{const now=Date.now(),n=srCount(cards,now),c=srPick(cards,now);
   let h=`<div class="fstat"><span>Nye <b>${n.ny}</b></span><span>Lærer nå <b>${n.laer}</b></span><span>Til repetisjon <b>${n.due}</b></span><span>Planlagt senere <b>${n.later}</b></span></div><div class="bar opt"><i style="width:${100*n.later/cards.length}%"></i></div>`;
   const tools=`<div class="ftools"><span>Taster: mellomrom snur, 1–4 vurderer</span><button class="btn" id="bR">Nullstill bolken</button></div>`;
   if(!c){box.innerHTML=h+`<div class="fdone"><b>Ferdig for nå.</b><p>Ingen kort i bolken forfaller akkurat nå. Neste kort kommer ${new Date(n.next).toLocaleDateString('nb-NO',{weekday:'long',day:'numeric',month:'long'})}.</p></div>`+tools;keyH=null}
   else{const s=F.sr[c.id],kind=!s?'Nytt kort':s.s?'Lærer nå':'Repetisjon';
    box.innerHTML=h+`<div class="fkind">${kind}</div>`+cardH(c,F.side)+`<div class="srb">`+['Gjenta','Vanskelig','Greit','Lett'].map((t,g)=>`<button type="button" data-g="${g}" disabled><b>${t}</b><span>${srLabel(s,g,now)}</span></button>`).join('')+`</div><p class="fhint" id="fT">Snu kortet før du vurderer det.</p>`+tools;
    let open=false;const flip=flipper(()=>{open=true;$$('.srb button').forEach(b=>b.disabled=false);$('#fT').hidden=true});
    const grade=g=>{if(!open)return;F.sr[c.id]=nextSR(F.sr[c.id],g,Date.now());C.save();C.sideRefresh&&C.sideRefresh();show()};
    $$('.srb button').forEach(b=>b.onclick=()=>grade(+b.dataset.g));
    keyH=k=>{if(k===' '){flip();return true}if(/^[1-4]$/.test(k)){grade(+k-1);return true}}}
   confirmBtn($('#bR'),()=>{cards.forEach(c=>delete F.sr[c.id]);C.save();C.sideRefresh&&C.sideRefresh();show()})};
  show()};
 const draw=()=>{opts();F.m==='sr'?sr():basic()};
 draw()};

/* ---------- Lær ---------- */
/* Kortene deles i runder på sju nye kort. I en runde kommer først flervalg på alle kortene, så skriver du svaret på alle.
   Kort du bommer på kommer tilbake til du har klart alle, og først da åpner neste runde. Nivå per kort: 0 = ikke lært, 1 = klart flervalg, 2 = mestret. */
P.laer=el=>{F.lb=validBolk(F.lb);F.la=F.la==='f'?'f':'b';const N=7;
 el.innerHTML=`<div class="page wide"><div class="col" id="fcRoot"><div class="eyebrow">Flashcards</div><h1>Lær</h1>
<p class="lead">Kortene kommer i runder på sju nye kort. Først får du flervalg på alle. Så får du begrepet eller spørsmålet, skriver svaret selv, ser fasiten og vurderer om du klarte det. Neste runde åpner når du har klart alle.</p>
<div class="fopt"><div><label>Bolk</label><div class="seg" id="lB"></div></div><div><label>Svar med</label><div class="seg" id="lA"></div></div></div>
${topH}<div class="fwrap" id="lx"></div></div></div>`;
 const box=$('#lx'),lv=id=>Math.min(2,F.lv[id]||0);let cards=[],chunks=[],R=null;
 const opts=()=>{$('#lB').innerHTML=segH(bolkOpts(),F.lb);$('#lA').innerHTML=segH([['b','Bakside'],['f','Forside']],F.la);
  segBind($('#lB'),v=>{F.lb=v;C.save();begin()});segBind($('#lA'),v=>{F.la=v;C.save();opts();ask()});
  topBind(bolkName(F.lb)+' · Lær')};
 /* Fremdriftslinjen: ett felt per runde, tallet på mestrede kort står etter de ferdige rundene, og totalen står sist. */
 const bar=()=>{const cur=chunks.findIndex(c=>c.some(x=>lv(x.id)<2)),at=cur<0?chunks.length:cur,m=cards.filter(c=>lv(c.id)>=2).length;
  const seg=c=>`<i><b style="width:${100*c.reduce((s,x)=>s+lv(x.id),0)/(2*c.length)}%"></b></i>`;
  return `<div class="qbar" role="img" aria-label="${m} av ${cards.length} kort mestret">${chunks.slice(0,at).map(seg).join('')}<span class="qn on">${m}</span>${chunks.slice(at).map(seg).join('')}<span class="qn">${cards.length}</span></div>`};
 const tools=()=>`<div class="ftools"><button class="btn" id="lR">Nullstill bolken</button></div>`;
 const bindTools=()=>confirmBtn($('#lR'),()=>{cards.forEach(c=>{delete F.lv[c.id];delete F.ms[c.id]});C.save();C.sideRefresh&&C.sideRefresh();begin()});
 /* Finner runden du står i, og om den er på flervalg (p = 0) eller skriving (p = 1).
    Nivåene er lagret, så en runde du forlot halvveis fortsetter der du slapp. */
 const load=()=>{const i=chunks.findIndex(c=>c.some(x=>lv(x.id)<2));if(i<0){R=null;return}
  const c=chunks[i],p=c.some(x=>lv(x.id)===0)?0:1;
  R={i,c,p,q:shuf(c.filter(x=>lv(x.id)===p).map(x=>x.id)),miss:R&&R.i===i?R.miss:{},sum:false}};
 const begin=()=>{cards=deck(F.lb);chunks=[];for(let i=0;i<cards.length;i+=N)chunks.push(cards.slice(i,i+N));R=null;load();opts();ask()};
 const result=ok=>{const id=R.q.shift();
  if(ok)F.lv[id]=R.p+1;else{R.miss[id]=1;R.q.splice(Math.min(R.q.length,2+rnd(2)),0,id)}
  C.save();
  if(!R.q.length){if(R.p===0)load();else R.sum=true}
  ask()};
 const ask=()=>{
  if(!R){box.innerHTML=bar()+`<div class="fdone"><b>Alle ${cards.length} kortene i bolken er mestret.</b><p>Velg en annen bolk, eller nullstill for å lære bolken på nytt.</p></div>`+tools();bindTools();keyH=null;return}
  if(R.sum){const last=R.i===chunks.length-1;
   box.innerHTML=bar()+`<div class="fdone"><b>Runde ${R.i+1} av ${chunks.length} er ferdig</b><p>Du har klart alle ${R.c.length} kortene i runden.</p><button class="btn pri" id="lN">${last?'Fullfør':'Neste runde'}</button></div>
<div class="tw"><table class="lsum"><tbody>${R.c.map(c=>`<tr><td>${esc(c.f)}</td><td>${esc(c.b)}</td><td><span class="chip ${R.miss[c.id]?'x':'m'}">${R.miss[c.id]?'Bommet underveis':'Mestret'}</span></td></tr>`).join('')}</tbody></table></div>`+tools();
   const next=()=>{load();ask();scrollTo(0,0)};$('#lN').onclick=next;bindTools();C.sideRefresh&&C.sideRefresh();
   keyH=k=>{if(k==='Enter'||k===' '){next();return true}};return}
  const c=byId[R.q[0]],ask_=F.la==='f'?c.b:c.f,right=F.la==='f'?c.f:c.b;
  const kind=(t)=>`<div class="qk"><span>${t}</span><span class="y">Runde ${R.i+1} av ${chunks.length} · ${R.q.length} igjen</span></div><div class="lp${ask_.length>60?' long':''}">${esc(ask_)}</div>`;
  if(R.p===0){const a=F.la==='f'?0:1,seen=new Set([right]);
   const ds=shuf(c.g.c.map(x=>x[a])).filter(t=>!seen.has(t)&&seen.add(t)).slice(0,3),os=shuf([right].concat(ds));
   box.innerHTML=bar()+`<div class="lq">${kind('Flervalg')}<div class="qa">${os.map((t,i)=>`<button class="op" data-i="${i}"><span class="k">${i+1}</span>${esc(t)}</button>`).join('')}</div><div id="lF"></div></div>`+tools();
   let state=0;
   const pick=i=>{if(state)return;const ok=os[i]===right;state=ok?1:2;$$('.op',box).forEach((b,j)=>{b.disabled=true;if(os[j]===right)b.classList.add('right');else if(j===i)b.classList.add('wrong')});
    if(ok)setTimeout(()=>result(true),650);
    else{$('#lF').innerHTML=`<div class="fb"><span class="res noc">Feil.</span> Riktig svar er markert. Kortet kommer tilbake senere i runden. <button class="btn pri" id="lC">Fortsett</button></div>`;$('#lC').onclick=()=>result(false)}};
   $$('.op',box).forEach(b=>b.onclick=()=>pick(+b.dataset.i));bindTools();
   keyH=k=>{if(/^[1-4]$/.test(k)&&+k<=os.length&&!state){pick(+k-1);return true}if((k==='Enter'||k===' ')&&state===2){result(false);return true}}}
  else{box.innerHTML=bar()+`<div class="lq">${kind('Skriv svaret')}<textarea id="lW" rows="3" placeholder="Skriv svaret ditt her"></textarea><div id="lF"><div class="fact"><button class="btn pri" id="lS" disabled>Vis fasit</button></div><p class="fhint">Du må skrive et svar før du kan se fasiten. Enter viser fasiten.</p></div></div>`+tools();
   const ta=$('#lW');let open=false;
   const reveal=()=>{if(open||!ta.value.trim())return;open=true;const first=ta.value.trim();
    $('#lF').innerHTML=`<div class="lans mine"><small>Du svarte</small>${esc(first)}</div><div class="lans"><small>Fasit</small>${esc(right)}</div><div class="fact"><button class="btn fno" id="bN">✗ Kunne ikke</button><button class="btn fyes" id="bY">✓ Kunne</button></div><p class="fhint">Sammenlign svaret ditt med fasiten, og velg selv. Du kan skrive videre i feltet, for eksempel for å skrive av fasiten. Piltastene virker når du klikker utenfor feltet.</p>`;
    $('#bN').onclick=()=>result(false);$('#bY').onclick=()=>result(true)};
   $('#lS').onclick=reveal;ta.oninput=()=>{if(!open)$('#lS').disabled=!ta.value.trim()};ta.onkeydown=e=>{if(e.key==='Enter'&&!e.shiftKey&&!open){e.preventDefault();reveal()}};
   bindTools();try{ta.focus({preventScroll:true})}catch(e){}
   keyH=k=>{if(!open)return;if(k==='ArrowLeft'||k==='1'){result(false);return true}if(k==='ArrowRight'||k==='2'){result(true);return true}}}};
 begin()};
})();
