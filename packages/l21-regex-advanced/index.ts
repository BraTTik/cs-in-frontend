import { zipStr } from "./zip-str.ts";
import { format } from "./format.ts";
import { calc } from './calc.ts';

const text = "abbaabbafffbezza";

console.log(zipStr(text));

const templateResult = format('Hello, ${user}! Your age is ${age}.', {user: 'Bob', age: 10});
console.log(templateResult);

console.log(calc(`
Какой-то текст (10 + 15 - 24) ** 2
Еще какой то текст 2 * 10
`));

console.assert(calc(`
Какой-то текст (10 + 15 - 24) ** 2
Еще какой-то текст 2 * 10
`) == `
Какой-то текст 1
Еще какой-то текст 20
`);

console.assert(calc(`
Площадь квадрата это x * x
(Например)
Если сторона квадрата 2 то площадь будет (2 * 2)

тут просто
1 ** 2 + 2 * 2 * 3 + 3 ** 2

Вложенные скобки
(10 - (2 + 3)) / 5
`) == `
Площадь квадрата это x * x
(Например)
Если сторона квадрата 2 то площадь будет 4

тут просто
22

Вложенные скобки
1
`)
