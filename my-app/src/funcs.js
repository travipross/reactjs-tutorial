import React from 'react';

export function Square(props){
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
  
  // Convenience function to calculate winner
export  function calculateWinner(squares) {
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
  
export  function rowColFromIndex(i) {
    var row = Math.floor(i / 3)
    var col = i % 3;
    return [row, col];
  }
