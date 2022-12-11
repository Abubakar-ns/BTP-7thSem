import React, {Component} from 'react';
import Node from './Node/Node';
import {dijkstra} from '../Algorithms/djisktra';
import {AStar} from '../Algorithms/astar';
import {dfs} from '../Algorithms/dfs';
import {bfs} from '../Algorithms/bfs';
import {
    ThemeProvider,
    theme,
    ColorModeProvider,
    CSSReset,
    Box,
    Flex,
    IconButton,
    useColorMode,
    Heading,
    Text,
    FormControl,
    FormLabel,
    Input,
    Stack,
    Button,
    Textarea,
    Select,
    Checkbox, 
    CheckboxGroup,
    Table,
    VStack,
    HStack
  } from '@chakra-ui/react'
import './PathFindingVisualizer.css';

export default class PathfindingVisualizer extends Component {
   
  constructor(props) {
    
    super();
    this.state = {
      grid: [],
      START_NODE_ROW: 9,
      FINISH_NODE_ROW:6,
      START_NODE_COL: 3,
      FINISH_NODE_COL: 12,
      mouseIsPressed: false,
      ROW_COUNT: props.room*3+1,
      COLUMN_COUNT: props.room*3+1,
      MOBILE_ROW_COUNT: 10,
      MOBILE_COLUMN_COUNT: 20,
      isRunning: false,
      isStartNode: false,
      isFinishNode: false,
      isWallNode: false, // xxxxxxx
      currRow: 0,
      currCol: 0,
      isDesktopView: true,
    };

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.toggleIsRunning = this.toggleIsRunning.bind(this);
  }
 
  componentWillReceiveProps(nextProps) {
    this.setState({ data: nextProps.data });  
  }

  componentDidMount() {
    const grid = this.getInitialGrid();
    this.setState({grid});
  }

  toggleIsRunning() {
    this.setState({isRunning: !this.state.isRunning});
  }

  toggleView() {
    if (!this.state.isRunning) {
      this.clearGrid();
    //   this.clearWalls();
      const isDesktopView = !this.state.isDesktopView;
      let grid;
      if (isDesktopView) {
        grid = this.getInitialGrid(
          this.state.ROW_COUNT,
          this.state.COLUMN_COUNT,
        );
        this.setState({isDesktopView, grid});
      } else {
        if (
          this.state.START_NODE_ROW > this.state.MOBILE_ROW_COUNT ||
          this.state.FINISH_NODE_ROW > this.state.MOBILE_ROW_COUNT ||
          this.state.START_NODE_COL > this.state.MOBILE_COLUMN_COUNT ||
          this.state.FINISH_NODE_COL > this.state.MOBILE_COLUMN_COUNT
        ) {
          alert('Start & Finish Nodes Must Be within 10 Rows x 20 Columns');
        } else {
          grid = this.getInitialGrid(
            this.state.MOBILE_ROW_COUNT,
            this.state.MOBILE_COLUMN_COUNT,
          );
          this.setState({isDesktopView, grid});
        }
      }
    }
  }

  /******************** Set up the initial grid ********************/
  getInitialGrid = (
    rowCount = this.state.ROW_COUNT,
    colCount = this.state.COLUMN_COUNT,
  ) => {
    const initialGrid = [];
    for (let row = 0; row < rowCount; row++) {
      const currentRow = [];
      for (let col = 0; col < colCount; col++) {
        currentRow.push(this.createNode(row, col));
      }
      initialGrid.push(currentRow);
    }
    return initialGrid;
  };

  createNode = (row, col) => {
    let val=false;
    for(let i=1;i<this.state.ROW_COUNT;i+=3){
        for(let j=1;j<this.state.COLUMN_COUNT;j+=3){
            if((row==i && col==j) || (row==i && col==j+1) || (row==i+1 && col==j) || (row==i+1 && col==j+1)){
                val=true;
            }
        }
    }
    let finish=false;
    if(2*row==this.state.ROW_COUNT-1 && col==this.state.COLUMN_COUNT-1){
        finish=true;
    }
    if(row==this.state.ROW_COUNT-1 && 2*col==this.state.COLUMN_COUNT-1){
        finish=true;
    }
    return {
      row,
      col,
      isStart:
        row === this.state.START_NODE_ROW && col === this.state.START_NODE_COL,
      isFinish:finish,
      distance: Infinity,
      distanceToFinishNode:
        Math.abs(this.state.FINISH_NODE_ROW - row) +
        Math.abs(this.state.FINISH_NODE_COL - col),
      isVisited: false,
      isWall: val,
      previousNode: null,
      isNode: true,
    };
  };

  /******************** Control mouse events ********************/
  handleMouseDown(row, col) {
    if (!this.state.isRunning) {
      if (this.isGridClear()) {
        if (
          document.getElementById(`node-${row}-${col}`).className ===
          'node node-start'
        ) {
          this.setState({
            mouseIsPressed: true,
            isStartNode: true,
            currRow: row,
            currCol: col,
          });
        } else if (
          document.getElementById(`node-${row}-${col}`).className ===
          'node node-finish'
        ) {
          this.setState({
            mouseIsPressed: true,
            isFinishNode: true,
            currRow: row,
            currCol: col,
          });
        } else {
          const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
          this.setState({
            grid: newGrid,
            mouseIsPressed: true,
            isWallNode: true,
            currRow: row,
            currCol: col,
          });
        }
      } else {
        this.clearGrid();
      }
    }
  }

