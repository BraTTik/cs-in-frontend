import { TreeMap } from "./tree-map.ts";

const treeMap = new TreeMap<string, number>();

treeMap.set('apple', 10);
treeMap.set('banana', 20);
treeMap.set("cherry", 30);

for (let entry of treeMap) {
  console.log(entry);
}
