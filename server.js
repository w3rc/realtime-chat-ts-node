"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
var express_1 = __importDefault(require("express"));
var app = express_1.default();
var http = require('http').createServer(app);
app.get('/', function (req, res) {
    console.log('connected');
    return res.json('Hi there');
});
// Socket
var socketio = require('socket.io')(http);
// socketio.on('connection', (userSocket: any) => {
// 	userSocket.on('send_message', (data: any) => {
// 		userSocket.broadcast.emit('receive_message', data);
// 	});
// });
socketio.on('connection', function (socket) {
    //Get the chatID of the user and join in a room of the same chatID
    var chatID = 'ABCD';
    chatID = socket.handshake.query.chatID;
    socket.join(chatID);
    //Leave the room if the user closes the socket
    socket.on('disconnect', function () {
        socket.leave(chatID);
    });
    //Send message to only a particular user
    socket.on('send_message', function (message) {
        var receiverChatID = message.receiverChatID;
        var senderChatID = message.senderChatID;
        var content = message.content;
        //Send message to only that particular room
        socket.in(receiverChatID).emit('receive_message', {
            content: content,
            senderChatID: senderChatID,
            receiverChatID: receiverChatID,
        });
    });
});
http.listen(process.env.PORT, function () {
    console.log('Listening on port ' + process.env.PORT);
});
