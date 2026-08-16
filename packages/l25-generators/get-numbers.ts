import { ReadStream } from "node:fs";

export function getNumbers(stream: ReadStream) {
  let current = stream;

  function* numberIterator() {
    const numberRegex = /[-+]?(([1-9]\d*|0)(\.\d*)?|\.\d+)([eE][-+]?\d+)?/g;
    current.setEncoding("utf-8");

    let chunk = current.read(64);

    while (chunk != null) {
      const str = chunk.toString();
      const match = str.matchAll(numberRegex);

      for (const m of match) {
        const input = m[0];
        if (input != null) {
          yield parseFloat(input);
        }
      }

      chunk = current.read(64);
    }
  }

  let iter = numberIterator();

  return {
     [Symbol.iterator]() {
       return this;
     },
    next(newStream?: ReadStream) {
      if (newStream) {
        current = newStream;
        iter = numberIterator();
      }

      const val = iter.next();

      if (val.done) {
        throw "Expect new data stream";
      }

      return val;
    }
  }
}
