'use strict';
var config = require('../modules/config')
  , app = config.app
  , mongoose = config.mongoose
  , models = require('../models')
  , Registry = models.Registry
  , Transaction = models.Transaction
  //, stripe = require('stripe')(process.env.STRIPE_TEST_SECRET)
  , stripe = require('stripe')(process.env.STRIPE_LIVE_SECRET)
  , nodemailer = require('nodemailer')
  , smtpTransport = nodemailer.createTransport("SMTP",{
      service: "Gmail"
    , auth: {
          user: process.env.MAIL_USER
        , pass: process.env.MAIL_PASS
    }
  })
  ;
//mongoose.connect('mongodb://localhost/test');
var redir = function(req,res,next){
  return next();
  if(!req.secure && /registry/.test(req.path)){
    res.redirect('https://stephanieandgreg.us/registry');
  } else {
    next();
  }
};

app.get('/registry',redir,function(req,res){
  console.log('reqest to registry');
  Registry.find(function(err,registryEntries){
    console.log('rendering registryEntries');
    res.render('registry',{
      name:'stephanieandgreg.us - Registry',
      errordiv:'hidden',
      thanksdiv:'hidden',
      //thanks: req.session,
      addmsg:"Sponsor it!",
      test:req.query.test==='true',
      items: registryEntries
    });
  });
});

app.get('/registry/pay',function(req,res){
  console.log('paying via stripe!');
  stripe.charges.create({
    amount:req.query.amount,
    card:req.query.token,
    currency:'USD',
    capture:true
  },function(err,charge){
    //async -- and charged if capture option is not false
    console.log(charge);
    if(err){
      return res.json({error:err});
    }
    res.json({success:charge.captured&&charge.paid,trnId:charge.id,charge:charge});

    //now email me about it!
    var fullname = charge.card.name;
    var total = (charge.amount/100).toFixed(2);
    var mailtext = 'You received a payment of $'+total+' from '+fullname;
    var mailOptions = {
      from: 'mailer@stephanieandgreg.us',
      to: process.env.MAIL_USER,
      subject: 'Payment from '+fullname,
      text: mailtext
    };
    smtpTransport.sendMail(mailOptions,function(err,response){
      if(err){
        console.log(err);
      }
    });
  });
});

app.all('/registry/thanks',function(req,res){
  var trnId = req.body&&req.body.txn_id?req.body.txn_id:(req.query&&req.query.txn_id?req.query.txn_id:'');
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
      to: process.env.MAIL_USER,
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
