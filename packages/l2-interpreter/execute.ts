import * as COMMANDS from "./commands.ts";
type Memory = { value: number | undefined, cursor: number }

export const execute = (program: number[]) => {
  const memory: Memory = {
    value: undefined,
    cursor: 0
  };

  while(memory.cursor < program.length) {
    const command = program[memory.cursor];
    switch (command) {
      case COMMANDS.SET_A:
        incCursor(memory)
        setA(memory, getOperand(memory, program));
        break;
      case COMMANDS.PRINT_A:
        printA(memory)
        break;
      case COMMANDS.IFN_A:
        if (!ifnA(memory)) {
          // двигаем курсор через команду
          jmp(memory, memory.cursor + 2)
        }
        break;
      case COMMANDS.DEC_A:
        decA(memory);
        break;
      case COMMANDS.JMP:
        incCursor(memory);
        jmp(memory, getOperand(memory, program) - 1);
        break;
      case COMMANDS.RET:
        incCursor(memory);
        return memory.value;
      default:
        throw new Error("Unknown command");
    }
    incCursor(memory)
  }
}

function setA(memory: Memory, value: number) {
  memory.value = value;
}

function printA(memory: Memory) {
  console.log(memory.value);
}

function ifnA(memory: Memory) {
  return memory.value === 0;
}

function decA(memory: Memory) {
  if (undA(memory)) {
    throw new Error("A is undefined")
  }
  memory.value! -= 1;
}

function jmp(memory: Memory, value: number) {
  memory.cursor = value;
}

function undA(memory: Memory) {
  return memory.value == null
}

function incCursor(memory: Memory) {
  memory.cursor += 1
}

function getOperand(memory: Memory, program: number[]) {
  return program[memory.cursor];
}
