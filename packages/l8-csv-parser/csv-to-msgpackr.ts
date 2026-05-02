import * as fs from "node:fs";
import * as readline from "node:readline";
import { PackrStream } from "msgpackr";

const packr = new PackrStream();

const rl = readline.createInterface({
  input: fs.createReadStream("./data.csv"),
  crlfDelay: Infinity
})

const writeStream = fs.createWriteStream("./data.msgpackr");

packr.pipe(writeStream);

rl.on("line", (line: string) => {
  packr.write(line)
})
