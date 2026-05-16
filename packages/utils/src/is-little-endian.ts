export const isLittleEndian = () => {
  const buffer = new ArrayBuffer(64);
  const view = new DataView(buffer);

  view.setUint32(0, 12345);

  return new Uint32Array(buffer, 0, 1)[0] === 12345;
}
