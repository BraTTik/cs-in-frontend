import { CircularBuffer } from "./circular-buffer.ts";

type MethodName = "push" | "pop" | "shift" | "unshift";

type BenchResult = {
  size: number;
  operations: number;
  pushTotalMs: string;
  pushAvgNs: string;
  popTotalMs: string;
  popAvgNs: string;
  shiftTotalMs: string;
  shiftAvgNs: string;
  unshiftTotalMs: string;
  unshiftAvgNs: string;
};

const WARMUP_ROUNDS = 10;
const TEST_SIZES = [10, 100, 1_000, 10_000, 100_000];

const measureMs = (callback: () => void): number => {
  const start = performance.now();
  callback();
  return performance.now() - start;
};

const runMethod = (size: number, method: MethodName): number => {
  const buffer = new CircularBuffer<number>(size);

  for (let i = 0; i < size; i++) {
    buffer.push(i);
  }

  if (method === "push") {
    return measureMs(() => {
      for (let i = 0; i < size; i++) {
        buffer.push(i);
      }
    });
  }

  if (method === "unshift") {
    return measureMs(() => {
      for (let i = 0; i < size; i++) {
        buffer.unshift(i);
      }
    });
  }

  if (method === "pop") {
    return measureMs(() => {
      for (let i = 0; i < size; i++) {
        buffer.pop();
      }
    });
  }

  return measureMs(() => {
    for (let i = 0; i < size; i++) {
      buffer.shift();
    }
  });
};

const warmupJit = () => {
  const warmupSizes = [100, 1_000];

  for (let round = 0; round < WARMUP_ROUNDS; round++) {
    for (let i = 0; i < warmupSizes.length; i++) {
      const size = warmupSizes[i];
      runMethod(size, "push");
      runMethod(size, "pop");
      runMethod(size, "shift");
      runMethod(size, "unshift");
    }
  }
};

const formatMs = (value: number): string => `${value.toFixed(3)}ms`;
const formatNs = (totalMs: number, operations: number): string => `${((totalMs * 1_000_000) / operations).toFixed(2)}ns`;

const benchmark = (): BenchResult[] => {
  const results: BenchResult[] = [];

  for (let i = 0; i < TEST_SIZES.length; i++) {
    const size = TEST_SIZES[i];
    const pushMs = runMethod(size, "push");
    const popMs = runMethod(size, "pop");
    const shiftMs = runMethod(size, "shift");
    const unshiftMs = runMethod(size, "unshift");

    results.push({
      size,
      operations: size,
      pushTotalMs: formatMs(pushMs),
      pushAvgNs: formatNs(pushMs, size),
      popTotalMs: formatMs(popMs),
      popAvgNs: formatNs(popMs, size),
      shiftTotalMs: formatMs(shiftMs),
      shiftAvgNs: formatNs(shiftMs, size),
      unshiftTotalMs: formatMs(unshiftMs),
      unshiftAvgNs: formatNs(unshiftMs, size),
    });
  }

  return results;
};

console.log("JIT warmup...");
warmupJit();
console.log("Benchmarking CircularBuffer methods...");
console.table(benchmark());
