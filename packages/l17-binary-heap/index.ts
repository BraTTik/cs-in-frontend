import { heapsort } from "./heapsort.ts"

const arr = [10, 20, 2, 4, 11, 92, 55, 12, 0]

console.log(heapsort(arr, (a, b) => a - b));
