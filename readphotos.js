#!/usr/bin/env node
"use strict";
var models = require('./models/index2')
  , Photo = models.Photo
  , fs = require('fs')
  , path = require('path')
  , gm = require('gm')
  , async = require('async')
  , optimist = require('optimist')
  , argv = optimist
  .usage('Usage: $0 --sourceDir [str] --destDir [str]')
  .demand(['sourceDir','destDir'])
  .argv
  , imgPath = path.join(__dirname,'public','uploads')
  , newImgPath = path.join(__dirname,'public','images','engagement-photos')
  , publicPath = path.join('/images','engagement-photos')
  , walk = function(dir,callback){
      console.log('walking dir: '+dir);
      var results = [];
      fs.readdir(dir,function(err,list){
        console.log('found files: %s',JSON.stringify(list));
        if(err) { return callback(err); }
        var pending = list.length;
        if(!pending) { return callback(null,results); }
        list.forEach(function(file){
          file = dir + '/' + file;
          fs.stat(file, function(err,stat){
            if(stat && stat.isDirectory()){
              walk(file,function(err,res){
                results = results.concat(res);
                if(!--pending) { callback(null,results); }
              });
            } else {
              results.push(file);
              if(!--pending) { callback(null,results); }
            }
          });
        });
      });
    }
  , saving = 0
  , order = 0
  , resize = function(filepath,thmbpath,photo,cb){
      gm(filepath)
      .size(function(err,size){
        if(!err){
          var newwidth = size.width>size.height?101:null;
          var newheight = size.width<size.height?101:null;
          gm(filepath).resize(newwidth,newheight).write(thmbpath,function(err){
            if(!err){
              photo.save(function(err,newdoc){
                saving--;
                if(err){
                  console.log('error when inserting db entry: %s',JSON.stringify(err));
                } else {
                  console.log('saved photo: %s',JSON.stringify(newdoc));
                }
                cb();
              });
            } else {
              console.log('error when writing image: %s',JSON.stringify(err));
              cb();
            }
          });
        } else {
          console.log('error when reading image size: %s',JSON.stringify(err));
          cb();
        }
      });
    }
  , q = async.queue(function(task,callback) {
      resize(task.filename,task.outname,task.dbphoto,callback);
    }, 4)
  ;
//console.log(models);
walk(imgPath,function(err,files){
  console.log('finished walking, found files %s',JSON.stringify(files));
  if(err) { process.exit(console.log(err)); }
  files.forEach(function(file){
    var newfile = path.join(newImgPath,path.basename(file));
    var filepath = path.join(newImgPath,path.basename(file));
    var thmbpath = path.join(newImgPath,path.basename(file,'.jpg'))+'-thmb.jpg';
    var publicpath = path.join(publicPath,path.basename(file));
    var thmbpublicpath = path.join(publicPath,path.basename(file,'.jpg'))+'-thmb.jpg';
    if(path.extname(file).toLowerCase() === '.jpg'){
      fs.rename(file,newfile,function(err){
        if(!err){
          console.log('renamed %s to %s',file,newfile);
          var photo = new Photo({
            src:publicpath
          , location:filepath
          , title:path.basename(file)
          , subtitle:''
          , category:'engagement'
          , thmbloc:thmbpath
          , thmbsrc:thmbpublicpath
          , order:(++order)
          });
          console.log('saving photo...');
          saving++;
          q.push({filename:filepath,outname:thmbpath,dbphoto:photo});
        } else {
          console.log('error: %s',JSON.stringify(err));
        }
      });
    }
  });
});
