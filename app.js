var config = require('./modules/config')
  , express = config.express
  , cons = config.consolidate
  , connect = config.connect
  , swig = config.swig
  , app = config.app
  , logger = config.logger
  , requireDir = require('require-dir')
  , https = require('https')
  , spdy = require('spdy')
  , options = {
      key:config.EXPRESS_KEY,
      ca:config.EXPRESS_CA,
      cert:config.EXPRESS_CERT
    }
  ;

var routes = require('./routes');

if(!module.parent){
  console.log('starting app on port '+config.EXPRESS_PORT);
  app.use(logger);
  try{
    app.listen(config.EXPRESS_PORT);
    //https.createServer(options,app).listen(config.EXPRESSL_PORT);
    spdy.createServer(options,app).listen(config.EXPRESSL_PORT);
  }catch(e){
    console.log('couldnt start on port '+config.EXPRESS_PORT+': '+e+'\nstarting on port '+config.EXPRESS_BAK_PORT);
    app.listen(config.EXPRESS_BAK_PORT);
  }
}
module.exports = app;
