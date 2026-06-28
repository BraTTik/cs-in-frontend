class TreeMapNode<K, T> {
  value: K;
  data: T;

  left: TreeMapNode<K, T> | null = null;
  right: TreeMapNode<K, T> | null = null;

  constructor(value: K, data: T) {
    this.value = value;
    this.data = data;
  }

  isLeaf() {
    return this.left == null && this.right == null;
  }

  hasOneChild() {
    return (this.left == null && Boolean(this.right)) || (this.right == null && Boolean(this.left));
  }
}

type Comparator<T> = (a: T, b: T) => number;

const defaultComparator = <T>(a: T, b: T) => {
  if (a === b) return 0;
  return a > b ? 1 : -1;
}

export class TreeMap<K, T> {
  private root: TreeMapNode<K, T> | null = null;
  private _size: number = 0;

  constructor(private comparator: Comparator<K> = defaultComparator) {
  }

  size() {
    return this._size;
  }

  get(key: K): T | null {
    let current = this.root;

    while(!this.#isNull(current)) {
      const compare = this.comparator(key, current.value);
      if (this.#isEqual(compare)) return current.data;

      if (this.#isLess(compare)) {
        current = current.left;
      } else {
        current = current.right;
      }
    }

    return null
  }

  set(key: K, value: T): void {
    const node = new TreeMapNode(key, value);
    if (!this.root) {
      this.root = node;
      this._size++;
      return;
    }

    let current = this.root!;

    while (current != null) {
      const compare = this.#compare(node, current);
      if (this.#isEqual(compare)) {
        current.data = node.data;
        return;
      }

      if (this.#isLess(compare)) {
        if (this.#isNull(current.left)) {
          this._size++;
          current.left = node;
          return;
        }

        current = current.left;
      } else {
        if (this.#isNull(current.right)) {
          this._size++;
          current.right = node;
          return;
        }

        current = current.right;
      }
    }
  }

  has(key: K): boolean {
    return !this.#isNull(this.get(key));
  }

  delete(key: K): T | null {
    let current = this.root;
    let parent: TreeMapNode<K, T> | null = null;
    let node: TreeMapNode<K, T> | null = null;

    let compare: number;

    while (!this.#isNull(current)) {
      compare = this.comparator(key, current.value);
      if (this.#isEqual(compare)) {
        node = current;
        break;
      }

      parent = current;
      if (this.#isGreater(compare)) {
        current = current.right;
      } else {
        current = current.left;
      }
    }

    if (node) {
      /** Листовой случай */
      if (node.isLeaf()) {
        if (!parent) {
          this.root = null;
        } else {
          if (this.#isGreater(compare!)) {
            parent.right = null;
          } else {
            parent.left = null;
          }
        }
      /** Один потомок */
      } else if  (node.hasOneChild()) {
        const child = node.left ?? node.right;
        if (!parent) {
          this.root = child;
        } else {
          if (this.#isGreater(compare!)) {
            parent.right = child;
          } else {
            parent.left = child;
          }
        }
      /** Два потомка */
      } else {
        let minNode: TreeMapNode<K, T> | null = node.right!;

        while (true) {
          if (minNode?.isLeaf()) {
            break;
          }

          minNode = minNode?.left ?? null;
        }

        minNode.left = node.left;
        minNode.right = node.right;

        if (!parent) {
          this.root = minNode;
        } else {
          if (this.#isGreater(compare!)) {
            parent.right = minNode;
          } else {
            parent.left = minNode;
          }
        }
      }

      this._size--;
    }

    return node?.data ?? null;
  }

  entries() {
    const r: [key: K, value: T][] = [];
    for (let entry of this) {
      r.push(entry);
    }
    return r;
  }

  keys() {
    return this.entries().map(([key]) => key);
  }

  values() {
    return this.entries().map(([_, value]) => value);
  }

  *[Symbol.iterator](): Iterator<[K, T]> {
    const stack: TreeMapNode<K, T>[] = [];
    let current = this.root;

    while (!this.#isNull(current) || stack.length > 0) {
      while (!this.#isNull(current)) {
        stack.push(current);
        current = current.left;
      }

      const value = stack.pop()!;
      yield [value.value, value.data];

      if (value.right) {
        current = value.right;
      }
    }
  }

  #compare(a: TreeMapNode<K, T>, b: TreeMapNode<K, T>): number {
    return this.comparator(a.value, b.value);
  }

  #isLess(result: number) {
    return result < 0;
  }

  #isGreater(result: number) {
    return result > 0;
  }

  #isEqual(result: number) {
    return result === 0;
  }

  #isNull(value: unknown): value is null {
    return value == null;
  }
}
