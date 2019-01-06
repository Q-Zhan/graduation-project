
let io;

function init(app) {
    var http = require('http').Server(app);
    io = require('socket.io')(http);
    io.on('connection', function(socket) {
        socket.emit('connected'); // 通知客户端已连接
        console.log('a user connected');
        console.log('socket id:' +socket.id)
        // console.log(socket.handshake)
        // console.log(io.sockets.sockets)
    })

    // 监听socket
    http.listen(8082);
    console.log('监听socket端口：8082')
}

function getSocketIo() {
    return io;
}

module.exports = {
    init: init,
    getSocketIo: getSocketIo
}