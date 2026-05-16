export class PointerFrame {
  static byteLength = Uint32Array.BYTES_PER_ELEMENT * 2;
  static ADDRESS = 0;
  static BYTE_LENGTH = 1;

  #view: Uint32Array;

  get address() {
    return this.#view[PointerFrame.ADDRESS];
  }

  get byteLength() {
    return this.#view[PointerFrame.BYTE_LENGTH];
  }

  static read(buffer: ArrayBuffer, offset: number) {
    return new PointerFrame(new Uint32Array(buffer, offset, 2));
  }

  static write(buffer: ArrayBuffer, offset: number, address: number, byteLength: number) {
    const view = new Uint32Array(buffer, offset, 2);
    view[PointerFrame.ADDRESS] = address;
    view[PointerFrame.BYTE_LENGTH] = byteLength;
  }

  protected constructor(view: Uint32Array) {
    this.#view = view;
  }
}
