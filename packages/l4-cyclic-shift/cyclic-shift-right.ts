export const cyclicShiftRight = (num: number, step: number) => {
  for (let i = 0; i < step; i++) {
    const rightBitMask = num << 31
    num = num >>> 1
    num = num | rightBitMask
  }

  return num;
}
