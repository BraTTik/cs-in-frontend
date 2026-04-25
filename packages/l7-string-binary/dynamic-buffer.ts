export class DynamicBuffer implements DataView {
  #buffer: ArrayBuffer;
  #dataView: DataView;
  #littleEndian: boolean;

  get buffer() {
    return this.#buffer;
  }

  constructor(initial = 8, littleEndian = true) {
    this.#buffer = new ArrayBuffer(initial);
    this.#dataView = new DataView(this.#buffer);
    this.#littleEndian = littleEndian;
  }

  write(offset: number, bytes: ArrayBufferLike) {
    this.#checkSize(offset, bytes.byteLength);
    new Uint8Array(this.#buffer, offset).set(new Uint8Array(bytes));
  }

  read(offset: number, byteLength: number) {
    return this.#buffer.slice(offset, offset + byteLength);
  }

  #checkSize(offset: number, byteLength: number) {
    if (offset + byteLength >= this.#buffer.byteLength) {
      const current = new Uint8Array(this.#buffer);
      const next = new Uint8Array(new ArrayBuffer((offset + byteLength) * 2));
      next.set(current);
      this.#buffer = next.buffer;
      this.#dataView = new DataView(this.#buffer);
    }
  }

  get [Symbol.toStringTag]() {
    return this.#dataView[Symbol.toStringTag];
  }

  get byteLength(): number {
    return this.#dataView.byteLength;
  }

  get byteOffset(): number {
    return this.#dataView.byteOffset;
  }

  getBigInt64(byteOffset: number, littleEndian?: boolean): bigint {
    this.#checkSize(byteOffset, 8);
    return this.#dataView.getBigInt64(byteOffset, littleEndian ?? this.#littleEndian);
  }

  getBigUint64(byteOffset: number, littleEndian?: boolean): bigint {
    this.#checkSize(byteOffset, 8);
    return this.#dataView.getBigUint64(byteOffset, littleEndian ?? this.#littleEndian);
  }

  getFloat16(byteOffset: number, littleEndian?: boolean): number {
    this.#checkSize(byteOffset, 2);
    return this.#dataView.getFloat16(byteOffset, littleEndian ?? this.#littleEndian);
  }

  getFloat32(byteOffset: number, littleEndian?: boolean): number {
    this.#checkSize(byteOffset, 4);
    return this.#dataView.getFloat32(byteOffset, littleEndian ?? this.#littleEndian);
  }

  getFloat64(byteOffset: number, littleEndian?: boolean): number {
    this.#checkSize(byteOffset, 8);
    return this.#dataView.getFloat64(byteOffset, littleEndian ?? this.#littleEndian);
  }

  getInt16(byteOffset: number, littleEndian?: boolean): number {
    this.#checkSize(byteOffset, 2);
    return this.#dataView.getInt16(byteOffset, littleEndian ?? this.#littleEndian);
  }

  getInt32(byteOffset: number, littleEndian?: boolean): number {
    this.#checkSize(byteOffset, 4);
    return this.#dataView.getInt32(byteOffset, littleEndian ?? this.#littleEndian);
  }

  getInt8(byteOffset: number): number {
    this.#checkSize(byteOffset, 1);
    return this.#dataView.getInt8(byteOffset);
  }

  getUint16(byteOffset: number, littleEndian?: boolean): number {
    this.#checkSize(byteOffset, 2);
    return this.#dataView.getUint16(byteOffset, littleEndian ?? this.#littleEndian      );
  }

  getUint32(byteOffset: number, littleEndian?: boolean): number {
    this.#checkSize(byteOffset, 4);
    return this.#dataView.getUint32(byteOffset, littleEndian ?? this.#littleEndian);
  }

  getUint8(byteOffset: number): number {
    this.#checkSize(byteOffset, 1);
    return this.#dataView.getUint8(byteOffset);
  }

  setBigInt64(byteOffset: number, value: bigint, littleEndian?: boolean): void {
    this.#checkSize(byteOffset, 8);
    this.#dataView.setBigInt64(byteOffset, value, littleEndian ?? this.#littleEndian);
  }

  setBigUint64(byteOffset: number, value: bigint, littleEndian?: boolean): void {
    this.#checkSize(byteOffset, 8);
    this.#dataView.setBigUint64(byteOffset, value, littleEndian ?? this.#littleEndian);
  }

  setFloat16(byteOffset: number, value: number, littleEndian?: boolean): void {
    this.#checkSize(byteOffset, 2);
    this.#dataView.setFloat16(byteOffset, value, littleEndian ?? this.#littleEndian);
  }

  setFloat32(byteOffset: number, value: number, littleEndian?: boolean): void {
    this.#checkSize(byteOffset, 4);
    this.#dataView.setFloat32(byteOffset, value, littleEndian ?? this.#littleEndian);
  }

  setFloat64(byteOffset: number, value: number, littleEndian?: boolean): void {
    this.#checkSize(byteOffset, 8);
    this.#dataView.setFloat64(byteOffset, value, littleEndian ?? this.#littleEndian);
  }

  setInt16(byteOffset: number, value: number, littleEndian?: boolean): void {
    this.#checkSize(byteOffset, 2);
    this.#dataView.setInt16(byteOffset, value, littleEndian ?? this.#littleEndian);
  }

  setInt32(byteOffset: number, value: number, littleEndian?: boolean): void {
    this.#checkSize(byteOffset, 4);
    this.#dataView.setInt32(byteOffset, value, littleEndian ?? this.#littleEndian);
  }

  setInt8(byteOffset: number, value: number): void {
    this.#checkSize(byteOffset, 1);
    this.#dataView.setInt8(byteOffset, value);
  }

  setUint16(byteOffset: number, value: number, littleEndian?: boolean): void {
    this.#checkSize(byteOffset, 2);
    this.#dataView.setUint16(byteOffset, value, littleEndian ?? this.#littleEndian);
  }

  setUint32(byteOffset: number, value: number, littleEndian?: boolean): void {
    this.#checkSize(byteOffset, 4);
    this.#dataView.setUint32(byteOffset, value, littleEndian ?? this.#littleEndian);
  }

  setUint8(byteOffset: number, value: number): void {
    this.#checkSize(byteOffset, 1);
    this.#dataView.setUint8(byteOffset, value);
  }
}
