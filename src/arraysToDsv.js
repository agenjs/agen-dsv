import { dsvFormat } from 'd3-dsv';

export default function arraysToDsv({ delimiter = ';' } = {}) {
  return async function* (it) {
    let xsv;
    for await (let array of it) {
      if (!xsv) {
        if (typeof delimiter === 'function') delimiter = await delimiter();
        xsv = dsvFormat(delimiter);
      }
      yield xsv.formatRows([array]);
    }
  }
}
