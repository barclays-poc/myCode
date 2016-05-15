@echo off
echo start setup of Docker environment
FOR /f "tokens=*" %%i IN ('docker-machine env default') DO %%i
echo setup of Docker environment complete
echo.

echo start build of myCode image
docker build -q -t barclays-mycode .
echo build of myCode image complete
echo.

docker rm -f myCode

echo start provision of myCode container
docker run -d -p 27017:27017 -p 8080:8080 --name myCode barclays-mycode
echo provision of myCode container complete
echo.

pause
