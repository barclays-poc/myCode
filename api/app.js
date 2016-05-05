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


//loads all tutorial on page load
app.get('/api/tutorial', function(request, response){
    Tutorial.getTutorial(function(err, tutorial){
     if(err){
      throw err;
     }
     response.json(tutorial);
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


//API POST calls
//add tutorials to db
app.post('/api/tutorials', function(request, response){
   //access everything that comes in from a form and assign to 
   //tutorials
   var tutorials = request.body;
   console.log(tutorials);
    Tutorials.addTutorials(tutorials, function(err, tutorials){
     if(err){
     	throw err;
     }
     response.json(tutorials);
    });
});

//add tutorials to db
app.post('/api/tutorial', function(request, response){
   //access everything that comes in from a form and assign to 
   //tutorials
   var tutorial = request.body;
   console.log(tutorial);
    Tutorial.addTutorial(tutorial, function(err, tutorial){
     if(err){
      throw err;
     }
     response.json(tutorial);
    });
});


//add tutorials to db
app.post('/api/writeToFile', function(request, response){

   var tutorialResponse = request.body;
   console.log(JSON.stringify(tutorialResponse));
    
    var fs = require('fs');
    
   fs.writeFile('../test.txt', JSON.stringify(tutorialResponse) , (err) => {
      if (err) throw err;
      console.log('Written to the file');
    });
    
    response.json('{"status":"successfull"}');
});

//API PUT calls 
/*//updates content in db
app.put('/api/contents/:_id', function(request, response){
   //access everything that comes in from a form and assign to 
   //content
   var id = request.params._id;
   var content = request.body;
    Content.updateContent(id,content,{} ,function(err, content){
     if(err){
     	throw err;
     }
     response.json(content);
    });
});
*/


//API DELETE calls
//delete tutorials in db
app.delete('/api/tutorials/:id', function(request, response){
   //access everything that comes in from a form and assign to 
   //content
   var id = request.params.id;
   var tutorials = request.body;
    Tutorials.deleteTutorials(id,function(err, tutorials){
     if(err){
     	throw err;
     }
     response.json(tutorials);
    });
});

//API DELETE calls
//delete tutorial in db
app.delete('/api/tutorial/:id', function(request, response){
   //access everything that comes in from a form and assign to 
   //content
   var id = request.params.id;
   var tutorial = request.body;
    Tutorial.deleteTutorial(id,function(err, tutorial){
     if(err){
      throw err;
     }
     response.json(tutorial);
    });
});

app.listen(8888);
console.log("Server running on port 8888.....");
