import { BCD } from "./bcd.ts";

const n = new BCD(123456);

console.log(n.toBigint());
console.log(n.toNumber());
console.log(n.toString())

console.log(n.at(0));
console.log(n.at(1));
console.log(n.at(-1));
console.log(n.at(-2));
