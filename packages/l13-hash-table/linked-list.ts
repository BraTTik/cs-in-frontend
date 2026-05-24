class Node<T> {
  value: T;
  next: Node<T> | null = null;
  prev: Node<T> | null = null;

  constructor(value: T) {
    this.value = value;
  }
}

export class LinkedList<T> {
  private start: Node<T> | null = null;
  private last: Node<T> | null = null;

  push(value: T) {
    const node = new Node(value);
    if (!this.start) {
      this.start = node;
      this.last = node;
    } else {
      this.last!.next = node;
      node.prev = this.last;
      this.last = node;
    }
  }

  find(callback: (value: T) => boolean): T | null {
    if (!this.start) {
      return null;
    }
    for (let node of this) {
      if (callback(node.value)) {
        return node.value;
      }
    }

    return null
  }

  delete(callback: (value: T) => boolean): T | null {
    if (!this.start) {
      return null;
    }

    for (let node of this) {
      if (callback(node.value)) {
        const prev = node.prev;
        const next = node.next;
        if (prev) {
          prev.next = next;
        } else {
          this.start = next;
        }
        if (next) {
          next.prev = prev;
        } else {
          this.last = prev;
        }
        node.next = null;
        node.prev = null;

        return node.value;
      }
    }

    return null;
  }

  *[Symbol.iterator](): Iterator<Node<T>> {
    let current: Node<T> | null = this.start;
    while (current != null) {
      yield current
      current = current.next;
    }
  }
}
