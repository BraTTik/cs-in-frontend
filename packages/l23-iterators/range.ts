import { isNumber, isInteger } from "utils";

type Order = "asc" | "desc";

export class Range<T extends (number | string)> {
  constructor(private min: T, private max: T) {
    this.#validateInput(min, max);
  }

  reverse(): IterableIterator<T> {
    let current = this.#toIndex(this.max);

    const toValue = this.#toValue.bind(this);
    const hasFinished = this.#hasFinished.bind(this);

    return {
      [Symbol.iterator]() {
        return this;
      },

      next() {
        if (!hasFinished(current, "desc")) {
          const value = { value: toValue(current), done: false };
          current--;
          return value;
        }

        return { value: undefined, done: true };
      }
    }
  }

  [Symbol.iterator](): Iterator<T> {
    let current = this.#toIndex(this.min);

    const toValue = this.#toValue.bind(this);
    const hasFinished = this.#hasFinished.bind(this);

    return {
      next() {
        if (!hasFinished(current, "asc")) {
          const value = { value: toValue(current), done: false };
          current++;
          return value;
        }
        return { value: undefined, done: true }
      }
    }
  }

  #hasFinished(value: number, order: Order) {
    const threshold = order === "asc" ? this.max : this.min;

    return order === "asc" ? value > this.#toIndex(threshold) : value < this.#toIndex(threshold);
  }

  #toIndex(i: T): number {
    if (isNumber(i)) return i;

    return i.charCodeAt(0)
  }

  #toValue(i: number): T {
    if (isNumber(this.min)) return i as T;
    return String.fromCharCode(i) as T;
  }

  #validateInput(a: T, b: T) {
    const stringLength = (str: string) => str.length === 1
    const aType = typeof a;
    const bType = typeof b;
    if (aType !== bType) {
      throw new TypeError(`Types should be same got a - "${aType}" type and b - "${bType}" type`);
    }
    if (a > b) {
      throw new RangeError(`Min should be less or equal to max got min ${a} and max ${b}`);
    }
    if (aType === "string" && bType === "string") {
      if (!stringLength(a as string)) {
        throw new RangeError(`Range accepts only chars got ${a} for min`);
      }
      if (!stringLength(b as string)) {
        throw new RangeError(`Range accepts only chars got ${a} for max`);
      }
    } else if (aType === "number" && bType === "number") {
      if (!isInteger(a)) {
        throw new TypeError(`Range supports only integers got ${a} for min`);
      }
      if (!isInteger(b)) {
        throw new TypeError(`Range supports only integers got ${b} for min`);
      }
    }
  }
}

