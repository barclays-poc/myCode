var express = require('express');
var router = express.Router();
var fs = require('fs');
var https = require('https');
var pump = require('pump');
var path = require('path');
var build = require('dockerode-build');

//create and initialise docker
var Docker = require('dockerode');
var docker = new Docker({
  protocol: 'https',
  host: '192.168.99.100',
  port: process.env.DOCK_PORT || 2376,
  ca: fs.readFileSync('C:/Users/aran/.docker/machine/machines/default/'+ 'ca.pem'),
  cert: fs.readFileSync('C:/Users/aran/.docker/machine/machines/default/'+ 'cert.pem'),
  key: fs.readFileSync('C:/Users/aran/.docker/machine/machines/default/'+ 'key.pem')
});

//use logger
var log = require('../logger/config.js');
var logger=log.LOG;

//defines deploy page route
router.post('/', function(request, response){
  var tutorialRequest = request.body;
  logger.info("Request Detail: " + JSON.stringify(tutorialRequest, null, 4));

  writeOutput(tutorialRequest,request,response);

//docker container connection test
  // var container = docker.getContainer('d43c5a26d7c3');
  // container.inspect(function (err, data) {
  //   console.log(data);
  // });

//docker image connection test
  // var image = docker.getImage('4812296bb057');
  // image.inspect(function(err, data){
  //   console.log(data);
  // })


var imageName = 'testbuildnode2';
console.log(__dirname);
 docker.buildImage('./deploy/env/1/archive.tar', {t: imageName}, function(err, response){
    if(err){
      logger.error(err);
    }else{
    response.pipe(process.stdout, {end:true});

    response.on('end', function (){
      createcontainer();
    });
    }
    //logger.info(response);
  })
});

function createcontainer(){
  docker.createContainer({Image: "testbuildnode2"}, function(err, container){
    container.start({"PortBindings": {"8083/tcp" : [
      {"HostPort": "8080"}
    ]}}, function(err, data){
      if(err){
        logger.error(err);
      }
    })
  })
}

//writes user ouput to correct file
function writeOutput(tutorialRequest,request,response){
  var filename = "./deploy/code/";

  //loop through the array and write the tutorial output to file
  for (var code in tutorialRequest){
    var extension = "";

    logger.info("Output Id: " + tutorialRequest[code].id);
    logger.info("Mode: " + tutorialRequest[code].mode);
    logger.info("Code:\n" + tutorialRequest[code].value);

    //setting correct extensions
    if(tutorialRequest[code].mode == "gherkin"){
      extension = "feature";
    }else{
      extension = tutorialRequest[code].mode;
    }

    //creating the file with tutorial output
    fs.writeFile(filename + tutorialRequest[code].id+"."+extension, tutorialRequest[code].value , function(err){
      if (err) {
        logger.error(err);
        response.json('{"status":"Error"}');
      }
    });
    logger.info("File Written: " + filename + tutorialRequest[code].id+"."+extension);
  }
  response.json('{"status":"successfull"}');
}

module.exports = router;
