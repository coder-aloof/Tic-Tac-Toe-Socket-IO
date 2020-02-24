const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;
const path = require('path');
const Game = require('./models/game');
const root = path.join(__dirname, "public");

app.use(express.static(root));
app.get('/' , (req, res) => {
    res.sendFile('index.html', {root});
});

app.get('/game' , (req, res) => {
    console.log('game route');
    res.sendFile('game.html', {root});
});

server.listen(port, () =>{
    console.log('listening on Port : ', port);
});

let rooms = [];
io.on('connection', function(socket){
    console.log('User connected with socket id', socket.id);
    socket.on('join', (id) => {
        var game;
        if (rooms.length === 0) {
            game = new Game();
        } else {
            game = rooms[rooms.length - 1];
        }
        game.addPlayer(id, socket);
        if (game.getPlayersCount() === 2) {
            game.startGame();
        }
    });
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });
    socket.on('disconnect', () => {
        console.log(socket.id, 'disconnected');
    });
});
