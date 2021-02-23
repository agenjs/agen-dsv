import { dsvFormat } from 'd3-dsv';

export default function arraysFromDsv({ delimiter = ';' } = {}) {
  return async function* (it) {
    let xsv;
    for await (let line of it) {
      if (!xsv) {
        if (typeof delimiter === 'function') delimiter = await delimiter();
        xsv = dsvFormat(delimiter);
      }
      yield xsv.parseRows(line)[0] || []
    }
  }
}
