import React, { Component } from 'react';
import dijkstra from './dijkstra';
import { ROWSIZE, COLSIZE, GRIDWIDTH } from './consts';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import AdjustIcon from '@material-ui/icons/Adjust';
import Snackbar from '@material-ui/core/Snackbar';

import './Visualizer.css';

function Node(props) {
    const {
        row,
        col,
        nodeSize,
        isStart,
        isFinish,
        isWall,
        onMouseDown,
        onMouseEnter,
        onMouseUp,
    } = props;

    const isStartOrFinish = isFinish ? (
        <AdjustIcon style={{ width: `${nodeSize}vw` }} />
    ) : isStart ? (
        <KeyboardArrowRightIcon style={{ width: `${nodeSize}vw` }} />
    ) : (
        ''
    );

    const wallClass = isWall ? 'node-wall' : '';

    return (
        <div
            id={`node-${row}-${col}`}
            style={{ width: `${nodeSize}vw`, height: `${nodeSize}vw` }}
            className={`node ${wallClass}`}
            onMouseDown={() => onMouseDown(row, col)}
            onMouseEnter={() => onMouseEnter(row, col)}
            onMouseUp={() => onMouseUp()}
        >
            {isStartOrFinish}
        </div>
    );
}

export default class Visualizer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            grid: [],
            startNode: null,
            endNode: null,
            mouseIsPressed: false,
            open: false,
        };
    }

    theme = createMuiTheme({
        palette: {
            primary: {
                main: '#80cbc4',
            },
            secondary: {
                main: '#bbdefb',
            },
        },
    });

    handleOpen = () => {
        this.setState({
            open: true,
        });
    };

    handleClose = () => {
        this.setState({
            open: false,
        });
    };

    animateDijkstra(grid, startNode, endNode) {
        const { visited, sPath } = dijkstra(grid, startNode, endNode);
        const n = visited.length;
        for (let i = 0; i < n; i++) {
            setTimeout(() => {
                const node = visited[i];
                document.getElementById(
                    `node-${node.row}-${node.col}`
                ).className = 'node node-visited';
            }, 7 * i);
        }
        const m = sPath.length;
        for (let i = 0; i < m; i++) {
            setTimeout(() => {
                const node = sPath[i];
                document.getElementById(
                    `node-${node.row}-${node.col}`
                ).className = 'node node-path';
            }, 7 * n + 50 * i);
        }
    }
    componentDidMount() {
        this.setInitialState();
        this.handleOpen();
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
                    isWall: false,
                };
            }
        }
        let startNode = grid[10][7];
        let endNode = grid[10][37];
        startNode.isStart = true;
        endNode.isFinish = true;
        startNode.dst = 0;
        this.setState({ grid, startNode, endNode });
    }

    clearGrid() {
        this.state.grid.map((row, rowIdx) =>
            row.map(
                (col, colIdx) =>
                    (document.getElementById(
                        `node-${rowIdx}-${colIdx}`
                    ).className = 'node')
            )
        );
        document.getElementById(`node-${10}-${15}`).className = 'node';
        document.getElementById(`node-${10}-${35}`).className = 'node';
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
        const nodeSize = GRIDWIDTH / COLSIZE;
        return (
            <ThemeProvider theme={this.theme}>
                <div>
                    <AppBar position="static">
                        <Toolbar style={{ margin: '0.2em' }}>
                            <div style={{ width: '20vw' }}>
                                <Typography variant="h5">
                                    Dijkstra Visualizer
                                </Typography>
                            </div>

                            <Grid container spacing={3} justify="center">
                                <Grid item>
                                    <Button
                                        style={{ width: '13vw' }}
                                        onClick={() =>
                                            this.animateDijkstra(
                                                grid,
                                                startNode,
                                                endNode
                                            )
                                        }
                                        variant="contained"
                                        color="secondary"
                                    >
                                        Play
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button
                                        style={{ width: '13vw' }}
                                        onClick={() => this.clearGrid()}
                                        variant="contained"
                                        color="secondary"
                                    >
                                        Clear Grid
                                    </Button>
                                </Grid>
                            </Grid>
                            <div style={{ width: '20vw' }}></div>
                        </Toolbar>
                    </AppBar>
                    <div className="grid">
                        {grid.map((row, rowIdx) => (
                            <div
                                className="grid-row"
                                style={{ width: `${GRIDWIDTH}vw` }}
                                key={rowIdx}
                            >
                                {row.map((node, nodeIdx) => (
                                    <Node
                                        key={nodeIdx}
                                        row={node.row}
                                        col={node.col}
                                        nodeSize={nodeSize}
                                        isStart={node.isStart}
                                        isFinish={node.isFinish}
                                        isVisited={node.isVisited}
                                        isWall={node.isWall}
                                        onMouseDown={(row, col) =>
                                            this.handleMouseDown(row, col)
                                        }
                                        onMouseEnter={(row, col) =>
                                            this.handleMouseEnter(row, col)
                                        }
                                        onMouseUp={() => this.handleMouseUp()}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
                <Snackbar
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    open={this.state.open}
                    onClose={this.handleClose}
                    message="Click on the grid to add a wall, then click Play to visualize how the algorithm finds the shortest path!"
                />
            </ThemeProvider>
        );
    }
}
