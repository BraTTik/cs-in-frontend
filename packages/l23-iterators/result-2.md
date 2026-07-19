## take — взять N элементов

Необходимо реализовать функцию `take`, которая возвращает итератор по первым `amount` элементам исходной последовательности.

Требования:

- Принимает любой `Iterable<T>` и число `amount`
- Выдаёт не больше `amount` значений
- Работает лениво: не материализует всю коллекцию заранее
- Корректно завершается, если исходный итератор закончился раньше

```typescript
export function take<T>(iterable: Iterable<T>, amount: number): IterableIterator<T> {
  let current = 0;
  const iter = Iterator.from(iterable);

  return Iterator.from({
    next(): IteratorResult<T, unknown> {
      if (current < amount){
        current++;
        return iter.next();
      }
      return { done: true, value: false}
    }
  })
}
```

Пример использования:

```typescript
import { random } from "./random-int.ts";
import { take } from "./take.ts";

console.log([...take(random(0, 100), 5)]);
// например: [42, 7, 91, 3, 18]
```

---

## filter — фильтрация итератора

Необходимо реализовать функцию `filter`, которая возвращает итератор только по элементам, прошедшим предикат.

Требования:

- Принимает `Iterable<T>` и callback `(item: T) => boolean`
- Выдаёт только элементы, для которых callback вернул `true`
- Работает лениво через `next()`

```typescript
export function filter<T>(iterable: Iterable<T>, callback: (item: T) => boolean): IterableIterator<T> {
  const iter = Iterator.from(iterable);

  return Iterator.from({
    next: () => {
      const result = iter.next();
      const value = result.value;
      if (result.done || callback(value!)) {
        return result;
      }

      return { done: true, value: undefined };
    }
  })
}
```

Пример использования:

```typescript
import { filter } from "./filter.ts";

console.log([...filter([1, 2, 3, 4, 5], (n) => n % 2 === 0)]);
// [2, 4]
```

---

## enumerate — индекс + значение

Необходимо реализовать функцию `enumerate`, которая оборачивает каждый элемент в пару `[index, value]`.

Требования:

- Индексация с `0`
- Возвращает `IterableIterator<[number, T]>`
- Не меняет исходную последовательность, только добавляет счётчик

```typescript
export function enumerate<T>(iterable: Iterable<T>): IterableIterator<[index: number, T]> {
  const iter = Iterator.from(iterable);
  let i = 0;

  return Iterator.from({
    next: () => {
      const res = iter.next();
      if (res.done) return res;

      return { done: false, value: [i++, res.value] };
    }
  })
}
```

Пример использования:

```typescript
import { enumerate } from "./enumerate.ts";

console.log([...enumerate(["a", "b", "c"])]);
// [[0, "a"], [1, "b"], [2, "c"]]
```

---

## seq — последовательная склейка итераторов

Необходимо реализовать функцию `seq`, которая последовательно обходит несколько итерируемых объектов как одну плоскую последовательность.

Требования:

- Принимает `Iterable<Iterable<any>>`
- Сначала полностью обходит первый iterable, затем второй и т.д.
- Поддерживает разные типы источников: массивы, `Set`, строки и т.п.

```typescript
export function seq(iterable: Iterable<Iterable<any>>): IterableIterator<any> {
  const iters = Iterator.from(iterable);
  let current: IterableIterator<any> | null = null;

  return Iterator.from({
    next: () => {
      let nextValue = current?.next();
      if (nextValue?.done) {
        current = null;
      }

      if (!current) {
        const nextIter = iters.next();
        if (nextIter.done) return { value: undefined, done: true }
        current = Iterator.from(nextIter.value!);
        nextValue = current.next();
      }

      return { value: nextValue?.value, done: false };
    }
  })
}
```

Пример использования:

```typescript
import { seq } from "./seq.ts";

console.log([...seq([[1, 2], new Set([3, 4]), "bla"])]);
// [1, 2, 3, 4, "b", "l", "a"]
```

---

## mapSeq — последовательное применение нескольких map

Необходимо реализовать функцию `mapSeq`, которая для каждого элемента исходной последовательности применяет цепочку функций-преобразователей.

Требования:

- Принимает `Iterable<T>` и `Iterable<(item: T) => any>`
- Для каждого элемента последовательно вызывает все callback'и слева направо
- Результат каждой функции передаётся в следующую

```typescript
export function mapSeq<T>(iterable: Iterable<T>, map: Iterable<(item: T) => any>) {
  const itemIter = Iterator.from(iterable).map(i => {
    let res: any = i;
    for (let callback of map) {
      res = callback(res);
    }
    return res;
  });

  return Iterator.from({
    next(){
      return itemIter.next();
    }
  })
}
```

Пример использования:

```typescript
import { mapSeq } from "./map-seq.ts";

console.log([...mapSeq([1, 2, 3], [(el) => el * 2, (el) => el + 1])]);
// [3, 5, 7]  // (1*2)+1, (2*2)+1, (3*2)+1
```
