import { guessDelimiter } from '../dist/agen-dsv-esm.js';

const lines = [
  'John;Doe;120 jefferson st.;Riverside; NJ; 08075',
  'Jack;McGinnis;220 hobo Av.;Phila; PA;09119',
  '"John ""Da Man""";Repici;120 Jefferson St.;Riverside; NJ;08075',
  'Stephen;Tyler;"7452 Terrace ""At the Plaza"" road";SomeTown;SD; 91234',
  ';Blankman;;SomeTown; SD; 00298',
  '"Joan ""the bone"", Anne";Jet;9th, at Terrace plc;Desert City;CO;00123'
]
const f = guessDelimiter(3); // Use 3 first line to guess the best delimiter

for await (let line of f.guesser(lines)) {
  // Do nothing. Just consume lines...
}

const delimiter = await f();
console.log(`Delimiter: "${delimiter}"`);

// Output:
// Delimiter: ";"