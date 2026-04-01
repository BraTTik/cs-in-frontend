export const toBinaryString = (num: number) => {
  const int = new Int32Array([num]);
  const buffer = new Uint8Array(int.buffer);

  let result = "";

  for (let i = 0; i < buffer.length; i++) {
    const bytes = buffer[i];
    const str = bytes.toString(2).padStart(8, "0");
    result = str + "_" + result;
  }

  return result.slice(0, -1);
};
