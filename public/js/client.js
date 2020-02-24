const socket = io();
$('form').submit((e) => {
    m = $('#m');
    e.preventDefault(); // prevents page reloading
    socket.emit('chat message', m.val());
    m.val('');
    return false;
});

socket.on('chat message', (msg) => {
    $('#messages').append($('<li>').text(msg));
});

const startGame = () => {
    console.log(socket);
    socket.emit('join', {id: socket.id});
};
