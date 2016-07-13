var log4js = require('log4js');

//configuring the logger for consol and file
log4js.configure({
appenders: [
  { type: 'console'}
  //,{ type: 'file', filename: "c://test.log", category: 'my_project' }
 ]
});

//logger for buildapi project
var logger  = log4js.getLogger('buildapi');

//configuring the logger level
logger.setLevel('DEBUG');

//converting logger to static variables
//so its available outside this file
Object.defineProperty(exports, "LOG", { value:logger });
