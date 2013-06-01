/**
 * Created with JetBrains WebStorm.
 * User: i.burlak
 * Date: 01.06.13
 * Time: 21:38
 * To change this template use File | Settings | File Templates.
 */

var io = require('socket.io').listen(3001),
    users = {};

io.sockets.on('connection', function (socket) {

    function register(user) {
        console.log(user);
        users[user.session] = socket;
    }

    socket.on('register', register);
});

exports.emit = function (session, type, data){
    users[session].emit('events', { type: type, data: data});
};
