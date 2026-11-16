/* Hjem, eksamensdel og oppslag */
(function(){const P=C.pages,$=C.$,$$=C.$$,S=C.S;
const E=C.EMNE,EXAM=new Date(E.eksamen);
const exDate=EXAM.toLocaleDateString('nb-NO',{day:'numeric',month:'long'});
const page=(el,h,wide=true)=>{el.innerHTML=`<div class="page wide"><div class="col">${h}</div></div>`;const c=$('.col',el);C.math(c);return c};
const mods=()=>C.mods;

P.hjem=el=>{const all=mods().flatMap(C.allQ),p=C.prog(all),days=Math.max(0,Math.ceil((EXAM-new Date())/864e5));
 const card=m=>{const q=C.prog(C.allQ(m));return `<a href="#${m.id}"><span class="eyebrow">Modul ${m.nr}</span><b>${m.short}</b><small>${m.sections.length} deler · ${q.n} oppgaver${q.done?` · ${q.acc} % riktig`:''}</small><div class="bar"><i style="width:${q.pct}%"></i></div></a>`};
 const c=page(el,`<div class="eyebrow">${C.esc(E.kode)} · ${C.esc(E.semester)}</div><h1>${C.esc(E.navn)}</h1>
 <p class="lead">Her skal det stå to til tre setninger om kurset: hva det dekker, hvordan det er bygget opp, og hva oppgavene er hentet fra.</p>
 <div class="stat"><div><b>${days}</b><span>dager til eksamen ${exDate}</span></div><div><b>${p.done} / ${p.n}</b><span>oppgaver gjort</span></div><div><b>${p.done?p.acc+' %':'–'}</b><span>riktig så langt</span></div></div>
 <p><a class="btn pri" href="#${(mods().find(m=>{const q=C.prog(C.allQ(m));return q.pct<100})||mods()[0]).id}">${p.done?'Fortsett':'Start med første modul'} →</a> <a class="btn" href="#eksamen">Se hva eksamen krever</a></p>
 <h2>Fargene på boksene</h2><p>Hver bokstype har samme farge i hele kurset.</p><ul class="legend"><li style="--c:var(--why)">Hvorfor</li><li style="--c:var(--key)">Regel og hovedpoeng</li><li style="--c:var(--ana)">Analogi</li><li style="--c:var(--trap)">Felle</li><li style="--c:var(--exam)">Eksamenstips</li><li style="--c:var(--ex)">Regneeksempel</li><li style="--c:var(--goal)">Mål og oversikt</li><li style="--c:var(--wg)">Interaktiv figur</li><li style="--c:var(--chk)">Test</li></ul>
 <h2>Moduler</h2><p>Kurset skal ha flere moduler, gjerne én for hvert kapittel i pensum. De dukker opp her etter hvert som de legges til.</p><div class="mods">${mods().map(card).join('')}</div>
 <h2>Plan fram til eksamen</h2><p>Her skal det stå en leseplan som fordeler modulene på ukene fram til eksamen.</p>
 <div class="tw"><table><tr><th>Periode</th><th>Gjør dette</th><th>Viktig</th></tr>
 <tr><td>Uke 1</td><td>Modul 1 og 2</td><td>Her står hva som er viktigst i perioden.</td></tr>
 <tr><td>Uke 2</td><td>Modul 3 og 4</td><td>Her står hva som er viktigst i perioden.</td></tr>
 <tr><td>Siste dager</td><td>Prøveeksamen på tid, deretter «Repeter feil»</td><td>Ta prøveeksamen med klokke.</td></tr></table></div>
 <div class="goal"><b>Slik bruker du kurset</b><p>Les en del, lek med figuren, og gjør sjekkpunktet før du går videre. Første gang et fagbegrep dukker opp i en modul, står definisjonen i margen. På smal skjerm klikker du på ordet. Alt lagres i denne nettleseren.</p></div>`)};

/* Poeng per tema og år: [tema, år 1, år 2, …]. Årstallene står i HEAT_YEARS. */
const HEAT_YEARS=['2023','2024','2025'];
const HEAT=[['Første tema',10,12,8],['Andre tema',20,15,18],['Tredje tema',0,10,12]];
P.eksamen=el=>{const mx=Math.max(1,...HEAT.flatMap(r=>r.slice(1)));page(el,`<div class="eyebrow">Eksamen</div><h1>Slik er eksamen</h1>
 <p class="lead">Her skal det stå når eksamen er, hvor lenge den varer, hvilke hjelpemidler som er tillatt, og hvor mye den teller.</p>
 <h2>Format</h2><p>Her skal det stå hvordan eksamen er bygget opp: antall oppgaver, oppgavetyper, poeng per del og hvilket språk oppgavene er på.</p>
 <h2>Hva som gir poeng</h2><p>Her skal det stå en oversikt over hvor mange poeng hvert tema har gitt på tidligere eksamener. Tabellen under fylles ut i exam.js.</p>
 <div class="tw"><table class="heat"><tr><th>Tema</th>${HEAT_YEARS.map(y=>`<th>${y}</th>`).join('')}</tr>${HEAT.map(r=>`<tr><td>${r[0]}</td>${r.slice(1).map(v=>`<td style="background:color-mix(in srgb,var(--opt) ${Math.round(v/mx*60)}%,transparent)">${v||'–'}</td>`).join('')}</tr>`).join('')}</table></div>
 <div class="key"><b>Slik leser du tabellen</b><p>Her skal det stå hva tabellen viser: hvilke temaer som kommer hvert år, og hvor det lønner seg å bruke mest tid.</p></div>
 <h2>Oppgavetyper som går igjen</h2><p>Her skal det stå en liste over oppgavetypene som går igjen, med lenke til modulen som dekker hver av dem.</p>
 <ul><li>Første oppgavetype: <a href="#m1">modul 1</a></li><li>Andre oppgavetype: <a href="#m1">modul 1</a></li></ul>
 <h2>Strategi</h2><p>Her skal det stå hvordan tiden bør brukes på eksamen.</p>
 <ol><li>Første råd, for eksempel hvilken del som bør tas først.</li><li>Andre råd, for eksempel hvor mange minutter hvert poeng er verdt.</li></ol>
 <h2>Feil og uklarheter i kildene</h2><p>Her skal det stå feil som er funnet i forelesninger, løsningsforslag og oppgavetekster, og hva som er riktig.</p>
 <div class="tw"><table><tr><th>Kilde</th><th>Problem</th><th>Riktig</th></tr>
 <tr><td>Her står kilden</td><td>Her står hva som er feil eller uklart</td><td>Her står hva som er riktig</td></tr></table></div>
 <div class="trap"><b>Dette dekker kurset ikke</b><p>Her skal det stå hvilke deler av pensum kurset ikke dekker, slik at studenten vet hva som må leses andre steder.</p></div>`)};

/* Forklaringer til enkeltoppgaver i oppgavebanken, med nøkkelen 'år-nummer'. */
const EXPL={'2025-1':'Her står forklaringen til oppgave 1 fra 2025. Oppgaver uten forklaring viser bare riktig svar.'};
const TAG=(y,n)=>'bank.'+y+'.'+n;
P.bank=el=>{const c=page(el,`<div class="eyebrow">Eksamen</div><h1>Oppgavebank</h1><p class="lead">Her skal flervalgsoppgavene fra tidligere eksamener ligge, ordrett og sortert etter år. Oppgavene legges inn i assets/bank.js.</p><div class="seg" id="yr"></div><div id="bl" style="margin-top:12px"></div>`);
 const yrs=[...new Set(C.BANK.map(b=>b.y))].sort().reverse();let y=yrs.includes(S.bankY)?S.bankY:yrs[0];
 const draw=()=>{$('#yr').innerHTML=yrs.map(v=>{const list=C.BANK.filter(b=>b.y===v).map(b=>({id:TAG(b.y,b.n)}));const p=C.prog(list);return `<button class="${v===y?'on':''}" data-y="${v}">${v} (${p.done}/${p.n})</button>`}).join('');$$('#yr button').forEach(b=>b.onclick=()=>{y=b.dataset.y;S.bankY=y;C.save();draw()});
  const box=$('#bl');box.innerHTML='<div class="check"></div>';const k=$('.check',box);C.BANK.filter(b=>b.y===y).forEach(b=>C.renderQ(k,{t:'mc',fix:1,y:'Oppgave '+b.n,q:C.esc(b.q),o:b.o.map(C.esc),a:b.a,a2:b.a2,e:EXPL[b.y+'-'+b.n]||''},TAG(b.y,b.n),()=>{const list=C.BANK.filter(q=>q.y===y).map(q=>({id:TAG(q.y,q.n)}));const p=C.prog(list);const btn=$('#yr button.on');if(btn)btn.textContent=`${y} (${p.done}/${p.n})`}));C.math(box)};draw()};

/* Tegneoppgaver: [figurnavn i figs.js, tittel, oppgavetekst, sjekkliste, hvor oppgaven er hentet fra]. */
const DRAW=[['eksempel','Eksempeltegning','Her står oppgaveteksten: hva studenten skal tegne, og hva som skal merkes.',['Første ting tegningen må ha med','Andre ting tegningen må ha med','Tredje ting tegningen må ha med'],'Eksamen, år']];
P.tegn=el=>{const c=page(el,`<div class="eyebrow">Eksamen</div><h1>Tegneoppgaver</h1><p class="lead">Her skal oppgavene der studenten må tegne for hånd ligge. Tegn først med lukket bok, åpne fasiten, og kryss av det du fikk med.</p><div class="check" id="dq"></div>`);
 const k=$('#dq');DRAW.forEach(d=>{C.renderQ(k,{t:'ref',y:d[4],q:`<b>${d[1]}.</b> ${d[2]}`,m:`<figure>${C.enFig(d[0])}</figure>`,k:d[3]},'tegn.'+d[0])});C.math(k)};

/* Prøveeksamen */
/* Flervalg i prøveeksamen: [spørsmål, [alternativer], plasseringen til riktig alternativ]. Hvert spørsmål gir 1 poeng. */
const MC=[
['Her står første flervalgsspørsmål i prøveeksamen.',['Riktig alternativ','Galt alternativ','Galt alternativ','Galt alternativ'],0],
['Her står andre flervalgsspørsmål i prøveeksamen.',['Riktig alternativ','Galt alternativ','Galt alternativ','Galt alternativ'],0]];
/* Langsvar: {h: overskrift} starter en ny del. Ellers pts = poeng, q = oppgave, s = løsning. */
const LONG=[
{h:'Del 2: langsvar'},
{pts:10,q:String.raw`<b>1. Tittel på oppgaven.</b> Her står oppgaveteksten.<br>a) Første deloppgave. [4p]<br>b) Andre deloppgave. [6p]`,s:String.raw`<p>a) Her står løsningen på første deloppgave, med alle steg.</p><p>b) Her står løsningen på andre deloppgave.</p>`},
{pts:8,q:String.raw`<b>2. Tittel på oppgaven.</b> Her står oppgaveteksten.<br>a) Første deloppgave. [3p]<br>b) Andre deloppgave. [5p]`,s:String.raw`<p>a) Her står løsningen.</p><p>b) Her står løsningen.</p>`}];
const TOTAL=MC.length+LONG.reduce((t,l)=>t+(l.pts||0),0);
P.prove=el=>{const c=page(el,`<div class="eyebrow">Eksamen</div><h1>Prøveeksamen</h1><p class="lead">Her skal det ligge et nytt oppgavesett med samme format som eksamen. Ta det på tid uten notater, gjerne de siste dagene før eksamen.</p><div class="timer"><span id="tm">4:00:00</span><span><button class="btn pri" id="st">Start klokken</button> <button class="btn" id="rs">Nullstill klokke</button></span></div><div id="sc" class="stat"></div><h2>Del 1: flervalg</h2><div class="check" id="mcq"></div><div id="lq"></div>`);
 const ids=[];const score=()=>{let got=0;ids.forEach(([id,p])=>{const s=S.q[id];if(s&&s.d)got+=(s.s||0)*p});$('#sc').innerHTML=`<div><b>${C.nb(got,1)} / ${TOTAL}</b><span>poeng så langt</span></div><div><b>${(g=>g>=89?'A':g>=77?'B':g>=65?'C':g>=53?'D':g>=41?'E':'F')(100*got/TOTAL)}</b><span>etter NTNUs veiledende skala</span></div>`};
 MC.forEach((m,i)=>{const id='prove.mc.'+i;ids.push([id,1]);C.renderQ($('#mcq'),{t:'mc',q:(i+1)+'. '+m[0],o:m[1],a:m[2]},id,score)});
 let box=null;LONG.forEach((l,i)=>{if(l.h){$('#lq').insertAdjacentHTML('beforeend',`<h2>${l.h}</h2><div class="check"></div>`);box=$('#lq').lastElementChild;return}const id='prove.l.'+i;ids.push([id,l.pts]);C.renderQ(box,{t:'ex',pts:l.pts,q:l.q,s:l.s},id,score)});
 C.math(c);score();
 const fmt=ms=>{ms=Math.max(0,ms);const s=Math.floor(ms/1000),h=Math.floor(s/3600),m=Math.floor(s%3600/60);return `${h}:${String(m).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`};
 const tick=()=>{const t=$('#tm');if(!t){clearInterval(iv);return}if(S.proveStart)t.textContent=fmt(S.proveStart+144e5-Date.now())};const iv=setInterval(tick,1000);tick();
 $('#st').onclick=()=>{if(!S.proveStart){S.proveStart=Date.now();C.save();tick()}};$('#rs').onclick=()=>{delete S.proveStart;C.save();$('#tm').textContent='4:00:00'}};

P.feil=el=>{const items=[];mods().forEach(m=>C.allQ(m).forEach(x=>{const s=S.q[x.id];if(s&&s.d&&s.s<1)items.push(x)}));
 const c=page(el,`<div class="eyebrow">Oppslag</div><h1>Repeter feil</h1><p class="lead">${items.length?`Her er alle ${items.length} oppgavene du ikke har full uttelling på. Gjør dem igjen om noen dager, så sitter det bedre.`:'Ingen feil registrert ennå. Oppgaver du svarer feil på, havner her automatisk.'}</p><div class="check" id="fq" ${items.length?'':'hidden'}></div>`);
 items.forEach(x=>C.renderQ($('#fq'),x.q,x.id,()=>{}));C.math(c)};

/* Formler: [navn, LaTeX]. SHEET er det som står på formelarket, MUST er det som må kunnes utenat. */
const SHEET=[['Navn på formelen','y=ax+b'],['En formel til','A=\\pi r^2']];
const MUST=[['Formel som ikke står på arket','c^2=a^2+b^2']];
P.formler=el=>{const row=x=>`<tr><td>${x[0]}</td><td>$${x[1]}$</td></tr>`;const c=page(el,`<div class="eyebrow">Oppslag</div><h1>Formler</h1><p class="lead">Her skal formlene i emnet stå, delt i det som står på formelarket til eksamen og det som må kunnes utenat.</p><h2>På formelarket</h2><div class="tw"><table>${SHEET.map(row).join('')}</table></div><h2>Må kunnes utenat</h2><div class="tw"><table>${MUST.map(row).join('')}</table></div><h2>Nyttige tall</h2><p>Her kan det stå konstanter, omregninger og andre tall som er greie å ha for hånden.</p>`);C.math(c)};

P.ordliste=el=>{const c=page(el,`<div class="eyebrow">Oppslag</div><h1>Ordliste</h1><p class="lead">Alle ${C.G.length} fagbegrepene i kurset, med definisjon på norsk og engelsk. Begrepene legges inn i assets/glossary.js.</p>
 <div class="wg-c" style="padding:0;margin-bottom:6px"><div class="ctl" style="flex:2 1 240px"><label for="gq">Søk på engelsk eller norsk</label><input id="gq" type="text"></div><div class="ctl"><label>Sorter etter</label><div class="seg" id="gs"><button type="button" class="on" data-s="en">Engelsk → norsk</button><button type="button" data-s="no">Norsk → engelsk</button></div></div></div>
 <div class="azbar" id="az"></div><div class="tw"><table class="gl"><thead><tr><th id="h1"></th><th id="h2"></th><th>Definisjon</th></tr></thead><tbody id="gl"></tbody></table></div>`);
 let mode='en',q='';
 const cap=C.capEn;
 const key=g=>(mode==='en'?g.en:g.t);
 const letter=g=>{const ch=key(g).charAt(0).toUpperCase();return /[0-9]/.test(ch)?'#':ch};
 const draw=()=>{const f=q.toLowerCase();const items=C.G.filter(g=>(g.t+' '+g.en+' '+g.d+' '+g.de).toLowerCase().includes(f)).sort((a,b)=>key(a).localeCompare(key(b),mode==='en'?'en':'nb',{sensitivity:'base'}));
  $('#h1').textContent=mode==='en'?'English':'Norsk';$('#h2').textContent=mode==='en'?'Norsk':'English';
  let h='',cur='';const ls=[];items.forEach(g=>{const l=letter(g);if(l!==cur){cur=l;ls.push(l);h+=`<tr class="lt" id="gl-${ls.length}"><td colspan="3">${l}</td></tr>`}const a=mode==='en'?cap(g.en):g.t,b=mode==='en'?g.t:cap(g.en);h+=`<tr><td>${C.esc(a)}</td><td>${C.esc(b)}</td><td><span class="de" lang="en">${g.de}</span><span class="dn">${g.d}</span></td></tr>`});
  $('#gl').innerHTML=h||'<tr><td colspan="3">Ingen treff.</td></tr>';C.math($('#gl'));
  $('#az').innerHTML=ls.map((l,i)=>`<button type="button" data-i="${i+1}">${l}</button>`).join('');$$('#az button').forEach(b=>b.onclick=()=>document.getElementById('gl-'+b.dataset.i).scrollIntoView())};
 $('#gq').oninput=e=>{q=e.target.value;draw()};
 $$('#gs button').forEach(b=>b.onclick=()=>{mode=b.dataset.s;$$('#gs button').forEach(x=>x.classList.toggle('on',x===b));draw()});draw()};
})();
