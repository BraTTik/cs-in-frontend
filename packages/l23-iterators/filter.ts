export function filter<T>(iterable: Iterable<T>, callback: (item: T) => boolean): IterableIterator<T> {
  const iter = Iterator.from(iterable);

  return Iterator.from({
    next: () => {
      let result: IteratorResult<T> =  { done: true, value: undefined }

      do {
        result = iter.next();
        if (!result.done && callback(result.value)) {
          return result;
        }
      } while (!result.done);

      return result;
    }
  })
}
