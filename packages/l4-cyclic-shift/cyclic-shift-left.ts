export const cyclicShiftLeft = (num: number, step: number) => {
  for (let i = 0; i < step; i++) {
    const leftBitMask = num >>> 31;
    num = num << 1;
    num = num | leftBitMask;
  }

  return num;
}
