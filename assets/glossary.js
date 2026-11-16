/* Ordliste. Én linje per begrep:
     g(nøkkel, norsk begrep, engelsk begrep, norsk definisjon, engelsk definisjon, alias)
   Alias er skrivemåtene som skal kjennes igjen i modulteksten. Alias med store bokstaver må stå nøyaktig slik i teksten.
   Første gang et begrep brukes i en modul, vises definisjonen i margen, og det engelske begrepet settes i parentes etter ordet.
   Er eksamen på norsk og engelsk ikke trengs, skriv samme ord som norsk og engelsk begrep og la den engelske definisjonen stå tom. */
(function(){const g=(k,t,en,d,de,a)=>C.G.push({k,t,en,d,de:de||'',a:a||[t]});

// EKSEMPLER. Bytt dem ut med begrepene i emnet, gjerne gruppert etter modul.
g('eksempelbegrep','Eksempelbegrep','Example term','Her står den norske definisjonen: én til to setninger som forklarer begrepet.','Here goes the English definition, one or two sentences.',['eksempelbegrep','eksempelbegrepet']);
g('annetbegrep','Et annet begrep','Another term','Her står definisjonen av et annet begrep. Ordlisten bør dekke alle fagbegrepene i emnet.','Here goes the definition of another term.',['et annet begrep']);
g('fork','Forkortelse','Abbreviation (ABC)','Forkortelser skrives i parentes etter det engelske begrepet. Et alias med store bokstaver, som ABC, kjennes bare igjen når det står nøyaktig slik.','Abbreviations go in parentheses after the English term.',['ABC']);
})();
