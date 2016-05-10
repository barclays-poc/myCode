#build
docker build -t docker-mycode .
#run
docker run -d -p 27017:27017 -p 8080:8080 --name myCode docker-mycode