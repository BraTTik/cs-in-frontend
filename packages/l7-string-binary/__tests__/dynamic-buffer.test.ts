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

  it("keeps existing bytes after multiple expansions", () => {
    const buffer = new DynamicBuffer(2);

    buffer.write(0, new Uint8Array([1, 2, 3, 4]).buffer);
    buffer.write(4, new Uint8Array([5, 6, 7, 8]).buffer);

    expect(new Uint8Array(buffer.read(0, 8))).toEqual(new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]));
  });

  it("supports zero-length write and read", () => {
    const buffer = new DynamicBuffer(4);

    buffer.write(0, new Uint8Array([]).buffer);
    const result = buffer.read(0, 0);

    expect(result.byteLength).toBe(0);
    expect(buffer.byteLength).toBe(4);
  });

  it("returns zero-initialized bytes from expanded unread area", () => {
    const buffer = new DynamicBuffer(1);

    buffer.setUint8(0, 42);
    const unreadByte = buffer.getUint8(10);

    expect(unreadByte).toBe(0);
    expect(buffer.byteLength).toBeGreaterThan(10);
    expect(buffer.getUint8(0)).toBe(42);
  });

  it("uses little-endian by default for typed operations", () => {
    const buffer = new DynamicBuffer(2);

    buffer.setUint16(0, 0x0102);

    expect(new Uint8Array(buffer.read(0, 2))).toEqual(new Uint8Array([0x02, 0x01]));
    expect(buffer.getUint16(0)).toBe(0x0102);
  });

  it("respects big-endian when configured in constructor", () => {
    const buffer = new DynamicBuffer(2, false);

    buffer.setUint16(0, 0x0102);

    expect(new Uint8Array(buffer.read(0, 2))).toEqual(new Uint8Array([0x01, 0x02]));
    expect(buffer.getUint16(0)).toBe(0x0102);
  });

  it("allows explicit endianness override per call", () => {
    const buffer = new DynamicBuffer(2, false);

    buffer.setUint16(0, 0x0102, true);

    expect(new Uint8Array(buffer.read(0, 2))).toEqual(new Uint8Array([0x02, 0x01]));
    expect(buffer.getUint16(0, true)).toBe(0x0102);
  });
});
