export class ImageData {
  public data: Uint8ClampedArray;
  public width: number;
  public height: number;

  constructor(data: Uint8ClampedArray, width: number, height: number)
  constructor(width: number, height: number)
  constructor(data: Uint8ClampedArray | number, width: number, height?: number) {
    if (typeof data === "object") {
      this.data = data;
      this.width = width;
      this.height = height;
    } else {
      this.width = data;
      this.height = width;
      this.data = new Uint8ClampedArray(this.width * this.height * 4);
    }
  }
}
