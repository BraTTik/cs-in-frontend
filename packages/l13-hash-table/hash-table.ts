import { LinkedList } from "./linked-list.ts";
import { type HashValue, hash } from "./hash.ts"

type Key = HashValue;

class HashKey {
  readonly type: string;
  readonly hash: number;
  readonly origin: Key;

  constructor(key: Key, capacity: number) {
    this.type = typeof key;
    this.hash = hash(key) % capacity;
    this.origin = key;
  }

  static isEqual(a: HashKey, b: HashKey) {
    return a.type === b.type && a.hash === b.hash && a.origin === b.origin;
  }
}

class TableValue<T> {
  readonly key: HashKey;
  value: T;

  constructor(key: Key, value: T, capacity: number) {
    this.key = new HashKey(key, capacity);
    this.value = value;
  }
}

export class HashTable<T> {
  private collection: (LinkedList<TableValue<T>> | null)[];
  private length = 0;

  private static readonly CAPACITY_THRESHOLD = 0.6;

  constructor(initialCapacity: number = 1024) {
    this.collection = Array.from({ length: initialCapacity }, () => null);
  }

  set(key: Key, value: T) {
    const val = new TableValue(key, value, this.collection.length);
    const hash = val.key.hash;
    if (!this.collection[hash]) {
      this.collection[hash] = new LinkedList<TableValue<T>>();
    }
    const list = this.collection[hash];
    const node = list.find(item => HashKey.isEqual(item.key, val.key));
    if (!node) {
      this.collection[hash]!.push(val);
      this.length++;
    } else {
      node.value = value;
    }

    this.#rehash();
    return this;
  }

  has(key: Key) {
    return Boolean(this.get(key));
  }

  get(key: Key): T | null {
    const k = new HashKey(key, this.collection.length);
    const iterator = this.iterator();

    for (let item of iterator) {
      if (HashKey.isEqual(item.key, k)) {
        return item.value
      }
    }

    return null;
  }

  delete(key: Key): T | null {
    const k = new HashKey(key, this.collection.length);
    const hash = k.hash;
    if (this.collection[hash]) {
      const val = this.collection[hash].delete((value) => HashKey.isEqual(value.key, k));
      if (val) {
        this.length--;
      }
      return val?.value ?? null;
    }

    return null;
  }

  #rehash() {
    if (this.length >= this.collection.length * HashTable.CAPACITY_THRESHOLD) {
      const values = this.collection;
      this.collection = new Array(values.length * 2);

      this.foreach(values, (val) => {
        this.set(val.key.origin, val.value);
      })
    }
  }

  *[Symbol.iterator]() {
    const iterator = this.iterator();
    for (const item of iterator) {
      yield [item.key.origin, item.value] as const;
    }
  }

  private *iterator() {
    for (const list of this.collection) {
      if (list != null) {
        for (let item of list) {
          yield item.value;
        }
      }
    }
  }

  private foreach(collection: (LinkedList<TableValue<T>> | null)[], callback: (val: TableValue<T>) => void) {
    for (const list of collection) {
      if (list != null) {
        for (let item of list) {
          callback(item.value);
        }
      }
    }
  }
}
