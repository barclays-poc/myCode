var mongoose = require('mongoose');

//platform schema require for api
var platformSchema = mongoose.Schema({
  _id: {type: Number, required: true},
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

//exposing and assing the platform model
var Platform = module.exports = mongoose.model('Platform', platformSchema);

//get all platforms from mongoo
module.exports.getPlatform = function(callback, limit){
  Platform.find(callback).limit(limit);
}

//get platform by id
module.exports.getPlatformById = function(id, callback){
  Platform.findById(id, callback);
}