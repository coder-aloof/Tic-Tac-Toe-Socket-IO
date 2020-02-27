const express   = require('express');
const app       = express();
const server    = require('http').createServer(app);
const io        = require('socket.io')(server);
const port      = process.env.PORT || 3000;
const path      = require('path');
const Game      = require('./models/game');
const root      = path.join(__dirname, "public");

const symbol = ["#", "O"];
const numbers = [1, 0];

app.use(express.static(root));
app.get('/' , (req, res) => {
    res.sendFile('index.html', {root});
});

server.listen(port, () => {
    console.log('listening on Port : ', port);
});

let rooms = [];
let playerCount = 0;
io.on('connection', (socket) => {
    console.log('User connected with socket id', socket.id);
    let game;
    socket.on('join', (msg) => {
        playerCount++;
        if (playerCount > 0 && playerCount <= 2) {
            if (rooms.length === 0) {
                game = new Game();
                rooms.push(game);
            } else {
                game = rooms[rooms.length - 1];
            }
            game.addPlayer(socket.id, playerCount ,socket, symbol[playerCount-1], numbers[playerCount-1]);
            if (game.getPlayersCount() === 2) {
                console.log("Game started")
            }
        }
    });
    socket.on('make-move', (data) => {
        if (!game.checkLive()) {
            // do nothing
        }
        else if (game.getCurrentPlayer().id === socket.id) {
            if (game.getPositions().indexOf(data.position) === -1) {
                game.addPosition(data.position);
                const symbol = game.getPlayer(game.getCurrentPlayer().id).symbol;
                game.getCurrentPlayerSocket().emit('move-made', {
                    position: data.position,
                    symbol: symbol
                });
                game.getOppositionSocket().emit('move-made', {
                    position: data.position,
                    symbol: symbol
                });
                if (game.updateBoard(data.position, game.getCurrentPlayer().number)) {
                    game.getCurrentPlayerSocket().emit('result', 'You Win');
                    game.getOppositionSocket().emit('result', 'You Lost');
                }
                if (game.checkDraw()) {
                    game.getCurrentPlayerSocket().emit('result', 'Draw');
                    game.getOppositionSocket().emit('result', 'Draw');
                }
                game.changeTurn();
            } else {
                console.log("Position already clicked");
            }
        } else {
            socket.emit('invalid-move', 'Your Opponents Turn');
        }
        socket.emit();
    });
    socket.on('disconnect', () => {
        console.log(socket.id, 'disconnected');
        if (playerCount > 0) {
            playerCount--;
        }
        if (playerCount == 0) {
            game = undefined;
        }
    });
});
