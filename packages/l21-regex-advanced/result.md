## Сжатие строки

Необходимо написать функцию, которая бы принимала бы строку и "схлопывала" бы все подряд идущие повторения.

```typescript
const regex = /(.+?)\1+/g;

export const zipStr = (str: string) => {
  let prev: string;

  do {
    prev = str;
    str = str.replaceAll(regex, "$1");
  } while(str !== prev);

  return str;
}

```

---

## Простой шаблонизатор

Необходимо написать функцию, которая принимает строковый шаблон и объект параметров, и возвращает результат применения данных к этому шаблону.

```typescript
export const format = (str: string, template: Record<string, string | number>) => {
  const regex = /\$\{(.+?)}/g
  return str.replaceAll(regex, (_, name) => {
    return template[name] as string;
  })
}
```
---

## Вычисление выражений в строке

Необходимо написать функцию, которая находит арифметические операции в строке и заменяет на результат вычислений.

```typescript
const loopReplace = (regex: RegExp, str: string, replacer: (substring: string, ...args: any[]) => string) => {
  let prev: string;

  do {
    prev = str;
    str = str.replace(regex, replacer)
  } while(prev !== str);

  return str;
}

export const calc = (str: string): string => {
  const parenthesesRegex = /\(([^()]+)\)/g
  const regex = /(\d+(?:\s*(?:\+|-|\/|\*\*|\*)\s*\d+)+)/g

  str = loopReplace(parenthesesRegex, str, (match, res) => {
    if (regex.test(res)) {
      return eval(res);
    }
    return match
  })

  str = loopReplace(regex, str, (match) => {
    return  eval(match);
  })

  return str;
}
```
