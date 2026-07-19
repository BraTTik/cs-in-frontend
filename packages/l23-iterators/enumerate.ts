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
