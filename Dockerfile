# Dockerizing myCode backend
# Based on ubuntu:latest
# Node.js & MongoDB

FROM ubuntu:latest

MAINTAINER M.Y. Jonathan Fenwick jmjfenwick@gmail.com

RUN echo "Start Image Build"

# MongoDB

  RUN echo "MongoDB installing..."

  # Import MongoDB public GPG key AND create a MongoDB list file
  RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927
  RUN echo "deb http://repo.mongodb.org/apt/ubuntu trusty/mongodb-org/3.2 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-3.2.list

  # Update apt-get sources AND install MongoDB
  RUN apt-get update && apt-get install -y mongodb-org

  # Create the MongoDB data directory and copies scripts
  RUN mkdir -p /data/db

  # Expose port 27017 from the container to the host
  EXPOSE 27017

# Node.js

  RUN echo "Node.js installing..."

  # Installs Node.js and NPM
  RUN apt-get install -y nodejs
  RUN apt-get install -y npm

# Install App

  RUN echo "API application deploying..."

  # Create app directory in the image
  RUN mkdir -p /usr/api
  WORKDIR /usr/api

  # Installs any dependencies
  COPY api/package.json /usr/api
  RUN npm install

  # Bundle app source
  COPY api /usr/api

  # Opens HTTP port
  EXPOSE 8080

# Handles custom scripts

  # Copies the data
  RUN echo "Data copying..."
  RUN mkdir -p /usr/data
  COPY data /usr/data

  # Copies the scripts
  RUN echo "Start scripts copying..."
  RUN echo "Copies the start commands"
  RUN mkdir -p /usr/start
  COPY start /usr/start


  CMD ["/bin/bash","/usr/start/start.sh"]
