import { PointerFrame } from "./pointer-frame.ts";

export class Stack {
  #buffer: ArrayBuffer;
  #view: Uint8Array;
  #length: number;

  constructor(buffer: ArrayBuffer, byteOffset: number, capacity: number) {
    this.#buffer = buffer;
    this.#length = 0;
    this.#view = new Uint8Array(this.#buffer, byteOffset, capacity);
  }

  push(address: number, byteLength: number) {
    if (this.#isOverflow(PointerFrame.byteLength)) {
      throw new RangeError("Stack overflow");
    }

    const frame = PointerFrame.write(this.#buffer, this.#length, address, byteLength);
    this.#length += PointerFrame.byteLength;
    return frame;
  }

  pop() {
    if (this.#length === 0) return;
    const offset = this.#length - PointerFrame.byteLength
    const frame = PointerFrame.read(this.#buffer, offset);
    this.#length = offset;

    return frame;
  }

  #isOverflow(length: number): boolean {
    return  length + this.#length >= this.#view.length
  }
}
