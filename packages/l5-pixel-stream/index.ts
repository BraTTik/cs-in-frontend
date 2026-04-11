import { FlatPixelStream } from "./flat-pixel-stream.ts";
import { ArraysPixelStream } from "./arrays-pixel-stream.ts"
import { COLUMN_MAJOR, ROW_MAJOR } from "./types.ts";
import type { PixelStream } from "./types.ts";
import { ImageData } from "./image-data.ts";

const imageData100 = new ImageData(100, 100);
const imageData1000 = new ImageData(1000, 1000);
const bigImageData = new ImageData(4096, 4096);

const imageTest = [
  imageData100,
  imageData1000,
  bigImageData
]

type BenchResult = {
  size: string,
  setPixel: string;
  getPixel: string;
  rowMajor: string;
  columnMajor: string;
}

const template = (): BenchResult => ({
  size: "",
  setPixel: "",
  getPixel: "",
  rowMajor: "",
  columnMajor: "",
})

const resultTemplate = (): BenchResult[] => [template(), template(), template()]

const flatResult: BenchResult[] = resultTemplate();
const arraysResult: BenchResult[] = resultTemplate();

const performanceTest = (calback: Function) => {
  const start = Date.now();
  calback();
  return (Date.now() - start).toFixed(3) + "ms";
}

const testStream = (stream: PixelStream, size: string, result: BenchResult) => {
  result.size = size;
  result.setPixel = performanceTest(() => stream.setPixel( 12, 12, [1, 1, 1, 1]));
  result.getPixel = performanceTest(() => stream.getPixel(12, 12));
  result.rowMajor = performanceTest(() => stream.forEach(ROW_MAJOR, () => void 0));
  result.columnMajor = performanceTest(() => stream.forEach(COLUMN_MAJOR, () => void 0));
}

for (let test = 0; test < imageTest.length; test++) {
  const image = imageTest[test];
  const flatPixelStream = new FlatPixelStream(image);
  const arrayPixelStream = new ArraysPixelStream(image);

  const size = `${image.width}x${image.height}`;

  const flat = flatResult[test];
  testStream(flatPixelStream, size, flat);

  const array = arraysResult[test];
  testStream(arrayPixelStream, size, array);

}

console.log("======= FlatPixelStream =======")
console.table(flatResult)

console.log("======= ArrayPixelStream =======");
console.table(arraysResult);
