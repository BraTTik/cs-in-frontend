import { encodeStrings, decodeStrings } from "../b-version.ts";

const tests = ["Hello", "world", "!", "", "мир"];

const HELLO = "Hello";
const testEncoded = new TextEncoder().encode(HELLO);

describe("tests for B-version", () => {
  it ("encoded string", () => {
    const test = encodeStrings([HELLO]);
    expect(test.__buffer.slice(Uint32Array.BYTES_PER_ELEMENT)).toEqual(testEncoded.buffer);
  })

  it("encodes strings", () => {
    const buffer = encodeStrings(tests);

    expect(buffer.at(0)).toBe("Hello");
    expect(buffer.at(2)).toBe("!");
    expect(buffer.at(-1)).toBe("мир");
    expect(buffer.at(-2)).toBe("");
  })

  it("decodes strings", () => {
    const buffer = encodeStrings(tests);
    expect(decodeStrings(buffer)).toEqual(tests);
  })
})
