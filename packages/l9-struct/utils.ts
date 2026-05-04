import { ImageData } from "./image-data.ts";
import * as fs from "node:fs";
import * as path from "node:path";

const hexRegexp = new RegExp(/^#?([0-9a-f]{6}|[0-9a-f]{3})$/);

const normalizeHex = (hex: string): string => {
  if (hexRegexp.test(hex)) {
    const sliced = hex.slice(1);
    if (sliced.length === 3) {
      return sliced + sliced;
    }

    return sliced;
  }

  throw new TypeError(`Invalid hex value: got ${hex} `);
}

export const convertHex = (hex: string): Uint8Array => {
  const rgba = new Uint8Array(4);
  const normalizedHex = normalizeHex(hex);
  const r = normalizedHex.slice(0, 2);
  const g = normalizedHex.slice(2, 4);
  const b = normalizedHex.slice(4);
  const alpha = 255;

  rgba[0] = parseInt(r, 16);
  rgba[1] = parseInt(g, 16);
  rgba[2] = parseInt(b, 16);
  rgba[3] = alpha;

  return rgba;
};

export const toHex = (rgba: { red: number; green: number; blue: number }) => {
  const r = rgba.red.toString(16);
  const b = rgba.blue.toString(16);
  const g = rgba.green.toString(16);

  return `#${r}${g}${b}`;
}

const DIM_OFFSET = Uint16Array.BYTES_PER_ELEMENT * 2;

export const BIN_FILE = "./test.bin";
export const ARRAY_FILE = "./array.json";
export const ARRAYS_FILE = "./arrays.json";

export const saveImageData = (imageData: ImageData, file: string = BIN_FILE) => {
  const buffer = new ArrayBuffer(Uint16Array.BYTES_PER_ELEMENT * 2 + (imageData.width * imageData.height) * 4);
  const dView = new Uint16Array(buffer, 0, 2);
  const dataView = new Uint8ClampedArray(buffer, DIM_OFFSET);

  dView[0] = imageData.width;
  dView[1] = imageData.height;

  dataView.set(imageData.data);

  fs.writeFileSync(file, new Uint8Array(buffer));
}

export const readImageData = (file = BIN_FILE): ImageData => {
  const buffer = fs.readFileSync(file);

  const dView = new Uint16Array(buffer.buffer, buffer.byteOffset, 2);

  const width = dView[0];
  const height = dView[1];

  const data = new Uint8ClampedArray(buffer.buffer, buffer.byteOffset + DIM_OFFSET, width * height * 4);

  return new ImageData(data, width, height);
}

export const saveImageDataJson = (imageData: ImageData, file: string = ARRAY_FILE) => {
  const width = imageData.width;
  const height = imageData.height;
  const data = Array.from(imageData.data);

  fs.writeFileSync(file, JSON.stringify({ width, height, data }), "utf-8");
}

export const readImageDataJson = (file: string = ARRAY_FILE) => {
  const str = fs.readFileSync(file, "utf-8");
  const data = JSON.parse(str);

  return new ImageData(new Uint8ClampedArray(data.data), data.width, data.height);
}

export const saveArrayOfArraysJson = (imageData: ImageData, file: string = ARRAYS_FILE) => {
  const width = imageData.width;
  const height = imageData.height;
  const values = Array.from(imageData.data);
  const data: number[][] = [];

  for (let i = 0; i < values.length; i += 4) {
    const pixel: number[] = new Array(4);
    pixel[0] = values[i];
    pixel[1] = values[i + 1];
    pixel[2] = values[i + 2];
    pixel[3] = values[i + 3];
    data.push(pixel);
  }

  fs.writeFileSync(file, JSON.stringify({ width, height, data }), "utf-8");
}

export const readArrayOfArraysJson = (file: string = ARRAYS_FILE) => {
  const str = fs.readFileSync(file, "utf-8");
  const data = JSON.parse(str);
  const pixels = data.data.flat();

  return new ImageData(new Uint8ClampedArray(pixels), data.width, data.height);
}

export const formatSize = (size: number) => (size / 1024 / 1024).toFixed(2) + " MB";

export const logFileSize = (file: string) => {
  const size = formatSize(fs.statSync(file).size);
  const name = path.basename(file);

  console.log(`${name}: ${size}`);

  return size;
}
