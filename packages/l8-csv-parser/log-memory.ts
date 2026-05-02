import process from "node:process";

const formatBytes = (bytes: number) => {
  return (bytes / 1024 / 1024).toFixed(2) + "MB"
}

export const logMemory = (title: string) => {
  const memory = process.memoryUsage();
  console.log(title);
  console.log(`HeapTotal: ${formatBytes(memory.heapTotal)}`);
  console.log(`HeapUsed: ${formatBytes(memory.heapUsed)}`);
  console.log(`RSS: ${formatBytes(memory.rss)}`);
}
