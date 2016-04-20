var mongoose = require('mongoose');

//content schema - required for application not for DB
var contentSchema = mongoose.Schema({
  _id: {type: String, required: true},
	platformGroup: { type: String, required: true },
	platformName: { type: String, required: true },
	requirements:{
      	content: { type: String }, 
         information: [new mongoose.Schema({
            title: { type: String },
            url: { type: String }, }, 
          {_id: false} )] ,
         additional: [new mongoose.Schema({
             title: { type: String },
             url: { type: String },
             target: { type: String },
          }, {_id: false})],
         tutorial: [new mongoose.Schema({
             title: { type: String },
             url: { type: String },
         }, {_id: false})]
  },
  design:{
        content: { type: String }, 
         information: [new mongoose.Schema({
            title: { type: String },
            url: { type: String }, }, 
          {_id: false} )] ,
         additional: [new mongoose.Schema({
             title: { type: String },
             url: { type: String },
             target: { type: String },
          }, {_id: false})],
         tutorial: [new mongoose.Schema({
             title: { type: String },
             url: { type: String },
         }, {_id: false})]
  },  
  build:{
        content: { type: String }, 
         information: [new mongoose.Schema({
            title: { type: String },
            url: { type: String }, }, 
          {_id: false} )] ,
         additional: [new mongoose.Schema({
             title: { type: String },
             url: { type: String },
             target: { type: String },
          }, {_id: false})],
         tutorial: [new mongoose.Schema({
             title: { type: String },
             url: { type: String },
         }, {_id: false})]
  },  
  test:{
        content: { type: String }, 
         information: [new mongoose.Schema({
            title: { type: String },
            url: { type: String }, }, 
          {_id: false} )] ,
         additional: [new mongoose.Schema({
             title: { type: String },
             url: { type: String },
             target: { type: String },
          }, {_id: false})],
         tutorial: [new mongoose.Schema({
             title: { type: String },
             url: { type: String },
         }, {_id: false})]
  }
});

//make the genre object accessiable from whole app
var Content = module.exports = mongoose.model('Content', contentSchema);

//Get all Contents from DB
//exposed to whole app
//callback and limit passed throug the route
module.exports.getContent = function(callback, limit){
   Content.find(callback).limit(limit);
}

//Get content by id
module.exports.getContentById = function(id, callback){
   Content.findById(id,callback);
}

// Creates Content in DB
module.exports.addContent = function(content, callback){
  Content.create(content, callback);
}

//updates Content in DB
module.exports.updateContent = function(content, callback){
  var condition = {_id: id};
  var update = {
     platformName: content.platform
  }
  Content.findOneAndUpdate(condition, update, options, callback);
}

//Removes Content in DB
module.exports.deleteContent = function(id, callback){
  var condition = {_id: id};
  Content.remove(condition, callback);
}



