// Update with your config settings.
require('dotenv').config();

module.exports = {
	dev: {
		client: 'pg',
		connection: process.env.DATABASE_URL,
		searchPath: ['user','public'],
		pool: {
			min: 2,
			max: 10
		}
	},

	production: {
		client: 'postgresql',
		connection: {
			database: 'my_db',
			user:     'username',
			password: 'password'
		},
		pool: {
			min: 2,
			max: 10
		},
		migrations: {
			tableName: 'knex_migrations'
		}
	}

};