  isGridClear() {
    for (const row of this.state.grid) {
      for (const node of row) {
        const nodeClassName = document.getElementById(
          `node-${node.row}-${node.col}`,
        ).className;
        if (
          nodeClassName === 'node node-visited' ||
          nodeClassName === 'node node-shortest-path'
        ) {
          return false;
        }
      }
    }
    return true;
  }

  handleMouseEnter(row, col) {
    if (!this.state.isRunning) {
      if (this.state.mouseIsPressed) {
        const nodeClassName = document.getElementById(`node-${row}-${col}`)
          .className;
        if (this.state.isStartNode) {
          if (nodeClassName !== 'node node-wall') {
            const prevStartNode = this.state.grid[this.state.currRow][
              this.state.currCol
            ];
            prevStartNode.isStart = false;
            document.getElementById(
              `node-${this.state.currRow}-${this.state.currCol}`,
            ).className = 'node';

            this.setState({currRow: row, currCol: col});
            const currStartNode = this.state.grid[row][col];
            currStartNode.isStart = true;
            document.getElementById(`node-${row}-${col}`).className =
              'node node-start';
          }
          this.setState({START_NODE_ROW: row, START_NODE_COL: col});
        } else if (this.state.isFinishNode) {
          if (nodeClassName !== 'node node-wall') {
            const prevFinishNode = this.state.grid[this.state.currRow][
              this.state.currCol
            ];
            prevFinishNode.isFinish = false;
            document.getElementById(
              `node-${this.state.currRow}-${this.state.currCol}`,
            ).className = 'node';

            this.setState({currRow: row, currCol: col});
            const currFinishNode = this.state.grid[row][col];
            currFinishNode.isFinish = true;
            document.getElementById(`node-${row}-${col}`).className =
              'node node-finish';
          }
          this.setState({FINISH_NODE_ROW: row, FINISH_NODE_COL: col});
        } else if (this.state.isWallNode) {
          const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
          this.setState({grid: newGrid});
        }
      }
    }
  }

  handleMouseUp(row, col) {
    if (!this.state.isRunning) {
      this.setState({mouseIsPressed: false});
      if (this.state.isStartNode) {
        const isStartNode = !this.state.isStartNode;
        this.setState({isStartNode, START_NODE_ROW: row, START_NODE_COL: col});
      } else if (this.state.isFinishNode) {
        const isFinishNode = !this.state.isFinishNode;
        this.setState({
          isFinishNode,
          FINISH_NODE_ROW: row,
          FINISH_NODE_COL: col,
        });
      }
      this.getInitialGrid();
    }
  }

  handleMouseLeave() {
    if (this.state.isStartNode) {
      const isStartNode = !this.state.isStartNode;
      this.setState({isStartNode, mouseIsPressed: false});
    } else if (this.state.isFinishNode) {
      const isFinishNode = !this.state.isFinishNode;
      this.setState({isFinishNode, mouseIsPressed: false});
    } else if (this.state.isWallNode) {
      const isWallNode = !this.state.isWallNode;
      this.setState({isWallNode, mouseIsPressed: false});
      this.getInitialGrid();
    }
  }

  /******************** Clear Board/Walls ********************/

  clearGrid() {
    if (!this.state.isRunning) {
      const newGrid = this.state.grid.slice();
      for (const row of newGrid) {
        for (const node of row) {
          let nodeClassName = document.getElementById(
            `node-${node.row}-${node.col}`,
          ).className;
          if (
            nodeClassName !== 'node node-start' &&
            nodeClassName !== 'node node-finish' &&
            nodeClassName !== 'node node-wall'
          ) {
            document.getElementById(`node-${node.row}-${node.col}`).className =
              'node';
            node.isVisited = false;
            node.distance = Infinity;
            node.distanceToFinishNode =
              Math.abs(this.state.FINISH_NODE_ROW - node.row) +
              Math.abs(this.state.FINISH_NODE_COL - node.col);
          }
          if (nodeClassName === 'node node-finish') {
            node.isVisited = false;
            node.distance = Infinity;
            node.distanceToFinishNode = 0;
          }
          if (nodeClassName === 'node node-start') {
            node.isVisited = false;
            node.distance = Infinity;
            node.distanceToFinishNode =
              Math.abs(this.state.FINISH_NODE_ROW - node.row) +
              Math.abs(this.state.FINISH_NODE_COL - node.col);
            node.isStart = true;
            node.isWall = false;
            node.previousNode = null;
            node.isNode = true;
          }
        }
      }
    }
  }

