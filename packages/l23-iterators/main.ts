import { querySelectorAllLazy } from './query-selector-lazy.ts';

const iter = querySelectorAllLazy(".item", document.body);

console.log(iter.next().value);
console.log(iter.next().value);
console.log(iter.next().value);

for (let item of iter) {
  console.log(item)
}
