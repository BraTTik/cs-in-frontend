//
// class Pointer {
//   private lengthView: Uint32Array;
//
//   get length(): number {
//     return this.lengthView[0];
//   }
//
//   constructor(private _ptr: number, private buffer: ArrayBuffer, free: () => void) {
//     this.lengthView = new Uint32Array(buffer, _ptr, 1);
//   }
//
//   deref() {
//     return this.buffer.slice(this.valueOf(), this.length + +this);
//   }
//
//   valueOf() {
//     return this._ptr + Uint32Array.BYTES_PER_ELEMENT;
//   }
//
//   [Symbol.toPrimitive](hint: string) {
//     if (hint === "string") {
//       return this.valueOf().toString(16)
//     }
//     return this.valueOf();
//   }
// }
//

export class Memory {

}
