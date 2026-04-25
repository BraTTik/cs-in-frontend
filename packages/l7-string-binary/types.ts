export interface Buffer {
  get length(): number;
  get __buffer(): ArrayBuffer;
  at(index: number): string | undefined;
  forEach(callback: (value: string, index: number) => void): void;
}
