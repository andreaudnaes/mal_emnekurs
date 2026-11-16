# Mal for emnekurs

En tom mal for et interaktivt eksamenskurs. Rammene er på plass: meny, sidetyper, tester, flashcards og fremgang. Fagstoffet mangler. Hver side har en kort tekst som sier hva som skal stå der, og ett eller to eksempler som viser formatet.

Kurset er en ren nettside. Åpne `index.html` i en nettleser. Det trengs ingen installasjon, ingen server og ingen nettforbindelse. Fremgangen lagres lokalt i nettleseren.

## Slik lager du et kurs av malen

1. Kopier repoet og gi det navnet til emnet.
2. Fyll inn emnekode, emnenavn, semester og eksamensdato øverst i `assets/app.js` (blokken `EMNE`). Gi også kurset sin egen lagringsnøkkel der.
3. Skriv modulene. Kopier `assets/m1.js` til `m2.js`, `m3.js` og så videre, gjerne én modul for hvert kapittel i pensum, og legg hver fil til i `index.html`.
4. Fyll ut eksamensdelen, flashcards og oppslag i filene under.
5. Skriv denne README-en om til en beskrivelse av kurset.

## Sidene i kurset

| Side i menyen | Hva som skal stå der | Fil |
|---|---|---|
| Forside | Kort om kurset, nedtelling til eksamen, oversikt over modulene og en leseplan | `assets/exam.js` (`P.hjem`) |
| Moduler | Selve fagstoffet. Hver modul har ingress, læringsmål og flere deler, og hver del avsluttes med et sjekkpunkt | `assets/m1.js`, `m2.js`, … |
| Slik er eksamen | Format, hva som gir poeng, oppgavetyper som går igjen, strategi og kjente feil i kildene | `assets/exam.js` (`P.eksamen`) |
| Oppgavebank | Flervalgsoppgaver fra tidligere eksamener, ordrett og sortert etter år | `assets/bank.js` |
| Quizer | Korte flervalgsprøver, for eksempel quizene fra semesteret, med retting til slutt | `assets/rat.js` |
| Tegneoppgaver | Oppgaver som må tegnes for hånd, med fasitfigur og sjekkliste | `assets/exam.js` (`DRAW`) og `assets/figs.js` |
| Prøveeksamen | Et nytt oppgavesett i samme format som eksamen, med klokke og poengsum | `assets/exam.js` (`MC` og `LONG`) |
| Flashcards | Kort med begreper, formler og feller. Vanlig sortering eller spaced repetition | `assets/cards.js` |
| Lær | De samme kortene i runder på sju: først flervalg, så skriver studenten svaret selv | `assets/cards.js` |
| Repeter feil | Fylles automatisk med oppgavene studenten ikke har full uttelling på | ingen |
| Formler | Formlene i emnet, delt i det som står på formelarket og det som må kunnes utenat | `assets/exam.js` (`SHEET` og `MUST`) |
| Ordliste | Alle fagbegrepene med definisjon på norsk og engelsk | `assets/glossary.js` |

## Byggeklossene i en modul

`assets/m1.js` viser alle sammen i bruk.

- **Tekst:** vanlig HTML i feltet `html`. Formler skrives i LaTeX, `$…$` i teksten og `$$…$$` på egen linje.
- **Bokser:** `<div class="why">` (hvorfor), `ana` (analogi), `key` (regel), `trap` (felle), `ex` (regneeksempel) og `exam` (eksamenstips). Første `<b>` i boksen er tittelen.
- **Statisk figur:** `[[f:navn|figurtekst]]`. Figurene tegnes som SVG i `assets/figs.js`.
- **Interaktiv figur:** `[[w:navn]]`. Figurene programmeres i `assets/w1.js`.
- **Margdefinisjon:** kommer av seg selv første gang et ord fra ordlisten brukes i modulen.
- **Sjekkpunkt:** listen `quiz` i hver del. Fire typer:
  - `mc`: flervalg med `q`, `o`, `a` (plasseringen til riktig svar) og `e` (forklaring)
  - `num`: tallsvar med `q`, `a`, `tol` (godtatt avvik) og `e`
  - `ref`: refleksjon med `q`, `m` (eksempelsvar) og `k` (poeng svaret bør ha med)
  - `ex`: eksamensoppgave med `y` (kilde), `pts`, `q` og `s` (løsning)
- **Engelsk eksamen:** legg til `en:1` på en oppgave for å få engelske merkelapper og knapper på den.

## Ting som er lette å gå i

- Fremgangen lagres på modulens `id`, delens `id` og plasseringen til hver oppgave. Endrer du disse etter at kurset er tatt i bruk, mister studentene fremgangen på det som flyttes.
- Flashcards lagres på bolk og plassering. Nye kort må legges til sist i bolken.
- En bolk med flashcards bør ha minst fire kort, fordi flervalg i Lær henter de gale alternativene fra samme bolk.
- Skriv modulteksten inne i `String.raw` slik eksempelet gjør, ellers må hver backslash i LaTeX dobles.

## Filer

```
index.html          skallet som laster alt
assets/app.js       kursmotoren: meny, ruting, tester, fremgang og verktøy for figurer. Oppsettet for emnet står øverst.
assets/app.css      utseendet
assets/m1.js        eksempelmodul
assets/figs.js      statiske figurer
assets/w1.js        interaktive figurer
assets/glossary.js  ordliste
assets/exam.js      forside, eksamenssider, prøveeksamen, formler og ordlistesiden
assets/bank.js      oppgavebank
assets/rat.js       quizer
assets/cards.js     flashcards
assets/flash.js     logikken for Flashcards og Lær
assets/katex/       KaTeX, som tegner formlene uten nett
```
