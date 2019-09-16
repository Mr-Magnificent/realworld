const debug = require('debug')('app:');
let io = require('socket.io')();
const socketAuth = require('./socket-authentication');

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

		/**
		 * TODO sentimentAnalysis
		 */
		socket.on('message', async (data) => {
			socket.to('chatroom').emit('message', data);
		});

		/**
		 * TODO set is_live->false for user
		 */
		socket.on('disconnect', async () => {
			
		});
	});
};
