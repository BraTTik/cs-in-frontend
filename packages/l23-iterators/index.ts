import { random } from "./random-int.ts";
import { Range } from "./range.ts";
import { take } from "./take.ts";
import { filter } from "./filter.ts";
import { enumerate } from "./enumerate.ts";
import { seq } from "./seq.ts";
import { mapSeq} from "./map-seq.ts";

const randomInt = random(0, 100);

console.log([...filter([1, 2, 3, 4], (el) => el % 2 === 0)])
console.log([...seq([[1, 2], new Set([3, 4]), "bla"])]);
console.log([...mapSeq([1, 2, 3], [(el) => el * 2, (el) => el + 1])]);
