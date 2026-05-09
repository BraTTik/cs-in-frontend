import type { IView, ViewCtor, ViewValue } from "./types.ts";

const resolveWindow = <T extends IView<any>>(ctor: ViewCtor<T>): T => {
  if (typeof ctor === "function") {
    return new ctor() as T;
  }
  return ctor as T;
};

export class Vector<T extends IView<any>> {
  #buffer: ArrayBuffer;
  #window: T;
  #capacity: number;
  #length: number;

  get capacity() {
    return this.#capacity;
  }

  get length() {
    return this.#length;
  }

  view(index: number) {
    index = this.#normalizeIndex(index);
    const offset = this.#getOffset(index);
    this.#window.setOffset(offset);

    return this.#window;
  }

  constructor(capacity: number, window: ViewCtor<T>, buffer?: ArrayBuffer) {
    this.#window = resolveWindow(window);
    this.#capacity = capacity;
    this.#buffer = buffer ?? new ArrayBuffer(capacity * this.#window.byteLength, { maxByteLength: capacity * this.#window.byteLength * 2 });
    this.#length = 0;
    this.#window.setBuffer(this.#buffer);
  }

  fill(value: ViewValue<T>) {
    for (let i = 0; i < this.#length; i++) {
      this.#safeSetItem(i, value);
    }
  }

  push(value: ViewValue<T>): number {
    if (this.#shouldResize(this.#length)) {
      this.#resize();
    }
    this.#safeSetItem(this.#length, value);
    return ++this.#length;
  }

  pop(): ViewValue<T> | undefined {
    if (this.#length <= 0) return;
    const index = this.#length - 1;
    this.#length--;
    return this.#safeGetItem(index);
  }

  set(index: number, value: ViewValue<T>) {
    index = this.#normalizeIndex(index);
    const offset = this.#getOffset(index);
    this.#window.set(value, offset);
  }

  get(index: number): ViewValue<T> {
    index = this.#normalizeIndex(index);
    return this.#window.get(this.#getOffset(index));
  }

  reserve(count: number) {
    const toReserve = Math.max(0, count - (this.capacity - this.length));
    if (toReserve) {
      this.#resize(this.capacity + toReserve);
    }
  }

  shrinkToFit() {
    try {

      (this.#buffer as ArrayBuffer).resize(this.#length * this.#window.byteLength)
      this.#capacity = this.#length;
    } catch (e) {
      console.log(this.#length);
      console.log(this.#buffer.byteLength, this.#length * this.#window.byteLength);
      throw e
    }

  }

  #getOffset(index: number): number {
    return this.#window.byteLength * index;
  }

  #safeSetItem(safeIndex: number, value: ViewValue<T>) {
    const offset = this.#getOffset(safeIndex);
    this.#window.set(value, offset);
  }

  #safeGetItem(safeIndex: number): ViewValue<T> {
    return this.#window.get(this.#getOffset(safeIndex));
  }

  #normalizeIndex(_index: number): number {
    if (_index < 0) {
      _index = _index + this.#length;
    }
    if (_index >= this.#length) {
      throw new RangeError("Index out of bounds");
    }

    return _index;
  }

  #shouldResize(index: number) {
    return index >= this.#capacity;
  }

  #resize(capacity?: number) {
    const nextCapacity = capacity ?? this.#capacity * 2;
    const nextByteLength = nextCapacity * this.#window.byteLength
    this.#capacity = nextCapacity;
    if (nextByteLength <= this.#buffer.maxByteLength) {
      (this.#buffer as ArrayBuffer).resize(nextByteLength);
      return;
    }
    const nextView = new Uint8Array(new ArrayBuffer(nextCapacity * this.#window.byteLength, { maxByteLength: nextByteLength * 2 }));
    nextView.set(new Uint8Array(this.#buffer, 0, this.#length * this.#window.byteLength));
    this.#buffer = nextView.buffer;
    this.#window.setBuffer(this.#buffer);
  }
}
