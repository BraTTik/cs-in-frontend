import { random } from "./random-int.ts";
import { Range } from "./range.ts";

const randomInt = random(0, 100);

// for (let i = 0; i < 10; i++) {
//   console.log(randomInt.next().value)
// }
//

const range = new Range("a", "f");
const intRange = new Range(-5, 1);

console.log(Array.from(range));
console.log(Array.from(range.reverse()));
console.log(Array.from(intRange));
console.log(Array.from(intRange.reverse()));
