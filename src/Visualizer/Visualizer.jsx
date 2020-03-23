import React, { Component } from "react";
import dijkstra from "./dijkstra";
import { ROWSIZE, COLSIZE } from "./consts";

import "./Visualizer.css";

function Node(props) {
  const {
    row,
    col,
    isStart,
    isFinish,
    isWall,
    onMouseDown,
    onMouseEnter,
    onMouseUp
  } = props;

  const extraClassName = isFinish
    ? "node-finish"
    : isStart
      ? "node-start"
      : isWall
        ? "node-wall"
        : "";

  return (
    <div
      id={`node-${row}-${col}`}
      className={`node ${extraClassName}`}
      onMouseDown={() => onMouseDown(row, col)}
      onMouseEnter={() => onMouseEnter(row, col)}
      onMouseUp={() => onMouseUp()}
    ></div>
  );
}

export default class Visualizer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: [],
      startNode: null,
      endNode: null,
      mouseIsPressed: false
    };
  }

  animateDijkstra(grid, startNode, endNode) {
    const { visited, sPath } = dijkstra(grid, startNode, endNode);
    const n = visited.length;
    for (let i = 0; i < n; i++) {
      setTimeout(() => {
        const node = visited[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-visited";
      }, 7 * i);
    }
    const m = sPath.length;
    for (let i = 0; i < m; i++) {
      setTimeout(() => {
        const node = sPath[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-path";
      }, 7 * n + 50 * i);
    }
  }
  componentDidMount() {
    this.setInitialState();
  }

  setInitialState() {
    const grid = [];
    for (let i = 0; i < ROWSIZE; i++) {
      grid[i] = [];
      for (let j = 0; j < COLSIZE; j++) {
        grid[i][j] = {
          row: i,
          col: j,
          isStart: false,
          isFinish: false,
          isVisited: false,
          weight: 1,
          dst: Infinity,
          prev: null,
          isWall: false
        };
      }
    }
    let startNode = grid[10][15];
    let endNode = grid[10][35];
    startNode.isStart = true;
    endNode.isFinish = true;
    startNode.dst = 0;
    this.setState({ grid, startNode, endNode });
  }

  clearGrid() {
    this.state.grid.map((row, rowIdx) =>
      row.map(
        (col, colIdx) =>
          (document.getElementById(`node-${rowIdx}-${colIdx}`).className =
            "node")
      )
    );
    document.getElementById(`node-${10}-${15}`).className = "node node-start";
    document.getElementById(`node-${10}-${35}`).className = "node node-finish";
    this.setInitialState();
  }

  handleMouseDown(row, col) {
    const newGrid = this.state.grid;
    newGrid[row][col].isWall = true;
    this.setState({ newGrid, mouseIsPressed: true });
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    const newGrid = this.state.grid;
    newGrid[row][col].isWall = true;
    this.setState({ newGrid });
  }

  handleMouseUp() {
    this.setState({ mouseIsPressed: false });
  }

  render() {
    const { grid, startNode, endNode } = this.state;
    return (
      <div>
        <div className="buttons">
          <button
            onClick={() => this.animateDijkstra(grid, startNode, endNode)}
          >
            Visualize Dijkstra
          </button>

          <button onClick={() => this.clearGrid()}>Clear Grid</button>
        </div>
        <div className="grid">
          {grid.map((row, rowIdx) => (
            <div className="grid-row" key={rowIdx}>
              {row.map((node, nodeIdx) => (
                <Node
                  key={nodeIdx}
                  row={node.row}
                  col={node.col}
                  isStart={node.isStart}
                  isFinish={node.isFinish}
                  isVisited={node.isVisited}
                  isWall={node.isWall}
                  onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                  onMouseEnter={(row, col) => this.handleMouseEnter(row, col)}
                  onMouseUp={() => this.handleMouseUp()}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }
}
