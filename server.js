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
socketio.on('connection', function (userSocket) {
    userSocket.on('send_message', function (data) {
        userSocket.broadcast.emit('receive_message', data);
    });
});
http.listen(process.env.PORT, function () {
    console.log('Listening on port ' + process.env.PORT);
});
