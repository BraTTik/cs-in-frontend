import type { Array } from "./types.ts";
import { minmax } from "utils";


export class CircularBuffer<T> implements Array<T> {
  #arr: (T | null)[];
  /** начало среза виртуального массива в текущем массиве */
  #zero: number;
  #length: number;

  #safeLength: (length: number) => number;

  constructor(capacity: number) {
    if (isNaN(capacity) || !isFinite(capacity)) {
      throw new TypeError("Invalid input length");
    }
    this.#arr = Array.from({ length: capacity }, () => null);
    this.#zero = 0;
    this.#length = 0;
    this.#safeLength = minmax(0, capacity);
  }

  get capacity(): number {
    return this.#arr.length;
  }

  get length(): number {
    return this.#length;
  }

  at(_index: number): T | null {
    if (_index < 0 || _index >= this.#length) {
      return null;
    }
    const index = this.getIndex(_index)
    return this.#arr[index] ?? null;
  }

  pop(): T | null {
    const index = this.getIndex(this.length - 1);
    const item = this.#arr[index] ?? null;
    this.#arr[index] = null;
    this.#length = this.#safeLength(this.#length - 1);
    return item;
  }

  push(_item: T): number {
    if (this.capacity === 0) {
      return 0;
    }
    const index = this.getIndex(this.length);
    this.#arr[index] = _item;
    this.#length = this.#safeLength(this.#length + 1);
    if (this.length === this.capacity) {
      this.moveZero(index + 1);
    }
    return this.length;
  }

  shift(): T | null {
    const index = this.#zero;
    const item = this.#arr[index] ?? null;
    this.#arr[index] = null;
    this.#length = this.#safeLength(this.#length - 1);
    this.moveZero(index + 1);
    return item;
  }

  unshift(_item: T): number {
    if (this.capacity === 0) {
      return 0;
    }
    const index = this.getIndex(this.#zero - 1);
    this.#arr[index] = _item;
    this.#length = this.#safeLength(this.#length + 1);
    this.moveZero(index);

    return this.length
  }

  private getIndex(i: number) {
    const index = i + this.#zero;
    return this.normalizeIndex(index);
  }

  private moveZero(index: number) {
    this.#zero = this.normalizeIndex(index);
  }

  private normalizeIndex(i: number) {
    return ((i % this.capacity) + this.capacity) % this.capacity;
  }
}
