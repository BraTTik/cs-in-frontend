import { encodeStrings, decodeStrings } from "./a-version.ts";

const encoded = encodeStrings(["Hello", "world", "!", "", "мир"]);

console.log(decodeStrings(encoded))
