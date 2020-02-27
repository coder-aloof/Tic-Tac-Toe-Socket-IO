function Player(id, socket, symbol, number) {
    this.id = id;
    this.socket = socket;
    this.symbol = symbol;
    this.number = number;
};

module.exports = Player;