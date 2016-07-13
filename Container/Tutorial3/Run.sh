#dos2unix
dos2unix start/start.sh
#build
docker build -t docker-java .
#run
#docker run -d -p 8081:8081 --name myCode-test docker-java
