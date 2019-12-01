import PriorityQueue from "tinyqueue";
import { ROWSIZE, COLSIZE } from "./consts";

export default function dijkstra(grid, startNode, endNode) {
  const visited = [];
  const allNodes = getAllNodes(grid);
  const newStart = allNodes[startNode.row][startNode.col];
  const newEnd = allNodes[endNode.row][endNode.col];

  let pq = new PriorityQueue([], function(a, b) {
    return a.dst - b.dst;
  });
  pq.push(newStart);

  while (pq.peek() !== undefined) {
    let curr = pq.pop();
    curr.isVisited = true;
    visited.push(curr);

    if (curr.row === endNode.row && curr.col === endNode.col) break;

    checkNeighbor(allNodes, curr, pq, curr.row + 1, curr.col);
    checkNeighbor(allNodes, curr, pq, curr.row, curr.col + 1);
    checkNeighbor(allNodes, curr, pq, curr.row - 1, curr.col);
    checkNeighbor(allNodes, curr, pq, curr.row, curr.col - 1);
  }
  const sPath = shortestPath(newStart, newEnd);
  return { visited, sPath };
}

function checkNeighbor(grid, previous, pq, row, col) {
  if (row < 0 || row >= ROWSIZE || col < 0 || col >= COLSIZE) return;

  let curr = grid[row][col];
  if (curr.isVisited || curr.isWall) return;

  let newDistance = previous.dst + curr.weight;
  if (curr.dst > newDistance) {
    pq.push(curr);
    curr.prev = previous;
    curr.dst = newDistance;
  }
}

function shortestPath(startNode, endNode) {
  let path = [];
  let curr = endNode;
  path.push(curr);
  while (curr !== startNode && curr.prev !== null) {
    path.push(curr.prev);
    curr = curr.prev;
  }
  return path.reverse();
}

function getAllNodes(grid) {
  const nodes = [];
  for (const row of grid) {
    const rows = [];
    for (const node of row) {
      let newNode = { ...node };
      rows.push(newNode);
    }
    nodes.push(rows);
  }
  return nodes;
}
