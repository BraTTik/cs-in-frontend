import { Byte } from "../byte.ts";

describe("byte", () => {
  it("adds bytes to the given value", () => {
    const byte = new Byte();
    byte.add(0b00, 2);
    expect(byte.value).toBe(0b0000_0000);
    byte.add(0b111, 3);
    expect(byte.value).toBe(0b0011_1000);
    let [rem, length] = byte.add(0b1111, 4);
    expect(byte.value).toBe(0b0011_1111);
    expect(rem).toBe(0b1);
    expect(length).toBe(1);
  })

  it("does not add if full", () => {
    const fullByte = new Byte(0, 8);
    const [rem, length] = fullByte.add(0b11, 2);
    expect(fullByte.value).toBe(0);
    expect(rem).toBe(0b11);
    expect(length).toBe(2);
  })
})
