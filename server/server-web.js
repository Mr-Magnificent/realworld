global.Promise = require('bluebird');
require('dotenv').config();
const next = require('next');
const express = require('express');

const dev = process.env.NODE_ENV !== 'dev';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

const compression = require('compression');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const debug = require('debug')('app:');

nextApp.prepare()
	.then(() => {
		const app = express();
		const server = require('http').createServer(app);
		const io = require('socket.io')(server);

		require('../routes/socket/index')(io);

		require('../app/config/database');

		const routes = require('../routes/api');

		// const httpToHttps = require('../app/middleware/httpToHttps');
		// app.use(httpToHttps);


		app.use(compression());
		app.use(morgan('combined'));
		app.use(bodyParser.json());
		app.use(bodyParser.urlencoded({ extended: true }));
		app.use(cookieParser());

		app.use('/api', routes);
		app.get('*', (req, res) => {
			return handle(req, res);
		});

		const PORT = process.env.PORT || 3000;

		server.listen(PORT, (err) => {
			if (err) {
				debug.extend('app err')(err.message);
				throw err;
			}
			debug(`Server listening on Port ${PORT}`);
		});

	})
	.catch((err) => {
		debug.extend('next error')(err.stack);
		process.exit(1);
	});
