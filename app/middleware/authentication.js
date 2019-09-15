const debug = require('debug')('app');
const jwt = require('jsonwebtoken');
const promisify = require('bluebird').promisify;
const verify = promisify(jwt.verify);

const User = require('../models/User');

module.exports = async (req, res, next) => {
	let token = req.headers['authorization'];
	if (!token) {
		return res.status(401).send({message: 'Token not present'});
	}
	token = token.split(' ')[1];
	try {
		const decoded = await verify(token, process.env.KEY);
		debug.extend('auth')(decoded);
		const user = await  User.query().findById(decoded);
		req.user = user;
		next();
	} catch (err) {
		res.status(401).send({message: err.message});
	}
};
