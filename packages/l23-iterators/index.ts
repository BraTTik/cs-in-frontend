import { random } from "./random-int.ts";

const randomInt = random(0, 100);

for (let i = 0; i < 10; i++) {
  console.log(randomInt.next().value)
}
