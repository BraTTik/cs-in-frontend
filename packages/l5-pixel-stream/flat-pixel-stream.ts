import type { PixelStream, RGBA, TraverseMode } from "./types.ts";
import { ROW_MAJOR } from "./types.ts"
import { ImageData } from "./image-data.ts";

export class FlatPixelStream implements PixelStream {
  #height: number;
  #width: number;
  #data: number[];
  #rgbaLength = 4;

  constructor(imageData: ImageData) {
    this.#height = imageData.height;
    this.#width = imageData.width;
    this.#data = Array.from(imageData.data);
  }

  forEach(mode: TraverseMode, callback: (rgba: RGBA, x: number, y: number) => void): void {
    mode === ROW_MAJOR ? this.rowMajor(callback) : this.columnMajor(callback);
  }

  getPixel(x: number, y: number): RGBA {
    const startIndex = this.startIndex(x, y);
    return this.#data.slice(startIndex, startIndex + this.#rgbaLength) as RGBA;
  }

  setPixel(x: number, y: number, rgba: RGBA): RGBA {
    const startIndex = this.startIndex(x, y);
    for (let i = startIndex; i < startIndex + this.#rgbaLength; i++) {
      const val = rgba[i - startIndex];
      this.#data[i] = val;
    }
    return rgba;
  }

  private startIndex(x: number, y: number): number {
    if (x >= this.#width || x < 0 || y >= this.#height || y < 0) {
      throw new RangeError("invalid pixel index");
    }
    return (y * this.#width + x) * this.#rgbaLength;
  }

  private rowMajor(callback: (rgba: RGBA, x: number, y: number) => void) {
    for (let h = 0 ; h < this.#height; h++) {
      for (let w = 0 ; w < this.#width; w++) {
        callback(this.getPixel(w, h), w, h);
      }
    }
  }

  private columnMajor(callback: (rgba: RGBA, x: number, y: number) => void) {
    for (let w = 0; w < this.#width; w++) {
      for (let h = 0; h < this.#height; h++) {
        callback(this.getPixel(w, h), w, h);
      }
    }
  }

  private indexToCoordinate(index: number): [x: number, y: number] {
    const rem = index % this.#rgbaLength;
    const normalized = index - rem;
    const pixelIndex = normalized / this.#rgbaLength;
    const y = Math.floor(pixelIndex / this.#width);
    const x = pixelIndex % this.#width;

    return [x, y];
  }
}
