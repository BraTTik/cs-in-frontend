import { indexOf, lastIndexOf } from "./index-of.ts";

const ages = [9, 10, 12, 15, 19, 21, 27, 29, 33, 36, 38, 42, 42, 42, 42, 42, 42, 42, 56, 62, 65, 71, 77, 81, 90, 99, 105];

console.log(lastIndexOf(ages, 12))
console.log(indexOf(ages, 56));
console.log(lastIndexOf(ages, 42));
console.log(indexOf(ages, 42));

const callOriginIndexOf: typeof indexOf<number, number> = (arr, search) => {
  return arr.indexOf(search);
}

const callOriginLastIndexOf: typeof indexOf<number, number> = (arr, search) => {
  return arr.lastIndexOf(search);
}


function benchmark(arr: number[], value: number, method: typeof indexOf<number, number>, label: string) {
  console.time(label);
  method(arr, value);
  console.timeEnd(label);
}

benchmark(ages, 42, callOriginIndexOf, "OriginIndexOf");
benchmark(ages, 42, indexOf, "indexOf");
benchmark(ages, 42, callOriginLastIndexOf, "OriginLastIndexOf");
benchmark(ages, 42, lastIndexOf, "lastIndexOf");

// Результаты
// OriginIndexOf: 0.022ms
// indexOf: 0.017ms
// OriginLastIndexOf: 0.024ms
// lastIndexOf: 0.005ms

