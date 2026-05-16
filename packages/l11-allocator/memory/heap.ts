import { isLittleEndian } from "utils";
import { HeapBlock } from "./heap-block.ts";


export class Heap {
  #heapLow: number;
  #highHeap: number;
  #buffer: ArrayBuffer;

  constructor(buffer: ArrayBuffer, capacity: number) {
    this.#heapLow = buffer.byteLength - capacity;
    this.#buffer = buffer;
    this.#highHeap = buffer.byteLength;

    this.#createBlock(
      this.#highHeap,
      this.#highHeap - this.#heapLow - HeapBlock.HEADER_BYTE_LENGTH,
      false,
      0,
      0
    )
  }

  malloc(size: number) {
    let block = this.#findFreeBlock(size);
    if (block.size !== size) {
      block = this.#splitBlock(block, size);
    } else {
      block.used = true
    }

    return block.address - block.size - HeapBlock.HEADER_BYTE_LENGTH;
  }

  free(address: number, size: number) {
    const block = this.#getBlock(address + size + HeapBlock.HEADER_BYTE_LENGTH);
    if (block.size !== size) {
      throw new Error("Wrong size of heap block size");
    }
    block.used = false;
    this.#join(block);
  }

  #join(block: HeapBlock) {
    let next = block.next;
    while (next !== 0) {
      const nextBlock = this.#getBlock(next);
      if (nextBlock.used) break;
      next = nextBlock.next;
      this.#joinNext(block, nextBlock)
    }
    let prev = block.prev
    while(prev !== 0) {
      const prevBlock = this.#getBlock(prev);
      if (prevBlock.used) break;
      prev = prevBlock.prev;
      this.#joinPrev(block, prevBlock)
    }
  }

  #joinNext(block: HeapBlock, next: HeapBlock) {
    block.size = block.size + next.size + HeapBlock.HEADER_BYTE_LENGTH;
    block.next = next.next
  }

  #joinPrev(block: HeapBlock, prev: HeapBlock) {
    block.offset = prev.offset;
    block.size = block.size + prev.size + HeapBlock.HEADER_BYTE_LENGTH;
    block.address = prev.address;
    block.prev = prev.prev;
  }

  #splitBlock(block: HeapBlock, size: number): HeapBlock {
    const next = this.#createBlock(
      //[Next:[==S==][Header]] [Block:[==S==][Header]]
      block.address  - HeapBlock.HEADER_BYTE_LENGTH - size,
      block.size - size - HeapBlock.HEADER_BYTE_LENGTH,
      false,
      block.next,
      block.address
    );

    return this.#createBlock(block.address, size, true, next.address, block.prev)
  }


  // #isOOM(size: number) {
  //   return this.#occupied + size > this.#capacity;
  // }

  #findFreeBlock(size: number): HeapBlock {
    let block = this.#getBlock(this.#highHeap);
    while (block.used || block.size < size) {
      if (block.next === 0) {
        throw new RangeError("Out of Memory");
      }
      block = this.#getBlock(block.next);
    }

    return block;
  }

  #getBlock(offset: number) {
    return new HeapBlock(this.#buffer, offset - HeapBlock.HEADER_BYTE_LENGTH);
  }

  #createBlock(
    offset: number,
    size: number,
    used: boolean,
    next: number,
    prev: number,
  ) {
    const block = new HeapBlock(this.#buffer, offset - HeapBlock.HEADER_BYTE_LENGTH);
    block.size = size;
    block.next = next;
    block.prev = prev;
    block.used = used;
    block.address = offset;

    return block;
  }
}
