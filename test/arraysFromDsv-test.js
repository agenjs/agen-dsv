import tape from "tape-await";
import { arraysFromDsv } from "../src/index.js";

tape(`arraysFromDsv`, async function(t) {
  const list = ['a;A', 'b;B', 'c;C', 'd;D', 'abc:Hello, world!;two;three', 'k'];
  let i = 0;
  const f = arraysFromDsv();
  for await (let array of f(list)) {
    t.deepEqual(array, list[i++].split(';'));
  }
  t.equal(i, list.length);
})
