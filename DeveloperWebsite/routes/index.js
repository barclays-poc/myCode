var express = require('express');
var router = express.Router();

/*
var http = require('http');
//GET api call
var optionsget = {
  host : 'localhost', // here only the domain name
  // (no http/https !)
  port : 8888,
  //path : '/api/books/5713ac5dde17138365db9300', // the rest of the url with parameters if needed
  path : '/api/contents',
  method : 'GET' // do GET
};

console.info('Options prepared:');
console.info(optionsget);
console.info('Do the GET call');

// do the GET request
var reqGet = http.request(optionsget, function(res) {
  console.log("statusCode: ", res.statusCode);
  // uncomment it for header details
//  console.log("headers: ", res.headers);
  res.on('data', function(d) {
    console.info('GET result:\n');
    //process.stdout.write(d);
    var responseObject = JSON.parse(d);
    console.log(responseObject);
    console.info('\n\nCall completed');
  });


});

reqGet.end();
reqGet.on('error', function(e) {
  console.error(e);
});

*/


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });

});

module.exports = router;