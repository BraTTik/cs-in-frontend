import { getCharShift, getCharBits, charOpCode, UPPER_CASE_CHAR, OP_CODE_LENGTH, END_CHAR} from "./dictionary.ts";
import { Byte } from "./byte.ts";
import { Vector } from "./vector.ts";

const isUpperCase = (str: string) => /^[А-Я]*$/.test(str);

export const encode = (str: string): Uint8Array => {
  const vector = new Vector();
  let currentByte = new Byte();

  const addBits = (bits: number, length: number) => {
    if (length === 0) return;
    const [remainBits, remainBitsLength] = currentByte.write(bits, length);
    if (remainBitsLength) {
      vector.push(currentByte.value);
      currentByte = new Byte();
      addBits(remainBits, remainBitsLength)
    }
  }

  for (let char of str) {
    const isUpper = isUpperCase(char);
    const { code, length} = getCharBits(char.toLowerCase());
    if (isUpper) {
      addBits(charOpCode(UPPER_CASE_CHAR), OP_CODE_LENGTH);
    }
    const [remainBits, remainBitsLength] = currentByte.write(code as number, length);
    addBits(remainBits, remainBitsLength);
  }

  const { code, length} = getCharBits(END_CHAR);
  addBits(code as number, length);
  if (!currentByte.isEmpty) vector.push(currentByte.value);

  return vector.array;
}
