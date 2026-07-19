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
