var express = require('express');
var app = express();
var bodyParser =  require('body-parser');
var https = require('https');
var log4js = require('log4js');
var fs = require('fs');
var http = require('http');

//use logger
var log = require('./logger/config.js');
var logger=log.LOG;

//contains api environment variables like port/domain/protocol
var env = require('./environment/environmentvariable');

//routes
var deploy = require('./routes/deploy.js');

app.use(function(req, res, next){
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
})

//parse body of request as json
app.use(bodyParser.json());

//deploy route
app.use('/api/deploy', deploy);

//Server info
logger.info("Port: "+ env.port);
logger.info("Domain: "+ env.domain);
logger.info("Protocol: "+ env.protocol);

//create server
//  https.createServer({
//   key: fs.readFileSync(__dirname + '/ssl/key.pem'),
//   cert: fs.readFileSync(__dirname + '/ssl/cert.pem')
// }, app).listen(env.port);

//create http server
app.listen(env.port);

//server info
logger.info("Server Initialised");
logger.info("API url: "+env.protocol+"://"+env.domain+":"+env.port);
