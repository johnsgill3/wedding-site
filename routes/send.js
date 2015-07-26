'use strict';
var config = require('../modules/config')
  , app = config.app
  , nodemailer = require('nodemailer')
  , smtpTransport = nodemailer.createTransport("SMTP",{
      service: "Gmail"
    , auth: {
          user: process.env.MAIL_USER
        , pass: process.env.MAIL_PASS
    }
  })
  ;

app.get('/contact',function(req,res){
  res.render('contact',{name:'stephanieandgreg.us - Contact',thanksdiv:'hidden',errordiv:'hidden'});
});

app.all('/send', function(req,res){
    console.log(req.body);
    var mailtext = '';
    if(req.body.name === undefined ||req.body.name === '' ||
       req.body.email === undefined ||req.body.email === '' ||
       req.body.note === undefined ||req.body.note === ''){
        var errormsg = [];
        if(!req.body.name){
          errormsg.push('name is empty');
        }
        if(!req.body.email){
          errormsg.push('email is empty');
        }
        if(!req.body.note){
          errormsg.push('note is empty');
        }
        res.redirect('/thanks?error=Please fill out all form fields, '+errormsg.join(', '));
    }else{
        Object.keys(req.body).forEach(function(key){
                mailtext += key+': '+req.body[key]+'\n';
        });
        var mailOptions = {
            from: "mailer@stephaneandgreg.us",
            to: process.env.MAIL_USER,
            subject: "Love Note from "+req.body.name,
            text: mailtext
        };
        smtpTransport.sendMail(mailOptions,function(error,response){
            if(error){
                console.log(error);
                res.redirect('/thanks?error='+JSON.stringify(error));
            }else{
                res.redirect('/thanks');
            }
        });
    }
});

app.get('/thanks',function(req,res){
    if(req.query.error){
        res.render('contact',{name:'stephanieandgreg.us - Contact',thanksdiv:'hidden',error:req.query.error});
    }else{
      res.render('contact',{name:'stephanieandgreg.us - Contact',errordiv:'hidden',thanks:"Thank you for your message!"});
    }
});
