export interface RGBAWindow {
  get red(): number;
  get green(): number;
  get blue(): number;
  get alpha(): number;
  set red(value);
  set green(value);
  set blue(value);
  set alpha(value);

  get hex(): string;
  set hex(value: string);

  setBuffer(buffer: ArrayBufferLike): void;
  setOffset(offset: number): void;

  array(): Uint8ClampedArray;
}
