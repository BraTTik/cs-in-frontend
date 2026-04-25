import { Buffer } from "./types.ts";
import { readString } from "./string-view.ts";

export class AVersion implements Buffer {
   #buffer: ArrayBuffer;
   #maxByteLength: number;
   #encoder = new TextEncoder();

   #lengthOffset = Uint32Array.BYTES_PER_ELEMENT;
   #dataView: DataView;

   get __buffer() {
     return this.#buffer;
   }

   get length(): number {
     return this.#dataView.getInt32(0, true);
   }

   get maxByteLength(): number {
     return this.#maxByteLength;
   }

  constructor(values: string[]) {
    this.#buffer = new ArrayBuffer(1024);
    this.#maxByteLength = 1024;
    this.#dataView = new DataView(this.#buffer);
    this.#dataView.setInt32(0, values.length, true)
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

     return readString(this.#buffer, readOffset, stringLength);
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
     new Uint8Array(this.#buffer, offset).set(bytes);
  }

  #readStringLength(offset: number): [lenght: number, offset: number] {
     offset = this.#align(offset, Uint32Array.BYTES_PER_ELEMENT);
     const length = this.#dataView.getUint32(offset, true);
     return [length, offset + Uint32Array.BYTES_PER_ELEMENT];
  }

  #writeStringLength(value: number, offset: number) {
     offset = this.#align(offset, Uint32Array.BYTES_PER_ELEMENT);
     this.#dataView.setInt32(offset, value, true);
     return offset + this.#lengthOffset;
  }

  #normalizeIndex(index: number): number {
     return ((index % this.length) + this.length) % this.length;
  }

  #align(offset: number, bytesPerElement: number): number {
     return (offset + bytesPerElement - 1) & ~(bytesPerElement - 1);
  }
}

export const encodeStrings = (strings: string[]): Buffer => {
  return new AVersion(strings)
}

export const decodeStrings = (buffer: Buffer): string[] => {
  const str = new Array(buffer.length);
  for (let i = 0; i < buffer.length; i++) {
    str[i] = buffer.at(i);
  }

  return str;
}
