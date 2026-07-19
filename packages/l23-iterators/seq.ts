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
