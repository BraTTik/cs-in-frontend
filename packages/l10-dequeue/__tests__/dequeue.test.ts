import { Dequeue } from "../dequeue.ts";


const run = (callback: (index: number) => void, iteratee  = 10) => {
  for (let i = 0; i < iteratee; i++) {
    callback(i)
  }
}

describe("dequeue", () => {
  it("shift and unshift", () => {
    const deq = new Dequeue(Uint8Array, 10);

    expect(deq.unshift(8)).toBe(1);
    expect(deq.shift()).toBe(8);
    expect(deq.shift()).toBeUndefined();
    expect(deq.length).toBe(0);
  })

  it("push and pop", () => {
    const deq = new Dequeue(Uint8Array, 10);
    expect(deq.push(2)).toBe(1);
    expect(deq.pop()).toBe(2);
    expect(deq.pop()).toBeUndefined();
    expect(deq.length).toBe(0);
  })

  it("works with 1 capacity", () => {
    const deq = new Dequeue(Uint8Array, 1);

    run((i) => expect(deq.push(1)).toBe(i + 1))
    run(() => expect(deq.pop()).toBe(1))

    expect(deq.length).toBe(0);
    expect(deq.pop()).toBeUndefined();

    run((i) => expect(deq.unshift(1)).toBe(i + 1));
    run(() => expect(deq.shift()).toBe(1));

    expect(deq.length).toBe(0);
    expect(deq.shift()).toBeUndefined();

  })

  it("mix unsfhift/pop push/shift", () => {
    const deq = new Dequeue(Uint8Array, 5);

    run(() => {
      deq.push(1);
    });
    run(() => expect(deq.shift()).toBe(1));

    run(() => deq.unshift(2));

    run(() => expect(deq.pop()).toBe(2));
  })

  it("works with Array", () => {
    const deq = new Dequeue(Array<{value: string }>, 10);
    const testValue = (i: number) => ({ value: `Test ${i}` });

    const iterations = 10;

    run((i) => {
      deq.push(testValue(i));
    }, iterations)

    run((i) => expect(deq.pop()).toEqual(testValue(iterations - i - 1)), iterations);
  })
})
