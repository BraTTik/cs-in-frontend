import type { PixelStream, RGBA, TraverseMode } from "./types.ts";
import { ROW_MAJOR } from "./types.ts"
import { ImageData } from "./image-data.ts";

export class TypedPixelStream implements PixelStream {
  #height: number;
  #width: number;
  #data: Uint8ClampedArray;
  #rgbaLength = 4;
  #callbackData: RGBA = new Array<number>(4).fill(0) as RGBA;

  constructor(imageData: ImageData) {
    this.#height = imageData.height;
    this.#width = imageData.width;
    this.#data = imageData.data.subarray();
  }

  forEach(mode: TraverseMode, callback: (rgba: RGBA, x: number, y: number) => void): void {
    mode === ROW_MAJOR ? this.rowMajor(callback) : this.columnMajor(callback);
  }

  getPixel(x: number, y: number): RGBA {
    const startIndex = this.startIndex(x, y);
    return this.#data.subarray(startIndex, startIndex + this.#rgbaLength) as unknown as RGBA;
  }

  setPixel(x: number, y: number, rgba: RGBA): RGBA {
    const startIndex = this.startIndex(x, y);
    for (let i = startIndex; i < startIndex + this.#rgbaLength; i++) {
      const val = rgba[i - startIndex];
      this.#data[i] = val;
    }
    return rgba;
  }

  private calcXY(index: number) {
    let p = index / 4;
    return [p % this.#width, Math.floor(p / this.#width)]
  }


  private startIndex(x: number, y: number): number {
    if (x >= this.#width || x < 0 || y >= this.#height || y < 0) {
      throw new RangeError("invalid pixel index");
    }
    return (y * this.#width + x) * this.#rgbaLength;
  }

  private rowMajor(callback: (rgba: RGBA, x: number, y: number) => void) {
    for (let i = 0; i < this.#data.length; i += this.#rgbaLength) {
      const [x, y] = this.calcXY(i);
      this.fillCallbackData(i);
      callback(this.#callbackData, x, y);
    }
  }

  private columnMajor(callback: (rgba: RGBA, x: number, y: number) => void) {
    for (let w = 0; w < this.#width; w++) {
      for (let h = 0; h < this.#height; h++) {
        const index = (h * this.#width + w) * this.#rgbaLength;
        this.fillCallbackData(index);
        callback(this.#callbackData, w, h);
      }
    }
  }

  private fillCallbackData(start: number) {
    for (let j = 0; j < this.#rgbaLength; j++) {
      this.#callbackData[j] = this.#data[start + j];
    }
  }
}
