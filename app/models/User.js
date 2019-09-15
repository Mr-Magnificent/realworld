const { Model } = require('objection');

class User extends Model {
	static get tableName() {
		return 'user';
	}
    
	static get jsonSchema() {
		return {
			type: 'object',
			required: ['email','username','password'],
            
			properties: {
				email: {type: 'string'},
				username: {type: 'string'},
				password: {type: 'string', maxLength: 80},
				name: {type: 'string'},
				socketId: {type: 'string', maxLength: 10},
				isLive: {type: 'boolean'}
			}
		};
	}
    
	$beforeInsert() {
		this.created_at = new Date().toISOString();
	}
}

module.exports = User;
