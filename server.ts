require('dotenv').config();
import express, { Request, Response } from 'express';
const app = express();

const http = require('http').createServer(app);

app.get('/', (req: Request, res: Response) => {
	console.log('connected');
	return res.json('Hi there');
});

// Socket
const socketio = require('socket.io')(http);

socketio.on('connection', (userSocket: any) => {
	userSocket.on('send_message', (data: any) => {
		userSocket.broadcast.emit('receive_message', data);
	});
});

http.listen(process.env.PORT, () => {
	console.log('Listening on port ' + process.env.PORT);
});
