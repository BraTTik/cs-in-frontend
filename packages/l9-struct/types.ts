export abstract class Struct<TData> {
  #byteLength: number;
  #alignment: number;
  #buffer: ArrayBuffer | null = null;
  #offset: number = 0;

  abstract get(): TData;
  abstract set(value: TData): void;

  get byteLength() {
    return this.#byteLength;
  }

  get alignment() {
    return this.#alignment;
  }

  get offset() {
    return this.#offset;
  }

  get buffer() {
    if (this.#buffer == null) {
      throw new Error(`${this.constructor.name} is not initialized`)
    }

    return this.#buffer;
  }

  protected constructor(byteLength: number, alingment: number) {
    this.#byteLength = byteLength;
    this.#alignment = alingment
  }

  abstract init(buffer: ArrayBuffer, offset: number, data: TData): this;
  abstract from(buffer: ArrayBuffer, offset: number): this;
}
