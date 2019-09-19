const debug = require('debug')('app:');
module.exports = (req, res, next) => {
	debug.extend('https')(process.env.NODE_ENV);
	if (req.secure) {
		next();
	} else {
		res.redirect(`https://${req.headers.host}${req.url}`);
	}
};
