var config = require('../modules/config')
  , app = config.app
  , _ = require('lodash')
  , models = require('../models')
  , rsvp = models.Rsvp
  , nodemailer = require('nodemailer')
  , smtpTransport = nodemailer.createTransport('SMTP', {
    service: 'Gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  })
  ;

app.get('/rsvp',function(req,res){
    'use strict';
    res.render('rsvp',{
        name:config.NAME+' - RSVP',
        errordiv:'hidden',
        thanksdiv:'hidden'
    });
});
app.post('/rsvp',function(req,res){
  'use strict';
  var newrsvp = new rsvp();
  var mailtext = '';
  _.each(req.body,function(val,key){
    newrsvp[key] = val;
    mailtext += key+': '+val+'\n';
  });
  var mailOptions = {
    from: 'mailer@stephanieandgreg.us',
    to: process.env.MAIL_USER,
    subject: 'RSVP from '+req.body.firstName+' '+req.body.lastName,
    text: mailtext
  };
  newrsvp.save(function(err,saved){
    if(req.xhr){
        if(err){
          res.json({error:'Could not save RSVP, please try again.'});
        } else {
          res.json(req.body);
        }
    } else {
      res.render('rsvp',{
        name:'stephanieandgreg.us - RSVP',
        errordiv:err?'':'hidden',
        error: err,
        thanksdiv:'',
        thanks:'RSVP another guest'
      });
    }
  });
  smtpTransport.sendMail(mailOptions,function(error,response){
    if(error){
      console.log(error);
    }
  });
});
