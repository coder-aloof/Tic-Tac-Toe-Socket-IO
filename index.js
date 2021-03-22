const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;
const path = require('path');
const Game = require('./models/game');
const root = path.join(__dirname, "public");
const uuid = require('uuid/v4');

const symbol = ["X", "O"];
const numbers = [1, -1];

app.use(express.static(root));
app.get('/' , (req, res) => {
    res.sendFile('index.html', {root});
});

server.listen(port, () => {
    console.log('listening on Port : ', port);
});

let rooms = []; // to hold games
let archivedRooms = []; // to hold games that were ended

io.on('connection', (socket) => {
    let game;
    socket.on('join', () => {
        if (rooms.length === 0 || rooms[rooms.length-1].getPlayersCount() === 2) {
            game = new Game(uuid());
            rooms.push(game);
            console.log(`Total Rooms ${rooms.length}`);
        } else {
            game = rooms[rooms.length - 1];
        }
        socket.roomId = game.getRoomId();
        socket.join(socket.roomId);
        game.addPlayer(socket.id, socket, symbol[game.getPlayersCount()], numbers[game.getPlayersCount()]);
        if (game.getPlayersCount() === 1) {
            socket.emit('message', 'Waiting for Player');
        }
        if (game.getPlayersCount() === 2) {
            io.to(socket.roomId).emit('empty-message', 'Game Starts');
            game.setStatus(1); // In progress
        }
    });
    socket.on('make-move', (data) => {
        console.log(`Game status ${game.getStatus()}`);
        if (game.getStatus() === 2) {
            console.log(`Winner is ${game.getWinner().id}`);
        }
        else if (game.getStatus() === 0) {
            socket.emit('message', 'Please Wait');
        }
        else if (game.getCurrentPlayer().id === socket.id) {
            if (game.getPositions().indexOf(data.position) === -1) {
                game.addPosition(data.position);
                const symbol = game.getCurrentPlayer().symbol;
                socket.emit('move-made', {
                    position: data.position,
                    symbol: symbol
                });
                socket.to(socket.roomId).emit('move-made', {
                    position: data.position,
                    symbol: symbol
                });
                if (game.updateBoard(data.position, game.getCurrentPlayer().number)) {
                    socket.emit('result', 'You Win');
                    socket.to(socket.roomId).emit('result', 'You Lost');
                }
                if (game.checkDraw()) {
                    io.to(socket.roomId).emit('result', 'Draw');
                }
                game.changeTurn();
            } else {
                console.log("Position already clicked");
            }
        } else {
            socket.emit('invalid-move', 'Your Opponents Turn');
        }
    });
    socket.on('disconnect', () => {
        console.log(socket.id, 'disconnected');
        socket.leave(socket.roomId);
        if (game.getStatus() === 0 && game.getCurrentPlayersCount() === 1) {
            // when the game has not started yet but the only user in the room disconnects
            game.playerLeft(socket, false);
            rooms.splice(game, 1);
        } else if (game.getStatus() === 1) {
            // when the game is in progress but one user leaves the room
            game.playerLeft(socket, true);
            io.to(socket.roomId).emit('result', 'Opponent Left! You Win');
        } else if (game.getStatus() === 2 || game.getCurrentPlayersCount() === 2) {
            // when the game is over and one user leaves the room
            game.playerLeft(socket, false);
        } else if (game.getStatus() === 2 || game.getCurrentPlayersCount() === 1) {
            // when the game is over and the other user also leaves the room
            game.playerLeft(socket, false);
            rooms.splice(game,1);
            archivedRooms.push(game);
        }
    });
});
