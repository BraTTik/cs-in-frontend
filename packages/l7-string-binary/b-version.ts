import { DynamicBuffer } from "./dynamic-buffer.ts";
import type { Buffer } from "./types.ts";
import { readString } from "./string-view.ts";

type Cursor = [length: number, cursor: number];

const CURSOR_LENGTH = Uint32Array.BYTES_PER_ELEMENT * 2;

const readStringCursor = (buffer: DynamicBuffer, offset: number): Cursor => {
  const length = buffer.getUint32(offset, true);
  const cursor = buffer.getUint32(offset + Uint32Array.BYTES_PER_ELEMENT, true);
  return [length, cursor];
}

const writeStringCursor = (cursorBuffer: DynamicBuffer, offset: number, cursor: Cursor) => {
  const [stringLength, cursorValue] = cursor;
  cursorBuffer.setUint32(offset, stringLength);
  cursorBuffer.setUint32(offset + Uint32Array.BYTES_PER_ELEMENT, cursorValue);
}

export class BVersion implements Buffer {
  #buffer: DynamicBuffer;
  #cursorBuffer: DynamicBuffer;
  #bufferOffset: number
  #encoder = new TextEncoder();

  #lengthOffset = Uint32Array.BYTES_PER_ELEMENT;

  constructor(str: string[]) {
    this.#buffer = new DynamicBuffer();
    this.#cursorBuffer = new DynamicBuffer();
    this.#bufferOffset = 0;

    const length = str.length;
    let cursorOffset = 0;
    this.#cursorBuffer.setUint32(0, length);
    cursorOffset += this.#lengthOffset;

    for (let i = 0; i < length; i++) {
      const [stringLength, cursor] = this.#writeString(str[i]);
      writeStringCursor(this.#cursorBuffer, cursorOffset, [stringLength, cursor]);
      cursorOffset += CURSOR_LENGTH;
    }
  }

  get __buffer(): ArrayBuffer {
    return this.#buffer.buffer;
  }

  at(_index: number): string | undefined {
    const index = this.#normalizeIndex(_index);
    if (index >= this.length || isNaN(index) || !isFinite(index)) return undefined;
    const cursor = this.#getCursor(index);

    return this.#readString(cursor);
  }

  forEach(callback: (value: string, index: number) => void): void {
    let index = 0;
    for (let item of this) {
      callback(item, index);
      index++;
    }
  }

  get length(): number {
    return this.#cursorBuffer.getUint32(0);
  }

  #writeString(value: string): [length: number, cursor: number] {
    const cursor = this.#bufferOffset;
    const data = this.#encoder.encode(value);
    this.#buffer.write(cursor, data.buffer);
    this.#bufferOffset += data.length;

    return [data.length, cursor];
  }

  #readString(cursor: Cursor): string {
    const [stringLength, cursorValue] = cursor;
    return readString(this.#buffer.buffer, cursorValue, stringLength);
  }

  #getCursor(index: number) {
    const offset = CURSOR_LENGTH * index;
    return readStringCursor(this.#cursorBuffer, offset + this.#lengthOffset);
  }

  #normalizeIndex(index: number): number {
    return ((index % this.length) + this.length) % this.length;
  }

  *[Symbol.iterator]() {
    const length = this.length;
    for (let i = 0; i < length; i++) {
      yield this.at(i)!;
    }
  }
}

export const encodeStrings = (str: string[]) => new BVersion(str);

export const decodeStrings = (buffer: Buffer) => {
  const length = buffer.length;
  const arr = Array.from({ length }, (i) => "");

  buffer.forEach((value, index) => {
    arr[index] = value;
  })

  return arr;
}
