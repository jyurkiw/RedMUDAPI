var express = require('express');
var app = express();
var redis = require('redis');
var lib = require('redmudlib')(redis.createClient());
var morgan = require('morgan');
var bodyParser = require('body-parser');

var port = 8080;
var apiPreface = '/api';

var modeler = require('./models/modeler');

// Configure the application
app.use(morgan('combined'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/json' }));
app.use(apiPreface, require('./routes/area-route'));
app.use(apiPreface, require('./routes/areas-route'));

app.listen(port);
console.log('server running...');

module.exports = app; // for testing