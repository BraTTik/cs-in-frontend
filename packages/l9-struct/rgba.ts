import { convertHex, toHex } from "./utils.ts";
import type { ColorValue, RGBAWindow, HexColor, PixelValue } from "./types.ts";

const Color = {
  RED: 0,
  GREEN: 1,
  BLUE: 2,
  ALPHA: 3
}

export class RGBA implements RGBAWindow {
  static byteLength: 4 = 4;
  #buffer: ArrayBufferLike | null = null;
  #offset: number = 0;
  #view: Uint8ClampedArray | null = null;

  static hex = (color: string) => color as HexColor

  private colorCache: Map<HexColor, PixelValue> = new Map();

  setBuffer(buffer: ArrayBufferLike): void {
    this.#buffer = buffer;
    this.#view = new Uint8ClampedArray(buffer);
  }

  get byteLength() {
    return RGBA.byteLength;
  }

  setOffset(offset: number): void {
    this.#offset = offset;
  }

  get red() {
    return this.getValue(Color.RED)
  }

  set red(value: number) {
    this.setValue(Color.RED, value);
  }

  get blue() {
    return this.getValue(Color.BLUE)
  }

  set blue(value: number) {
    this.setValue(Color.BLUE, value);
  }

  get green() {
    return this.getValue(Color.GREEN)
  }

  set green(value: number) {
    this.setValue(Color.GREEN, value);
  }

  get alpha() {
    return this.getValue(Color.ALPHA);
  }

  set alpha(value: number) {
    this.setValue(Color.ALPHA, value);
  }

  get hex() {
    return toHex(this) as HexColor;
  }

  set hex(value: HexColor) {
    const rgba = this.#resolveColor(value);
    this.red = rgba[Color.RED];
    this.green = rgba[Color.GREEN];
    this.blue = rgba[Color.BLUE];
    this.alpha = rgba[Color.ALPHA];
  }

  array(): Uint8ClampedArray {
    if (!this.#buffer) {
      throw new Error("Buffer is not set")
    }
    return new Uint8ClampedArray(this.#buffer, this.#offset, 4);
  }

  private getValue(offset: number): number {
    if (!this.#buffer) {
      throw new Error("Buffer is not set")
    }
    return this.#view![offset + this.#offset];
  }

  private setValue(offset: number, value: number): void {
    if (!this.#buffer) {
      throw new Error("Buffer is not set")
    }

    this.#view![offset + this.#offset] = value;
  }

  get(offset: number = this.#offset): PixelValue {
    this.#offset = offset;
    return this.#view!.subarray(this.#offset, this.#offset + this.byteLength);
  }

  set(value: ColorValue, offset: number = this.#offset): void {
    const rgba = this.#resolveColor(value);
    this.#offset = offset;
    this.red = rgba[Color.RED];
    this.green = rgba[Color.GREEN];
    this.blue = rgba[Color.BLUE];
    this.alpha = rgba[Color.ALPHA];
  }

  #resolveColor(color: ColorValue): PixelValue {
    if (typeof color === "string") {
      let pixel = this.colorCache.get(color);
      if (pixel == null) {
        pixel = convertHex(color) as PixelValue;
        this.colorCache.set(color, pixel);
      }
      return pixel;
    }

    return color;
  }
}
