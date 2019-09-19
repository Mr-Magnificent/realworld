// Update with your config settings.
require('dotenv').config();

module.exports = {
	dev: {
		client: 'postgresql',
		connection: `${process.env.DATABASE_URL}`,
		searchPath: ['user','public'],
		pool: {
			min: 2,
			max: 10
		}
	},

	production: {
		client: 'postgresql',
		connection: `${process.env.DATABASE_URL}?ssl=true`,
		searchPath: ['user','public'],
		pool: {
			min: 2,
			max: 10
		}
	}
};
