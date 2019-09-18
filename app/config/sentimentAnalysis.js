const AYLIENTextAPI = require('aylien_textapi');

const textapi = new AYLIENTextAPI({
	application_id: process.env.AYLIEN_APP_ID,
	application_key: process.env.AYLIEN_API_KEY,
	https: true
});

const textAPIPromise = (text) => new Promise((resolve, reject) => {
	textapi.sentiment({
		'text': text
	}, function(error, response) {
		if (error) {
			reject(error);
		} else {
			resolve(response);
		}
	});
});

module.exports = textAPIPromise;
