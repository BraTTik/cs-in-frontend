import { DynamicBuffer } from "../dynamic-buffer.ts";

describe("DynamicBuffer", () => {
  it("writes and reads string", () => {
    const buffer = new DynamicBuffer();
    buffer.write(0, new TextEncoder().encode("Hello").buffer);
    expect(new Uint8Array(buffer.read(0, 5))).toEqual(new TextEncoder().encode("Hello"));
  });

  it("expands buffer", () => {
    const buffer = new DynamicBuffer(4);
    buffer.write(0, new TextEncoder().encode("Hello").buffer);
    buffer.write(5, new TextEncoder().encode("World").buffer); // 10 bytes
    expect(new Uint8Array(buffer.read(0, 10))).toEqual(new TextEncoder().encode("HelloWorld"));
  });
});
