import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return <button className="square" onClick={onSquareClick}>
    {value}
  </button>;
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <div className="status">{status}</div>
      {[0, 1, 2].map(i => {
        return (<div key={i} className="board-row">
          {[0, 1, 2].map(j => {
            return (<Square key={3 * i + j} value={squares[3 * i + j]} onSquareClick={() => handleClick(3 * i + j)} />);
          })}
        </div>);
      })}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([[].fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];
  const xIsNext = currentMove % 2 === 0;
  const [isHistoryAsc, setIsHistoryAsc] = useState(true);

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function handleToggle() {
    setIsHistoryAsc(!isHistoryAsc);
  }

  const moves = history.map((squares, moveNum) => {
    let description;
    let move;
    if (isHistoryAsc) {
      move = moveNum;
    } else {
      move = history.length - 1 - moveNum;
    }
    if (move === currentMove) {
      description = 'You are at move #' + move;
    } else if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      (move === currentMove) ?
        <li key={move}>{description}</li> :
        <li key={move}>
          <button onClick={() => jumpTo(move)}>{description}</button>
        </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
        <button onClick={handleToggle}>Toggle</button>
      </div>
    </div>
  )
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
