import { encode } from "../encode.ts";
import { toBinaryString } from "utils";

describe("encode", () => {
  it("should encode А", () => {
    const arr = encode("А");
    expect(arr).toEqual(new Uint8Array([0b00_01_10_11, 0b11111000, 0, 0, 0, 0, 0, 0]));
  })

  it("should encode Мама", () => {
    const arr = encode("Мама");
    expect(arr).toEqual(new Uint8Array([0b00_11_0000, 0b01_01_10_11, 0b000001_01, 0b10_111111, 0b10_000000, 0, 0, 0]));
  })
})
