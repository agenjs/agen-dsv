import { arraysFromDsv }  from '../dist/agen-dsv-esm.js';

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