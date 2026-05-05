import { readImageData, saveImageData, readImageDataJson, saveImageDataJson, saveArrayOfArraysJson, formatSize, readArrayOfArraysJson, BIN_FILE, ARRAY_FILE, ARRAYS_FILE, logFileSize } from "./utils.ts";
import { Matrix2D } from "./matrix-2d.ts";
import { RGBA } from "./rgba.ts";
import { ImageData } from "./image-data.ts";
// @ts-ignore
import { compressToGzip, compressToBrotli } from "../utils/src/gzip.js";
import { ArraysPixelStream } from "../l5-pixel-stream/arrays-pixel-stream.ts";
import { FlatPixelStream } from "../l5-pixel-stream/flat-pixel-stream.ts"
import type { PixelStream } from "../l5-pixel-stream/types.ts";

const JIT_RUNS = 100;

const imageData = new ImageData(1920, 1080);
const image = new Matrix2D(imageData.width, imageData.height, RGBA, imageData.data.buffer);

const arraysData = new ArraysPixelStream(imageData);
const flatData = new FlatPixelStream(imageData);


const durationTime = (run: () => void) => {
  const start = performance.now()
  run();
  return performance.now() - start;
}

type SaveReadResult = {
  type: string;
  saveTime: number;
  readTime: number;
  size: string;
  gz: string;
  br: string;
}

type MutateResult = {
  set: number;
  read: number;
  fill: number;
}

const matrixRun = (): MutateResult => {
  const jit = () => {
    console.log("Jit matrix")
    for (let i = 0; i < JIT_RUNS; i++) {
      image.set(1, 1, [255, 255, 255, 255]);
      image.get(1, 1);
      image.fill("#ffffff");
    }
    console.log("End jit matrix")
  }

  jit();

  const fillTime = durationTime(() => image.fill("#ffffff"));

  const setTime = durationTime(() => image.set(1, 1, [255, 0, 0, 255]));
  const getTime = durationTime(() => image.get(1, 10));

  return {
    set: setTime,
    read: getTime,
    fill: fillTime,
  }
}

const runPixelStream = (stream: PixelStream) => {
  const jit = () => {
    console.log(`JIT: ${stream.constructor.name}`);
    for (let i = 0; i < JIT_RUNS; i++) {
      stream.setPixel(1, 1, [255, 0, 0, 255]);
      stream.getPixel(1, 1);
      stream.forEach("RowMajor", (rgba, x, y) => {
        stream.setPixel(x, y, rgba);
      })
    }
    console.log(`End JIT: ${stream.constructor.name}`);
  }

  jit();

  const fillTime = durationTime(() => stream.forEach("RowMajor", (_, x, y) => {
    stream.setPixel(x, y, [255, 255, 255, 255]);
  }));
  const setTime = durationTime(() => stream.setPixel(1, 1, [255, 255, 255, 255]));
  const getTime = durationTime(() => stream.getPixel(1, 1));

  return {
    set: setTime,
    read: getTime,
    fill: fillTime,
  }
}

const matrixDataResult = matrixRun();
const flatDataResult = runPixelStream(flatData);
const arraysDataResult = runPixelStream(arraysData);

const serializeRun = async (title: string, file: string, save: (imageData: ImageData, file: string) => void, read: (file: string) => ImageData): Promise<SaveReadResult> => {

  const saveTime = durationTime(() => save(imageData, file))
  const size = logFileSize(file);
  const gzipResult = await compressToGzip(file);
  const brotliResult = await compressToBrotli(file);

  const readTime = durationTime(() => read(file))

  return {
    type: title,
    saveTime,
    readTime,
    size,
    gz: formatSize(gzipResult.compressedSize),
    br: formatSize(brotliResult.compressedSize)
  }
}

const binaryResult = await serializeRun("Binary", BIN_FILE, saveImageData, readImageData);
const jsonResult = await serializeRun("Array JSON", ARRAY_FILE, saveImageDataJson, readImageDataJson);
const arraysResult = await serializeRun("Array of Arrays", ARRAYS_FILE, saveArrayOfArraysJson, readArrayOfArraysJson);

const logResults = (title: string, mutate: MutateResult, serialize: SaveReadResult) => {
  console.log(`==== ${title} ====`)
  console.table({...mutate, ...serialize});
  console.log("=======");
  console.log();
}

logResults("Binary", matrixDataResult, binaryResult);
logResults("Flat", flatDataResult, jsonResult);
logResults("Arrays", arraysDataResult, arraysResult);
