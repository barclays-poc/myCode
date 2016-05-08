# Dockerizing myCode backend
# Based on ubuntu:latest
# Node.js & MongoDB

FROM ubuntu:latest

MAINTAINER M.Y. Jonathan Fenwick jmjfenwick@gmail.com

# MongoDB

  # Import MongoDB public GPG key AND create a MongoDB list file
  RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927
  RUN echo "deb http://repo.mongodb.org/apt/ubuntu trusty/mongodb-org/3.2 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-3.2.list

  # Update apt-get sources AND install MongoDB
  RUN apt-get update && apt-get install -y mongodb-org

  # Create the MongoDB data directory and copies scripts
  RUN mkdir -p /data/db

  # Expose port 27017 from the container to the host
  EXPOSE 27017

  CMD ["/usr/bin/mongod"]

  # Confirms MongoDB completed
  RUN echo "MongoDB installed in image"

# Node.js

  # Installs Node.js and NPM
  RUN apt-get install -y nodejs
  RUN apt-get install -y npm

  RUN echo "Node.js installed in image"

# Install App

  # Create app directory in the image
  RUN mkdir -p /usr/api
  WORKDIR /usr/api

  # Installs any dependencies
  COPY api/package.json /usr/api
  RUN npm install

  # Bundle app source
  COPY api /usr/api

  # Opens HTTP port
  EXPOSE 8888

  RUN echo "API application deployed into image"

# Handles custom scripts

  # Copies the scripts
  RUN mkdir -p /usr/start
  COPY start /usr/start
  RUN echo "Start up aretfacts copied to image"
