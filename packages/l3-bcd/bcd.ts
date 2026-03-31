export class BCD {
  private nums: Uint8Array;

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
    return Array.from(this.nums).map(String).reverse().join("")
  }

  at(index: number) {
    const normalized = this.normalizeIndex(index);
    return this.nums[normalized];
  }

  private split(num: number | bigint): Uint8Array {
    const arr: number[] = []
    let index = 0;
    do {
      const rem = this.remain(num, 10);
      arr.push(Number(rem));
      num = this.sub(num, rem);
      num = this.divide(num, 10);
      index++
    } while (num > 0)

    return new Uint8Array(arr);
  }

  private join(buffer: Uint8Array): number | bigint {
    return buffer.reduce<number | bigint>((sum, n, i) => {
      const carry = this.pow(10, i);
      if (!this.isBigint(sum) && i >= 31 && this.add(sum, this.multiply(n, carry)) > Number.MAX_SAFE_INTEGER) {
        sum = BigInt(sum)
      }
      return this.add(sum, this.multiply(n, carry));
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
}
