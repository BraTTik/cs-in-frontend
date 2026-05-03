import { RGBAWindow } from "./types.ts";
import ArrayLike = jasmine.ArrayLike;

type RGBACtor = RGBAWindow | (new () => RGBAWindow);

const resolveWindow = (ctor: RGBACtor): RGBAWindow => {
  if (typeof ctor === "function") {
    return new ctor();
  }
  return ctor;
}

type ColorValue = ArrayLike<number> | string;

interface MatrixView {
  get red(): number;
  get green(): number;
  get blue(): number;
  get alpha(): number;
  set red(value);
  set green(value);
  set blue(value);
  set alpha(value);

  get hex(): string;
  set hex(value: string);
}

interface Matrix {
  view(row: number, col: number): MatrixView;
  get(row: number, col: number): Uint8ClampedArray;
  set(row: number, col: number, value: ColorValue): void;
  fill(value: ColorValue): void;
}

export class Matrix2D implements Matrix {
  #data: Uint8ClampedArray;
  #window: RGBAWindow;
  #width: number;
  #height: number;
  #length: number;

  get width() {
    return this.#width;
  }

  get height() {
    return this.#height;
  }

  view(row: number, column: number) {
     const offset = this.#getOffset(row, column);
     this.#window.setOffset(offset);

     return this.#window;
  }

  get(row: number, col: number): Uint8ClampedArray {
    const offset = this.#getOffset(row, col);
    this.#window.setOffset(offset);

    return this.#window.array();
  }

  set(row: number, col: number, value: ColorValue) {
    const offset = this.#getOffset(row, col);
    this.#window.setOffset(offset);
    if (typeof value === "string") {
      this.#window.hex = value;
    } else {
      this.#window.red = value[0] ?? 0;
      this.#window.green = value[1] ?? 0;
      this.#window.blue = value[2] ?? 0;
      this.#window.alpha = value[3] ?? 0;
    }
  }

  fill(value: ColorValue) {
    for (let h = 0; h < this.#height; h++) {
      for (let v = 0; v < this.#height; v++) {
        this.set(h, v, value);
      }
    }
  }

  constructor(width: number, height: number, rgba: RGBACtor, data?: Uint8ClampedArray) {
    this.#width = width;
    this.#height = height;
    this.#data = data ?? new Uint8ClampedArray(width * height);
    this.#window = resolveWindow(rgba);
    this.#length = width * height;
    this.#window.setBuffer(this.#data.buffer);
  }

  #getOffset(row: number, column: number) {
    row = this.#normalizeIndex(row, this.height);
    column = this.#normalizeIndex(column, this.width);

    return row * this.width + column;
  }

  #normalizeIndex(_index: number, length: number) {
    let index = _index
    if (index < 0) {
      index = ((_index % length) + length) % length;
    }
    if (index >= length) {
      throw new RangeError("Index out of bounds");
    }

    return index;
  }
}
