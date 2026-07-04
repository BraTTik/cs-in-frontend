import { Trie } from "./trie.ts";

const trie = new Trie();

trie.addWord("мясо");
trie.addWord("мясорубка");
trie.addWord("мир");

console.assert(trie.go("м").go("я").go("с").go("о").isWord());
console.assert(trie.go("м").go("и").go("р").isWord());
console.assert(!trie.go("м").go("и").go("г").isWord());
