import { BCD } from "./bcd.ts";

const n = new BCD(BigInt(2**88));

console.log(n.toBigint());
console.log(n.toNumber());
console.log(n.toString())

console.log(n.at(0));
console.log(n.at(1));
console.log(n.at(-1));
console.log(n.at(-2));
