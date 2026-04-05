export class Byte {
  #length = 8;
  #occupied = 0;
  #value = 0;

  constructor(value: number = 0, occupied = 0) {
    this.#value = value & 255;
    this.#occupied = occupied;
  }

  get value() {
    return this.#value;
  }

  get isEmpty() {
    return this.#occupied === 0;
  }

  get isFull() {
    return this.#occupied === this.#length;
  }

  get vacant() {
    return this.#length - this.#occupied;
  }

  /**
   * Записывает значение по длине битов, если не поместились в байт
   * возвращает остаток значения и его длину в битах
   *  */
  write(bits: number, length: number): [number, number] {
    const shift = this.vacant - length;
    this.#occupied = Math.min(8, this.#occupied + length);

    if (shift < 0) {
      const absShift = Math.abs(shift);
      const mask = createMask(absShift);
      const remBits = mask & bits;
      bits = bits >>> absShift;
      this.#value |= bits;

      return [remBits, absShift];
    } else {
      bits = (bits << shift) >>> 0;
      this.#value |= bits;

      return [0, 0];
    }
  }

  /**
   * Возвращает значение по длине битов, если в байте только кусок значения,
   * возвращает также сколько битов нужно прочесть в следующем байте
   *  */
  read(length: number): [number, number] {
    const shift = (this.#length - length);
    const missing = Math.abs(Math.max(0, length - this.#occupied));
    const mask = createMask(length) << shift;
    const value = (this.#value & mask) >>> (shift);
    this.#value = (this.#value << length) & 255;
    this.#occupied = Math.max(0, this.#occupied - length);

    return [value, missing];
  }
}

function createMask(length: number): number {
  return (1 << length) - 1;
}
