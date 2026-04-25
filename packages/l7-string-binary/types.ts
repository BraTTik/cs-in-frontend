export interface Buffer {
  get maxByteLength(): number;
  get length(): number;
  get __buffer(): ArrayBuffer;
  at(index: number): string | undefined;
}
