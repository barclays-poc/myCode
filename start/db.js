/* Gets the reference to the DB*/
var db = connect("localhost:27017/api");

/* Creates the collections */
db.createCollection('tutorial');
db.createCollection('tutorials');

/* Loops around the files and loads*/
