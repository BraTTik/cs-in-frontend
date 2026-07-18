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
