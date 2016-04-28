@ECHO off

echo=================Starting mongoDB======================
start mongod 
echo=================mongoDB Started=======================

echo=================Start Node============================
start node ../app.js
echo=================Node Started========================== 