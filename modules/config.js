var express = require('express')
  , app = express()
  , cons = require('consolidate')
  , connect = require('connect')
  , path = require('path')
  , swig = require('swig')
  , logger = require('./logger')
  , Session = require('connect-mongodb')
  , Db = require('mongodb').Db
  , Server = require('mongodb').Server
  , fs = require('fs')
  , mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
app.enable('trust proxy');
app.use(express.compress());
app.use(function(req,res,next){
    'use strict';
    if(req.subdomains && req.subdomains.length !== 0 && req.subdomains[0] !== 'dev'){
      console.log('redirecting from '+req.host+' to '+req.protocol+'://stephanieandgreg.us');
      res.redirect(301,req.protocol+'://stephanieandgreg.us');
      res.end();
    } else {
      next();
    }
});

app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session(
    {store: new Session({
        db: new Db('test', new Server('localhost',27017, {auto_reconnect:true, native_parser:true, safe:true}))
    }),
    cookie: {maxAge: 300000},
    secret:'thisisacorrecthorsesecretbatterystaplesecret'}
));

var EXPRESS_KEY, EXPRESS_CERT, EXPRESS_CA;

try{
  /*jslint stupid:true*/
  EXPRESS_KEY = fs.readFileSync(__dirname+'/../certs/prv.key');
  EXPRESS_CERT = fs.readFileSync(__dirname+'/../certs/cert.pem');
  EXPRESS_CA = [];
  EXPRESS_CA.push(fs.readFileSync(__dirname+'/../certs/int.pem'));
  /*jslint stupid:false*/
} catch(err){
  console.error(err);
}

app.engine('swig',cons.swig);
app.set('view engine','swig');

swig.init({
  cache : app.get('env') === 'production',
  root: path.join(__dirname,'..','templates'),
  allowErrors:true
});
app.set('views',path.join(__dirname,'..','templates'));
app.use(connect.static(path.join(__dirname,'..','public'), { maxAge: /*86400000*/300000 }));


module.exports = { //ALL_CAPS represent static values, lowercase_stuff are dynamically required resources
  EXPRESS_PORT: 8080,
  EXPRESSL_PORT: 8443,
  EXPRESS_BAK_PORT: 8080,
  EXPRESSL_BAK_PORT: 8443,
  EXPRESS_KEY: EXPRESS_KEY,
  EXPRESS_CERT: EXPRESS_CERT,
  EXPRESS_CA: EXPRESS_CA,
  DEBUG: true,
  express : express,
  app : app, //one app to rule them all
  cons : cons,
  connect: connect,
  swig: swig,
  logger: logger,
  mongoose: mongoose,
  NODE_ROOT: path.join(__dirname,'..')+'/',
  UPLOAD_DIR: path.join(__dirname,'..','public','uploads')+'/',
  PUBLIC_UPLOAD_DIR: '/uploads/'
};
