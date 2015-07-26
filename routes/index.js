var config = require('../modules/config')
  , app = config.app
  , spdypush = require('../modules/spdypush')
  , fs = require('fs')
  , path = require('path')
  ;

require('./send');
require('./send-stephaniecochard');
require('./registry');
require('./rsvp');
require('./photos');
require('./manager');
require('./australia');

app.get('/', function(req,res){
  "use strict";
  res.render('index',{name:config.NAME,
    h1:config.EVENT_DESCRIPTION,
    date:config.EVENT_DATE,
    loc:config.EVENT_LOCATION_LINK
    });
});
