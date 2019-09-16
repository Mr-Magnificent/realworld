const debug = require('debug')('app:');
const User = require('../models/User');
const { verifyToken } = require('../middleware/authentication');

module.exports = async (socket, next) => {
	const query = socket.handshake.query;
	debug(query.token);
	try {
		const decoded = await verifyToken(query.token);
		debug.extend('decoded')(decoded);
		const user = await User.query().findById(decoded);
		socket.user = user;
		next();
	} catch (err) {
		debug.extend('err')(err.message);
		next(new Error('Authentication Error'));
	}
}; 
