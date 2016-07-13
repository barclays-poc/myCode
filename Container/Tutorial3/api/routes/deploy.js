var express = require('express');
var router = express.Router();
var fs = require('fs');
var https = require('https');
const execFile = require('child_process').execFile;

//use logger
var log = require('../logger/config.js');
var logger=log.LOG;

var scriptToExecute = '/usr/api/tutorialoutput/execute.sh';

//defines deploy page route
router.post('/:id', function(request, response){
  var tutorialRequest = request.body;
  logger.info("Request Detail: " + JSON.stringify(tutorialRequest, null, 4));

  writeOutput(tutorialRequest);
  executeTutorial(scriptToExecute,response);

});

//writes user ouput to correct file
function writeOutput(tutorialRequest){
   fileLocation = "./tutorialoutput/";

  //loop through the array and write the tutorial output to file
  for (var code in tutorialRequest){
    logger.info("Output Id: " + tutorialRequest[code].id);
    logger.info("Mode: " + tutorialRequest[code].mode);
    logger.info("Code:\n" + tutorialRequest[code].value);
    logger.info("filename: "+ tutorialRequest[code].filename);

    //creating file with tutorial output
  fs.writeFile(fileLocation + tutorialRequest[code].filename, tutorialRequest[code].value , function(err){
      if (err) {
        logger.error(err);
        response.json('{"status":"Error"}');
      }
    });
    logger.info("File Written: " + fileLocation + tutorialRequest[code].filename);
  }
}


//executes the tutorial
function executeTutorial(shellscript, response){
  const child = execFile(shellscript, function (error, stdout, stderr){
    if (error){
      logger.info(error);
      //logger.info(stderr);
    }
    logger.info(stdout);
  if(error == null) {
    var output = '{"status": "success", "outputMessage": "Tutorial executed successfully output below", "outputValue" : ' + JSON.stringify(stdout) + '}';
  }else {
    var output = '{"status": "error", "outputMessage": "Error Message", "outputValue": ' + JSON.stringify(stderr) +'}';
  }
  console.log(output);
    response.json(output);
  });
}

module.exports = router;
