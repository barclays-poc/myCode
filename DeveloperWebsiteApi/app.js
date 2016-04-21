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


app.use(bodyParser.json());

//assign model
var Content = require ('./models/content');

//connect to mongoose
mongoose.connect('mongodb://localhost/api');
var db = mongoose.connection;


app.get('/', function(request, response){
	response.send('Please use the /api/contents');
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

//Get Content json by id
app.get('/api/contents/:_id', function(request, response){
	Content.getContentById(request.params._id, function(err, content){
		if(err){
			throw err;
		}
		response.json(content);
	})
})

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
