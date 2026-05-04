import { RGBA } from "./rgba.ts";
import { Matrix2D } from "./matrix-2d.ts";

const imageData = new ImageData(10, 10)
const image = new Matrix2D(imageData.width, imageData.height, RGBA, imageData.data);

image.set(1, 5, [255, 0, 0, 255]);

console.log(image.get(1, 5).buffer)
