import { Typed } from "./types.ts";

export class U8 extends Typed<number> {
  private view: Uint8Array | null = null;

  get(): number {
    if (this.view == null) {
      throw new Error(`${this.constructor.name} is not a initialized`);
    }
    return this.view[0];
  }

  set(value: number) {
    if (this.view == null) {
      throw new Error(`${this.constructor.name} is not a initialized`);
    }
    this.view[0] = value;
  }

  constructor() {
    super(1, 0);
  }


  from(buffer: ArrayBuffer, offset: number): this {
    this.view = new Uint8Array(buffer, offset);
    return this;
  }

  init(buffer: ArrayBuffer, offset: number, data: number): this {
    this.view = new Uint8Array(buffer, offset);
    this.view[0] = data;

    return this;
  }
}
