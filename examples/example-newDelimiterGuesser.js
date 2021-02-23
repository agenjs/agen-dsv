import { newDelimiterGuesser } from '../dist/agen-dsv-esm.js';

const { update, done } = newDelimiterGuesser();

// Provide three lines to analyse:
update('John;Doe;120 jefferson st.;Riverside; NJ; 08075');
update('Jack;McGinnis;220 hobo Av.;Phila; PA;09119');
update('"John ""Da Man""";Repici;120 Jefferson St.;Riverside; NJ;08075');

// Get the best guess:
const delimiter = await done();
console.log(`Delimiter: "${delimiter}"`);
// Output:
// Delimiter: ";"