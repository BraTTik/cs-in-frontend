import { writeString, readString } from "../string-view.ts";

const testString = "Test String"

describe("utils", () => {
  it("writes and reads string", () => {
    const buffer = new ArrayBuffer(256);
    const encode = writeString(testString, buffer, 0);
    expect(readString(buffer, 0, encode.written)).toBe(testString);
  })
})

