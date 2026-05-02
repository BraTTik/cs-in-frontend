import { UnpackrStream } from "msgpackr";
import * as fs from "node:fs";
import { logMemory } from "./log-memory.ts"

let firstRead = true;
const MSG_TIME = "msgpackr time";
console.time(MSG_TIME);

export const runMsg = async () => {
  const readStream = fs.createReadStream("./data.msgpackr");
  const msgStream = new UnpackrStream();
  readStream.pipe(msgStream);

  return new Promise(resolve => {
    msgStream.on("data", () => {
      if (firstRead) {
        console.timeLog(MSG_TIME, "First read");
        firstRead = false;
      }
    })

    msgStream.on("close", () => {
      console.timeEnd(MSG_TIME);
      logMemory("MSGPACKR Memory Usage")
      resolve(true)
    })
  })
}
