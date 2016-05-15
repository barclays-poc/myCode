var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

app.use(function(req, res, next){
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
})

//tells to parse the body of a request as json
app.use(bodyParser.json());

//assign model
var Tutorials = require ('./models/tutorials');
var Tutorial = require ('./models/tutorial');

//connect to mongoose
mongoose.connect('mongodb://localhost/api');
var db = mongoose.connection;

function log( request, messageType, object)
{
  console.log("");
  console.log(request.protocol + '://' + request.get('host') + request.originalUrl + " - " + messageType);
  console.log(JSON.stringify(object, null, 2));
}

//API GET calls
//api home page
app.get('/', function(request, response){
	response.send('Please use the /api/tutorials');
})


//loads all tutorials on page load
app.get('/api/tutorials', function(request, response){
    Tutorials.getTutorials(function(err, tutorials){
     if(err){
      throw err;
     }

     log(request, "Response", tutorials[0]);
     response.json(tutorials[0]) ;
    });
});


//Get Tutorials json by id
app.get('/api/tutorials/:id', function(request, response){

  Tutorial.getTutorialById(request.params.id, function(err, tutorial){
    if(err){
      throw err;
    }

    log(request, "Response", tutorial);
    response.json(tutorial);
  })
});

//add tutorials to db
app.post('/api/tutorials/:id/build', function(request, response){

    var tutorialRequest = request.body;
    log(request, "Request", tutorialRequest);

    var fs = require('fs');

    fs.writeFile('../test.txt', JSON.stringify(tutorialRequest) , (err) => {
        if (err) response.json('{"status":"Error"}');;
    });

    response.json('{"status":"successfull"}');
});

app.listen(8080);
console.log("Server running on port 8080.....");
