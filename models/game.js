const Player = require("./player");
const reducer = (accumulator, currentvalue) => accumulator + currentvalue;

function Game() {
    this.players = [];
    this.positions = [];
    this.turn = 0;
    this.boardSize = 3;
    this.board = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ];
    this.live = true;
    this.addPlayer = (id, count, socket, symbol, number) => {
        this.players.push(new Player(id, count, socket, symbol, number));
    };
    this.getPlayersCount = () => {
        return this.players.length;
    };
    this.addPosition = (position) => {
        this.positions.push(position);
    };
    this.getPositions = () => {
        return this.positions;
    };
    this.getCurrentPlayer = () => {
        return this.players[this.turn];
    };
    this.getCurrentPlayerSocket = () => {
        return this.players[this.turn].socket;
    };
    this.getOppositionSocket = () => {
        return this.players[1 - this.turn].socket;
    };
    this.changeTurn = () => {
        this.turn = 1 - this.turn;
    };
    this.getPlayer = (id) => {
        return this.players.find(player => player.id === id);
    };
    this.updateBoard = (position, value) => {
        let i = Math.floor(position/this.boardSize);
        let j = position % 3;
        this.board[i][j] = value;
        console.log(this.board);
        let result1 = this.boardRowSum(i) || this.boardColumnSum(j);
        let result2 = this.diagonalSum();
        return result1 || result2;
    };
    this.boardRowSum = (k) => {
        let sum = this.board[k].reduce(reducer);
        if (sum === 3 || sum === -3) {
            this.live = false;
            return true;
        } else {
            return false;
        }
    };
    this.boardColumnSum = (k) => {
        let sum = 0;
        for (let idx = 0; idx < this.board.length; idx++) {
            sum += this.board[idx][k];
        }
        if (sum === 3 || sum === -3) {
            this.live = false;
            return true;
        } else {
            return false;
        }
    };
    this.diagonalSum = () => {
        let diagonal = 0, crossDiagonal = 0;
        for (let row = 0; row < this.board.length; row++) {
            diagonal += this.board[row][row];
            crossDiagonal += this.board[row][this.board.length - row - 1];
        }
        if (diagonal == 3 || diagonal == -3) {
            this.live = false;
            return true;
        }
        else if (crossDiagonal == 3 || crossDiagonal == -3) {
            this.live = false;
            return true;
        } else {
            return false;
        }
    };
    this.checkDraw = () => {
        if (this.positions.length === this.boardSize * this.boardSize) {
            this.live = false;
            return true;
        } else {
            return false;
        }
    };
    this.checkLive = () => {
        return this.live;
    };
}

module.exports = Game;