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

socket.on('move-made', (data) => {
    $('#' + data.position).text(data.symbol);
    $('#message').text('');
});

socket.on('invalid-move', (msg) => {
    $('#message').text(msg);
});

socket.on('result', (msg) => {
    $('#message').text(msg);
});
