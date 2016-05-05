var mongoose = require('mongoose');

//sub schema required for resouce
var subResourceSchema = mongoose.Schema({
      title: {type: String, required: true},
      target: {type: String},
      url: {type: String}, 
    }, {_id: false });

//sub schema required for sub segments
var subSegmentSchema = mongoose.Schema({
      id: {type: Number, required: true},
      command: {type: String, required: true},
      mode: {type: String, required: true} ,
      example: {type: String}, 
    }, {_id: false});

//tutorial schema required for api
var tutorialSchema = mongoose.Schema({
  id: {type: Number, required:true},
  name: {type: String, required: true},
  asset: {
    id: {type: Number, required: true},
    name: {type: String, required: true},
    content: {type: String, required: true},
    diagram: {type: String},
    resources: [subResourceSchema]
  },
  requirement: {
    new: {type: String},
    example: {type: String}
  },
  design: {type: String},
  code: {
    segments: [subSegmentSchema],
    video: {type: String}
  },
  test: {
    segments: [subSegmentSchema],
    video: {type: String}    
  }
});

//exposing the tutorial object for the whole api
var Tutorial = module.exports = mongoose.model('Tutorial', tutorialSchema, 'tutorial');

//get all tutorial from mongo
//GET call
module.exports.getTutorial = function(callback, limit){
  Tutorial.find(callback).limit(limit);
}

//get tutorial by id
//GET call
module.exports.getTutorialById = function(id, callback){
  //Tutorial.findById(id, callback);
  var condition = {id: id};
  Tutorial.findOne(condition, callback);
}

// Creates tutorial in DB
//POST call
module.exports.addTutorial = function(content, callback){
  Tutorial.create(content, callback);
}

//updates tutorial in DB
//PUT call
module.exports.updateTutorial = function(content, callback){
  var condition = {id: id};
  var update = {
     platformName: content.platform
  }
  Tutorial.findOneAndUpdate(condition, update, options, callback);
}

//Removes tutorial in DB
//DELETE call
module.exports.deleteTutorial = function(id, callback){
  var condition = {id: id};
  Tutorial.remove(condition, callback);
}

