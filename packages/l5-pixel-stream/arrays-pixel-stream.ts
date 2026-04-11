import type { PixelStream, RGBA, TraverseMode } from "./types.ts";
import { ROW_MAJOR } from "./types.ts";
import { ImageData } from "./image-data.ts";

export class ArraysPixelStream implements PixelStream {
  private width: number;
  private height: number;
  private data: RGBA[]

  constructor(data: ImageData) {
    this.width = data.width;
    this.height = data.height;
    this.data = new Array(data.data.length / 4);

    for (let i = 0; i < data.data.length; i += 4) {
      const pixel = data.data.slice(i, i + 4);
      this.data[i] = Array.from(pixel) as RGBA;
    }
  }

  forEach(mode: TraverseMode, callback: (rgba: RGBA, x: number, y: number) => void): void {
    mode === ROW_MAJOR ? this.rowMajor(callback) : this.columnMajor(callback);
  }

  getPixel(x: number, y: number): RGBA {
    this.checkRange(x, y);
    return this.data[this.toIndex(x, y)];
  }

  setPixel(x: number, y: number, rgba: RGBA): RGBA {
    this.data[this.toIndex(x, y)] = rgba;
    return rgba;
  }

  private checkRange(x: number, y: number) {
    if (x >= this.width) {
      throw new RangeError(`Value x - ${x} is out of range`);
    }
    if (y >= this.height) {
      throw new RangeError(`Value y - ${y} is out of range`);
    }
  }

  private toIndex(x: number, y: number) {
    return y * this.width + x;
  }

  private columnMajor(callback: (rgba: RGBA, x: number, y: number) => void) {
    for (let w = 0; w < this.width; w++) {
      for (let h = 0; h < this.height; h++) {
        callback(this.getPixel(w, h), w, h);
      }
    }
  }

  private rowMajor(callback: (rgba: RGBA, x: number, y: number) => void) {
    for (let h = 0; h < this.height; h++) {
      for (let w = 0; w < this.width; w++) {
        callback(this.getPixel(w, h), w, h);
      }
    }
  }
}