  clearWalls() {
    if (!this.state.isRunning) {
      const newGrid = this.state.grid.slice();
      for (const row of newGrid) {
        for (const node of row) {
          let nodeClassName = document.getElementById(
            `node-${node.row}-${node.col}`,
          ).className;
          if (nodeClassName === 'node node-wall') {
            document.getElementById(`node-${node.row}-${node.col}`).className =
              'node';
            node.isWall = false;
          }
        }
      }
    }
  }

  /******************** Create Animations ********************/
  visualize(algo) {
    if (!this.state.isRunning) {
      this.clearGrid();
      this.toggleIsRunning();
      const {grid} = this.state;
      const startNode =
        grid[this.state.START_NODE_ROW][this.state.START_NODE_COL];
    const finishNode1 =
        grid[(this.state.ROW_COUNT-1)/2][this.state.COLUMN_COUNT-1];
    const finishNode2 =
        grid[this.state.ROW_COUNT-1][(this.state.COLUMN_COUNT-1)/2];
      let visitedNodesInOrder;
      switch (algo) {
        case 'Dijkstra':
          visitedNodesInOrder = dijkstra(grid, startNode, finishNode1,finishNode2);
          break;
        case 'AStar':
            visitedNodesInOrder = AStar(grid, startNode, finishNode1,finishNode2);
          break;
        case 'BFS':
            visitedNodesInOrder = bfs(grid, startNode, finishNode1,finishNode2);
          break;
        default:
          // should never get here
          break;
      }
      const nodesInShortestPathOrder1 = getNodesInShortestPathOrder(finishNode1);
      const nodesInShortestPathOrder2 = getNodesInShortestPathOrder(finishNode2);
      nodesInShortestPathOrder1.push('end');
      nodesInShortestPathOrder2.push('end');
      if(nodesInShortestPathOrder2>nodesInShortestPathOrder1){
        this.animate(visitedNodesInOrder, nodesInShortestPathOrder1);
      }
      else{
        this.animate(visitedNodesInOrder, nodesInShortestPathOrder2);
      }
      
    }
  }

  animate(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        const nodeClassName = document.getElementById(
          `node-${node.row}-${node.col}`,
        ).className;
        if (
          nodeClassName !== 'node node-start' &&
          nodeClassName !== 'node node-finish'
        ) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            'node node-visited';
        }
      }, 10 * i);
    }
  }

  /******************** Create path from start to finish ********************/
  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      if (nodesInShortestPathOrder[i] === 'end') {
        setTimeout(() => {
          this.toggleIsRunning();
        }, i * 50);
      } else {
        setTimeout(() => {
          const node = nodesInShortestPathOrder[i];
          const nodeClassName = document.getElementById(
            `node-${node.row}-${node.col}`,
          ).className;
          if (
            nodeClassName !== 'node node-start' &&
            nodeClassName !== 'node node-finish'
          ) {
            document.getElementById(`node-${node.row}-${node.col}`).className =
              'node node-shortest-path';
          }
        }, i * 40);
      }
    }
  }

  render() {
    const {grid, mouseIsPressed} = this.state;
    return (
      <HStack justifyContent='center'>
        <HStack>
        <Table
          className="grid-container"
          onMouseLeave={() => this.handleMouseLeave()}>
          <tbody className="grid">
            {grid.map((row, rowIdx) => {
              return (
                <tr key={rowIdx}>
                  {row.map((node, nodeIdx) => {
                    const {row, col, isFinish, isStart, isWall} = node;
                    return (
                      <Node
                        key={nodeIdx}
                        col={col}
                        isFinish={isFinish}
                        isStart={isStart}
                        isWall={isWall}
                        mouseIsPressed={mouseIsPressed}
                        onMouseDown={(row, col) =>
                          this.handleMouseDown(row, col)
                        }
                        onMouseEnter={(row, col) =>
                          this.handleMouseEnter(row, col)
                        }
                        onMouseUp={() => this.handleMouseUp(row, col)}
                        row={row}></Node>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </Table>
        </HStack>
        <VStack justifyContent="center">
        <Button
           backgroundColor={"#0e8566"} 
           color={"white"}
          onClick={() => this.clearGrid()}>
          Clear Grid
        </Button>
        <Button
           backgroundColor={"#0e8566"} 
           color={"white"}
          onClick={() => this.visualize('Dijkstra')}>
          Dijkstra's
        </Button>
        <Button
           backgroundColor={"#0e8566"} 
           color={"white"}
          onClick={() => this.visualize('AStar')}>
          A*
        </Button>
        <Button
         backgroundColor={"#0e8566"} 
         color={"white"}
          onClick={() => this.visualize('BFS')}
          >
          Breadth First Search
        </Button>
        </VStack>
      </HStack>
    );
  }
}

/******************** Create Walls ********************/
const getNewGridWithWallToggled = (grid, row, col) => {
  // mouseDown starts to act strange if I don't make newGrid and work off of grid instead.
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  if (!node.isStart && !node.isFinish && node.isNode) {
    const newNode = {
      ...node,
      isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
  }
  return newGrid;
};

// Backtracks from the finishNode to find the shortest path.
// Only works when called after the pathfinding methods.
function getNodesInShortestPathOrder(finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}