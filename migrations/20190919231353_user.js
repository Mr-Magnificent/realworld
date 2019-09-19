const tableName = 'User';
exports.up = function (knex) {
	return knex.schema.createTable(tableName, (t) => {
		t.increments('id').primary();
		t.string('name').notNullable();
		t.string('email').notNullable();
		t.string('password', 80).notNullable();
		t.string('username').index().notNullable();
		t.string('scoket_id').notNullable();
		t.boolean('is_live').defaultTo(false);
		t.datetime('created_at').defaultTo(knex.fn.now(6));

		t.unique('email');
	});
};

exports.down = function (knex) {
	return knex.schema.dropTable(tableName);
};
