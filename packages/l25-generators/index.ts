import {  createReadStream } from "node:fs";
import { getNumbers } from './get-numbers.ts';
import { join } from "node:path";
import process from "node:process";

console.log(process.cwd())

const readStream = createReadStream(join(process.cwd(), "./test.txt"));
const nextStream = createReadStream(join(process.cwd(), "./test2.txt"));

readStream.on("readable", () => {
  let iter = getNumbers(readStream);
  try {
    for (let i of iter) {
      console.log(i)
    }
  } catch (err) {
    nextStream.on("readable", () => {
      console.log(iter.next(nextStream));
      for (let n of iter) {
        console.log(n);
      }
    })
  }
})
