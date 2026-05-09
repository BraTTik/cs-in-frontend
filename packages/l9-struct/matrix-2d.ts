import type { IView, ViewCtor, ViewValue } from "./types.ts";

const resolveWindow = <T extends IView<any>>(ctor: ViewCtor<T>): T => {
  if (typeof ctor === "function") {
    return new ctor() as T;
  }
  return ctor as T;
};

export class Matrix2D<T extends IView<any>> {
  #buffer: ArrayBufferLike;
  #window: T;
  #width: number;
  #height: number;
  #length: number;

  get width() {
    return this.#width;
  }

  get height() {
    return this.#height;
  }

  view(row: number, column: number): T {
    const offset = this.#getOffset(row, column);
    this.#window.setOffset(offset);

    return this.#window;
  }

  get(row: number, col: number): ViewValue<T> {
    const offset = this.#getOffset(row, col);
    this.#window.setOffset(offset);

    return this.#window.get();
  }

  set(row: number, col: number, value: ViewValue<T>) {
    const offset = this.#getOffset(row, col);
    this.#window.set(value, offset);
  }

  fill(value: ViewValue<T>) {
    const byteLength = this.#window.byteLength;
    for (let i = 0, offset = 0; i < this.#length; i++, offset += byteLength) {
      this.#window.set(value, offset);
    }
  }

  constructor(width: number, height: number, window: ViewCtor<T>, data?: ArrayBufferLike) {
    this.#width = width;
    this.#height = height;
    this.#window = resolveWindow(window);
    this.#buffer = data ?? new ArrayBuffer(width * height * this.#window.byteLength);
    this.#length = width * height;
    this.#window.setBuffer(this.#buffer);
  }

  #calcOffset(row: number, column: number) {
    return (row * this.#width + column) * this.#window.byteLength;
  }

  #getOffset(row: number, column: number) {
    row = this.#normalizeIndex(row, this.height);
    column = this.#normalizeIndex(column, this.width);

    return this.#calcOffset(row, column);
  }

  #normalizeIndex(_index: number, length: number) {
    let index = _index;
    if (index < 0) {
      index = ((_index % length) + length) % length;
    }
    if (index >= length) {
      throw new RangeError("Index out of bounds");
    }

    return index;
  }
}
