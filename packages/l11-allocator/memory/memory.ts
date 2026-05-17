import { Stack } from "./stack.ts";
import { Heap } from "./heap.ts";
import { PointerFrame } from "./pointer-frame.ts";

class Pointer {
  #destroyed = false;
  free: () => void;
  #stackFrame?: PointerFrame;
  #mem: Memory;
  #ptr: number;
  #size: number;
  #buffer: ArrayBuffer;

  get _ptr() {
    return this.#ptr;
  }

  get _size() {
    return this.#size;
  }

  constructor( ptr: number, size: number, buffer: ArrayBuffer, mem: Memory,  free: () => void, stackFrame?: PointerFrame) {
    this.free = () => {
      if (this.#destroyed) {
        throw new Error("Double free detected");
      }
      this.#destroyed = true;
      free();
    };
    this.#stackFrame = stackFrame;
    this.#mem = mem;
    this.#ptr = ptr;
    this.#size = size;
    this.#buffer = buffer;
  }

  change(buffer: ArrayBuffer): void {
    if (this._size === buffer.byteLength) {
      this.#mem.__write(buffer, this._ptr);
    } else {
      const ptr = this.#mem.alloc(buffer.byteLength);
      if (this.#stackFrame) {
        this.#stackFrame.address = ptr.valueOf();
        this.#stackFrame.byteLength = buffer.byteLength;
      }
      this.#mem.__write(buffer, ptr.valueOf());
    }
  }

  deref() {
    return this.#buffer.slice(this.valueOf(), this._size + this.valueOf());
  }

  valueOf() {
    return this._ptr;
  }

  [Symbol.toPrimitive](hint: string) {
    if (hint === "string") {
      return this.valueOf().toString(16)
    }
    return this.valueOf();
  }
}


export class Memory {
  #heap: Heap;
  #stack: Stack;
  #buffer: ArrayBuffer;
  #bufferView: Uint8Array;

  constructor(capacity: number, { stack }: { stack: number }) {
    const heapMemory = capacity - stack;
    if (heapMemory <= 0) {
      throw new Error("Heap Memory can't be less or equal 0");
    }

    this.#buffer = new ArrayBuffer(capacity);
    this.#stack = new Stack(this.#buffer, 0, stack);
    this.#heap = new Heap(this.#buffer, heapMemory);
    this.#bufferView = new Uint8Array(this.#buffer);
  }

  push(buffer: ArrayBuffer) {
    const address = this.#heap.malloc(buffer.byteLength);
    const frame = this.#stack.push(address, buffer.byteLength);
    this.__write(buffer, address);

    return new Pointer(address, buffer.byteLength, this.#buffer, this, () => {
      throw new Error("Stack pointer cannot be freed use pop instead");
    }, frame)
  }

  pop() {
    const frame = this.#stack.pop();
    if (frame) {
      this.#heap.free(frame.address, frame.byteLength);
    }
    return frame;
  }

  alloc(capacity: number) {
    const ptr = this.#heap.malloc(capacity);

    return new Pointer(ptr, capacity, this.#buffer, this, () => {
      this.free(ptr, capacity);
    })
  }

  free(address: number, size: number) {
    this.#heap.free(address, size);
  }

  /** unsafe service method do not use out of class */
  __write(buffer: ArrayBuffer, ptr: number): void {
    this.#bufferView.set(new Uint8Array(buffer), ptr);
  }
}
