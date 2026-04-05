import { Byte } from "./byte.ts";
import { END_CHAR, UPPER_CASE_CHAR, UPPER_CASE_CODE, getCodeLength, OP_CODE_LENGTH, dictionary } from "./dictionary.ts";
import { toBinaryString } from "utils";

class Reader {
  private bytes: IterableIterator<Byte>;
  private current: Byte | undefined;

  constructor(bytes: Uint8Array) {
    this.bytes = [...bytes].map(b => new Byte(b, 8))[Symbol.iterator]();
    this.current = this.bytes.next().value;
  }

  read(length: number) {
    if (!this.current) return null;
    let [val, rem] = this.current.read(length);

    if (rem !== 0) {
      this.current = this.bytes.next().value!;
      let [remVal] = this.current!.read(rem);
      val |= remVal;
    }

    return val;
  }
}


export const decode = (bytes: Uint8Array) => {
  let str = "";
  let isCaps = false;

  const reader = new Reader(bytes);

  const readOpCode = () => {
    let opCode = reader.read(OP_CODE_LENGTH);
    if (opCode === UPPER_CASE_CODE) {
      isCaps = true;
      opCode = reader.read(OP_CODE_LENGTH);
    }

    return opCode;
  }

  while(true) {
    const opCode = readOpCode();
    if (opCode == null) break;
    const bits = reader.read(getCodeLength(opCode));
    if (bits == null) break;

    let char = dictionary[getCodeLength(opCode)][bits];
    if (char === END_CHAR) break;
    if (!char) {
      char = dictionary.nums[bits];
    }
    if (isCaps) {
      char = char.toUpperCase();
      isCaps = false
    }

    str += char;
  }

  return str;
}
