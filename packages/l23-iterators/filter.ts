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
