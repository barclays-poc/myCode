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



//API GET calls
//api home page
app.get('/', function(request, response){
	response.send('Please use the /api/tutorials or /api/tutorial');
})


//loads all tutorials on page load
app.get('/api/tutorials', function(request, response){
    Tutorials.getTutorials(function(err, tutorials){
     if(err){
      throw err;
     }
     response.json(tutorials);
    });
});


//Get Tutorials json by id
app.get('/api/tutorial/:id', function(request, response){
  Tutorial.getTutorialById(request.params.id, function(err, tutorial){
    if(err){
      throw err;
    }
    response.json(tutorial);
  })
});


//Get Tutorials json by id
app.get('/api/tutorials/:id', function(request, response){
  Tutorials.getTutorialsById(request.params.id, function(err, tutorials){
    if(err){
      throw err;
    }
    response.json(tutorials);
  })
});

//add tutorials to db
app.post('/api/writeToFile', function(request, response){

   var tutorialResponse = request.body;
   console.log(JSON.stringify(tutorialResponse));
    
    var fs = require('fs');
    
   fs.writeFile('../test.txt', JSON.stringify(tutorialResponse) , (err) => {
      if (err) response.json('{"status":"Error"}');;
      console.log('Written to the file');
    });
    
    response.json('{"status":"successfull"}');
});

app.listen(8080);
console.log("Server running on port 8080.....");
