import { zipStr } from "./zip-str.ts";
import { format } from "./format.ts";

const text = "abbaabbafffbezza";

console.log(zipStr(text));

const res = format('Hello, ${user}! Your age is ${age}.', {user: 'Bob', age: 10});
console.log(res);
