/* Statiske figurer. Hver figur er en SVG-streng F.navn, og den settes inn i en modul med [[f:navn|figurtekst]].
   Teksten bruker currentColor, så figurene virker i lyst og mørkt tema.
   Verktøy: svg(bredde, høyde, beskrivelse, innhold), box(x, y, b, h, tekst), ar(...) pil, ln(...) linje, tx(x, y, tekst). */
(function(){const F=C.F;
const svg=(w,h,a,b)=>`<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${a}" style="color:var(--ink);font-family:var(--sans)"><defs><marker id="fa" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 z" fill="context-stroke"/></marker></defs>${b}</svg>`;
const box=(x,y,w,h,t,f,s)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="7" fill="${f||'var(--panel2)'}" stroke="${s||'var(--line)'}"/>`+(t||'').split('|').map((l,i,a)=>`<text x="${x+w/2}" y="${y+h/2+4+(i-(a.length-1)/2)*14}" text-anchor="middle" font-size="12.5" fill="currentColor">${l}</text>`).join('');
const ar=(x1,y1,x2,y2,c,d,w)=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c||'currentColor'}" stroke-width="${w||1.6}" ${d?'stroke-dasharray="6 4"':''} marker-end="url(#fa)"/>`;
const ln=(x1,y1,x2,y2,c,w,d)=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c||'currentColor'}" stroke-width="${w||1.6}" ${d?'stroke-dasharray="6 4"':''}/>`;
const tx=(x,y,t,o)=>`<text x="${x}" y="${y}" font-size="${(o&&o.s)||12}" text-anchor="${(o&&o.a)||'middle'}" fill="${(o&&o.c)||'currentColor'}">${t}</text>`;

/* EKSEMPELFIGUR: tre bokser med piler. Bytt den ut med figurer fra emnet. */
F.eksempel=svg(640,130,'Eksempelfigur med tre bokser',
 box(30,40,150,50,'Første steg')+ar(180,65,245,65)+box(245,40,150,50,'Andre steg|(to linjer)')+ar(395,65,460,65)+box(460,40,150,50,'Tredje steg')+
 tx(320,118,'Tekst i figuren skrives med tx',{s:11.5,c:'var(--mute)'}));

/* Brukes av tegneoppgavene til å hente fasitfiguren. */
C.enFig=k=>F[k];
})();
