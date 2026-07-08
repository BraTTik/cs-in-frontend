const testText = `
Какой-то текст (10 + (15 - 24)) ** 2
Еще какой то текст 2 * 10
`

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
