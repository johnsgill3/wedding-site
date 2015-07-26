'use strict';
var config = require('../modules/config')
  , app = config.app
  , nodemailer = require('nodemailer')
  , transport = nodemailer.createTransport("SES",{
          AWSAccessKeyID: process.env.AWS_ACCESS_KEY_ID_GREGCOCHARD
        , AWSSecretKey: process.env.AWS_ACCESS_KEY_GREGCOCHARD
        , ServiceUrl: 'https://email.us-west-2.amazonaws.com'
  })
  ;

app.post('/send-email', function(req,res){
    if(req.body.name === undefined ||req.body.name === '' ||
       req.body.email === undefined ||req.body.email === '' ||
       req.body.message === undefined ||req.body.message === ''){
        var errormsg = [];
        if(!req.body.name){
          errormsg.push('name is empty');
        }
        if(!req.body.email){
          errormsg.push('email is empty');
        }
        if(!req.body.message){
          errormsg.push('message is empty');
        }
        res.redirect('http://www.stephanieschmidtcreative.com/contact?error=Please+fill+out+all+form+fields,+'+errormsg.join(',+').replace(/ /g,'+'));
    }else{
        var mailOptions = {
            from: 'mailer@stephanieschmidtcreative.com',
            to: 'stephanie@stephanieschmidtcreative.com',
            replyTo: req.body.email,
            subject: "Contact request from "+req.body.name,
            text: req.body.message
        };
        transport.sendMail(mailOptions,function(error,response){
            if(error){
                console.log('error emailing from stephaniecochard.com: '+require('util').inspect({error:error,responseStatus:response}));
            } else {
                console.log('sent email, options: %j',mailOptions);
            }
            res.redirect('http://www.stephanieschmidtcreative.com/contact?thanks');
        });
    }
});
