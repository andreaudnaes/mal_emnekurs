/* EKSEMPELMODUL. Kopier denne filen til m2.js, m3.js og så videre, én modul for hvert kapittel i pensum,
   og legg hver nye fil til i index.html. Modulene vises i menyen i den rekkefølgen de lastes.

   Felter:
     id        unik nøkkel, brukes i adressen (#m1) og i lagret fremgang. Ikke endre den etter at kurset er tatt i bruk.
     nr        tallet som vises i menyen
     short     kort tittel til menyen
     src       hvor stoffet er hentet fra (forelesning, kapittel i læreboka)
     title     full tittel øverst på siden
     lead      ingress: én til to setninger om hva modulen handler om
     goals     læringsmål, «Etter modulen kan du …»
     sections  delene i modulen. Hver del har id, title, html og quiz. */
C.add({id:'m1',nr:1,short:'Eksempelmodul',src:'Kilde: forelesning og kapittel i læreboka',
title:'Eksempelmodul: slik bygges en modul',
lead:String.raw`Her skal ingressen stå: én til to setninger om hva modulen handler om og hvorfor det er verdt å lære. Kurset skal ha flere moduler, gjerne én for hvert kapittel i pensum.`,
goals:[String.raw`Her står første læringsmål, formulert som noe studenten skal kunne gjøre`,String.raw`Her står andre læringsmål`,String.raw`Tre til fem mål per modul er passe`],
sections:[
{id:'tekst',title:'Første del: forklaring og bokser',html:String.raw`
<p>Hver del starter med en forklaring i vanlig tekst. Begynn med problemet som skal løses, før løsningen presenteres. Viktige ord settes i <b>fet skrift</b>. Et ord som står i ordlisten, for eksempel eksempelbegrep, får definisjonen sin i margen første gang det brukes.</p>
<div class="why"><b>Hvorfor</b><p>Denne boksen brukes til spørsmålet delen svarer på, eller til grunnen til at en metode finnes.</p></div>
<div class="ana"><b>Analogi: tittel på analogien</b><p>Denne boksen brukes til et bilde fra hverdagen som gjør mekanismen lettere å huske.</p></div>
<p>Formler skrives i LaTeX. En formel på egen linje står mellom doble dollartegn:</p>
$$y=ax+b$$
<p>En formel inne i teksten står mellom enkle dollartegn, som $a=2$.</p>
[[f:eksempel|Her står figurteksten. Statiske figurer tegnes i assets/figs.js og settes inn med navnet sitt.]]
<div class="key"><b>Regel</b><p>Denne boksen brukes til regelen eller hovedpoenget studenten må sitte igjen med.</p></div>
<div class="trap"><b>Felle</b><p>Denne boksen brukes til det som ofte går galt, for eksempel feil enhet eller et begrep som forveksles med et annet.</p></div>`,
quiz:[
{t:'mc',q:'Flervalgsspørsmål: her står spørsmålet. Riktig svar angis med plasseringen i listen, og alternativene stokkes når de vises.',o:['Dette er det riktige alternativet','Dette er et galt alternativ','Dette er et annet galt alternativ','Gale alternativer bør være typiske misforståelser'],a:0,e:'Her står forklaringen som vises etter at studenten har svart.'},
{t:'num',q:'Tallsvar: her står en regneoppgave. Hva er $2\\cdot3+1$?',a:7,tol:0,e:'Her står utregningen: $2\\cdot3+1=7$. Feltet tol angir hvor stort avvik som godtas.'},
{t:'ref',q:'Refleksjonsoppgave: her står et spørsmål studenten svarer på med egne ord, før fasiten vises.',m:'Her står et eksempel på et godt svar.',k:['Første poeng svaret bør ha med','Andre poeng','Tredje poeng']}
]},
{id:'figur',title:'Andre del: interaktiv figur, regneeksempel og eksamensoppgave',html:String.raw`
<p>En interaktiv figur lar studenten endre verdier og se hva som skjer. Figurene programmeres i assets/w1.js og settes inn med navnet sitt:</p>
[[w:eksempel]]
<div class="ex"><b>Regneeksempel</b><p>Denne boksen brukes til et gjennomregnet eksempel fra forelesning eller tidligere eksamen: $y=2\cdot3+1=7$.</p></div>
<div class="exam"><b>Eksamenstips</b><p>Denne boksen brukes til det som gjelder eksamen spesielt: hva som pleier å bli spurt om, og hva sensor ser etter.</p></div>
<h3>Mellomtittel</h3>
<p>Lange deler kan deles opp med mellomtitler. Tabeller passer når flere ting skal sammenlignes:</p>
<div class="tw"><table><tr><th>Egenskap</th><th>Alternativ A</th><th>Alternativ B</th></tr><tr><td>Første egenskap</td><td>Verdi</td><td>Verdi</td></tr><tr><td>Andre egenskap</td><td>Verdi</td><td>Verdi</td></tr></table></div>`,
quiz:[
{t:'mc',q:'Hver del avsluttes med et sjekkpunkt. Her står et nytt flervalgsspørsmål.',o:['Riktig alternativ','Galt alternativ','Galt alternativ','Galt alternativ'],a:0,e:'Forklaring.'},
{t:'ex',y:'Eksamen, år',pts:5,q:'Eksamensoppgave: her står en oppgave fra en tidligere eksamen, ordrett. Studenten løser den selv og gir seg poeng etter løsningen.<br>a) Første deloppgave. [2p]<br>b) Andre deloppgave. [3p]',s:String.raw`<p>a) Her står løsningen på første deloppgave, med alle steg.</p><p>b) Her står løsningen på andre deloppgave: $y=2\cdot3+1=7$.</p>`}
]}
]});
