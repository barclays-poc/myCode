#!/bin/bash
  echo "Starts MongoDB"
  mongod --fork --logpath /var/log/mongod.log
# Drops the current objectes==s
  echo "Removes previous database state"
  mongo api --eval "db.dropDatabase();"
  mongo api --eval "db.tutorials.drop();"
  mongo api --eval "db.tutorial.drop();"
# Connects to the API DB
  echo "Creates the database"
  mongo --eval "connect(\"localhost:27017/api\");"
# Creates the colleactions in the DB
  echo "Creates the collections"
  mongo api --eval "db.createCollection(\"tutorials\");"
  mongo api --eval "db.createCollection(\"tutorial\");"
# Need to generate this dynamically based on file lists
  echo "Loads the data into the API database"
  mongoimport --db api --collection "tutorials" --type "json" --file "/usr/data/tutorials.json"
  mongoimport --db api --collection "tutorial" --type "json" --file "/usr/data/tutorial.json"
# Finally starts the API - This will fail if DB not started
  echo "Starts the API listening for requests"
  nodejs /usr/api/app.js
