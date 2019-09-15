const knex = require('knex')({
	client: 'pg',
	connection: process.env.DATABASE_URL
});
const { Model } = require('objection');

let db = Model.knex(knex);

module.exports = db;
