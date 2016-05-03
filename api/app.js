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
var Content = require ('./models/content');
var Tutorial = require ('./models/tutorial');
var Platform = require ('./models/platform');

//connect to mongoose
mongoose.connect('mongodb://localhost/api');
var db = mongoose.connection;



//API GET calls
//api home page
app.get('/', function(request, response){
	response.send('Please use the /api/contents or /api/tutorials or /api/platforms');
})

//loads all contents on page load
app.get('/api/contents', function(request, response){
    Content.getContent(function(err, contents){
     if(err){
      throw err;
     }
     response.json(contents);
    });
});

//loads all tutorial on page load
app.get('/api/tutorials', function(request, response){
    Tutorial.getTutorial(function(err, tutorials){
     if(err){
      throw err;
     }
     response.json(tutorials);
    });
});

//loads all tutorial on page load
app.get('/api/platforms', function(request, response){
    Platform.getPlatform(function(err, platforms){
     if(err){
      throw err;
     }
     response.json(platforms);
    });
});

//Get Content json by id
app.get('/api/contents/:_id', function(request, response){
	Content.getContentById(request.params._id, function(err, content){
		if(err){
			throw err;
		}
		response.json(content);
	})
});

//Get Tutorials json by id
app.get('/api/tutorials/:_id', function(request, response){
  Tutorial.getTutorialById(request.params._id, function(err, tutorials){
    if(err){
      throw err;
    }
    response.json(tutorials);
  })
});

//Get Tutorials json by id
app.get('/api/platforms/:_id', function(request, response){
  Platform.getPlatformById(request.params._id, function(err, platform){
    if(err){
      throw err;
    }
    response.json(platform);
  })
});

//API POST calls
//add content to db
app.post('/api/contents', function(request, response){
   //access everything that comes in from a form and assign to 
   //content
   var content = request.body;
    Content.addContent(content, function(err, content){
     if(err){
     	throw err;
     }
     response.json(content);
    });
});


//API PUT calls 
//updates content in db
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


//API DELETE calls
//delete content in db
app.delete('/api/contents/:_id', function(request, response){
   //access everything that comes in from a form and assign to 
   //content
   var id = request.params._id;
   var content = request.body;
    Book.deleteContent(id,function(err, content){
     if(err){
     	throw err;
     }
     response.json(content);
    });
});

app.listen(8888);
console.log("Server running on port 8888.....");
