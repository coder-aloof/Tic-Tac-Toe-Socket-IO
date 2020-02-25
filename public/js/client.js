const socket = io();

$(document).ready(function () {
    socket.emit('join', 'Hi');
});

$('.tic').click( function(e) {
    e.preventDefault();
    const position = $(this).attr("id");
    socket.emit('make-move', {
        position: position
    });
});

socket.on('chat message', (msg) => {
    $('#messages').append($('<li>').text(msg));
});

socket.on('move-made', (data) => {
    console.log("move received");
    console.log(data);
    $('#' + data.position).text(data.symbol);
});

const startGame = () => {
    console.log(socket);
    socket.emit('join', {id: socket.id});
};
