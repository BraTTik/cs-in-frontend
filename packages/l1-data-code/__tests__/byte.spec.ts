import { Byte } from "../byte.ts";

describe("byte", () => {
  it("adds bytes to the given value", () => {
    const byte = new Byte();
    byte.write(0b00, 2);
    expect(byte.value).toBe(0b0000_0000);
    byte.write(0b111, 3);
    expect(byte.value).toBe(0b0011_1000);
    let [rem, length] = byte.write(0b1111, 4);
    expect(byte.value).toBe(0b0011_1111);
    expect(rem).toBe(0b1);
    expect(length).toBe(1);
  })

  it("does not add if full", () => {
    const fullByte = new Byte(0, 8);
    const [rem, length] = fullByte.write(0b11, 2);
    expect(fullByte.value).toBe(0);
    expect(rem).toBe(0b11);
    expect(length).toBe(2);
  })

  it("reads value", () => {
    const byte = new Byte(0b0101_0110, 8);
    let val = byte.read(2);
    expect(val).toEqual( [0b01, 0]);
    expect(byte.value).toBe(0b01_0110_00);
    expect(byte.vacant).toBe(2);

    val = byte.read(6);
    expect(val).toEqual([0b01_0110, 0]);
    expect(byte.value).toBe(0);
    expect(byte.isEmpty).toBe(true);
  })

  it("returns proper remain", () => {
    const byte = new Byte(0b0100_0000, 2);
    const val = byte.read(4);
    expect(val).toEqual([0b0100, 2]);
  })
})
