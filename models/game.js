const Player = require("./player");
const reducer = (accumulator, currentValue) => accumulator + currentValue;

function Game(roomId) {
    this.roomId = roomId;
    this.players = [];
    this.positions = [];
    this.turn = 0;
    this.boardSize = 3;
    this.currentPlayersCount = 0;
    this.board = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ];
    this.status = 0; // { 0: Not Yet Started, 1: Game in progress, 2: Game over}
    this.winner = undefined;  // update to Player object when a player wins of remains undefined in case of a draw
    this.getRoomId = () => {
        return this.roomId;
    };
    this.addPlayer = (id, count, socket, symbol, number) => {
        this.players.push(new Player(id, count, socket, symbol, number));
        this.currentPlayersCount++;
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
    this.getOpposition = () => {
        return this.players[1 - this.turn];
    };
    this.changeTurn = () => {
        this.turn = 1 - this.turn;
    };
    this.updateBoard = (position, value) => {
        let i = Math.floor(position/this.boardSize);
        let j = position % 3;
        this.board[i][j] = value;
        let result1 = this.boardRowSum(i) || this.boardColumnSum(j);
        let result2 = this.diagonalSum();
        return result1 || result2;
    };
    this.boardRowSum = (k) => {
        let sum = this.board[k].reduce(reducer);
        if (sum === 3 || sum === -3) {
            this.setStatus(2);
            this.setWinner(this.getCurrentPlayer());
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
            this.setStatus(2);
            this.setWinner(this.getCurrentPlayer());
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
            this.setStatus(2);
            this.setWinner(this.getCurrentPlayer());
            return true;
        }
        else if (crossDiagonal == 3 || crossDiagonal == -3) {
            this.setStatus(2);
            this.setWinner(this.getCurrentPlayer());
            return true;
        } else {
            return false;
        }
    };
    this.checkDraw = () => {
        if (this.positions.length === this.boardSize * this.boardSize) {
            this.setStatus(2);
            return true;
        } else {
            return false;
        }
    };
    this.getStatus = () => {
        return this.status;
    };
    this.setStatus = (sts) => {
        this.status = sts;
    };
    this.getWinner = () => {
        return this.winner;
    };
    this.setWinner = (winner) => {
        this.winner = winner;
    };
    this.getCurrentPlayersCount = () => {
        return this.currentPlayersCount;
    };
    this.playerLeft = (socket, flag) => {
        if (flag) {
            if (this.getCurrentPlayer().id == socket.id) {
                this.setWinner(this.getOpposition());
            } else {
                this.setWinner(this.getCurrentPlayer());
            }
            this.setStatus(2);
        }
        this.currentPlayersCount--;
    };
}

module.exports = Game;