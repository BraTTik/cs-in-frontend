interface TrieNode {
  isWord: boolean;
  char: string;
  children: Map<string, number>;
}

export class Trie {
  #buffer: Array<TrieNode> = [{ char: "", isWord: false, children: new Map() }];

  addWord(str: string) {
    let cursor  = 0;
    for (let char of str) {
      const cur = this.#buffer[cursor]
      if (cur.children.has(char)) {
        cursor = cur.children.get(char)!;
      } else {
        const node: TrieNode = { char, isWord: false, children: new Map() };
        cursor = this.#buffer.push(node) - 1;
        cur.children.set(char, cursor);
      }
    }
    this.#buffer[cursor].isWord = true;
  }

  go(char: string) {
    return new TrieWalker(0, this.#buffer).go(char)
  }
}

class TrieWalker {
  #start = 0;
  #buffer: TrieNode[];

  constructor(start: number, buffer: TrieNode[]) {
    this.#start = start;
    this.#buffer = buffer;
  }

  go(char: string) {
    const s = this.#start;
    if (s === -1 || this.#buffer[s] == null) {
      return this;
    } else {
      return new TrieWalker(this.#buffer[s].children.get(char) ?? -1, this.#buffer);
    }
  }

  isWord() {
    return this.#buffer[this.#start]?.isWord || false;
  }
}
