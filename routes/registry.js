'use strict';
var config = require('../modules/config')
  , app = config.app
  , mongoose = config.mongoose
  , models = require('../models')
  , Registry = models.Registry
  , Transaction = models.Transaction
  , nodemailer = require('nodemailer')
  , smtpTransport = nodemailer.createTransport("SMTP",{
      service: "Gmail"
    , auth: {
          user: 'stephanieandgreg.us@gmail.com'
        , pass: 'this is a long mail password'
    }
  })
  ;
//mongoose.connect('mongodb://localhost/test');
app.get('/registry',function(req,res){
  console.log('reqest to registry');
  Registry.find(function(err,registryEntries){
    console.log('rendering registryEntries');
    res.render('registry',{
      name:'stephanieandgreg.us - Registry',
      errordiv:'hidden',
      thanksdiv:'hidden',
      //thanks: req.session,
      addmsg:"Sponsor it!",
      items: registryEntries
    });
  });
});

app.all('/registry/thanks',function(req,res){
  var trnId = req.body?req.body.txn_id:req.query?req.query.txn_id:'';
  console.log('query: %s\nbody: %s',JSON.stringify(req.query),JSON.stringify(req.body));
  res.render('registry',{
    name:'stephanieandgreg.us - Registry',
    errordiv:'hidden',
    thanksdiv:'',
    thanks:!!trnId?'Thanks for sponsoring our honeymoon!<br>Your transaction ID is '+trnId:'Thanks for sponsoring our honeymoon!',
  });
});

app.get('/registry/why',function(req,res){
  res.render('registry',{
    name:'stephaneiandgreg.us - Registry',
    errordiv:'',
    thanksdiv:'hidden',
    error: 'Why the hesitation? Please send feedback via our <a href="/contact">contact page</a>.',
  });
});

var paramfn = function(key){
  return function(req,res,next,param){
    var obj = {};
    obj[key] = param;
    req.params.push(obj);
    req[key] = param;
    next();
  };
};
app.param('method',paramfn('paymethod'));
app.param('type',paramfn('paytype'));
app.all('/yougotpaid/with/:method/as/:type',function(req,res){
  console.log('got paid with %s as a %s',req.paymethod,req.paytype);
  if(req.paymethod === 'paypal'){
    var fullname = req.body.first_name+' '+req.body.last_name;
    var total = req.body.payment_gross;
    var mailtext = 'You received a payment of $'+total+' from '+fullname;
    var mailOptions = {
      from: 'mailer@stephanieandgreg.us',
      to: 'stephanieandgreg.us@gmail.com',
      subject: 'Payment from '+fullname,
      text: mailtext
    };
    smtpTransport.sendMail(mailOptions,function(err,response){
      if(err){
        console.log(err);
      }
    });
  }
  console.log('query: %s\nbody: %s',JSON.stringify(req.query),JSON.stringify(req.body));
  res.end();
});
