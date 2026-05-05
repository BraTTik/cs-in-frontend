export type PixelValue =  ArrayLike<number>;
export type HexColor = string;

export type ColorValue = PixelValue | HexColor;

export interface IView<T> {
  get byteLength(): number;
  set(value: T, offset?: number): void;
  get(offset?: number): T;

  setOffset(offset: number): void;
  setBuffer(buffer: ArrayBufferLike): void;
}

export interface RGBAWindow extends IView<ColorValue>{
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

  array(): Uint8ClampedArray;
}
