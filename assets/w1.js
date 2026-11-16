/* Interaktive figurer. Hver figur er en funksjon W.navn, og den settes inn i en modul med [[w:navn]].
   Verktøyene ligger i app.js:
     ui(rot, tittel)        lager rammen og gir tilbake u
     u.params({...}, tegn)  lager glidere og knapper, og kaller tegn(v) hver gang en verdi endres
     u.svg(...)             viser en tegning, for eksempel fra plot({...})
     u.out(...)             viser teksten under figuren, og formler mellom dollartegn tegnes
   Blir det mange figurer, kan de deles på flere filer (w2.js, w3.js) som legges til i index.html. */
(function(){const W=C.W,ui=C.ui,plot=C.plot,R=C.range;

/* EKSEMPELFIGUR: en rett linje der studenten styrer stigningstall og konstantledd. Bytt den ut med figurer fra emnet. */
W.eksempel=r=>{const u=ui(r,'Eksempelfigur: rett linje');u.params({
 a:{l:'Stigningstall a',min:-2,max:2,step:.1,v:1,f:x=>x.toFixed(1)},
 b:{l:'Konstantledd b',min:-2,max:2,step:.1,v:0,f:x=>x.toFixed(1)}},v=>{
 const x=R(-3,3,60);
 u.svg(plot({h:210,x:[-3,3],y:[-8,8],xl:'x',yl:'y',xt:[-3,-2,-1,0,1,2,3],yt:[-8,-4,0,4,8],aria:'Rett linje',
  s:[{p:x.map(t=>[t,t]),c:'var(--c5)',d:'4 4',w:1.2},{p:x.map(t=>[t,v.a*t+v.b])}]}));
 u.out(`$y=${C.tx(v.a,1)}x${v.b<0?'-':'+'}${C.tx(Math.abs(v.b),1)}$. Ved $x=2$ er <span class="v">y = ${C.nb(2*v.a+v.b,1)}</span>. Stiplet linje er referansen $y=x$. Her skal teksten forklare hva studenten skal legge merke til.`)})};
})();
