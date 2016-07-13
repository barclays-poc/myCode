var express = require('express');
var router = express.Router();
var fs = require('fs');
var https = require('https');
var path = require('path');
var request = require('requestretry');

//mongoose models and db methods
var Tutorials = require ('../models/tutorials');
var Tutorial = require ('../models/tutorial');

//docker methods
var container = require('../docker/container');

//use logger
var log = require('../logger/config.js');
var logger=log.LOG;

//create and initialise docker
var Docker = require('dockerode');
var docker = new Docker({
  protocol: 'https',
  host: '192.168.99.100',
  port: process.env.DOCK_PORT || 2376,
  ca: fs.readFileSync(__dirname + '/docker/'+ 'ca.pem'),
  cert: fs.readFileSync(__dirname + '/docker/'+ 'cert.pem'),
  key: fs.readFileSync(__dirname + '/docker/'+ 'key.pem')
});

//loads all tutorials on page load
router.get('/', function(req, response){
    Tutorials.getTutorials(function(err, tutorials){
     if(err){
      logger.error(err);
     }
     logger.info(req, "Response", tutorials[0]);
     response.json(tutorials[0]) ;
    });
});

//Get Tutorials json by id
router.get('/:id', function(req, response){
  try
  {
    Tutorial.getTutorialById(req.params.id, function(err, tutorial){
      if(err){
        logger.error(err);
      }
      logger.info(req, "Response", tutorial);
      response.json(tutorial);
    })
  } catch (e) {
  } finally {
  }
});

//create tutorial envrionment and deploy tutorial output
router.post('/:id/build', function(req, response){
    var tutorialRequest = req.body;
    //log(request, "Request", tutorialRequest);
    logger.info(tutorialRequest);

    //container name
    var date = new Date();
    var minute = date.getMinutes();
    var hour = date.getHours();
    var sec = date.getSeconds();
    var containerName = imagename + hour + minute + sec;

    //docker image
    var imagename = 'docker-java';

    logger.info("Image: " + imagename);
    logger.info("Container Name: "+ containerName);
    container.processTutorial(imagename,containerName, tutorialRequest, response);
    //response.json('{"status":"successfull"}');
});

module.exports = router;
