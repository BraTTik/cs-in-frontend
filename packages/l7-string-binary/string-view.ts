const encoder = new TextEncoder();
const decoder = new TextDecoder();

export function readString(buffer: ArrayBuffer, offset: number, bytes: number): string {
  return decoder.decode(new Uint8Array(buffer, offset, bytes));
}

export function writeString(input: string, buffer: ArrayBuffer, offset: number) {
  return encoder.encodeInto(input, new Uint8Array(buffer, offset));
}
