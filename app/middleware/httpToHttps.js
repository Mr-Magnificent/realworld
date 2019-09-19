const debug = require('debug')('app:');
module.exports = (req, res, next) => {
	debug.extend('https')(process.env.NODE_ENV);
	if (process.env.NODE_ENV === 'dev' || req.secure) {
		debug.extend('inside')('inside');
		next();
	} else {
		res.redirect(301, `https://${req.headers.host}${req.url}`);
	}
};
