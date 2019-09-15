const Joi = require('@hapi/joi');

exports.signup = Joi.object().keys({
	username: Joi.string().alphanum().min(3).max(30).required(),
	password: Joi.string().min(8).max(32).required(),
	repeatPassword: Joi.ref('password'),
	email: Joi.string().email({ minDomainSegments: 2 }).required(),
	name: Joi.string().pattern(/^[a-zA-Z]{3,40}$/),
});

exports.login = Joi.object().keys({
	email: Joi.string().email().required(),
	password: Joi.string().min(8).max(32).required(),
});
