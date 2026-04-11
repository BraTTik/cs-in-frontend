import { FlatPixelStream } from "./flat-pixel-stream.ts";
import { ArraysPixelStream } from "./arrays-pixel-stream.ts";
import { ObjectPixelStream } from "./object-pixel-stream.ts";
import { TypedPixelStream } from "./typed-pixel-stream.ts";
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
  rowMajor: string;
  columnMajor: string;
}

const template = (): BenchResult => ({
  size: "",
  rowMajor: "",
  columnMajor: "",
})

const resultTemplate = (): BenchResult[] => [template(), template(), template()]

const flatResult: BenchResult[] = resultTemplate();
const arraysResult: BenchResult[] = resultTemplate();
const objResult: BenchResult[] = resultTemplate();
const typedResult: BenchResult[] = resultTemplate();

const performanceTest = (calback: Function) => {
  const start = Date.now();
  calback();
  return (Date.now() - start).toFixed(3) + "ms";
}

const testStream = (stream: PixelStream, size: string, result: BenchResult) => {
  result.size = size;
  result.rowMajor = performanceTest(() => stream.forEach(ROW_MAJOR, (_, x, y) => {
    // stream.setPixel(x, y, [1, 1, 1, 1])
  }));
  result.columnMajor = performanceTest(() => stream.forEach(COLUMN_MAJOR, (_, x, y) => {
    // stream.setPixel(x, y, [1, 1, 1, 1])
  }));
}

for (let test = 0; test < imageTest.length; test++) {
  const image = imageTest[test];
  const flatPixelStream = new FlatPixelStream(image);
  const arrayPixelStream = new ArraysPixelStream(image);
  const objectPixelStream = new ObjectPixelStream(image);
  const typedPixelStream = new TypedPixelStream(image);

  const size = `${image.width}x${image.height}`;

  const flat = flatResult[test];
  testStream(flatPixelStream, size, flat);

  const array = arraysResult[test];
  testStream(arrayPixelStream, size, array);

  const obj = objResult[test];
  testStream(objectPixelStream, size, obj);

  const typed = typedResult[test];
  testStream(typedPixelStream, size, typed);
}

console.log("======= FlatPixelStream =======")
console.table(flatResult)

console.log("======= ArrayPixelStream =======");
console.table(arraysResult);

console.log("======= ObjectPixelStream =======")
console.table(objResult);

console.log("======= TypedPixelStream =======");
console.table(typedResult);
