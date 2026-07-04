
export const emailRegex = /[a-zA-Z0-9-_]+@[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_]{2,}/;

console.log(emailRegex.test("user@example.com"));   // true
console.log(emailRegex.test("test@mail.ru"));       // true
console.log(emailRegex.test("user123@domain.org")); // true
console.log(emailRegex.test("invalid-email"));      // false
console.log(emailRegex.test("user@.com"));          // false
console.log(emailRegex.test("user@domain"));        // false
console.log(emailRegex.test("user@domain.c"));      // false


const numberRegex = /-?\b((0|[1-9]\d+)?\.?\d+|\d+)\b/g;

const text = "The price is 100.5 dollars, -5 degrees, and version2 is out.";

const numbers = text.match(numberRegex);
console.log(numbers); // [ '100.5', '-5' ]

// Необходимо написать регулярное выражение, которое находит все даты в формате DD.MM.YYYY или YYYY-MM-DD.
//
//   Требования:
//
// Формат 1: 15.01.2025 (день.месяц.год)
// Формат 2: 2025-01-15 (год-месяц-день)
// День: 01–31, месяц: 01–12, год: 1900–2099


const dateRegex = /((((0|1|2)\d)|30|31)\.(0\d|11|12)\.((19|20)\d{2})|(((19|20)\d{2})-(0\d|11|12)-(((0|1|2)\d)|30|31)))/g

const dateText = "Today is 15.01.2025 and tomorrow is 2025-01-16. Invalid: 32.13.2025";

const dates = dateText.match(dateRegex);
console.log(dates); // ["15.01.2025", "2025-01-16"]
