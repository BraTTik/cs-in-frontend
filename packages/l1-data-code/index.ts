import { encode } from './encode.ts';
import { decode } from "./decode.ts";

const cyph = encode("Какая-то строка!");

console.log(cyph)
console.log(decode(cyph))
