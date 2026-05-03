import { RGBA } from "../rgba.ts";

describe("RGBA", () => {
  it("should change value", () => {
    const buffer = new ArrayBuffer(RGBA.byteLength * 4);
    const rgba = new RGBA();
    rgba.setBuffer(buffer);
    rgba.setOffset(0);

    rgba.red = 255;

    expect(rgba.red).toBe(255);
    expect(rgba.green).toBe(0);
    expect(rgba.blue).toBe(0);
    expect(rgba.alpha).toBe(0);

    rgba.setOffset(RGBA.byteLength);
    expect(rgba.red).toBe(0);
    expect(rgba.green).toBe(0);
    expect(rgba.blue).toBe(0);
    expect(rgba.alpha).toBe(0);
  });

  it("applies hex color", () => {
    const buffer = new ArrayBuffer(RGBA.byteLength * 4);
    const rgba = new RGBA();

    rgba.setBuffer(buffer);
    rgba.setOffset(RGBA.byteLength);

    rgba.hex = "#ffffff";

    expect(rgba.red).toBe(255);
    expect(rgba.green).toBe(255);
    expect(rgba.blue).toBe(255);
    expect(rgba.alpha).toBe(255);
    expect(rgba.hex).toBe( "#ffffff");

    rgba.setOffset(0);

    expect(rgba.red).toBe(0);
    expect(rgba.green).toBe(0);
    expect(rgba.blue).toBe(0);
    expect(rgba.alpha).toBe(0);
  })
})
