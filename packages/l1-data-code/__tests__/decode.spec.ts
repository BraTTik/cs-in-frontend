import { encode } from "../encode.ts";
import { decode } from "../decode.ts";

const testStrings = ["Мама",  "Какая-то строка!", "Съешь ещё этих мягких французских булочек."]

describe("decode", () => {
  it.each(testStrings)( `should decode a string %s`, (test) => {
    const encodedString = encode(test);
    expect(decode(encodedString)).toBe(test)
  })
})
