require('dotenv').config();
import express, { Request, Response } from 'express';
const app = express();

const http = require('http').createServer(app);

interface Message {
	senderChatID: string;
	receiverChatID: string;
	content: string;
}

app.get('/chat', (req: Request, res: Response) => {
	console.log('connected');
	return res.json('Realtime P2P Chat with chatIDs');
});

// Socket
const socketio = require('socket.io')(http);

// socketio.on('connection', (userSocket: any) => {
// 	userSocket.on('send_message', (data: any) => {
// 		userSocket.broadcast.emit('receive_message', data);
// 	});
// });

socketio.on('connection', (socket:any) => {
	//Get the chatID/userID of the user and join in a room of the same chatID
	const chatID = socket.handshake.query.chatID;
	socket.join(chatID);

	//Leave the room if the user closes the socket
	socket.on('disconnect', () => {
		socket.leave(chatID);
	});

	//Send message to only a particular user
	socket.on('send_message', (message:Message) => {
		const receiverChatID = message.receiverChatID;
		const senderChatID = message.senderChatID;
		const content = message.content;

		//Send message to only that particular room
		socket.in(chatID).emit('receive_message', {
			'content': content,
			'senderID': senderChatID,
            'receiverID':receiverChatID,
		});
	});
});

http.listen(process.env.PORT, () => {
	console.log('Listening on port ' + process.env.PORT);
});
