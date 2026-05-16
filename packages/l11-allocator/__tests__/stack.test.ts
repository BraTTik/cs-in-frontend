import { Stack } from "../memory/stack.ts";

let stack: Stack;

describe("Stack", () => {
  beforeEach(() => {
    stack = new Stack(new ArrayBuffer(Uint32Array.BYTES_PER_ELEMENT * 32), 0, Uint32Array.BYTES_PER_ELEMENT * 32)
  })

  it("push and pop", () => {
    stack.push(12, 42);
    const frame = stack.pop();
    expect(frame?.address).toBe(12);
    expect(frame?.byteLength).toBe(42)
  })

  it("pops in proper order", () => {
    const iteratee = 3;

    for (let i = 0; i < iteratee; i++) {
      stack.push(i, i);
    }

    for (let i = 0; i < iteratee; i++) {
      const frame  = stack.pop();
      expect(frame?.address).toBe(iteratee - 1 - i);
      expect(frame?.byteLength).toBe(iteratee - 1 - i);
    }
  })

  it("throws error on overflow", () => {
    expect(() => {
      let guard = 0;
      while (guard < 100) {
        stack.push(41, 42)
        guard++
      }
    }).toThrow("Stack overflow");
  })
})
