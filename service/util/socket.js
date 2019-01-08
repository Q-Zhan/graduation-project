
let io;
let onlineUsers = {}; // 在线用户映射表，key: socket.id、value: userName

function init(app) {
    var http = require('http').Server(app);
    io = require('socket.io')(http);
    io.on('connection', function(socket) {
        socket.emit('connected'); // 通知客户端已连接
        let socketId = socket.id,
            userName = socket.handshake.query.userName;
        onlineUsers[socketId] = userName;
        // console.log('a user connected');
        // console.log('socket id:' +socket.id)
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
function getOnlineUsers() {
    return onlineUsers;
}

module.exports = {
    init: init,
    getSocketIo: getSocketIo,
    getOnlineUsers: getOnlineUsers
}