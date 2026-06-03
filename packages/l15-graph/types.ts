export interface Matrix<T> {
  get(row: number, col: number): T;
  set(row: number, col: number, value: T): void;
  forEach(callback: (value: T, row: number, column: number) => void): void;
}
