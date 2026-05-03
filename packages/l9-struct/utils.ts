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
