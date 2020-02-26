const Player = require("./player");

function Game() {
    this.players = [];
    this.positions = [];
    this.turn = 0;
    this.addPlayer = (id, count, socket, symbol) => {
        this.players.push(new Player(id, count, socket, symbol));
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
        console.log("Current Socket");
        return this.players[this.turn].socket;
    };
    this.getOpposition = () => {
        return this.players[1 - this.turn];
    };
    this.getOppositionSocket = () => {
        console.log("Opposition socket");
        return this.players[1 - this.turn].socket;
    };
    this.changeTurn = () => {
        this.turn = 1 - this.turn;
    };
    this.getPlayer = (id) => {
        return this.players.find(player => player.id === id);
    };
}

module.exports = Game;