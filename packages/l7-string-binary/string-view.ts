export function readString(buffer: ArrayBuffer, offset: number, bytes: number): string {
  return new TextDecoder().decode(buffer.slice(offset, offset + bytes));
}

export function writeString(input: string, buffer: ArrayBuffer, offset: number) {
  return new TextEncoder().encodeInto(input, new Uint8Array(buffer, offset));
}
