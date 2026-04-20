export interface Array<T> {
  shift(): T | null;
  unshift(item: T): number;
  pop(): T | null;
  push(item: T): number;
  at(index: number): T | null;
  get length(): number;
  get capacity(): number;
}
