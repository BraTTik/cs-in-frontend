
interface Heap<T, D> {
  push(value: T, data: D): void;
  pop(): D | null;
}

type Comparator<T> = (a: T, b: T) => number

const defaultComparator = <T>(a: T, b: T) => {
  if (a === b) return 0;
  return a > b ? 1 : -1;
}

class HeapNode<T, D> {
  value: T;
  data: D;

  constructor(value: T, data: D) {
    this.value = value;
    this.data = data;
  }
}

export class BinaryHeap<T, D> implements Heap<T, D> {
  #comparator: Comparator<T>;
  #nodes: HeapNode<T, D>[] = [];

  constructor(comparator: Comparator<T> = defaultComparator) {
    this.#comparator = comparator;
  }

  push(value: T, data: D) {
    const node = new HeapNode(value, data);
    this.#nodes.push(node);
    let currentIndex = this.#nodes.length - 1;

    while (true) {
      const parentIndex = this.#parent(currentIndex);
      const parent = this.#nodes[parentIndex];
      if (parent && this.#comparator(node.value, parent.value) < 0) {
        this.#swap(currentIndex, parentIndex);
        currentIndex = parentIndex;
        continue;
      }
      break;
    }
  }

  pop(): D | null {
    if (this.#nodes.length === 0) return null;
    if (this.#nodes.length === 1) {
      return this.#nodes.pop()!.data;
    }
    this.#swap(0, this.#nodes.length - 1);
    const val = this.#nodes.pop();
    let currentIndex = 0;
    const node = this.pick();

    if (!node) return null;

    const [nodeValue] = node;

    while(true) {
      const leftIndex = this.#left(currentIndex);
      const rightIndex = this.#right(currentIndex);

      const pivot = this.#getPivot(leftIndex, rightIndex);
      if (!pivot) break;

      const [pivotIndex, pivotValue] = pivot;

      if (this.#comparator(nodeValue, pivotValue) > 0) {
        this.#swap(currentIndex, pivotIndex);
        currentIndex = pivotIndex;
      } else {
        break;
      }
    }

    return val?.data ?? null;
  }

  pick(): [value: T, data: D] | null {
    const node = this.#nodes[0];

    return node ? [node.value, node.data] : null;
  }

  #getPivot(left: number, right: number): [index: number, value: T] | null {
    const l = this.#nodes[left];
    const r = this.#nodes[right];
    if (!r && !l) return null;
    if (!r && l) return [left, l.value];
    const compare = this.#comparator(l.value, r.value);
    return compare > 0 ? [left, l.value] : [right, r.value];
  }

  #swap(a: number, b: number) {
    [this.#nodes[a], this.#nodes[b]] = [this.#nodes[b], this.#nodes[a]];
  }

  #left(index: number): number {
    return index * 2 + 1;
  }

  #right(index: number): number {
    return index * 2 + 2;
  }

  #parent(index: number): number {
    return Math.floor((index - 1) / 2);
  }
}
