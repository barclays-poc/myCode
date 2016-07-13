var express = require('express');
var router = express.Router();
var fs = require('fs');
var https = require('https');
var path = require('path');
var request = require('requestretry');
var Docker = require('dockerode');
var env = require('../environment/environmentvariable');

//use logger
var log = require('../logger/config.js');
var logger=log.LOG;

//create and initialise docker
var docker = new Docker({
  protocol: 'https',
  host: env.dockerHost,
  port: process.env.DOCK_PORT || 2376,
  ca: fs.readFileSync(__dirname + '/ssl/'+ 'ca.pem'),
  cert: fs.readFileSync(__dirname + '/ssl/'+ 'cert.pem'),
  key: fs.readFileSync(__dirname + '/ssl/'+ 'key.pem')
});

var containerPort = null;
var containerId = null;

module.exports.processTutorial = function (imageName, containerName, tutorialOutput, response){
    //create container
    createContainer(imageName, containerName, response, tutorialOutput );
}

//create container to execute tutorial
function createContainer(imageName, containerName, response, tutorialOutput){
    logger.info("Image :" + imageName + "will be used");
    var image = docker.getImage(imageName);

    if(image = null){
      logger.info("Image:" +imageName+" is not available.");
      response.json('{"status":"Image required for this tutorial is missing"}');
    }else{
    docker.createContainer({Image: imageName, name:containerName}, function(err, container){
    container.start({"PortBindings": {"8081/tcp" : [
           {"HostPort": "8082-8085"}
         ]}},function(err, data){
      if(err){
        logger.error(err);
      }else{
        logger.info(container);
        containerId = container.id;
        logger.info("Container: "+ containerId + " created.");
        //get contianer info
        getContainerInfo(containerId, tutorialOutput, response);
       }
    });
  });
 }
}

//function to get container information required to construct
//container url
function getContainerInfo(containerId,tutorialOutput, response){
  var container = docker.getContainer(containerId);
  container.inspect(function (err, data) {
     logger.info("Container Information:")
     logger.info("Ip Address: " + data.NetworkSettings.IPAddress);

     var portdetails = JSON.stringify(data.NetworkSettings.Ports);
     var res = portdetails.replace("8081/tcp","port");
     var portJson = JSON.parse(res);
     var containerPort = portJson.port[0].HostPort;

     logger.info("Container Port : "+ portJson.port[0].HostPort);
     var url1 = 'http://'+env.dockerHost+':'+containerPort+'/api/deploy/3';
     postTutorialOutput(tutorialOutput, url1, response);
 })
}


//invoke the post endpoint in the container to execute contianer
function postTutorialOutput(tutorialOutput, url1, response1){
  //process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    request({
      method: 'POST',
      url:url1,
      body: tutorialOutput,
      json:true,
      maxAttempts: 3,
      retryDelay: 5000,
      retryStrategy: myRetryStrategy
    }, function (err, response, body){
      if(err){
        logger.info(err);
        response1.send(JSON.stringify(err));
      }
      if(response){
        logger.info(response.attempts);
      }
      if(body){
        logger.info(body);
        logger.info(JSON.stringify(body));
        response1.send(JSON.stringify(body));

      }
    });
}

function myRetryStrategy(err, response, body){
  // retry the request if we had an error or if the response was a 'Bad Gateway'
  logger.info(err);
  return err || response.statusCode === 502;
}
