/* Flashcards. Kort-ID er bolk + plassering (b1.3), og fremgangen lagres på ID-en.
   Nye kort må derfor legges til sist i bolken. Format per kort: [forside, bakside].
   Forsiden er fagbegrepet eller et kort spørsmål. Baksiden er forklaringen, én til to setninger.
   Lag gjerne én bolk for hver modul eller for hver del av pensum. */
C.cards=[
{id:'b1',nr:1,t:"Eksempelbolk",c:[
["Eksempelbegrep", "Her står forklaringen på begrepet, én til to setninger. Ta gjerne med en analogi fra modulen"],
["Et kort spørsmål som forside?", "Her står svaret. Ett begrep per kort, og ingen like forsider"],
["En formel", "Her står formelen og hva den brukes til, for eksempel y = ax + b"],
["En typisk felle", "Her står hva som pleier å gå galt, og hvordan det unngås"],
["Et begrep til", "Bolken bør ha minst fire kort, fordi flervalg i Lær henter de gale alternativene fra samme bolk"]
]},
{id:'b2',nr:2,t:"Eksempelbolk nummer to",c:[
["Første kort i bolk to", "Hver bolk velges for seg på sidene Flashcards og Lær, eller alle samlet"],
["Andre kort i bolk to", "Her står forklaringen"],
["Tredje kort i bolk to", "Her står forklaringen på det tredje kortet"],
["Fjerde kort i bolk to", "Her står forklaringen på det fjerde kortet"]
]}
];
