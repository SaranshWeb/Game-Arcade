import React, { useEffect, useState } from "react";
import "./Game2048.css"; // Optional: for styling

const SIZE = 4;

function createEmptyBoard() {
  return Array(SIZE).fill().map(() => Array(SIZE).fill(0));
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function addRandomTile(board) {
  let empty = [];
  board.forEach((row, i) => row.forEach((cell, j) => {
    if (cell === 0) empty.push([i, j]);
  }));
  if (empty.length === 0) return board;
  const [i, j] = empty[getRandomInt(empty.length)];
  board[i][j] = Math.random() < 0.9 ? 2 : 4;
  return board;
}

function clone(board) {
  return board.map(row => row.slice());
}

function slide(row) {
  let newRow = row.filter(v => v);
  for (let i = 0; i < newRow.length - 1; i++) {
    if (newRow[i] === newRow[i + 1]) {
      newRow[i] *= 2;
      newRow[i + 1] = 0;
    }
  }
  newRow = newRow.filter(v => v);
  while (newRow.length < SIZE) newRow.push(0);
  return newRow;
}

function operate(board, dir) {
  let oldBoard = clone(board);
  let newBoard = clone(board);

  for (let i = 0; i < SIZE; i++) {
    let row = [];
    for (let j = 0; j < SIZE; j++) {
      if (dir === 'left') row.push(newBoard[i][j]);
      else if (dir === 'right') row.unshift(newBoard[i][SIZE - 1 - j]);
      else if (dir === 'up') row.push(newBoard[j][i]);
      else if (dir === 'down') row.unshift(newBoard[SIZE - 1 - j][i]);
    }
    row = slide(row);
    for (let j = 0; j < SIZE; j++) {
      if (dir === 'left') newBoard[i][j] = row[j];
      else if (dir === 'right') newBoard[i][SIZE - 1 - j] = row[j];
      else if (dir === 'up') newBoard[j][i] = row[j];
      else if (dir === 'down') newBoard[SIZE - 1 - j][i] = row[j];
    }
  }

  if (JSON.stringify(newBoard) !== JSON.stringify(oldBoard)) {
    return addRandomTile(newBoard);
  }
  return board;
}

export default function Game2048() {
  const [board, setBoard] = useState(addRandomTile(createEmptyBoard()));

  useEffect(() => {
    const handleKeyDown = (e) => {
      let dir = null;
      if (e.key === 'ArrowLeft') dir = 'left';
      else if (e.key === 'ArrowRight') dir = 'right';
      else if (e.key === 'ArrowUp') dir = 'up';
      else if (e.key === 'ArrowDown') dir = 'down';
      if (dir) setBoard(b => operate(clone(b), dir));
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold mb-4">2048 Game</h1>
      <div className="grid grid-cols-4 gap-2 bg-gray-800 p-4 rounded-xl">
        {board.flat().map((cell, idx) => (
          <div key={idx} className="w-16 h-16 flex items-center justify-center text-lg font-bold rounded bg-gray-700">
            {cell !== 0 ? cell : ""}
          </div>
        ))}
      </div>
    </div>
  );
}
