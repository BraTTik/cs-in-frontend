import * as fs from "node:fs";
import * as readline from "node:readline";

export function parseCsv(file: string, seprator: string | RegExp, cb: (error: Error | null, data: string[]) => void): void {
  const rl = readline.createInterface({
    input: fs.createReadStream(file),
    crlfDelay: Infinity,
  });

  rl.on("line", (line: string) => {
    try {
      cb(null, line.split(seprator));
    } catch (error) {
      cb(error as Error, []);
    }

  })

  rl.once("close", () => {
    cb(null, []);
  })
}
