import tape from "tape-await";
import { arraysToDsv } from "../src/index.js";

tape(`arraysToDsv`, async function (t) {
  const list = [
    ['a', 'A'],
    ['b', 'B'],
    ['c', 'C'],
    ['d', 'D'],
    [],
    ['abc:Hello, world!', 'two', 'three'],
    ['k']
  ];
  const control = ['a;A', 'b;B', 'c;C', 'd;D', '', 'abc:Hello, world!;two;three', 'k'];
  let i = 0;
  const f = arraysToDsv();
  for await (let str of f(list)) {
    t.equal(str, control[i++]);
  }
  t.equal(i, list.length);
})
