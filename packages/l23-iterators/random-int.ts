import { randomInt } from "utils";

export const random = (min: number, max: number) => {
  return {
    [Symbol.iterator]() {
      return this;
    },

    next() {
      return { value: randomInt(min, max), done: false };
    }
  }
}
