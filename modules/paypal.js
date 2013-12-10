'use strict';
var http = require('http')
  , paypal_sdk = require('paypal-rest-sdk')
  , senderEmail = 'cliffhoper@gmail.com'
  , config_opts = {
      host:'api.sandbox.paypal.com',
      port:'',
      client_id:'',
      client_secret:''
    }
  ;

var card_data = {
  type:'visa',
  number:'4417119669820331',
  expire_month:'11',
  expire_year:'2018',
  cvv2:'123',
  first_name:'Joe',
  last_name:'Shopper'
};

var create_card = function(cb){
  paypal_sdk.credit_card.create(card_data, function(error,credit_card){
    if(error){
      console.log(error);
      return cb(error);
    }
    console.log('create credit-card response');
    console.log(credit_card);
    return cb(null,credit_card);
  });
};

var create_payment_json = {
  intent:'sale',
  payer: {
    payment_method:'credit_card',
    funding_instruments:[{
      credit_card:card_data
    }]
  },
  transactions:[{
    amount:{
      total:'7',
      currency:'USD',
      details:{
        subtotal:'7'
      }
    },
    description:'This is the payment transaction description.'
  }]
};

var sendPayment = function(cb){
  paypal_sdk.payment.create(create_payment_json,config_opts,function(err,res){
    if(err){
      console.log(err);
      return cb(err);
    }
    console.log(res);
    return cb(null,res);
  });
};

module.exports = {
createCard : create_card,
sendPayment : sendPayment
};
