# Dockerfile to create n image for Tutorial 3
# Based on Debian buildpack-deps:jessie-scm
# Software Node Js, OpenJDK & Jnuit 4.10

FROM buildpack-deps:jessie-scm

MAINTAINER M.Y. Aran

# Installing compression software
  RUN apt-get update && apt-get install -y --no-install-recommends \
		bzip2 \
		unzip \
		xz-utils \
	&& rm -rf /var/lib/apt/lists/*

# Default to UTF-8 file.encoding
  ENV LANG C.UTF-8

# Add a simple script that can auto-detect the appropriate JAVA_HOME value
# based on whether the JDK or only the JRE is installed
  RUN { \
		echo '#!/bin/sh'; \
		echo 'set -e'; \
		echo; \
		echo 'dirname "$(dirname "$(readlink -f "$(which javac || which java)")")"'; \
	} > /usr/local/bin/docker-java-home \
	&& chmod +x /usr/local/bin/docker-java-home

# Setting Java related environmental variables
  ENV JAVA_HOME /usr/lib/jvm/java-7-openjdk-amd64
  ENV JAVA_VERSION 7u101
  ENV JAVA_DEBIAN_VERSION 7u101-2.6.6-2~deb8u1

# Installing OpenJDK 7
  RUN set -x \
	&& apt-get update \
	&& apt-get install -y \
		openjdk-7-jdk="$JAVA_DEBIAN_VERSION" \
	&& rm -rf /var/lib/apt/lists/* \
	&& [ "$JAVA_HOME" = "$(docker-java-home)" ]

# Creating directory for JUnit
  RUN mkdir -p /usr/local/JUnit

# Copy Junit /jar
  COPY *.jar /usr/local/JUnit

# Setting addition environmentat variable for Jnut & Path
  ENV JUNIT_HOME /usr/local/JUNIT
	ENV PATH $PATH:$JAVA_HOME/bin/
  ENV CLASSPATH $JUNIT_HOME/junit4.10.jar:.

# Node.js
  RUN echo "Node.js installing."

# Installs Node.js and NPM
  RUN apt-get update; \
  apt-get install -y git curl; \
  curl -sL https://deb.nodesource.com/setup_5.x; \
  apt-get install -y nodejs npm

# Install API
  RUN echo "API deploying."

# Create working directory
	RUN mkdir -p /usr/api
	WORKDIR /usr/api

# install api dependency
	COPY api/package.json /usr/api
	RUN npm install

# Bundle app
  COPY api /usr/api

# Open HTTP port
	EXPOSE 8081

# Copies start scripts
	RUN mkdir -p /usr/start
	COPY start /usr/start

# Copy Junit /jar
	COPY *.jar /usr/local/JUnit

# Tutorial execute .sh
	COPY *.sh /usr/api/tutorialoutput/

# Setting addition environmentat variable for Junit & Path
	ENV JUNIT_HOME /usr/local/JUNIT
	ENV PATH $PATH:$JAVA_HOME/bin/
	ENV CLASSPATH $JUNIT_HOME/junit4.10.jar:.

#execute script on container start up
	CMD ["/usr/start/start.sh"]
