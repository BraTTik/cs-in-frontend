import { Dequeue } from "./dequeue.ts";

const deq = new Dequeue(Array<{value: string }>, 10);
const testValue = (i: number) => ({ value: `Test ${i}` });

const run = (callback: (index: number) => void, iteratee  = 10) => {
  for (let i = 0; i < iteratee; i++) {
    callback(i)
  }
}
const iterations = 10;

run((i) => {
  deq.push(testValue(i));
}, iterations)

run((i) => {
  console.log(i, deq.pop());
}, iterations);
