## Поток для извлечения чисел из строк

Необходим реализовать КА, который считывает дробные числа из потока входных данных.
Если поток данных иссяк, КА должен выбрасывать исключение и переходить в состояние ожидания новых данных.

```typescript
const numbers = getNumbers(someString);

try {
    for (const number of numbers) {
        console.log(number);
    }

} catch (err) {
    // Expect new input
    console.log(err);
  
    numbers.next(newString);
}
```
