import React, {useState, useEffect} from 'react';
import Node from './Node/Node';
import {dijkstra, getNodesInShortestPathOrder} from '../algorithms/dijkstra';

import './PathfindingVisualizer.css';

//Green Node => (0,0)
const START_NODE_ROW = 0;
const START_NODE_COL = 0;

//Red Node => (n-1, n-1)
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 14;

const PathFinder = () => {
  //Maintain grid state
  const [grid, setGrid] = useState([]);

  //Setup initial state of the grid
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getInitialGrid = () => {
    const grid = [];
    for (let row = 0; row < 11; row++) {
      const currentRow = [];
      for (let col = 0; col < 15; col++) {
        currentRow.push(createNode(col, row));
      }
      grid.push(currentRow);
    }
    return grid;
  };

  // Utility function for getInitialGrid, to initialize a single node
  const createNode = (col, row) => {
    return {
      col,
      row,
      isStart: row === START_NODE_ROW && col === START_NODE_COL,
      isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
      distance: Infinity,
      isVisited: false,
      isWall: false,
      previousNode: null,
    };
  };

  //Toggle behavior of a node to act as a wall or not act as a wall
  const getNewGridWithWallToggled = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
      ...node,
      isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
    return newGrid;
  };

  //Set grid when component mounts
  useEffect(() => {
    const grid = getInitialGrid();
    setGrid(grid);
  }, [getInitialGrid]);

  //Handle wall creation
  function handleClick(row, col) {
    const newGrid = getNewGridWithWallToggled(grid, row, col);
    setGrid(newGrid);
  }

  // First animation function
  function animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          animateShortestPath(nodesInShortestPathOrder);
        }, 20 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';
      }, 20 * i);
    }
  }

  //Second animation function
  function animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-shortest-path';
      }, 100 * i);
    }
  }

  //Do this when the button visualize is clicked
  function visualizeDijkstra() {
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];

    //Get relevant information
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);

    //Perform visual animation
    animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }
  //Grid component
  return (
    <>
      <br /> <br />
      <button className="btn" onClick={() => visualizeDijkstra()}>
        Visualize Dijkstra's Algorithm
      </button>
      <div className="grid">
        {grid.map((row, i) => {
          return (
            <div key={i}>
              {row.map((node, j) => {
                const {row, col, isFinish, isStart, isWall} = node;
                return (
                  <Node
                    key={j}
                    col={col}
                    isFinish={isFinish}
                    isStart={isStart}
                    isWall={isWall}
                    onMouseClick={() => {
                      handleClick(row, col);
                    }}
                    row={row}></Node>
                );
              })}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default PathFinder;
