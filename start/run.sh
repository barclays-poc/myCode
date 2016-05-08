#!/bin/bash

mongod
mongo /usr/scripts/db.js
nodejs /usr/api/app.js

read
