const debug = require('debug')('app:');
const jwt = require('jsonwebtoken');
const promisify = require('bluebird').promisify;
const verify = promisify(jwt.verify);

const User = require('../models/User');

exports.auth = async (req, res, next) => {
	let token = req.cookies.token;
	if (!token) {
		return res.status(401).send({ message: 'Token not present' });
	}
	try {
		const decoded = await this.verifyToken(token);
		debug.extend('auth')(decoded);
		const user = await User.query().findById(decoded);
		req.user = user;
		next();
	} catch (err) {
		res.status(401).send({ message: err.message });
	}
};

exports.verifyToken = async (token) => {
	try {
		debug.extend('token')(token);
		const decoded = await verify(token, process.env.KEY);
		return decoded;
	} catch (err) {
		throw new Error(err.message);
	}
};
