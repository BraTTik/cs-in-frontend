import { convertHex, toHex } from "./utils.ts";
import type { RGBAWindow } from "./types.ts"

enum Color {
  RED,
  GREEN,
  BLUE,
  ALPHA
}

export class RGBA implements RGBAWindow{
  static byteLength: 4 = 4;
  #buffer: ArrayBufferLike | null = null;
  #offset: number = 0;

  setBuffer(buffer: ArrayBufferLike | null): void {
    this.#buffer = buffer;
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
    return toHex(this);
  }

  set hex(value: string) {
    const rgba = convertHex(value);
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
    return new Uint8Array(this.#buffer, offset + this.#offset, 1)[0];
  }

  private setValue(offset: number, value: number): void {
    if (!this.#buffer) {
      throw new Error("Buffer is not set")
    }

    new Uint8Array(this.#buffer, offset + this.#offset, 1)[0] = value;
  }
}
