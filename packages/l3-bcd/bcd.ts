export class BCD {
  private nums: Uint8Array;

  constructor(num: number) {
    this.nums = this.split(num);
  }

  toBigint(): bigint {
    return BigInt(this.join(this.nums));
  }

  toNumber(): number {
    return this.join(this.nums);
  }

  toString(): string {
    return Array.from(this.nums).map(String).reverse().join("")
  }

  at(index: number) {
    const normalized = this.normalizeIndex(index);
    return this.nums[normalized];
  }

  private split(num: number): Uint8Array {
    const arr: number[] = []
    let index = 0;
    do {
      const rem = num % 10
      arr.push(rem);
      num -= rem;
      num /= 10;
      index++
    } while (num > 0)

    return new Uint8Array(arr);
  }

  private join(buffer: Uint8Array): number {
    return buffer.reduce((sum, n, i) => {
      const carry = 10 ** i;
      return sum + (n * carry);
    }, 0)
  }

  /** тк разряды числа лежат в обратном порядке их нужно развернуть */
  private normalizeIndex(index: number): number {
    const length = this.nums.length;
    if (index < 0) {
      index = length + index;
    }
    return length - index - 1;
  }
}
