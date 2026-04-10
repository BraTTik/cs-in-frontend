import { FlatPixelStream } from "./flat-pixel-stream.ts";
import { COLUMN_MAJOR, ROW_MAJOR } from "./types.ts";
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
  setPixel: number;
  getPixel: number;
  rowMajor: number;
  columnMajor: number;
}

const template = (): BenchResult => ({
  setPixel: 0,
  getPixel: 0,
  rowMajor: 0,
  columnMajor: 0,
})

const resultTemplate = (): BenchResult[] => [template(), template(), template()]

const flatResult: BenchResult[] = resultTemplate();

const performanceTest = (calback: Function) => {
  const start = performance.now();
  calback();
  return performance.now() - start;
}

for (let test = 0; test < imageTest.length; test++) {
  const image = imageTest[test];
  const flatPixelStream = new FlatPixelStream(image);

  const flat = flatResult[test];
  flat.setPixel = performanceTest(() => flatPixelStream.setPixel( 12, 12, [1, 1, 1, 1]));
  flat.getPixel = performanceTest(() => flatPixelStream.getPixel(12, 12));
  flat.rowMajor = performanceTest(() => flatPixelStream.forEach(ROW_MAJOR, () => void 0));
  flat.columnMajor = performanceTest(() => flatPixelStream.forEach(COLUMN_MAJOR, () => void 0));
}

console.log("======= FlatPixelStream =======")
console.table(flatResult)
