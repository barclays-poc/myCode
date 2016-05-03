var mongoose = require('mongoose');

//tutorial schema required for api
var tutorialSchema = mongoose.Schema({
  _id: {type: Number, required:true},
  name: {type: String, required: true},
  asset: {
    id: {type: Number, required: true},
    name: {type: String, required: true},
    content: {type: String, required: true},
    diagram: {type: String},
    resources: [new mongoose.Schema({
      title: {type: String, required: true},
      target: {type: String},
      url: {type: String}, },
      {_id: false })]
  },
  requirement: {
    new: {type: String},
    example: {type: String}
  },
  design: {type: String},
  code: {
    segments: [{
      id: {type: Number, required: true},
      command: {type: String, required: true},
      mode: {type: String, required: true} ,
      example: {type: String}
    }],
    video: {type: String}
  },
  test: {
    segments: [{
      id: {type: Number, required: true},
      command: {type: String, required: true},
      mode: {type: String, required: true} ,
      example: {type: String}
    }],
    video: {type: String}    
  }
});

//exposing the tutorial object for the whole api
var Tutorial = module.exports = mongoose.model('Tutorial', tutorialSchema);

//get all tutorials from mongo
//GET call
module.exports.getTutorial = function(callback, limit){
  Tutorial.find(callback).limit(limit);
}

//get tutorial by id
//GET call
module.exports.getTutorialById = function(id, callback){
  Tutorial.findById(id, callback);
}

// Creates Content in DB
//POST call
module.exports.addContent = function(content, callback){
  Content.create(content, callback);
}

//updates Content in DB
//PUT call
module.exports.updateContent = function(content, callback){
  var condition = {_id: id};
  var update = {
     platformName: content.platform
  }
  Content.findOneAndUpdate(condition, update, options, callback);
}

//Removes Content in DB
//DELETE call
module.exports.deleteContent = function(id, callback){
  var condition = {_id: id};
  Content.remove(condition, callback);
}

