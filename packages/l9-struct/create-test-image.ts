import { ImageData } from "./image-data.ts";
import { saveImageData, logFileSize } from "./utils.ts"
import * as fs from "node:fs";

const image = new ImageData(1024, 1024);

saveImageData(image);

logFileSize("./test.bin")
