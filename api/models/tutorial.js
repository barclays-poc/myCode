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
  },
    dockerfile : {type: String, required: true},
    reviewSwitch : {type: Boolean, default: true}
});

//exposing the tutorial object for the whole api
var Tutorial = module.exports = mongoose.model('Tutorial', tutorialSchema, 'tutorial');

//get tutorial by id
//GET call
module.exports.getTutorialById = function(id, callback){
  //Tutorial.findById(id, callback);
  var condition = {id: id};
  Tutorial.findOne(condition, callback);
}

