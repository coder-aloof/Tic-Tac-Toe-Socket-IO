const Player = require("./player");

function Game() {
    this.players = [];
    this.positions = [];
    this.currentPlayer = "";
    this.opponent = "";
    this.addPlayer = (id, socket, symbol) => {
        this.players.push(new Player(id, socket, symbol));
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
    this.setCurrentPlayer = (id) => {
        this.currentPlayer = id;
    };
    this.getCurrentPlayer = () => {
        return this.currentPlayer;
    };
    this.getPlayer = (id) => {
        return this.players.find(player => player.id === id);
    };
};

module.exports = Game;