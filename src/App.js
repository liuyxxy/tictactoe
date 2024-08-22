import { useState } from "react";

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currMove, setCurrMove] = useState(0);
  const xIsNext = (currMove%2 === 0); //odd player is X, even player is O. so the next move is vice versa.
  const currentSquares = history[currMove];

  function handlePlay(nextSquares) {
    const nextHist = [...history.slice(0, currMove + 1), nextSquares];
    setHistory(nextHist);
    setCurrMove(nextHist.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrMove(nextMove);
  }

  const moves = history.map((squares, move) => { // squares = element, move = index
    let description;
    if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    )
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board x={xIsNext} squares={currentSquares} onPlay={handlePlay}/>
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function Square({value, onSquareClick}) {
  return <button className="square" onClick={onSquareClick}>{value}</button>
}

function Board({x, squares, onPlay}) {
  const winner = calculateWinner(squares);
  let status;

  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (x?"X":"O");
  }

  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    if (x) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  const rows = 3, cols = 3;

  return (<>
      <div className="status">{status}</div>
      <div>
        {[...new Array(rows)].map((x, rowIndex) => {
            return (
              <div className="board-row" key={"row" + rowIndex}>
                {[...new Array(cols)].map((y, colIndex) => <Square key={rowIndex*cols + colIndex} value={squares[rowIndex*cols + colIndex]} onSquareClick={() => handleClick(rowIndex*cols + colIndex)}/>)}
              </div>
            )
          })
        }
      </div>
      {/* <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div> */}
    </> 
  );
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
