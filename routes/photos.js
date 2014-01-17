var config = require('../modules/config')
  , app = config.app
  , async = require('async')
  , zipper = require('zipper').Zipper
  , models = require('../models')
  , Photo = models.Photo
  , path = require('path')
  , fs = require('fs')
  ;

app.get('/photos',function(req,res){
    "use strict";
    Photo.find({category:'engagement',shown:true}).lean().sort({order:1}).exec(function(err,photos){
      res.render('photos',{
          name:'stephanieandgreg.us - Photos',
          photos: photos,
          errordiv:err?'':'hidden',
          error:err,
          thanksdiv:'hidden'
      });
    });
});

app.get('/photos/:category',function(req,res){
  "use strict";
  Photo.find({category:req.params.category,shown:true}).lean().sort({order:1}).exec(function(err,photos){
    res.render('photos',{
      name: 'stephanieandgreg.us - Photos '+req.params.category,
      photos:photos,
      errordiv:err?'':'hidden',
      error:err,
      thanksdiv:'hidden'
    });
  });
});

app.get('/photos/all',function(req,res){
  'use strict';
  fs.unlink('/tmp/photos.zip',function(error){
    var photoArray = [],i,ii, zipfile = new zipper('/tmp/photos.zip'),
    zipme = function(photo){
      console.log('zipping %s', path.basename(photo.lrgloc));
      return function(cb){
        zipfile.addFile(photo.lrgloc,path.basename(photo.lrgloc),function(err){
          var res = {success:'success'};
          if(err){
            console.log(err);
            res = null;
          }
          console.log('done zipping %s', path.basename(photo.lrgloc));
          cb(err,res);
        });
      };
    };
    Photo.find({category:'engagement',shown:true}).lean().sort({order:1}).exec(function(err,photos){
      for(i=0,ii=photos.length;i<ii;i++){
        photoArray.push(zipme(photos[i]));
      }
      async.series(photoArray,function(err,results){
        console.log('done, ',results);
        if(!err){
          res.download('/tmp/photos.zip');
        } else {
          res.send(500,{error:err});
        }
      });
    });
  });
});
