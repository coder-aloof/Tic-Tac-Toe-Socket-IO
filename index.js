const express   = require('express');
const app       = express();
const server    = require('http').createServer(app);
const io        = require('socket.io')(server);
const port      = process.env.PORT || 3000;
const path      = require('path');
const Game      = require('./models/game');
const root      = path.join(__dirname, "public");

const symbol = ["#", "0"];

app.use(express.static(root));
app.get('/' , (req, res) => {
    res.sendFile('index.html', {root});
});

app.get('/game' , (req, res) => {
    console.log('game route');
    res.sendFile('game.html', {root});
});

server.listen(port, () => {
    console.log('listening on Port : ', port);
});

let rooms = [];
let playerCount = 0;
io.on('connection', (socket) => {
    console.log('User connected with socket id', socket.id);
    var game;
    socket.on('join', (msg) => {
        playerCount++;
        console.log("Message", msg);
        console.log('Player Joined with socket id', socket.id);
        console.log(playerCount);
        if (playerCount > 0 && playerCount <= 2) {
            console.log("inside if block");
            if (rooms.length === 0) {
                game = new Game();
                rooms.push(game);
            } else {
                game = rooms[rooms.length - 1];
            }
            game.addPlayer(socket.id, socket, symbol[playerCount-1]);
            console.log("Players count",game.getPlayersCount());
            if (game.getPlayersCount() === 2) {
                console.log("Game started")
            }
        }
    });
    socket.on('make-move', (data) => {
        console.log("Move made by " + socket.id);
        if (game.getCurrentPlayer() === socket.id) {
            console.log("Invalid move");
            socket.emit('invalid-move', 'Your Opponents Turn');
        } else {
            if (game.getPositions().length === 0 || game.getPositions().indexOf(data.position) !== -1) {
                console.log("Move made by " + socket.id);
                game.addPosition(data.position);
                game.setCurrentPlayer(socket.id);
                socket.emit('move-made', {
                    position: data.position,
                    symbol: game.getPlayer(game.getCurrentPlayer()).symbol
                });
            }
        }
        socket.emit();
    });
    socket.on('disconnect', () => {
        console.log(socket.id, 'disconnected');
        if (playerCount > 0) {
            playerCount--;
        }
    });
});
