import * as fs from "node:fs";
import * as zlib from "node:zlib";
import { fileURLToPath } from "node:url";
import * as path from "node:path";

import { pipeline } from "node:stream/promises";

const isDirectRun = process.argv[1] != null && path.resolve(fileURLToPath(import.meta.url)) === path.resolve(process.argv[1]);

if (isDirectRun) {
  await main().catch(console.error);
}

// Сжатие в Gzip (альтернатива для совместимости)
export async function compressToGzip(inputFile, outputFile = null, options = {}) {
  if (!outputFile) {
    outputFile = `${inputFile}.gz`;
  }

  console.log(`🗜️  Сжатие Gzip: ${inputFile} → ${outputFile}`);
  const startTime = Date.now();

  const source = fs.createReadStream(inputFile);
  const destination = fs.createWriteStream(outputFile);
  const gzip = zlib.createGzip({ level: options.level || 9 });

  await pipeline(source, gzip, destination);

  const originalSize = fs.statSync(inputFile).size;
  const compressedSize = fs.statSync(outputFile).size;
  const ratio = ((1 - compressedSize / originalSize) * 100).toFixed(2);
  const time = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log(`   ✅ Gzip: ${(originalSize / 1024 / 1024).toFixed(2)} MB → ${(compressedSize / 1024 / 1024).toFixed(2)} MB (${ratio}% экономии) ⏱️ ${time}с`);

  return { outputFile, originalSize, compressedSize, ratio, time };
}

// Сжатие в Brotli
export async function compressToBrotli(inputFile, outputFile = null, options = {}) {
  if (!outputFile) {
    outputFile = `${inputFile}.br`;
  }

  console.log(`🗜️  Сжатие Brotli: ${inputFile} → ${outputFile}`);
  const startTime = Date.now();

  const source = fs.createReadStream(inputFile);
  const destination = fs.createWriteStream(outputFile);

  const brotli = zlib.createBrotliCompress({
    params: {
      [zlib.constants.BROTLI_PARAM_QUALITY]: options.quality || zlib.constants.BROTLI_MAX_QUALITY
    }
  });

  await pipeline(source, brotli, destination);

  const originalSize = fs.statSync(inputFile).size;
  const compressedSize = fs.statSync(outputFile).size;
  const ratio = ((1 - compressedSize / originalSize) * 100).toFixed(2);
  const time = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log(`   ✅ Brotli: ${(originalSize / 1024 / 1024).toFixed(2)} MB → ${(compressedSize / 1024 / 1024).toFixed(2)} MB (${ratio}% экономии) ⏱️ ${time}с`);

  return { outputFile, originalSize, compressedSize, ratio, time };
}

async function  main() {
  const args = process.argv.slice(2);

  let output = "";
  let input = ""
  let compress = []; // 'br', 'gz'

  for (let i = 0; i < args.length; i++) {
     if (args[i] === "--input" || args[i] === "-i") {
       input = args[i + 1];
       if (!output) {
         output = input;
       }
       i++;
     } else  if (args[i] === "--output" || args[i] === "-o") {
       output = args[i + 1];
       i++;
     } else if (args[i] === "--method" || args[i] === "-m") {
      const compressTypes = args[i + 1].split(",");
      compress = compressTypes.map(c => c.trim().toLowerCase());
      i++;
    } else if (args[i] === "--compress-all") {
      compress = ["br", "gz"];
    } else if (args[i] === "--help" || args[i] === "-h") {
      console.log(`
Использование:
  node gzip.js [опции]

Опции:
  --input, -i <файл>        Входной файл
  --output, -o <файл>       Имя выходного файла (по умолчанию <input>.<method>)
  --method, -m <типы>     Сжатие: zip, br (brotli), gz (gzip) через запятую
  --compress-all            Сжать всеми методами (br, gz)
  --help, -h                Показать эту справку

Форматы сжатия:
  br   - Brotli (лучшее сжатие, поддерживается современными браузерами)
  gz   - Gzip (отличная совместимость, чуть хуже сжатие чем Brotli)

Требования:
  Для ZIP сжатия требуется установка: npm install archiver
  Brotli и Gzip работают без дополнительных зависимостей
        `);
      process.exit(0);
    }
  }

  if (!input) {
    throw new Error("No input file");
  }

  for (let i = 0; i < compress.length; i++) {
    const method = compress[i];
    if (method === "gz") {
      await compressToGzip(input, output)
    } else if (method === "br") {
      await compressToBrotli(input, output)
    }
  }
}
