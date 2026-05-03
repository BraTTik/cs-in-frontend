import { Typed } from "./types.ts";

export type StructField =
  | Typed<any>
  | (new (...args: never[]) => Typed<any>);

export type FieldValue<F extends StructField> = F extends Typed<infer D>
  ? D
  : F extends new (...args: never[]) => infer I
    ? I extends Typed<infer D>
      ? D
      : never
    : never;

export type StructureValues<S extends Record<string, StructField>> = {
  [K in keyof S]: FieldValue<S[K]>;
};

type LayoutEntry = {
  key: string;
  ctor: new () => Typed<any>;
  offset: number;
};

function fieldCtor(f: StructField): new () => Typed<any> {
  if (typeof f === "function") {
    return f as new () => Typed<any>;
  }
  return f.constructor as new () => Typed<any>;
}

function alignOffset(offset: number, alignment: number): number {
  const a = alignment > 0 ? alignment : 1;
  const r = offset % a;
  return r === 0 ? offset : offset + (a - r);
}

export class Structure<S extends Record<string | number, StructField>> {
  readonly #scheme: ReadonlyArray<LayoutEntry>;
  readonly #byteLength: number;

  get byteLength() {
    return this.#byteLength;
  }

  constructor(scheme: S) {
    const keys = Object.keys(scheme) as (keyof S & string)[];
    let offset = 0;
    const entries: LayoutEntry[] = [];

    for (const key of keys) {
      const ctor = fieldCtor(scheme[key]);
      const probe = new ctor();
      offset = alignOffset(offset, probe.alignment);
      const at = offset;
      offset += probe.byteLength;
      entries.push({ key, ctor, offset: at });
    }

    this.#scheme = entries;
    this.#byteLength = offset;
  }

  create(buffer: ArrayBuffer, offset: number, data: StructureValues<S>): StructureValues<S> {
    const view = new View(buffer, offset, this.byteLength) as StructureValues<S>;

    for (const type of this.#scheme) {
      const inst = new type.ctor();
      inst.init(buffer, offset + type.offset, data[type.key as keyof StructureValues<S>] as never);

      Object.defineProperty(view, type.key, {
        enumerable: true,
        configurable: true,
        get: () => inst.get(),
        set: (value) => {
          inst.set(value);
        }
      });
    }

    return view;
  }
}

class View {
  #byteLength: number;
  #offset: number;
  #buffer: ArrayBuffer;

  get byteLength() {
    return this.#byteLength;
  }

  get offset() {
    return this.#offset;
  }

  get buffer() {
    return this.#buffer;
  }

  constructor(buffer: ArrayBuffer, offset: number, byteLength: number) {
    this.#byteLength = byteLength;
    this.#offset = offset;
    this.#buffer = buffer;
  }
}
