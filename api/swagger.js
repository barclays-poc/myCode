var argv = require('minimist')(process.argv.slice(2));
var swagger = require('swagger-node-express');
var bodyParser = require('body-parser');
var express = require('express');
var path = require('path');

module.exports.configureSwagger = function (app, port, domain){

  //coupling subpath with swagger
  swagger.setAppHandler(app);

  //serve static files
  app.use(express.static(path.join(__dirname + '/dist')));

  //setting api info
  swagger.setApiInfo({
    title: "Developer Website Tutorial/Tutorials API",
    description: "This API is for a MongoDB database containing information on Tutorial & Tutorials which will be used to drive the Developer Website.",
  });

  //getting the /dist/index.html for swagger UI
  app.get('/swagger', function(request, response){
    response.sendFile(path.join(__dirname + '/dist/index.html'));
    console.log(__dirname + '/dist/index.html');
  });

  //set api-doc path
  //swagger.configureSwaggerPaths('', path.join(__dirname + '/dist/index.htm'), '');

  //configure the api domain
  if(argv.domain !== undefined){
    domain = argv.domain;
  }else{
    console.log('No --domain=xxx specified, taking default hostname "localhost".')
  }

  //configure the api port
  if(argv.port !== undefined){
    port = argv.port;
  }else{
    console.log('No --port=xxx specified, taking default port ' + port + '.' );
  }

  //set and display the application URL
  var applicationUrl = 'http://'+ domain + ':' + port;
  console.log('API running on ' + applicationUrl);

  //configure application to swagger
  swagger.configure(applicationUrl, '1.0.0');
}
