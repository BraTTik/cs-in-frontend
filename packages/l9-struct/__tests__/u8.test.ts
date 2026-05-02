import { U8 } from "../u8.ts";

describe("U8", () => {
  it("initializes", () => {
    const u8 = new U8();
    const buffer = new ArrayBuffer(1);
    u8.init(buffer, 0, 42);
    expect(u8.get()).toBe(42);
  });

  it("throws error if not initialized", () => {
    const u8 = new U8();
    expect(() => u8.get()).toThrow("U8 is not a initialized");
  })

  it("initializes from buffer", () => {
    const buffer = new Uint8Array(1);
    buffer[0] = 42;
    const u8 = new U8().from(buffer.buffer, 0);
    expect(u8.get()).toBe(42);
  });

  it ("initializes from buffer with offset", () => {
    const buffer = new Uint8Array(2);
    buffer[0] = 4;
    buffer[1] = 2;

    const a = new U8().from(buffer.buffer, 1);
    expect(a.get()).toBe(2);
    const b = new U8().init(buffer.buffer, 1, 42);

    expect(b.get()).toBe(42);
    expect(a.get()).toBe(42);
  })
})
