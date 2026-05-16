import { Heap } from "../memory/heap.ts";
import { HeapBlock } from "../memory/heap-block.ts";

const BUFFER_SIZE = 256;
const HEAP_CAPACITY = 128;
const HEAP_LOW = BUFFER_SIZE - HEAP_CAPACITY;
const HEAP_HIGH = BUFFER_SIZE;
const HEADER = HeapBlock.HEADER_BYTE_LENGTH;
const INITIAL_PAYLOAD = HEAP_CAPACITY - HEADER;

/** Payload start for a block with exclusive end `blockEnd` and payload `size`. */
const payloadPtr = (blockEnd: number, size: number) => blockEnd - size - HEADER;

describe("Heap", () => {
  let buffer: ArrayBuffer;
  let heap: Heap;
  let view: Uint8Array;

  beforeEach(() => {
    buffer = new ArrayBuffer(BUFFER_SIZE);
    view = new Uint8Array(buffer);
    heap = new Heap(buffer, HEAP_CAPACITY);
  });

  it("first malloc uses the high end of the heap region", () => {
    const size = 16;
    const ptr = heap.malloc(size);

    expect(ptr).toBe(payloadPtr(HEAP_HIGH, size));
    expect(ptr).toBeGreaterThan(HEAP_LOW);
  });

  it("subsequent malloc addresses decrease (allocation from the end)", () => {
    const first = heap.malloc(32);
    const second = heap.malloc(16);

    expect(second).toBeLessThan(first);
  });

  it("allows writing and reading payload", () => {
    const size = 24;
    const ptr = heap.malloc(size);

    for (let i = 0; i < size; i++) {
      view[ptr + i] = i + 1;
    }

    for (let i = 0; i < size; i++) {
      expect(view[ptr + i]).toBe(i + 1);
    }
  });

  it("throws when freeing with wrong size", () => {
    const size = 32;
    const ptr = heap.malloc(size);

    expect(() => heap.free(ptr, size + 8)).toThrow();
  });

  it("throws Out of Memory when request exceeds heap capacity", () => {
    expect(() => heap.malloc(INITIAL_PAYLOAD + 1)).toThrow("Out of Memory");
  });

  it("throws Out of Memory when heap is fully allocated", () => {
    heap.malloc(INITIAL_PAYLOAD);

    expect(() => heap.malloc(8)).toThrow("Out of Memory");
  });

  it("coalesces after free and allows reusing the full heap", () => {
    const sizeA = 48;
    const sizeB = 24;
    const ptrA = heap.malloc(sizeA);
    const ptrB = heap.malloc(sizeB);

    heap.free(ptrA, sizeA);
    heap.free(ptrB, sizeB);

    const largeSize = INITIAL_PAYLOAD - HEADER - 8;
    const ptrLarge = heap.malloc(largeSize);

    expect(ptrLarge).toBe(payloadPtr(HEAP_HIGH, largeSize));
    expect(ptrLarge).toBeLessThan(ptrA);
    expect(ptrLarge + largeSize).toBeLessThanOrEqual(HEAP_HIGH - HEADER);
  });

  it("allocates the entire initial block in one call", () => {
    const ptr = heap.malloc(INITIAL_PAYLOAD);

    expect(ptr).toBe(HEAP_LOW);
    expect(() => heap.malloc(4)).toThrow("Out of Memory");
  });

  it("keeps allocations within heap bounds", () => {
    const sizes = [32, 20, 8];

    for (const size of sizes) {
      const ptr = heap.malloc(size);
      expect(ptr).toBeGreaterThanOrEqual(HEAP_LOW);
      expect(ptr + size).toBeLessThanOrEqual(HEAP_HIGH);
    }
  });

  it("coalesces when freeing in reverse allocation order", () => {
    const sizeA = 36;
    const sizeB = 28;
    const ptrA = heap.malloc(sizeA);
    const ptrB = heap.malloc(sizeB);

    heap.free(ptrB, sizeB);
    heap.free(ptrA, sizeA);

    const reusedSize = INITIAL_PAYLOAD - 20;
    expect(heap.malloc(reusedSize)).toBe(payloadPtr(HEAP_HIGH, reusedSize));
  });

  it("throws Out of Memory when fragments are too small", () => {
    heap.malloc(48);
    heap.malloc(24);

    expect(() => heap.malloc(24)).toThrow("Out of Memory");
  });
});
