const numberRegex = /(?<!\.)-?((0|[1-9]\d+)\.\d+(?!\.)|\d+(?!\.))/g;

const text = "The price is 100.5 dollars, -5 degrees, and version 2.0.1 is out.";

const numbers = text.match(numberRegex);
console.log(numbers);


// !@#$%^&*
const passwordRegex = /^(?=(.*\d))(?=(.*[!@#$%^&*]))(?=(.*[a-z]))(?=(.*[A-Z]))[a-zA-Z0-9!@#$%^&*]{8,20}$/;

console.log(passwordRegex.test("Password123!")); // true
console.log(passwordRegex.test("Pd123!"));       // false (меньше 8 символов)
console.log(passwordRegex.test("PASSWORD123!")); // false (нет строчных)
console.log(passwordRegex.test("Password!"));    // false (нет цифры)
console.log(passwordRegex.test("Password123"));  // false (нет спецсимвола)
