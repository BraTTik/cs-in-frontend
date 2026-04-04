import { toBinaryString } from "utils";
import { appendOpCode, charOpCode, dictionary, } from "./dictionary.ts";
import { encode } from './encode.ts';

console.log(appendOpCode(1, 1, 2))

console.log(dictionary)

console.log(encode("А"))
