var mongoose = require('mongoose');

//tutorials schema required for api
var tutorialsSchema = mongoose.Schema({
  version: {type: Number, required: true},
  id: {type: Number, required: true},
  name: {type: String, required: true},
  children: [new mongoose.Schema({
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

//get tutorials json from mongo
//GET call
module.exports.getTutorials = function(callback, limit){
  Tutorials.find(callback).limit(limit);
}
