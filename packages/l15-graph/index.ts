import { Matrix } from "./matrix.ts"
import { Graph } from "./graph.ts"

const matrix = new Matrix(Uint16Array, 10, 10);

const graph = new Graph(matrix);

graph.addEdge(1, 2);
graph.addEdge(2, 3);
graph.addEdge(3, 4);
graph.addEdge(5, 6);
graph.addEdge(6, 7);
graph.addEdge(7, 8);

graph.addArc(3, 1);

let rows: number[] = []
let rowIndex = 0;

console.table(Array.from({ length: 11 }, (_, index) => index - 1).toString());

let i = 0;

matrix.forEach((value, row, col) => {
  i++;
  if (row === rowIndex) {
    rows.push(value);
  } else {
    rows.unshift(rowIndex);
    console.table(rows.toString());
    rowIndex = row;
    rows = [value];
  }
})

rows.unshift(rowIndex);
console.table(rows.toString());
console.log("total: ", i)

graph.traverse(1, (node, depth, weight) => {
  console.log(`Узел: ${node}, глубина: ${depth}, вес ребра: ${weight}`);
})
