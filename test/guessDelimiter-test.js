import tape from "tape-await";
import { guessDelimiter, arraysFromDsv } from "../src/index.js";

tape(`guessDelimiter`, async function(t) {
  test(['a;A', 'b;B', 'c;C', 'd;D', 'abc:Hello, world!;two;three', 'k'], ';');
  test(['a,A', 'b,B', 'c,C', 'd,D', 'abc:Hello\\, world!,two,three', 'k'], ',');
  test(['a|A', 'b|B', 'c|C', 'd|D', 'abc:Hello\\, world!|two|three', 'k'], '|');
  test(['a\tA', 'b\tB', 'c\tC', 'd\tD', 'abc:Hello\\, world!\ttwo\tthree', 'k'], '\t');
})
function test(list, delim) {
  tape(`guessDelimiter - "${delim}"`, async function (t) {
    let i = 0;
    const delimiter = guessDelimiter();
    const f = compose(
      delimiter.guesser,
      arraysFromDsv(delimiter),
    );
    for await (let array of f(list)) {
      t.deepEqual(array, list[i++].split(delim));
    }
    t.equal(i, list.length);
  })
}

tape(`guessDelimiter using only the header line`, async function (t) {
  testOneLineGuess(['a;A', 'b;B', 'c;C', 'd;D', 'abc:Hello, world!;two;three', 'k'], ';');
  testOneLineGuess(['a,A', 'b,B', 'c,C', 'd,D', 'abc:Hello\\, world!,two,three', 'k'], ',');
  testOneLineGuess(['a|A', 'b|B', 'c|C', 'd|D', 'abc:Hello\\, world!|two|three', 'k'], '|');
  testOneLineGuess(['a\tA', 'b\tB', 'c\tC', 'd\tD', 'abc:Hello\\, world!\ttwo\tthree', 'k'], '\t');
})

function testOneLineGuess(list, delim) {
  tape(`guessDelimiter using one line: "${delim}"`, async function (t) {
    let i = 0;
    const delimiter = guessDelimiter(1);
    const f = compose(
      delimiter.guesser,
      arraysFromDsv(delimiter),
    );
    for await (let array of f(list)) {
      t.deepEqual(array, list[i++].split(delim));
    }
    t.equal(i, list.length);
  })
}


function compose(...list) {
  return async function* (it = [], ...args) {
    yield* list.reduce((it, f) => (f ? f(it, ...args) : it), it);
  }
}