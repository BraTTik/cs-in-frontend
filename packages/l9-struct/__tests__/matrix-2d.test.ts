import { Matrix2D  } from "../matrix-2d.ts";
import { RGBA } from "../rgba.ts";
import { PixelValue } from "../types.ts";

const whiteColor = new Uint8ClampedArray(4);
whiteColor[0] = 255;
whiteColor[1] = 255;
whiteColor[2] = 255;
whiteColor[3] = 255;

const blankColor = new Uint8ClampedArray(4);

const createImage = () => {
  const imageData = new ImageData(20, 20);
  const image = new Matrix2D(imageData.width, imageData.height, RGBA, imageData.data.buffer);

  return image;
}

describe("Matrix2D", () => {
  it("creates properly", () => {
    const image = createImage();
    expect(image.width).toBe(20);
    expect(image.height).toBe(20);
    expect(image.get(0, 0)).toEqual(blankColor);
  });

  it("should fill", () => {
    const imageData = new ImageData(20, 20);
    const image = new Matrix2D(imageData.width, imageData.height, RGBA, imageData.data.buffer);

    image.fill("#fff");

    expect(image.get(1, 10)).toEqual(whiteColor);
    expect(Array.from(image.get(2, 10) as PixelValue)).toEqual([255, 255, 255, 255]);
  })

  it("mutate pixel", () => {
    const image = createImage();

    image.view(1, 10).red = 255;

    expect(image.view(1, 10).red).toBe(255);
    expect(Array.from(image.get(1, 10)  as PixelValue)).toEqual([255, 0, 0, 0]);
  })

  it("return array", () => {
    const image = createImage();
    image.fill("#ffffff");

    const arr = image.view(1, 10).array()
    expect(arr).toEqual(whiteColor);

    arr[0] = 0;

    expect(Array.from(image.get(1, 10)  as PixelValue)).toEqual([0, 255, 255, 255]);
  })

  it("mutating array changes value", () => {
    const image = createImage();
    image.fill("#ffffff");

    const arr = image.view(1, 10).array()
    arr[0] = 0;

    expect(Array.from(image.get(1, 10)  as PixelValue)).toEqual([0, 255, 255, 255]);
  })


  it("changes color with hex", () => {
    const image = createImage();
    image.set(1, 10, "#ff0000");

    expect(Array.from(image.get(1, 10)  as PixelValue)).toEqual([255, 0, 0, 255]);
  })

  it("changes color with rgba", () => {
    const image = createImage();
    image.set(1, 10, [255, 0, 0, 255]);

    expect(Array.from(image.get(1, 10)  as PixelValue)).toEqual([255, 0, 0, 255]);
  })
})
