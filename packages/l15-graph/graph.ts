import type { Matrix } from "./types.ts";

export class Graph {
  #matrix: Matrix<number>;

  constructor(matrix: Matrix<number>) {
    this.#matrix = matrix;
  }

  hasEdge(a: number, b: number): boolean {
    const aValue = this.#matrix.get(a, b);
    const bValue = this.#matrix.get(b, a);

    return aValue > 0 && aValue === bValue;
  }

  hasArc(a:number, b:number): boolean {
    return this.#matrix.get(a, b) > 0
  }

  addEdge(a: number, b: number, weight: number = 1) {
    this.#matrix.set(a, b, weight);
    this.#matrix.set(b, a, weight);
  }

  removeEdge(a: number, b: number) {
    this.#matrix.set(a, b, 0);
    this.#matrix.set(b, a, 0);
  }

  addArc(a: number, b: number, weight: number = 1) {
    this.#matrix.set(a, b, weight);
  }

  removeArc(a: number, b: number) {
    this.#matrix.set(a, b, 0);
  }

  traverse(start: number, callback: (node: number, depth: number, weight: number) => void) {
    const visited: Set<number> = new Set();

    const queue: {node: number, depth: number}[] = [{ node: start, depth: 0 }];

    callback(start, 0, 0);

    while (queue.length > 0) {
      const { node, depth } = queue.shift()!;
      visited.add(node);
      for (let i = 0; i < this.#matrix.width; i++) {
        if (node === i || visited.has(i)) continue;
        if (this.hasArc(node, i) || this.hasEdge(node, i)) {
          callback(i, depth + 1, this.#matrix.get(node, i));
          queue.push({ node: i, depth: depth + 1 });
        }
      }
    }
  }
}
