const Server = require('socket.io');
const io = Server();


var Socket = {
    emit: function (event, data) {
        console.log(event, data);
        // io.sockets.emit(event, data);
        io.emit('news', { hello: 'world' });
    }
};

io.on("connection", function (socket) {
    console.log("A user connected");
});

exports.Socket = Socket;
exports.io = io;
