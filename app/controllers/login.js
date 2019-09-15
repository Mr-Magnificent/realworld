const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const debug = require('debug')('login');

const User = require('../models/User');
const validations = require('../config/validations');

exports.login = async (req, res, next) => {

	// @hapi/joi validations
	const validated = validations.login.validate(req.body);
	if (validated.error) {
		return res.status(400).send({
			message: validated.error
		});
	}


	try {
		const user = await User.query()
			.first()
			.where({
				email: req.body.email
			});

		const compareResult = await bcrypt.compare(req.body.password, user.password);
		if (compareResult == false) {
			return res.send(401).send({
				message: 'Incorrect username or password'
			});
		}

		const token = await jwt.sign(user.id, process.env.KEY);
		debug.extend('token')(token);
		return res.send({
			token: token,
			user: {
				name: user.name,
				username: user.username,
				email: user.email
			}
		});

	} catch (err) {
		return res.status(400).send({
			message: err.message
		});
	}
};
