const socket = io();
$('form').submit((e) => {
    m = $('#m');
    e.preventDefault(); // prevents page reloading
    socket.emit('chat message', m.val());
    m.val('');
    return false;
});
