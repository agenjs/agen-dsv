import { dsvFormat } from 'd3-dsv';

export default function newDelimiterGuesser(delimiters = [';', ',', '|', '\t']) {

  let slots = delimiters.map(d => ({
    delimiter : d,
    lengths: [],
    sigma: 0,
    mean: 0,
    splitter: dsvFormat(d)
  }));

  async function done() {
    slots.forEach((slot) => {
      slot.sigma = getSigma(slot.lengths);
      slot.mean = getMean(slot.lengths);
    });
    // slots.sort((a, b) => (b.mean === a.mean) ? a.sigma - b.sigma : b.mean - a.mean);
    slots.sort((a, b) => (b.mean !== a.mean) ? b.mean - a.mean : a.sigma - b.sigma);
    return slots[0].delimiter;
  }

  function update(line) {
    for (let { splitter, lengths } of slots) {
      const cols = splitter.parseRows(line)[0] || [];
      const len = cols.length;
      if (!len) continue;
      lengths.push(len);
    }
    return line;
  }

  function getMean(list) {
    list.sort();
    return list[Math.round(list.length / 2)];
  }

  function getSigma(list) {
    if (list.length < 2) return 0;
    let avg = list.reduce((a, v) => (a + v), 0) / list.length;
    let s = list.reduce((s, v) => s += ((v - avg) * (v - avg)), 0);
    s = Math.sqrt(s) / (list.length - 1);
    return s;
  }

  return { update, done };
}
