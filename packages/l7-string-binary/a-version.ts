import type { Buffer } from "./types.ts";
import { readString } from "./string-view.ts";
import { DynamicBuffer } from "./dynamic-buffer.ts";

export class AVersion implements Buffer {
   #buffer: DynamicBuffer;
   #encoder = new TextEncoder();

   #lengthOffset = Uint32Array.BYTES_PER_ELEMENT;

   get __buffer() {
     return this.#buffer.buffer;
   }

   get length(): number {
     return this.#buffer.getUint32(0);
   }

  constructor(values: string[]) {
    this.#buffer = new DynamicBuffer(8, true);
    this.#buffer.setInt32(0, values.length);
    let offset = this.#lengthOffset;

    values.forEach((str, index) => {
      const encoded = this.#encode(str);
      offset = this.#writeStringLength(encoded.length, offset)
      this.#write(encoded, offset);
      offset += encoded.length;
    })
  }

  at(index: number): string | undefined {
     const offset = this.#getOffset(index);
     if (offset < 0) return undefined;
     const [stringLength, readOffset] = this.#readStringLength(offset);

     return readString(this.#buffer.buffer, readOffset, stringLength);
  }

  forEach(callback: (value: string, index: number) => void) {
    let index = 0;

    for (let item of this) {
      callback(item, index);
      index += 1;
    }
  }

  #getOffset(_index: number): number {
     const index = this.#normalizeIndex(_index);
     let current = 0;
     if (index >= this.length) return -1;
     let offset = this.#lengthOffset;

     while (current < this.length) {
       if (current === index) {
         return offset
       }

       const [byteLength, readOffset] = this.#readStringLength(offset);
       offset = readOffset + byteLength;

       current++;
     }

     return -1;
  }

  #encode(str: string) {
     return this.#encoder.encode(str);
  }

  #write(bytes: Uint8Array, offset = 0) {
     this.#buffer.write(offset, bytes.buffer)
  }

  #readStringLength(offset: number): [lenght: number, offset: number] {
     offset = this.#align(offset, Uint32Array.BYTES_PER_ELEMENT);
     const length = this.#buffer.getUint32(offset);
     return [length, offset + Uint32Array.BYTES_PER_ELEMENT];
  }

  #writeStringLength(value: number, offset: number) {
     offset = this.#align(offset, Uint32Array.BYTES_PER_ELEMENT);
     this.#buffer.setInt32(offset, value, true);
     return offset + this.#lengthOffset;
  }

  #normalizeIndex(index: number): number {
     return ((index % this.length) + this.length) % this.length;
  }

  #align(offset: number, bytesPerElement: number): number {
     return (offset + bytesPerElement - 1) & ~(bytesPerElement - 1);
  }

  *[Symbol.iterator]() {
     let i = 0;
     let offset = this.#lengthOffset;

    while (i < this.length) {
      const [stringLength, readOffset] = this.#readStringLength(offset);
      const str = readString(this.#buffer.buffer, readOffset, stringLength);
      offset = readOffset + stringLength;
      i++;

      yield str;
    }
  }
}

export const encodeStrings = (strings: string[]): Buffer => {
  return new AVersion(strings)
}

export const decodeStrings = (buffer: Buffer): string[] => {
  const str = new Array(buffer.length);
  buffer.forEach((val, index) => {
    str[index] = val;
  });

  return str;
}
