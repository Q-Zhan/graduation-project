
let io = null;
let socketToUserMap = {}; // 在线用户映射表，key: socket.id、value: userId
let userToSocketMap = {}; // 在线用户映射表，key: userId、value: socket对象

function init(app) {
    var http = require('http').Server(app);
    io = require('socket.io')(http);
    // io.use(function(socket, next) {
    //     // TODO：仅在创建时调用，校验token
    //     console.log('!!!');
    //     next();
    // });
    io.on('connection', function(socket) {
        socket.emit('connected'); // 通知客户端已连接
        
        let socketId = socket.id,
            userId = socket.handshake.query.userId;
        socketToUserMap[socketId] = userId;
        userToSocketMap[userId] = socket;
    

        // console.log('a user connected');
        // console.log('socket id:' +socket.id)
        // console.log(socket.handshake)
        // console.log(io.sockets.sockets)
    })

    // 监听socket
    http.listen(8889);
    console.log('监听socket端口：8889')
}

function getSocketIo() {
    return io;
}
function getSocketToUserMap() {
    return socketToUserMap;
}
function getUserToSocketMap() {
    return userToSocketMap;
}

module.exports = {
    init,
    getSocketIo,
    getSocketToUserMap,
    getUserToSocketMap
}