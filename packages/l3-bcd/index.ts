import { BCD } from "./bcd.ts";
import assert from "node:assert";

const tests = [0, 1234, BigInt(2**53 - 1)];
// at (1, 2, -1, -2)
const atTests = [[0, undefined, 0, undefined], [1, 2, 4, 3], [9, 0, 1, 9]]

for (let i = 0; i < tests.length; i++) {
  const test = tests[i];
  const bcd = new BCD(test);
  assert.equal(bcd.toNumber(), Number(test), `Failed to convert number ${test}`);
  assert.equal(bcd.toBigint(), BigInt(test), `Failed to convert bigint ${test}`);
  assert.equal(bcd.toString(), String(test), `Failed to convert string ${test}`);

  const atTest = atTests[i];
  assert.equal(bcd.at(0), atTest[0], `Failed at (1) for ${test}`);
  assert.equal(bcd.at(1), atTest[1], `Failed at (2) for ${test}`);
  assert.equal(bcd.at(-1), atTest[2], `Failed at (-1) for ${test}`);
  assert.equal(bcd.at(-2), atTest[3], `Failed at (-2) for ${test}`);
}

