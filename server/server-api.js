const compression = require('compression');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

require('../routes/socket/index')(io);

require('dotenv').config;
require('../app/config/database');

const routes = require('../routes/api');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const debug = require('debug')('app:');

const httpToHttps = require('../app/middleware/httpToHttps');
app.use(httpToHttps);

app.use(compression());
app.use(morgan('combined'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api', routes);

// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
	debug(`Server listening on Port ${PORT}`);
});
