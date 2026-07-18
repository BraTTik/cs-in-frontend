const numberRegex = /(?<!\.)-?((0|[1-9]\d+)\.\d+(?!\.)|\d+(?=!\.))/g;

const text = "The price is 100.5 dollars, -5 degrees, and version 2.0.1 is out.";

const numbers = text.match(numberRegex);
console.log(numbers);
