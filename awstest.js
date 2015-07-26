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
/*s3.createBucket({
  Bucket: 'stephanieandgreg-us',
  ACL: 'public-read',
  CreateBucketConfiguration: {
    LocationConstraint: 'us-west-2'
  }
},function(err,data){
  'use strict';
  if(err){ console.log(err,err.stack); process.exit(1); }
  else { console.log(data); }
  
  */
  fs.readdir(readPath,function(err,files){
    'use strict';
    async.eachSeries(files,function(filename,callback){
      var filepath = path.join(readPath,filename);
      //console.log('filename: %s',filepath);
      s3.putObject({
        Bucket: awsBucket,
        Key: filename,
        ACL: 'public-read',
        Body: fs.createReadStream(filepath),
        ContentType: 'image/jpeg'
      },function(err,data){
        if(err){ console.log(err, err.stack);process.exit(1); }
        else { console.log(data); }
        callback(err,data);
      });
    },function(err,results){
      console.log(results);
    });
  });
/*});*/
