var fs = require('fs')
  , path = require('path')
  , awsBucket = 'stephanieandgreg-us'
  , awsKeyId = process.env.AWS_IAM_ACCESS_KEY_ID
  , awsSecretKey = process.env.AWS_IAM_SECRET_ACCESS_KEY
  , AWS = require('aws-sdk')
  , config = new AWS.Config({
      accessKeyId: awsKeyId,
      secretAccessKey: awsSecretKey,
      region: 'us-west-2'
    })
  ;
AWS.config.region = 'us-west-2';
var s3 = new AWS.S3()
  , readPath = path.join(__dirname,'public','images','engagement-photos')
  , async = require('async')
  ;
fs.readdir(readPath,function(err,files){
  files.forEach(function(file){
    s3.putObject({
      Bucket:awsBucket,
      Key: file,
      ACL: 'public-read',
      ContentType: 'image/jpeg'
    }, function(err,data){
      console.log(data);
    });
  });
});
