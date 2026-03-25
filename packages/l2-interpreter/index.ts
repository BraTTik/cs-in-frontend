import * as COMMANDS from "./commands.ts";
import { execute } from "./execute.ts";

const program = [
  // Ставим значения аккумулятора
  COMMANDS.SET_A,
  // В 10
  10,

  // Выводим значение на экран
  COMMANDS.PRINT_A,

  // Если A равно 0
  COMMANDS.IFN_A,

  // Программа завершается
  COMMANDS.RET,

  // И возвращает 0
  0,

  // Уменьшаем A на 1
  COMMANDS.DEC_A,

  // Устанавливаем курсор выполняемой инструкции
  COMMANDS.JMP,

  // В значение 2
  2
];

execute(program);
