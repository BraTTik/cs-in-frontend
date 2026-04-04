import { Vector } from "../vector.ts";

describe("Vector", () => {
  it("stores values", () => {
    const vector = new Vector();
    vector.push(1);
    expect(vector.at(0)).toEqual(1);
  })

  it("expands", () => {
    const vector = new Vector();
    for (let i = 0; i < 100; i++) {
      vector.push(i + 1);
    }
    expect(vector.length).toBe(100);
    expect(vector.at(99)).toBe(100);
  })
})
