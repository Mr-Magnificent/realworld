const User = require('../models/User');
const bcrypt = require('bcrypt');
const debug = require('debug')('app:');
const randomstring = require('randomstring');
const { signup } = require('../config/validations');

exports.createUser = async (req, res) => {
	// @hapi/joi validations
	let validated = signup.validate(req.body);
	debug.extend('validate')(validated);

	if (validated.error) {
		return res.status(400).send({
			message: validated.error
		});
	}

	const hashedPassword = await bcrypt.hash(req.body.password, parseInt(process.env.SALT_ROUNDS));

	if (!UsernameIsAvail(req.body.username)) {
		return res.status(400).send({
			message: 'invalid username'
		});
	}

	try {
		await User.query()
			.insert({
				email: req.body.email,
				username: req.body.username,
				password: hashedPassword,
				name: req.body.name,
				socket_id: randomstring.generate(6),
				is_live: false,
			});

		res.status(200).send({
			message: `${req.body.username} successfully created`,
		});
	} catch (err) {
		if (err) {
			res.status(400).send({
				message: err.message
			});
		}
	}
};

exports.checkUsername = async (req, res) => {
	let available;
	try {
		available = await UsernameIsAvail(req.query.username);
	} catch(err) {
		return res.status(500).send({
			message: err.message
		});
	}

	if (available) {
		return res.send({
			available: true
		});
	} else {
		return res.send({
			available: false
		});
	}
};

exports.toggleLive = async (req, res) => {
	try {
		const data = await User.query()
			.patch({ is_live: req.body.toggleValue })
			.findById(req.user.id)
			.returning('is_live');

		debug(data);
		/**
		 * TODO: redirect?
		 */
		return res.send({
			message: 'live broadcast turned on'
		});
	} catch (err) {
		return res.status(500).send({
			message: err.message
		});
	}
};

const UsernameIsAvail = async (username) => {
	try {
		const data = await User.query()
			.findOne({
				username: username
			});
		if (!data) {
			return true;
		}
		return false;
	} catch (err) {
		throw Error(err.message);
	}
};
