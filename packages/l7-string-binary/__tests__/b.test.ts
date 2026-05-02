import { encodeStrings, decodeStrings } from "../b-version.ts";

const tests = ["Hello", "world", "!", ""];

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
    expect(buffer.at(-1)).toBe("");
  })

  it("decodes strings", () => {
    const buffer = encodeStrings(tests);
    expect(decodeStrings(buffer)).toEqual(tests);
  })

  it("sets value", () => {
    const buffer = encodeStrings(tests);
    buffer.set(1, "мир");
    expect(buffer.at(1)).toBe("мир")
  })

  it("handles set edge-cases", () => {
    const buffer = encodeStrings(["zero", "one", "two", "three"]);

    // negative index should point to the last item
    buffer.set(-1, "");
    expect(buffer.at(3)).toBe("");

    buffer.set(-2, "wrapped");
    // ensure whole structure remains readable after edge updates
    expect(decodeStrings(buffer)).toEqual(["zero", "one", "wrapped", ""]);
  })

  it("applies sequential set with different string lengths", () => {
    const buffer = encodeStrings(["aa", "bb", "cc", "dd"]);

    buffer.set(0, "x");
    buffer.set(1, "very long value with unicode мир");
    buffer.set(2, "");
    buffer.set(3, "mid");
    buffer.set(1, "y");
    buffer.set(0, "another long value");

    expect(decodeStrings(buffer)).toEqual(["another long value", "y", "", "mid"]);
    expect(buffer.at(0)).toBe("another long value");
    expect(buffer.at(1)).toBe("y");
    expect(buffer.at(2)).toBe("");
    expect(buffer.at(3)).toBe("mid");
  })
})
