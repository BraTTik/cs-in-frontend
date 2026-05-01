import { encodeStrings as encodeA } from "./a-version.ts";
import { encodeStrings as encodeB } from "./b-version.ts";

const ITEMS_COUNT = 5_000;
const AT_PASSES = 5;
const FOR_EACH_PASSES = 3;
const RUNS = 6;

const source = Array.from({ length: ITEMS_COUNT }, (_, index) => {
  const parity = index % 2 === 0 ? "even" : "odd";
  return `${parity}-${index}-${"x".repeat((index % 16) + 1)}`;
});

const aBuffer = encodeA(source);
const bBuffer = encodeB(source);

type BenchResult = { label: string; ms: number; msPerOp?: number };

const nowMs = () => Number(process.hrtime.bigint()) / 1_000_000;

const bench = (
  label: string,
  run: () => void,
  runs = RUNS,
  operationsPerRun?: number,
): BenchResult => {
  // tiny warmup for JIT and caches
  run();

  const values: number[] = [];
  for (let i = 0; i < runs; i++) {
    const start = nowMs();
    run();
    values.push(nowMs() - start);
  }

  values.sort((a, b) => a - b);
  const median = values[Math.floor(values.length / 2)];
  const msPerOp =
    operationsPerRun && operationsPerRun > 0 ? median / operationsPerRun : undefined;
  return { label, ms: median, msPerOp };
};

let sink = 0;

const atLoopA = () => {
  for (let pass = 0; pass < AT_PASSES; pass++) {
    for (let i = 0; i < aBuffer.length; i++) {
      sink += aBuffer.at(i)?.length ?? 0;
    }
  }
};

const atLoopB = () => {
  for (let pass = 0; pass < AT_PASSES; pass++) {
    for (let i = 0; i < bBuffer.length; i++) {
      sink += bBuffer.at(i)?.length ?? 0;
    }
  }
};

const forEachLoopA = () => {
  for (let pass = 0; pass < FOR_EACH_PASSES; pass++) {
    aBuffer.forEach((value, index) => {
      sink += value.length + (index & 1);
    });
  }
};

const forEachLoopB = () => {
  for (let pass = 0; pass < FOR_EACH_PASSES; pass++) {
    bBuffer.forEach((value, index) => {
      sink += value.length + (index & 1);
    });
  }
};

const atOpsPerRun = AT_PASSES * source.length;
const atA = bench("AVersion at()", atLoopA, RUNS, atOpsPerRun);
const atB = bench("BVersion at()", atLoopB, RUNS, atOpsPerRun);
const eachA = bench("AVersion forEach()", forEachLoopA);
const eachB = bench("BVersion forEach()", forEachLoopB);

const printComparison = (left: BenchResult, right: BenchResult) => {
  const ratio = right.ms / left.ms;
  const faster = left.ms <= right.ms ? left : right;
  const slower = left.ms > right.ms ? left : right;
  const speedup = slower.ms / faster.ms;

  console.log(`${left.label}: ${left.ms.toFixed(2)}ms`);
  if (left.msPerOp !== undefined) {
    console.log(`  avg: ${(left.msPerOp * 1_000).toFixed(3)}ms/op`);
  }
  console.log(`${right.label}: ${right.ms.toFixed(2)}ms`);
  if (right.msPerOp !== undefined) {
    console.log(`  avg: ${(right.msPerOp * 1_000).toFixed(3)}ms/op`);
  }
  console.log(
    `=> быстрее: ${faster.label} (${speedup.toFixed(2)}x), raw-ratio(${right.label}/${left.label})=${ratio.toFixed(2)}x`,
  );
  console.log("");
};

console.log(`Dataset: ${ITEMS_COUNT} строк`);
console.log(`Runs per case (median): ${RUNS}`);
console.log("");

printComparison(atA, atB);
printComparison(eachA, eachB);

// prevents dead-code elimination in aggressive runtimes
console.log("sink:", sink);
