@agen/dsv
=========

This package contains utility methods splitting lines to arrays. Basically these methods
are wrappers for the `d3-dsv` library.

List of methods:
* [arraysFromDsv](#arraysFromDsv-method) - splits lines to arrays by the specified field delimiter
* [arraysToDsv](#arraysToDsv-method) - serializes arrays to dsv values
* [guessDelimiter](#guessDelimiter-method) - tries to guess field separator for DSV values
* [newDelimiterGuesser](#newDelimiterGuesser-method) - basic method used by the previous guesser

`arraysFromDsv` method
----------------------

This method splits individual lines to arrays and returns an AsyncIterator over them.

Parameters:
* `delimiter` - a delimiter symbol (like ';', '\t', ',', '|' ) or a function returning the symbol 

Returns an AsyncGenerator over arrays.

Example 1: Splitting lines to arrays:
```javascript
import { arraysFromDsv } from '@agen/dsv';

const f = arraysFromDsv(',');
const lines = [
  'John,Doe,120 jefferson st.,Riverside, NJ, 08075',
  'Jack,McGinnis,220 hobo Av.,Phila, PA,09119',
  '"John ""Da Man""",Repici,120 Jefferson St.,Riverside, NJ,08075',
  'Stephen,Tyler,"7452 Terrace ""At the Plaza"" road",SomeTown,SD, 91234',
  ',Blankman,,SomeTown, SD, 00298',
  '"Joan ""the bone"", Anne",Jet,"9th, at Terrace plc",Desert City,CO,00123'
]

for await (let array of f(lines)) {
  console.log(array);
}

// Output:
// [ "John", "Doe", "120 jefferson st.", "Riverside", " NJ", " 08075" ]
// ["Jack", "McGinnis", "220 hobo Av.", "Phila", " PA", "09119"]
// ['John "Da Man"', "Repici", "120 Jefferson St.", "Riverside", " NJ", "08075 ]
// [ "Stephen", "Tyler", '7452 Terrace "At the Plaza" road', "SomeTown", "SD", " 91234" ]
// ["", "Blankman", "", "SomeTown", " SD", " 00298"]
// [ 'Joan "the bone", Anne', "Jet", "9th, at Terrace plc", "Desert City", "CO", "00123" ]
```

Example 2: Reading binary content from the stream, decoding and splitting to arrays:
```javascript

import fs from 'fs';
import { compose } from '@agen/utils';
import { lines } from '@agen/encoding';
import { arraysFromDsv } from '@agen/dsv';

const f = compose(
  lines(), // Decode binary stream to text and split to lines
  arraysFromDsv(';') // Split individual lines to arrays using the ';' separator
);
const input = s.createReadStream('./data.csv');

for await (let array of f(input)) {
  console.log(array);
}

```

`arraysToDsv` method
--------------------

This method serializes arrays as individual lines.

Parameters:
* `delimiter` - a delimiter symbol (like ';', '\t', ',', '|' ) or a function returning the delimiter
 
Returns an AsyncGenerator over serialized lines.

Example: Serialize arrays to lines:
```javascript
import { arraysToDsv } from '@agen/dsv';

const f = arraysToDsv(';');
const arrays = [
  [ "John", "Doe", "120 jefferson st.", "Riverside", " NJ", " 08075" ],
  ["Jack", "McGinnis", "220 hobo Av.", "Phila", " PA", "09119"],
  ['John "Da Man"', "Repici", "120 Jefferson St.", "Riverside", " NJ", "08075 "],
  [ "Stephen", "Tyler", '7452 Terrace "At the Plaza" road', "SomeTown", "SD", " 91234" ],
  ["", "Blankman", "", "SomeTown", " SD", " 00298"],
  ['Joan "the bone", Anne', "Jet", "9th, at Terrace plc", "Desert City", "CO", "00123" ]
]

for await (let line of f(arrays)) {
  console.log(line);
}

const f = arraysToDsv(';');
const arrays = [
  ["John", "Doe", "120 jefferson st.", "Riverside", " NJ", " 08075"],
  ["Jack", "McGinnis", "220 hobo Av.", "Phila", " PA", "09119"],
  ['John "Da Man"', "Repici", "120 Jefferson St.", "Riverside", " NJ", "08075 "],
  ["Stephen", "Tyler", '7452 Terrace "At the Plaza" road', "SomeTown", "SD", " 91234"],
  ["", "Blankman", "", "SomeTown", " SD", " 00298"],
  ['Joan "the bone", Anne', "Jet", "9th, at Terrace plc", "Desert City", "CO", "00123"]
]

for await (let line of f(arrays)) {
  console.log(line);
}
// Output:
// John;Doe;120 jefferson st.;Riverside; NJ; 08075
// Jack;McGinnis;220 hobo Av.;Phila; PA;09119
// "John ""Da Man""";Repici;120 Jefferson St.;Riverside; NJ;08075 
// Stephen;Tyler;"7452 Terrace ""At the Plaza"" road";SomeTown;SD; 91234
// ;Blankman;;SomeTown; SD; 00298
// "Joan ""the bone"", Anne";Jet;9th, at Terrace plc;Desert City;CO;00123

```

`guessDelimiter` method
-----------------------

This method allows to guess which delimiter is used in a DSV file. To do so it tries to 
split provided stream of lines using various delimiters and comparing results.
The delimiter which generates the bigger number of cells for each line is returned as a winner.

Parameters:
* `len` - number of lines to analyse 
* `delimiters` - list of possible delimiters to check

Returns: 
* `delimiter` - an async function resolving the delimiter
* `delimiter.guess` : an AsyncGenerator (`async function* guess(it)`) accepting 
  strings and analysing them to guess the best delimiter; all consumed lines are yielded 
  from the internal buffer

Example 1: 
```javascript
import { guessDelimiter } from '@agen/dsv';

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
```

Example 2: Use automatic delimiter detection to split DSV files: 
```javascript

import fs from 'fs';
import { compose } from '@agen/utils';
import { lines } from '@agen/encoding';
import { arraysFromDsv, guessDelimiter } from '@agen/dsv';

const delimiter = guessDelimiter(10); // Use the first 10 lines to detect delimiter
const f = compose(
  lines(), // Decode binary stream to text and split to lines
  delimiter.guesser(), // Detects delimiters and notifies the "arraysFromDsv"
  arraysFromDsv(delimiter) // Split individual lines to arrays using the ';' separator
);
const input = s.createReadStream('./data.csv');

for await (let array of f(input)) {
  console.log(array);
}

```

`newDelimiterGuesser` method
----------------------------

This method creates a 'guesser' trying to detect the best delimiter for the provided lines.

Parameters:
* `delimiters` - list of possible delimiters to check; by default it checks the following values:
  `;`, `,` (comma), `|` (pipe), `\t` (tab)

Returns an object with two methods:
* `update(line)` - this method is used to push new lines to analyse
* `done()` - this method returns the delimiter providing the best splitting results

Example:
```javascript

import { newDelimiterGuesser } from '@agen/dsv';

const { update, done } = newDelimiterGuesser();

// Provide three lines to analyse:
update('John;Doe;120 jefferson st.;Riverside; NJ; 08075');
update('Jack;McGinnis;220 hobo Av.;Phila; PA;09119');
update('"John ""Da Man""";Repici;120 Jefferson St.;Riverside; NJ;08075');

// Get the best guess:
const delimiter = done();
console.log(`Delimiter: "${delimiter}"`);
// Output:
// Delimiter: ";"
```