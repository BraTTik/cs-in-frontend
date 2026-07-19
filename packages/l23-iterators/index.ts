import { random } from "./random-int.ts";
import { Range } from "./range.ts";
import { take } from "./take.ts";
import { filter } from "./filter.ts";
import { enumerate } from "./enumerate.ts";
import { seq } from "./seq.ts";

const randomInt = random(0, 100);

// for (let i = 0; i < 10; i++) {
//   console.log(randomInt.next().value)
// }
//

// const range = new Range("a", "f");
// const intRange = new Range(-5, 1);
//
// console.log(Array.from(range));
// console.log(Array.from(range.reverse()));
// console.log(Array.from(intRange));
// console.log(Array.from(intRange.reverse()));


console.log([...seq([[1, 2], new Set([3, 4]), "bla"])]);
