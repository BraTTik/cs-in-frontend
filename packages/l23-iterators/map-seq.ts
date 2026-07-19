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
