export const appendOpCode = (op: number, code: number, shift: number = 0) => {
  op = op << shift;
  return op | code;
}

export const UPPER_CASE_CHAR = "\U"
export const END_CHAR = "\e"
export const UPPER_CASE_CODE = 0;

export const OP_CODE_LENGTH = 2;

export const getCharBits = (char: string) => {
  const code = dictionary[getCharShift(char)][char];
  const length = getCharShift(char);

  return {
    code,
    length: OP_CODE_LENGTH + length,
  }
}

export const getCharShift = (char: string) => {
  switch (char) {
    case "о":
    case "е":
    case "а":
    case "и":
      return 2;
    case  " ":
    case  "н":
    case  "т":
    case  "с":
    case  "р":
    case  "в":
    case  "л":
    case  "к":
      return 3;
    default:
      return 6;
  }
}

export const getCodeLength = (opCode: number) => {
  switch (opCode) {
    case 1:
      return 2;
    case 2:
      return 3;
    default:
      return 6;
  }
}

export const charOpCode = (char: string) => {
  switch (char) {
    case UPPER_CASE_CHAR:
      return UPPER_CASE_CODE;
    case "о":
    case "е":
    case "а":
    case "и":
      return 1;
    case " ":
    case  "н":
    case  "т":
    case  "с":
    case  "р":
    case  "в":
    case  "л":
    case  "к":
      return 2;
    default:
      return 3;
  }
}

const makeCode = (char: string, code: number, ) => {
  return { [char]: appendOpCode(charOpCode(char), code, getCharShift(char)), [code]: char }
}

export const dictionary = {
  2: {
    ...makeCode("о", 0b00),
    ...makeCode("е", 0b01),
    ...makeCode("а", 0b10),
    ...makeCode("и", 0b11),
  },
  3: {
    ...makeCode(" ", 0b000),
    ...makeCode("н", 0b001),
    ...makeCode("т", 0b010),
    ...makeCode("с", 0b011),
    ...makeCode("р", 0b100),
    ...makeCode("в", 0b101),
    ...makeCode("л", 0b110),
    ...makeCode("к", 0b111),
  },
  6: {
    ...makeCode("м", 0b000001),
    ...makeCode("д", 0b000010),
    ...makeCode("п", 0b000011),
    ...makeCode("у", 0b000100),
    ...makeCode("я", 0b000101),
    ...makeCode("ы", 0b000110),
    ...makeCode("ь", 0b000111),
    ...makeCode("г", 0b001000),
    ...makeCode("з", 0b001001),
    ...makeCode("б", 0b001010),
    ...makeCode("у", 0b001011),
    ...makeCode("й", 0b001100),
    ...makeCode("ч", 0b001101),
    ...makeCode("ж", 0b001110),
    ...makeCode("ш", 0b001111),
    ...makeCode("ю", 0b010000),
    ...makeCode("ц", 0b010001),
    ...makeCode("щ", 0b010010),
    ...makeCode("э", 0b010011),
    ...makeCode("ф", 0b010100),
    ...makeCode("ъ", 0b010101),
    ...makeCode("ё", 0b010110),
    ...makeCode("х", 0b110000),
    ...makeCode(".", 0b010111),
    ...makeCode(",", 0b011000),
    ...makeCode(";", 0b011001),
    ...makeCode(":", 0b011010),
    ...makeCode("...", 0b011011),
    ...makeCode("?", 0b011100),
    ...makeCode("!", 0b011101),
    ...makeCode("-", 0b011110),
    ...makeCode("(", 0b011111),
    ...makeCode(")", 0b100000),
    ...makeCode("[", 0b100001),
    ...makeCode("]", 0b100010),
    ...makeCode("«", 0b100011),
    ...makeCode("»", 0b100100),
    ...makeCode("„", 0b100101),
    ...makeCode("“", 0b100110),
    ...makeCode("/", 0b100111),
    ...makeCode("|", 0b101000),
    ...makeCode("\\", 0b101001),
    ...makeCode("\"", 0b101010),
    ...makeCode("'", 0b101011),
    ...makeCode("+", 0b101100),
    ...makeCode("_", 0b101101),
    ...makeCode("%", 0b101110),
    ...makeCode("-", 0b101111),
    ...makeCode("\n", 0b111100),
    ...makeCode("\t", 0b111101),
    ...makeCode(END_CHAR, 0b111110),
    ...makeCode("~", 0b111111),
  },
  nums: {
    ...makeCode("0", 0b110010),
    ...makeCode("1", 0b110011),
    ...makeCode("2", 0b110100),
    ...makeCode("3", 0b110101),
    ...makeCode("4", 0b110110),
    ...makeCode("5", 0b110111),
    ...makeCode("6", 0b111000),
    ...makeCode("7", 0b111001),
    ...makeCode("8", 0b111010),
    ...makeCode("9", 0b111011),
  }
}
