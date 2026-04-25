export interface Buffer {
  get length(): number;
  get __buffer(): ArrayBuffer;
  at(index: number): string | undefined;
}
