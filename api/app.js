var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var https = require('https');
var http = require('http');
var fs = require('fs');

app.use(function(req, res, next){
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
})

//tells to parse the body of a request as json
app.use(bodyParser.json());

//connect to mongoose
mongoose.connect('mongodb://localhost/api');
var db = mongoose.connection;

//logger configuration
var log = require('./logger/config.js');
var logger=log.LOG;

//contains api environment variables like port/domain/protocol
var env = require('./environment/environmentvariable');

//Server info
logger.info("Port: "+ env.port);
logger.info("Domain: "+ env.domain);
logger.info("Protocol: "+ env.protocol);

//assign route
var tutorials = require('./routes/tutorials.js');

//swagger object
var Swagger = require('./swagger.js');

//configure swagger
Swagger.configureSwagger(app, env.port, env.domain);

//API GET calls
//api home page
app.get('/', function(request, response){
	response.send('Please use the /api/tutorials');
})

//api tutorials endpoint
app.use('/api/tutorials', tutorials);

//create https server
// https.createServer({
//   key: fs.readFileSync(__dirname + '/ssl/key.pem'),
//   cert: fs.readFileSync(__dirname + '/ssl/cert.pem')
// }, app).listen(8080);

//create http server
app.listen(env.port);

//server info
logger.info("Server Initialised");
logger.info("API url: "+env.protocol+"://"+env.domain+":"+env.port);
