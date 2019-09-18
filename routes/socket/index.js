const debug = require('debug')('app:');
let io = require('socket.io')();

const textAPIPromise = require('../../app/config/sentimentAnalysis');
const socketAuth = require('../../app/middleware/socket-authentication');

module.exports = (_io) => {
	io = _io;
	io.use(socketAuth);
	socket();
};

const socket = () => {
	io.on('connect', (socket) => {
		debug.extend('socket')(socket.id);
		socket.join('chatroom', (err) => {
			if (err) {
				debug(err);
			}
		});

		sendOnline();

		socket.on('message', async (data) => {
			try {
				const sentiment = await textAPIPromise(data);

				debug.extend()(sentiment);

				if (sentiment.polarity === 'positive') {
					sendMessage(socket, data, ':)');
				}
				else if (sentiment.polarity === 'neutral') {
					sendMessage(socket, data, ':|');
				}
				// negative case
				else {
					sendMessage(socket, data, ':(');
				}

			} catch (err) {
				debug.extend('sockMess')(err.message);

				// send message even if text analysis fails
				sendMessage(socket, data, '');
			}
		});



		/**
		 * TODO set is_live->false for user
		 */
		socket.on('disconnect', async () => {
			debug('disconnect');
			sendOnline();
		});
	});
};

const sendMessage = (socket, data, emotion) => {
	socket.to('chatroom').emit('message', {
		name: socket.user.username,
		message: `${data} ${emotion}`
	});
};

const sendOnline = () => {
	const { sockets } = io.sockets.adapter.rooms['chatroom'];
	let detailsArr = [];

	for (let socketId in sockets) {
		debug.extend('socketId: ')(socketId);
		detailsArr.push(io.sockets.connected[socketId]['user']);
	}

	debug.extend('socket details')(detailsArr);

	io.to('chatroom').emit('online', detailsArr);
};
