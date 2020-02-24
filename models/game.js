const Player = require("./player");

const Game = () => {
    this.players = [];
    this.status = 0;
    this.addPlayer = (id, socket) => {
        this.players.push(new Player(id, socket))
    };
    this.getPlayersCount = () => {
        return this.players.length;
    };
    this.startGame = () => {
        this.status = 1;
    };
};

module.exports = Game;