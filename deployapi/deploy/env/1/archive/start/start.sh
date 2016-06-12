#!/bin/bash

  echo "Starts MongoDB"
  mongod --fork --logpath /var/log/mongod.log

# Drops the current objectes==s
  echo "Removes previous database state"
  mongo api --eval "db.dropDatabase();"

# Sets the working directory
  cd "/usr/data"

# Deletes the collections
  for d in */ ; do
    mongo api --eval "db.${d%?}.drop();"
    echo "Removed collection ${d%?}"
  done

# Connects to the API DB
  echo "Creates the database"
  mongo --eval "connect(\"localhost:27017/api\");"

# Creates the colleactions in the DB
  for d in */ ; do

    #Creates collection
    mongo api --eval "db.createCollection(\"${d%?}\");"
    echo "Created collection ${d%?}"

    #Loads the data files into the collection
    for f in ${d%?}/* ; do
        mongoimport --db api --collection "${d%?}" --type "json" --file "/usr/data/$f"
        echo "Loaded $f into ${d%?}"
    done

  done

# Finally starts the API - This will fail if DB not started
  echo "Starts the API listening for requests"
  nodejs /usr/api/app.js
