var config = require('../modules/config')
  , app = config.app
  ;

require('./restart');
require('./send');
require('./registry');
require('./rsvp');
require('./photos');
require('./manager');
require('./australia');

app.get('/', function(req,res){
  "use strict";
  res.render('index',{name:'stephanieandgreg.us',
    h1:'The wedding of Stephanie Schmidt and Greg Cochard',
    date:'April 26, 2014',
    loc:'<a href="https://maps.google.com/maps?ie=UTF8&amp;cid=15646201110297392647&amp;q=Five+Crowns&amp;iwloc=A&amp;gl=US&amp;hl=en">Five Crowns, 3801 East Coast Hwy, CA 92625</a>'
    });
});
