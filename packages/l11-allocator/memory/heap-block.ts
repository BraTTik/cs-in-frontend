import { isLittleEndian } from "utils";

/*
структура заголовка блока
{
 address: U32;
 used: U8;
 next: U32;
 prev: U32;
 size: U32;
}
 */
export class HeapBlock {
  #dataView: DataView
  #offset: number;

  public static HEADER_BYTE_LENGTH = Uint32Array.BYTES_PER_ELEMENT * 4 + Uint8Array.BYTES_PER_ELEMENT;
  private static ADDRESS_OFFSET = 0;
  private static USED_OFFSET = Uint32Array.BYTES_PER_ELEMENT + HeapBlock.ADDRESS_OFFSET;
  private static NEXT_OFFSET =   Uint8Array.BYTES_PER_ELEMENT + HeapBlock.USED_OFFSET;
  private static PREV_OFFSET =  Uint32Array.BYTES_PER_ELEMENT + HeapBlock.NEXT_OFFSET;
  private static SIZE_OFFSET = Uint32Array.BYTES_PER_ELEMENT + HeapBlock.PREV_OFFSET;
  private static IS_LITTLE_ENDIAN = isLittleEndian();

  static create(buffer: ArrayBuffer, offset: number): HeapBlock {
    return new HeapBlock(buffer, offset);
  }

  get offset(): number {
    return this.#offset;
  }

  set offset(value: number) {
    this.#offset = value;
  }

  get size() {
    return this.#dataView.getUint32(this.offset + HeapBlock.SIZE_OFFSET, HeapBlock.IS_LITTLE_ENDIAN);
  }

  set size(value: number){
    this.#dataView.setUint32(this.offset + HeapBlock.SIZE_OFFSET, value, HeapBlock.IS_LITTLE_ENDIAN);
  }

  get address() {
    return this.#dataView.getUint32(this.offset + HeapBlock.ADDRESS_OFFSET, HeapBlock.IS_LITTLE_ENDIAN)
  }

  set address(address: number) {
    this.#dataView.setUint32(this.offset + HeapBlock.ADDRESS_OFFSET, address, HeapBlock.IS_LITTLE_ENDIAN)
  }

  get used(): boolean {
    return this.#dataView.getUint8(this.offset + HeapBlock.USED_OFFSET) === 1;
  }

  set used(value: boolean) {
    this.#dataView.setUint8(this.offset + HeapBlock.USED_OFFSET, Number(value));
  }

  get next(): number {
    return this.#dataView.getUint32(this.offset + HeapBlock.NEXT_OFFSET, HeapBlock.IS_LITTLE_ENDIAN)
  }

  set next(value: number) {
    this.#dataView.setUint32(this.offset + HeapBlock.NEXT_OFFSET, value, HeapBlock.IS_LITTLE_ENDIAN)
  }


  get prev(): number {
    return this.#dataView.getUint32(this.offset + HeapBlock.PREV_OFFSET, HeapBlock.IS_LITTLE_ENDIAN)
  }

  set prev(value: number) {
    this.#dataView.setUint32(this.offset + HeapBlock.PREV_OFFSET, value, HeapBlock.IS_LITTLE_ENDIAN)
  }

  constructor(buffer: ArrayBuffer, offset: number) {
    this.#dataView = new DataView(buffer);
    this.#offset = offset
  }
}
