import type { Matrix } from "./types.ts";

export class Graph {
  #matrix: Matrix<number>;

  constructor(matrix: Matrix<number>) {
    this.#matrix = matrix;
  }

  hasEdge(a: number, b: number): boolean {
    const aValue = this.#matrix.get(a, b);
    const bValue = this.#matrix.get(b, a);

    return aValue >= 0 && aValue === bValue;
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
}
