'use strict';
var config = require('../modules/config')
  , app = config.app
  , mongoose = config.mongoose
  , models = require('../models')
  , Registry = models.Registry
  , Transaction = models.Transaction
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

app.post('/registry/pay',function(req,res){
  var trn = new Transaction();
  trn.save(function(err,newTrn){
    res.redirect('/registry/thanks/'+newTrn._id);
  });
});
app.get('/registry/thanks/:id',function(req,res){
  var trnId = req.params.id;
  res.render('registry',{
    name:'stephanieandgreg.us - Registry',
    errordiv:'hidden',
    thanks:'Thanks for sponsoring our honeymoon!<br>Your transaction ID is '+trnId,
  });
});
