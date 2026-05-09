import { Vector } from "../vector.ts";
import { RGBA } from "../rgba.ts";
import type { PixelValue } from "../types.ts";

const getPixel = (vector: Vector<RGBA>, index: number) => Array.from(vector.get(index) as PixelValue)

describe("Vector", () => {
  it("should create an empty vector", () => {
    const vector = new Vector(0, RGBA);
    expect(vector.length).toBe(0);
    expect(vector.capacity).toBe(0);
  })

  it("should push and pop", () => {
    const LENGTH = 10;
    const vector = new Vector(LENGTH, RGBA);
    expect(vector.length).toBe(0);
    expect(vector.capacity).toBe(LENGTH);

    for (let i = 0; i < vector.capacity; i++) {
      vector.push([255, 255, 255, 255]);
    }

    expect(vector.length).toBe(LENGTH);

    while(vector.length) {
      expect(Array.from(vector.pop() as PixelValue)).toEqual([255, 255, 255, 255]);
    }
  });

  it("should set and get", () => {
    const LENGTH = 10;
    const vector = new Vector(LENGTH, RGBA);

    for (let i = 0; i < vector.capacity; i++) {
      vector.push([0, 0, 0, 0]);
    }

    vector.set(5, [255, 255, 255, 255]);

    expect(getPixel(vector, 5)).toEqual([255, 255, 255, 255]);
  });

  it("should fill", () => {
    const LENGTH = 10;
    const vector = new Vector(LENGTH, RGBA);

    for (let i = 0; i < vector.capacity; i++) {
      vector.push([0, 0, 0, 0]);
    }

    vector.fill("#fff");

    for (let i = 0; i < vector.length; i++) {
      expect(getPixel(vector, i)).toEqual([255, 255, 255, 255]);
    }
  })

  it ("should resize on capacity overflow", () => {
    const LENGTH = 10;
    const vector = new Vector(LENGTH, RGBA);
    for (let i = 0; i < vector.capacity; i++) {
      vector.push([0, 0, 0, 0]);
    }
    expect(vector.capacity).toBe(LENGTH);
    vector.push([0, 0, 0, 0]);
    expect(vector.length).toBe(11);
    expect(vector.capacity).toBe(LENGTH * 2);
  })

  it("should shrink", () => {
    const LENGTH = 10;
    const vector = new Vector(LENGTH, RGBA)
    for (let i = 0; i < LENGTH / 2; i++) {
      vector.push([0, 0, 0, 0]);
    }

    expect(vector.length).toBe(LENGTH / 2);
    expect(vector.capacity).toBe(LENGTH);

    vector.shrinkToFit();

    expect(vector.length).toBe(LENGTH / 2);
    expect(vector.capacity).toBe(LENGTH / 2);

    for (let i = 0; i < LENGTH / 2; i++) {
      expect(getPixel(vector, i)).toEqual([0, 0, 0, 0]);
    }
  })

  it("should throw exception on out of range index", () => {
    const LENGTH = 10;
    const vector = new Vector(LENGTH, RGBA)
    for (let i = 0; i < LENGTH / 2; i++) {
      vector.push([0, 0, 0, 0]);
    }

    expect(() => vector.get(LENGTH)).toThrow(new RangeError("Index out of bounds"))
  })

  it("should get view", () => {
    const LENGTH = 10;
    const vector = new Vector(LENGTH, RGBA)
    for (let i = 0; i < vector.capacity; i++) {
      vector.push([0, 0, 0, 0]);
    }

    const view = vector.view(5);
    view.red = 255;

    expect(getPixel(vector, 5)).toEqual([255, 0, 0, 0]);
  })

  it("should reserve", () => {
    const LENGTH = 10;
    const vector = new Vector(LENGTH, RGBA);
    for (let i = 0; i < LENGTH / 2; i++) {
      vector.push([0, 0, 0, 0]);
    }

    expect(vector.capacity).toBe(LENGTH);
    vector.reserve(3);
    expect(vector.capacity).toBe(LENGTH);
    vector.reserve(10);
    expect(vector.capacity).toBe(LENGTH / 2 + 10);

    for (let i = 0; i < LENGTH / 2; i++) {
      expect(getPixel(vector, i)).toEqual([0, 0, 0, 0]);
    }
  })
})
