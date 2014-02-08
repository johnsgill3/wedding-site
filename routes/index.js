var config = require('../modules/config')
  , app = config.app
  , fs = require('fs')
  , path = require('path')
  ;

//require('./restart');
require('./send');
require('./registry');
require('./rsvp');
require('./photos');
require('./manager');
require('./australia');
/*jslint stupid:true*/
var spdycache = {};
spdycache.requirejs = fs.readFileSync(path.join(__dirname,'..','public/components/requirejs/require.js'));
spdycache.appjs = fs.readFileSync(path.join(__dirname,'..','public/js/app.js'));

app.get('/', function(req,res){
  "use strict";
  if(res.isSpdy){
    var pushcb = function(name,filepath){
      return function(err,stream){
        console.log('pushing %s, err: %s',name,err);
        stream.on('error',function(err){
          console.log('push error, %s',err);
        });
        stream.on('acknowledge',function(){
          console.log('push ack, args: %s',arguments);
        });
        if(spdycache[name]){
          stream.end(spdycache[name]);
        } else {
          fs.readFile(path.normalize(path.join(__dirname,'..','public',filepath)),function(err,data){
            spdycache[name] = data;
            stream.end(data);
          });
        }
      };
    };
    var pushit = function(pubpath,content,name){
      res.push(pubpath,{'content-type':content},pushcb(name,pubpath));
    };
    pushit('/components/require/require.js','application/javascript','requirejs');
    pushit('/js/app.js','application/javascript','appjs');
    pushit('/css/bootstrap-responsive.css','text/css','boostrapcss');
    pushit('/css/main.css','text/css','maincss');
    pushit('/components/blueimp-gallery/css/blueimp-gallery.min.css','text/css','blueimpcss');
  }
  res.render('index',{name:'stephanieandgreg.us',
    h1:'The wedding of Stephanie Schmidt and Greg Cochard',
    date:'April 26, 2014',
    loc:'<a href="https://maps.google.com/maps?ie=UTF8&amp;cid=15646201110297392647&amp;q=Five+Crowns&amp;iwloc=A&amp;gl=US&amp;hl=en">Five Crowns, 3801 East Coast Hwy, CA 92625</a>'
    });
});
