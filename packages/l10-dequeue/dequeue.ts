
type ViewCtor<T> = new (capacity: number) => ArrayLike<T>;

interface ArrayLike<T> {
  readonly length: number;
  [p: number]: T
}

type Node<T> = {
  prev: Node<T> | null;
  next: Node<T> | null;
  view: ArrayLike<T>;
}

export class Dequeue<T> {
  #View: ViewCtor<T>;
  #capacity: number;
  #length: number;
  #startNode: Node<T>;
  #endNode: Node<T>;
  #unshiftIndex: number;
  #pushIndex: number;

  get length() {
    return this.#length;
  }

  constructor(view: ViewCtor<T>, capacity: number) {
    this.#View = view;
    this.#capacity = capacity;
    this.#length = 0;
    const initial = this.#createNode(this.#View, this.#capacity);
    this.#startNode = initial;
    this.#endNode = initial;
    this.#pushIndex = Math.floor(capacity / 2);
    this.#unshiftIndex =  this.#pushIndex - 1;
    this.#unshiftIndexNormalize();
  }

  unshift(value: T): number {
    this.#startNode.view[this.#unshiftIndex] = value;
    this.#unshiftIndex--;
    this.#unshiftIndexNormalize();
    return ++this.#length;
  }

  shift(): T | undefined {
    if (!this.#length) return;
    this.#unshiftIndex++;
    this.#unshiftIndexNormalize();
    const value = this.#startNode.view[this.#unshiftIndex];
    this.#length--;
    return value;
  }

  push(value: T): number {
    this.#endNode.view[this.#pushIndex] = value;
    this.#pushIndex++;
    console.log("before", this.#pushIndex, this.#endNode);
    this.#normalizePushIndex();
    console.log("after", this.#pushIndex, this.#endNode);
    console.log("_____________")
    return ++this.#length;
  }

  pop(): T | undefined {
    if (!this.#length) return;
    this.#pushIndex--;
    this.#normalizePushIndex();
    const value = this.#endNode.view[this.#pushIndex];
    this.#length--;
    return value;
  }

  #normalizePushIndex() {
    if (this.#shouldPrev(this.#pushIndex)) {
      this.#endNode = this.#getPrevNode(this.#endNode);
      this.#pushIndex = this.#normalizeIndex(this.#pushIndex);
    } else if (this.#shouldNext(this.#pushIndex)) {
      this.#endNode = this.#getNextNode(this.#endNode);
      this.#pushIndex = this.#normalizeIndex(this.#pushIndex);
    }
  }

  #unshiftIndexNormalize() {
    if (this.#shouldPrev(this.#unshiftIndex)) {
      this.#startNode = this.#getPrevNode(this.#startNode);
      this.#unshiftIndex = this.#normalizeIndex(this.#unshiftIndex);
    } else if (this.#shouldNext(this.#unshiftIndex)) {
      this.#startNode = this.#getNextNode(this.#startNode);
      this.#unshiftIndex = this.#normalizeIndex(this.#unshiftIndex);
    }
  }

  #shouldNext(index: number) {
    return index >= this.#capacity;
  }

  #shouldPrev(index: number) {
    return index < 0;
  }

  #normalizeIndex(index: number) {
    if (index < 0) {
      return index + this.#capacity
    }
    return index % this.#capacity;
  }

  #getPrevNode(node: Node<T>): Node<T> {
    let prev = node.prev;
    if (prev == null) {
      prev = this.#createNode(this.#View, this.#capacity, { next: node });
      node.prev = prev
    }

    return prev;
  }

  #getNextNode(node: Node<T>): Node<T> {
    let next = node.next;
    if (next == null) {
      next = this.#createNode(this.#View, this.#capacity, { prev: node });
      node.next = next;
    }

    return next
  }

  #createNode(View: ViewCtor<T>, capacity: number, options?: {
    prev?: Node<T> | null;
    next?: Node<T> | null;
  }): Node<T> {
    return {
      prev: options?.prev ?? null,
      next: options?.next ?? null,
      view: new View(capacity),
    }
  }
}
