export default function newRowParser(delimiter) {
  return function(str) {
    const list = [];
    let len = str.length;
    // Strip '\n' and '\r' symbols:
    while (len > 0) {
      const ch = str[len - 1];
      if (ch !== '\n' && ch !== '\r') break;
      len--;
    }
    let quote = false, esc = false, value = '', newCell = true;
    for (let i = 0; i < len; i++) {
      const ch = str[i];
      if (esc) {
        value += ch;
        newCell = false;
        esc = false;
      } else if (ch === '\\') {
        esc = true;
      } else if (quote) {
        if (ch === quote) {
          if (str[i + 1] === quote) {
            esc = true;
          } else {
            quote = false;
            newCell = true;
            list.push(value);
            value = '';
          }
        } else {
          value += ch;
        }
      } else if (ch === '"') {
        quote = ch;
      } else if (ch === delimiter) {
        newCell = true;
        list.push(value);
        value = '';
      } else {
        value += ch;
        newCell = false;
      }
    }
    if (value.length || newCell) list.push(value);
    return list;
  }
}