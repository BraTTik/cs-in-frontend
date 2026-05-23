import { Memory } from "./memory/memory.ts";
import { Rc } from "./rc.ts";

const mem = new Memory(100 * 1024, { stack: 10 * 1024 });

const buffer1 = new Uint8Array(new ArrayBuffer(16));
buffer1[1] = 42;

const buffer3 = new Uint8Array(new ArrayBuffer(16));
buffer3[1] = 2

{
  using pointer1 = mem.push(buffer1.buffer);
  console.log(pointer1.deref());
  pointer1.change(buffer3.buffer);
  console.log(pointer1.deref());
}


mem.push(new ArrayBuffer(128));


console.log(mem.pop()?.byteLength);
console.log(mem.pop()?.byteLength);

const pointer2 = mem.alloc(128);
const change2 = new Uint32Array(new ArrayBuffer(128))
change2[0] = 12345

pointer2.change(change2.buffer)
const pointer3 = mem.alloc(8);
const pointer4 = mem.alloc(4);
const pointer5 = mem.alloc(5 * 1024);

{
  using rcPointer = new Rc(mem.alloc(128));
  const bufferData = new Uint8Array(new ArrayBuffer(128));
  bufferData[0] = 255;
  rcPointer.change(bufferData.buffer);
  using cloned = rcPointer.clone();
  console.assert(new Uint8Array(cloned.deref())[0] === 255);
}

console.log(new Uint32Array(pointer2.deref())[0]);

pointer2.free();
pointer3.free();
pointer4.free();
pointer5.free();

try {
  pointer2.free()
} catch(error) {
  console.assert((error as Error).message === "Double free detected");
}
