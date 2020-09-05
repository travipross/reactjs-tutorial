import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props){
  // Create button with a function handler and label that were passed in via props, optionally highlighting
  if (props.highlight) {
    return (
      <button className="square, square-highlighted" onClick={props.onClick}> 
        {props.value}
      </button>
    )
  } else {
    return (
      <button className="square" onClick={props.onClick}> 
        {props.value}
      </button>
    )
  }
}

class Board extends React.Component {
  // Create new square component having a value and a callback function (passed from parent Game component)
  renderSquare(i) {
    return (
      <Square 
        value={this.props.squares[i]} 
        onClick={() => this.props.onClick(i)}
        highlight={this.props.highlightIdxs.includes(i)}
        key={i}
        />
    );
  }

  // Create squares (buttons) in rows defined by CSS file, having value specified by input arguement
  render() {
    var rows = []
    // Loop over rows
    for (var r=0; r<3; r++){
      var cols = []
      // Loop over cols within row
      for (var c=0; c<3; c++){
        // Append squares to cols to form a row
        cols.push(
          this.renderSquare(r*3+c)
        )
      }
      // append row of squares wrapped in a board-row div to list
      rows.push(
        <div className="board-row" key={r}>{cols}</div>
      )
    }
    return (
      <div>
        {rows}
      </div>
    )
  }
}

class Game extends React.Component {
  // Initialize Game with state for history, next player, and step number
  constructor(props){
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        lastIdx: null
      }],
      xIsNext: true,
      stepNumber: 0
    }
    this.reverseSorting = false
  }
  
  // method to change state to a different step
  jumpTo(step){
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  // callback function to execute when a square is clicked
  handleClick(i) {
    // store local state
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    // if winner is established, exit function early
    if (calculateWinner(squares)[0] || squares[i]) {
      return;
    }

    // Set value of selected square based on whose turn is next
    squares[i] = this.state.xIsNext ? 'X' : 'O';

    // Update state with new history, next player, and step number
    this.setState({
      history: history.concat([{
        squares: squares,
        lastIdx: i,
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length
    });
  }

  // Render game board component
  render() {
    // Get copies of current state
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winVals = calculateWinner(current.squares);
    const winner = winVals[0]
    const winSquares = winVals[1]
    
    // Create list items 
    const moves = history.map(
      (step, move) => {
        const lastIdx = step.lastIdx;
        const [lastRow, lastCol] = rowColFromIndex(lastIdx);
        const desc = (
          move ? 
            'Go to move #' + move + ' (row: ' + (lastRow+1) + ', col: ' + (lastCol+1) + ', val: ' + step.squares[lastIdx] + ')' 
            : 'Go to game start'
          );
        const bold = this.state.stepNumber === move
        let button
        if (bold) {
          button = <button onClick={() => this.jumpTo(move)}><b>{desc}</b></button>
        } else {
          button = <button onClick={() => this.jumpTo(move)}>{desc}</button>
        }
        return (
          <li key={move}>
            {button}
          </li>
        )
      }
    );

    
    // Construct status message to display
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      if (current.squares.every((v) => v)){
        status = "Tie game!"
      } else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }
    }

    // Draw board with current state and onClick handler
    const movesToRender = this.state.reverseSorting ? moves.reverse() : moves
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            highlightIdxs={winSquares}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol reversed={this.state.reverseSorting}>{movesToRender}</ol>
        </div>
        <div className="order-button">
          <button onClick={() => {
            this.setState(
              // Toggle the ordering when clicked
              {reverseSorting: !this.state.reverseSorting}
            )
          }}>
            Toggle Sort order
          </button>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

// Convenience function to calculate winner
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  // iterate over each line definition: If containing all the same value, that value wins
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], lines[i]]; // return value of winner, and the indices where the win was located
    }
  }

  // No full line of same value; no winner yet
  return [null, [null, null, null]];
}

function rowColFromIndex(i) {
  var row = Math.floor(i / 3)
  var col = i % 3;
  return [row, col];
}