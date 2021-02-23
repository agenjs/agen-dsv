import newDelimiterGuesser from './newDelimiterGuesser.js';

export default function guessDelimiter(len = 10, ...args) {
  let { update, done } = newDelimiterGuesser(...args);
  let resolve, promise = new Promise(r => resolve = r);
  async function delimiter() { return promise; }
  async function* guesser(it) {

    let idx = 0, buffer = [];
    try {
      for await (let line of it) {
        if (idx < len) {
          buffer.push(update(line));
          if (buffer.length === len) {
            resolve(done());
            yield* buffer;
          }
        } else {
          yield line;
        }
        idx++;
      }
      if (idx < len) {
        resolve(done());
        yield* buffer;
      }
    } finally {
      resolve(done());
    }
  }
  delimiter.guesser = guesser;
  return delimiter;
}