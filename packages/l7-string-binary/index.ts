import { encodeStrings, decodeStrings } from "./b-version.ts";

const encoded = encodeStrings(["Hello", "world", "!"]);

encoded.set(1, "мир");

console.log(encoded.at(1))
