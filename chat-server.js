socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
});