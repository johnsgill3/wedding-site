'use strict';
var fs = require('fs')
  , path = require('path')
  , pushcb = function(res,filepath){
    return function(err,stream){
      stream.on('error',function(err){
        console.log('push error, %s',err);
      });
      stream.on('acknowledge',function(){
        console.log('push ack, args: %s',arguments);
      });
      fs.createReadStream(path.normalize(path.join(__dirname,'..','public',filepath))).pipe(stream);
    };
  }
  , pushit = function(res,pubpath,content){
    res.push(pubpath,{'content-type':content},pushcb(res,pubpath));
  }
  ;
module.exports = function(req,res,next){
  if(res.isSpdy){
    pushit(res,'/components/requirejs/require.js','application/javascript');
    pushit(res,'/js/app.js','application/javascript');
    pushit(res,'/js/webfonts.js','application/javascript');
    pushit(res,'/js/gallery.js','application/javascript');
    pushit(res,'/js/bootstrap.js','application/javascript');
    pushit(res,'/css/bootstrap-responsive.css','text/css');
    pushit(res,'/css/main.css','text/css');
    pushit(res,'/components/blueimp-gallery/css/blueimp-gallery.min.css','text/css');
    pushit(res,'/components/blueimp-gallery/js/blueimp-gallery.js','application/javascript');
    pushit(res,'/components/blueimp-gallery/js/blueimp-helper.js','application/javascript');
    pushit(res,'/components/blueimp-gallery/js/jquery.blueimp-gallery.js','application/javascript');
    pushit(res,'/components/jquery/jquery.js','application/javascript');
    pushit(res,'/components/jquery/jquery.min.js','application/javascript');
  }
  next();
};
