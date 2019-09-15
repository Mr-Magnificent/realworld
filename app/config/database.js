const knexConf = require('../../knexfile')[process.env.NODE_ENV || 'dev'];
const knexConnection = require('knex')(knexConf);
const { Model } = require('objection');

let db = Model.knex(knexConnection);

module.exports = db;
