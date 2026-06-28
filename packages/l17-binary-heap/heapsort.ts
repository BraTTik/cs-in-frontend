import { BinaryHeap } from "./heap.ts";

type Comparator<T> = (a: T, b: T) => number;

function toHeap<T>(arr: T[], comparator?: Comparator<T>): BinaryHeap<T, T> {
  const heap = new BinaryHeap<T, T>(comparator);
  arr.forEach((value) => {
    heap.push(value, value);
  })

  return heap;
}

export const heapsort = <T>(arr: T[], comparator: Comparator<T>): T[] => {
  const heap = toHeap(arr, comparator);
  const res: T[] = [];
  while (true) {
    const val = heap.pop();
    if (val == null) break;
    res.push(val);
  }
  return res;
}
