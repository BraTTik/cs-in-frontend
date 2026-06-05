import type { Matrix as IMatrix } from "./types.ts";

export type DataType =
  | typeof Uint8Array
  | typeof Uint16Array
  | typeof Uint32Array
  | typeof Int8Array
  | typeof Int16Array
  | typeof Int32Array
  | typeof Float16Array
  | typeof Float32Array
  | typeof Float64Array;

export class Matrix<V extends InstanceType<DataType>, C extends (new (length: number) => V)> implements IMatrix<number> {
  #DataView: C;
  #view: V;
  readonly #width: number;
  readonly #height: number;

  get width(): number {
    return this.#width;
  }

  get height(): number {
    return this.#height;
  }

  constructor(View: C & DataType, width: number, height: number) {
    this.#width = width;
    this.#height = height;
    this.#DataView = View;
    this.#view = new View(width * height);
  }

  get(row: number, col: number): number {
    return this.#view[this.#getIndex(row, col)];
  }

  set(row: number, col: number, value: number) {
    this.#view[this.#getIndex(row, col)] = value;
  }

  forEach(callback: (value: number, row: number, col: number) => void) {
    this.#view.forEach((value, index) => {
      const row = Math.floor(index / this.#width);
      const col = index % this.#width;
      callback(value, row, col);
    });
  }

  #getIndex(row: number, col: number): number {
    if (row < 0 || row >= this.#height || col < 0 || col >= this.#width) {
      throw new RangeError(`Index out of bounds: [row: ${row}, col: ${col}]`);
    }
    return row * this.#width + col;
  }
}
