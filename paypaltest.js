var paypal = require('./modules/paypal')
  ;
paypal.sendPayment(function(err,info){
  console.log(arguments);
});
