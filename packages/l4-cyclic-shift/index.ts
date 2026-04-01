import { toBinaryString } from "utils";
import { cyclicShiftLeft } from "./cyclic-shift-left.ts";
import { cyclicShiftRight } from "./cyclic-shift-right.ts";


console.log(toBinaryString(cyclicShiftRight(0b10000000_00000000_00000000_00000001, 32 / 2)))

let num = 0b10101010_10101010_10101010_10101010
for (let i = 0; i < 10; i++) {
  num = cyclicShiftLeft(num, 1);
  num = cyclicShiftRight(num, 1);
  console.log(num >>> 0);
}

