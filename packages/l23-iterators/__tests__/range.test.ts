import { Range } from "../range.ts";

const minInt = -5;
const maxInt  = 1;

const length = maxInt - minInt;

const minChar = "a";
const maxChar = "f";

const integers = Array.from({ length: Math.abs(length) + 1 }).map((_, i) => i + minInt);
const chars = Array.from({ length: 6 }, (_, i) => String.fromCharCode(i + minChar.charCodeAt(0)));

describe("Range", () => {
  it("should create range of integers", () => {
    const range = new Range(-5, 1);

    expect(Array.from(range)).toEqual(integers);
    expect(Array.from(range.reverse())).toEqual(integers.toReversed());
  })

  it("should create range of chars", () => {
    const range = new Range(minChar, maxChar);

    expect(Array.from(range)).toEqual(chars);
    expect(Array.from(range.reverse())).toEqual(chars.toReversed());
  })

  it("should throw error on different types", () => {
    expect(() => new Range(minChar, maxInt as unknown as string)).toThrow();
  })

  it("should throw error on double", () => {
    expect(() => new Range(minInt, 4.3)).toThrow();
  })

  it("should throw if min greater than max", () => {
    expect(() => new Range(maxInt, minInt)).toThrow();
    expect(() => new Range(maxChar, minChar)).toThrow();
  })
})
