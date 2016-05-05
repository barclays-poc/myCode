var mongoose = require('mongoose');

//tutorials schema required for api
var tutorialsSchema = mongoose.Schema({
  id: {type: Number, required: true},
  name: {type: String, required: true},
  children: [new mongoose.Schema({
      name: {type: String},
      name: {type: String},
      children: [new mongoose.Schema({
          name: {type: String},
          children: [new mongoose.Schema({
            name: {type: String},
            id: {type: String}, },
          {_id: false})]
        },
      {_id: false})]
    } ,
  {_id: false})]
})

//exposing the tutorial object for the whole api
var Tutorials = module.exports = mongoose.model('Tutorials', tutorialsSchema, 'tutorials' );

//get all tutorials from mongo
//GET call
module.exports.getTutorials = function(callback, limit){
  Tutorials.find(callback).limit(limit);
}

//get tutorial by id
//GET call
module.exports.getTutorialsById = function(id, callback){
  //Tutorials.findById(id, callback);
  var condition = {id: id};
  Tutorials.findOne(condition, callback);
}

// Creates tutorial in DB
//POST call
module.exports.addTutorials = function(tutorials, callback){
  Tutorials.create(tutorials, callback);
}

//updates tutorial in DB
//PUT call
module.exports.updateTutorials = function(content, callback){
  var condition = {id: id};
  var update = {
     platformName: content.platform
  }
  Tutorials.findOneAndUpdate(condition, update, options, callback);
}

//Removes tutorial in DB
//DELETE call
module.exports.deleteTutorials = function(id, callback){
  var condition = {id: id};
  Tutorials.remove(condition, callback);
}

