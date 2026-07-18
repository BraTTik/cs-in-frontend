## Бесконечный генератор случайных чисел

Необходимо реализовать итератор, который бесконечно выдаёт случайные целые числа в заданном диапазоне `[min, max]`.

Требования:

- Реализует протоколы iterator и iterable (`next` + `Symbol.iterator`)
- `done` всегда `false` (последовательность бесконечная)
- Каждый вызов `next()` возвращает новое случайное число

```typescript
import { randomInt } from "utils";

export const random = (min: number, max: number) => {
  return {
    [Symbol.iterator]() {
      return this;
    },

    next() {
      return { value: randomInt(min, max), done: false };
    }
  }
}
```

---

## Range — итерируемый диапазон

Необходимо реализовать класс `Range`, который описывает диапазон значений и позволяет обходить его через `for...of` / `Array.from`.

Требования:

- Поддерживает целые числа и одиночные символы (`"a"`…`"f"`)
- Итерируется от `min` до `max` включительно
- Метод `reverse()` возвращает итератор в обратном порядке
- Валидация: одинаковые типы, `min <= max`, только integers / chars длины 1

```typescript
import { isNumber, isInteger } from "utils";

type Order = "asc" | "desc";

export class Range<T extends (number | string)> {
  constructor(private min: T, private max: T) {
    this.#validateInput(min, max);
  }

  reverse(): IterableIterator<T> {
    let current = this.#toIndex(this.max);

    const toValue = this.#toValue.bind(this);
    const hasFinished = this.#hasFinished.bind(this);

    return {
      [Symbol.iterator]() {
        return this;
      },

      next() {
        if (!hasFinished(current, "desc")) {
          const value = { value: toValue(current), done: false };
          current--;
          return value;
        }

        return { value: undefined, done: true };
      }
    }
  }

  [Symbol.iterator](): Iterator<T> {
    let current = this.#toIndex(this.min);

    const toValue = this.#toValue.bind(this);
    const hasFinished = this.#hasFinished.bind(this);

    return {
      next() {
        if (!hasFinished(current, "asc")) {
          const value = { value: toValue(current), done: false };
          current++;
          return value;
        }
        return { value: undefined, done: true }
      }
    }
  }

  #hasFinished(value: number, order: Order) {
    const threshold = order === "asc" ? this.max : this.min;

    return order === "asc" ? value > this.#toIndex(threshold) : value < this.#toIndex(threshold);
  }

  #toIndex(i: T): number {
    if (isNumber(i)) return i;

    return i.charCodeAt(0)
  }

  #toValue(i: number): T {
    if (isNumber(this.min)) return i as T;
    return String.fromCharCode(i) as T;
  }

  #validateInput(a: T, b: T) {
    const stringLength = (str: string) => str.length === 1
    const aType = typeof a;
    const bType = typeof b;
    if (aType !== bType) {
      throw new TypeError(`Types should be same got a - "${aType}" type and b - "${bType}" type`);
    }
    if (a > b) {
      throw new RangeError(`Min should be less or equal to max got min ${a} and max ${b}`);
    }
    if (aType === "string" && bType === "string") {
      if (!stringLength(a as string)) {
        throw new RangeError(`Range accepts only chars got ${a} for min`);
      }
      if (!stringLength(b as string)) {
        throw new RangeError(`Range accepts only chars got ${a} for max`);
      }
    } else if (aType === "number" && bType === "number") {
      if (!isInteger(a)) {
        throw new TypeError(`Range supports only integers got ${a} for min`);
      }
      if (!isInteger(b)) {
        throw new TypeError(`Range supports only integers got ${b} for min`);
      }
    }
  }
}
```

Пример использования:

```typescript
const range = new Range("a", "f");
const intRange = new Range(-5, 1);

console.log(Array.from(range));           // ["a", "b", "c", "d", "e", "f"]
console.log(Array.from(range.reverse())); // ["f", "e", "d", "c", "b", "a"]
console.log(Array.from(intRange));        // [-5, -4, -3, -2, -1, 0, 1]
```

---

## Ленивый querySelectorAll

Необходимо реализовать `querySelectorAllLazy` — аналог `querySelectorAll`, который обходит DOM лениво через итератор.

Требования:

- Обходит потомков `element` (сам корень в выборку не входит)
- Возвращает элементы по одному через `next()` (DFS)
- Совпадение проверяется через `element.matches(query)`
- Реализует `IterableIterator<Element>`

```typescript
export const querySelectorAllLazy = (query: string, element: Element): IterableIterator<Element> => {
  const stack: Element[] = Array.from(element.children).reverse();

  return {
    [Symbol.iterator]() {
      return this;
    },
    next() {
      while(stack.length > 0) {
        const element = stack.pop()!;
        if (element.children.length) {
          stack.push(...Array.from(element.children).reverse())
        }
        if (element.matches(query)) {
          return { value: element, done: false };
        }
      }
      return { done: true, value: undefined };
    }
  }
}
```

Пример использования:

```typescript
const iter = querySelectorAllLazy(".item", document.body);

console.log(iter.next().value);
console.log(iter.next().value);

for (const item of iter) {
  console.log(item);
}
```
