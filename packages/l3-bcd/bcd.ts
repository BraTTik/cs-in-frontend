
const FIRST_MASK = 0b00001111;
const SECOND_MASK = 0b11110000;

export class BCD {
  private nums: Uint8Array;
  private digits: number = 0;


  constructor(num: number | bigint) {
    this.nums = this.split(num);
  }

  toBigint(): bigint {
    return BigInt(this.join(this.nums));
  }

  toNumber(): number {
    return Number(this.join(this.nums));
  }

  toString(): string {
    return this.nums.reduce((str, i, index, origin) => {
      const [first, second] = this.unpack(i);
      if (this.isLast(origin, index) && this.isOdd(this.digits)) {
        return `${first}${str}`;
      }

      return `${second}${first}${str}`;
    }, "")
  }

  at(index: number) {
    const normalized = this.normalizeIndex(index);
    if (normalized >= this.digits || normalized < 0) {
      return undefined;
    }
    const slotIndex = Math.floor(normalized / 2);
    const [first, second] = this.unpack(this.nums[slotIndex]);
    return this.isOdd(normalized) ? second : first;
  }

  private split(num: number | bigint): Uint8Array {
    let arr = new Uint8Array(2);
    let digits = 0;
    let index = 0;
    let shift = 0 // 0 или 4;

    do {
      const rem = Number(this.remain(num, 10));
      if (index >= arr.length - 1) {
        const newArr = new Uint8Array(arr.length * 2);
        newArr.set(arr)
        arr = newArr;
      }
      num = this.sub(num, rem);
      num = this.divide(num, 10);

      // упаковываем число
      arr[index] |= rem << shift;
      // увеличиваем индекс на 0 или 1 (4 >> 2) -> 1
      index += shift >> 2;
      // переключаем сдвиг
      shift ^= 4;

      digits++;
    } while (num > 0)

    this.digits = digits;
    return arr.subarray(0,  Math.floor(digits / 2) + (shift >> 2))
  }

  private join(buffer: Uint8Array): number | bigint {
    const add = (sum: number | bigint, n: number, pow: number) => {
      const carry = this.pow(10, pow);
      if (!this.isBigint(sum) && this.add(sum, this.multiply(n, carry)) > Number.MAX_SAFE_INTEGER) {
        sum = BigInt(sum)
      }
      return this.add(sum, this.multiply(n, carry));
    }
    return buffer.reduce<number | bigint>((sum, n, i) => {
      const [first, second] = this.unpack(n);
      i = i * 2;
      return add(add(sum, first, i), second, i + 1);
    }, 0)
  }

  /** тк разряды числа лежат в обратном порядке их нужно развернуть */
  private normalizeIndex(index: number): number {
    const length = this.digits;
    if (index < 0) {
      index = length + index;
    }
    return length - index - 1;
  }

  private remain(division: number | bigint, divider: number | bigint): number | bigint {
    return this.calculate(division, divider, "%")
  }

  private divide(division: number | bigint, divider: number | bigint): number | bigint {
    return this.calculate(division, divider, "/")
  }

  private sub(a: number | bigint, b: number | bigint): number | bigint {
    return this.calculate(a, b, "-");
  }

  private add(a: number | bigint, b: number | bigint): number | bigint {
    return this.calculate(a, b, "+");
  }

  private multiply(a: number | bigint, b: number | bigint): number | bigint {
    return this.calculate(a, b, "*");
  }

  private pow(a: number | bigint, b: number | bigint): number | bigint {
    return this.calculate(a, b, "**");
  }

  private calculate(a: number | bigint, b: number | bigint, operator: "+" | "-" | "/" | "**" | "*" | "%"): number | bigint {
    const isBigint = [a, b].some(this.isBigint);
    let A = a;
    let B = b;
    const cast = (a: unknown) => a as number;

    if (isBigint) {
      A = BigInt(a);
      B = BigInt(b);
    }
    A = cast(A);
    B = cast(B);

    switch (operator) {
      case "*":
        return A * B;
      case "%":
        return A % B;
      case "**":
        return A ** B;
      case "+":
        return A + B;
      case "/":
        return A / B;
      case "-":
        return A - B;
    }
  }

  private isBigint(n: number | bigint): n is bigint {
    return typeof n === "bigint";
  }

  private isOdd(n: number) {
    return Boolean(n & 1);
  }

  private unpack(n: number): [number, number] {
    const first = n & FIRST_MASK;
    const second = (n & SECOND_MASK) >>> 4;
    return [first, second];
  }

  private isLast(arr: ArrayLike<number>, index: number): boolean {
    return arr.length -1 === index;
  }
}
