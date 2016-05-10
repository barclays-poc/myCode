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

module.exports.getTutorialsById = function(id, callback){
  //Tutorial.findById(id, callback);
  var condition = {id: id};
  Tutorials.findOne(condition, callback);
}

