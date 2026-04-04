export class Vector {
  #array: Uint8Array;
  #capacity: number;
  #length: number;

  get length() {
    return this.#length;
  }

  get array() {
    return this.#array;
  }

  constructor(capacity: number = 8) {
    this.#array = new Uint8Array(capacity);
    this.#capacity = capacity;
    this.#length = 0;
  }

  at(index: number): number | undefined {
    return this.#array[index];
  }

  push(n: number) {
    this.#length += 1;
    if (this.#capacity === this.#length) {
      this.expand();
    }
    this.#array[this.#length - 1] = n;

    return this.length;
  }

  private expand() {
    const prevCapacity = this.#capacity;
    const newArr = new Uint8Array(prevCapacity * 2);
    this.#capacity = newArr.length;
    newArr.set(this.#array);
    this.#array = newArr;
  }
}
