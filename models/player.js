function Player(id, count, socket, symbol, number) {
    this.id = id;
    this.count = count;
    this.socket = socket;
    this.symbol = symbol;
    this.number = number;
};

module.exports = Player;