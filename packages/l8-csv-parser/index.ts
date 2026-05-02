import { parseCsv } from './csv-parser.ts'
import { logMemory } from "./log-memory.ts"
import * as fs from "node:fs";
import { runMsg } from "./msgpack-test.ts";

const csvBench = async () => {
  return new Promise((resolve) => {
    const CSV_TIME = "CSV TIME"
    console.time(CSV_TIME);
    let isFirst = true;
    const csvRun = (_: Error | null, data: string[]) => {
      if (isFirst) {
        console.timeLog(CSV_TIME, "First read");
        isFirst = false;
      }
      if (!data.length) {
        console.timeEnd(CSV_TIME);
        logMemory("CSV Parse Memory")
        resolve(true);
      }
    }

    parseCsv("./data.csv", /(?<!\\),/, csvRun)
  })

}

await csvBench()
console.log()
global.gc?.();

await runMsg();
console.log()
global.gc?.();

const JSON_TIME = "JSON Time";
console.time(JSON_TIME);
const json = fs.readFileSync("./json.json", "utf-8");
JSON.parse(json);
console.timeEnd(JSON_TIME);

logMemory("JSON Parse Memory")
