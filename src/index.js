import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {

    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );

}

//for history: receive squares and onClick from Game. 1st delete constructor from Board
class Board extends React.Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         squares: Array(9).fill(null),
    //         xIsNext: true,
    //     };
    // } then change ref to squares via state to via props down in
    // renderSquare()


    // handleClick(i) {
    //     const squares = this.state.squares.slice();
    //     if (calculateWinner(squares) || squares[i]) {
    //         //early return to ignore click if there is a winner or the
    //         // square is already filled
    //         return;
    //     }
    //     squares[i] = this.state.xIsNext ? 'X' : 'O';
    //     this.setState({
    //         squares: squares,
    //         xIsNext: !this.state.xIsNext,
    //     });
    //     this.setState({squares: squares});
    // } moving to Game

    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                //finally this.handleClick(i) is replaced with
                // this.props.onClick(i). now update Game's render to use
                // most recent history entry for display
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        // const status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        // const winner = calculateWinner(this.state.squares)
        // let status;
        //
        // if (winner) {
        //     status = 'Winner: ' + winner;
        // } else {
        //     status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        // } snipped to move to Game for history refactor
        return (
            <div>
                {/*<div className="status">{status}</div>*/}
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        //lifting state up from board to game for history functionality
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            //stepNumber tracks which step we're currently viewing. jumpTo
            // will update it
            stepNumber: 0,
            xIsNext: true,
        }
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            //if stepNumber will turn even, set xIsNext to true
            xIsNext: (step % 2) === 0,
        });
    }

    handleClick(i) {
        // const history = this.state.history;

        //history changed to throw away future history if went back in time
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                //want to concat new history entries onto history in a way that doesn't
                // mutate the existing array ===> use concat(), not push()
                squares: squares,
            }]),
            stepNumber: history.length, //update after making a move to ensure we don't get stuck showing the same move after a new one has been made
            xIsNext: !this.state.xIsNext,
        });
    }

    render() {
        const history = this.state.history;
        // const current = history[history.length - 1];
        //changing current to instead render the currently selected move
        // according to stepNumber, rather than the last move in history
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares)

    //map over history array to create a list of buttons to "jump" to past moves
        const moves = history.map((step, move) => {
            //'step' refs current history El val, 'move' is index of the El
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            //create a button in a list item for each move in history
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)} > {desc} </button>
                </li>
            );
        })

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{ moves }</ol>
                </div>
            </div>
        );
    }
}

//helper function to check for a winner and return 'X', 'O', or null
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
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        console.log(squares[a]);
        console.log(squares[b]);
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game/>);
