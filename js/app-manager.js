requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: 'components',
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths: {
        app: '../app',
        jquery: 'jquery/jquery.min',
        bootstrap: '../js/bootstrap',
        webfonts: '../js/webfonts',
        manager: '../js/manager',
        filedrop: 'jquery-filedrop/jquery.filedrop',
        stripe: 'https://checkout.stripe.com/checkout'
    },
    shim: {
        bootstrap: ['jquery'],
        filedrop: ['jquery'],
        stripe: {
          exports:'StripeCheckout'
        }
    }
});

var modules = {};

modules.registry = (function(){
  'use strict';
  return {
    init: function($,StripeCheckout){
      var $am = $('#amount');
      var $p = $('#paybutton');
      $p.prop('disabled',false);
      var $e = $('#error');
      var liveKey='pk_live_iTVGtXXgh2brN1TClnllC6kb';
      var testKey='pk_test_5BG0dAoGUhspsgr1JpiH4QNU';
      var testHandler = StripeCheckout.configure({
        key:testKey,
        token: function(token,args){
          console.log('token: ',token,'args: ',args);
          var amount = $am.val();
          var strAmount = parseFloat(amount);
          amount = strAmount.toFixed(2);
          amount = parseInt(amount.split('.').join(''),10);
          $.ajax({
            url:'/manager/pay?test=true',
            data:{
              token:token.id,
              amount:amount
            }
          }).done(function(data){
            if(data.success){
              //put up the thanks div and show them the trx id
              $('#success').html(data.trnId?'Captured!<br>The transaction ID is '+data.trnId:'Captured!').removeClass('hidden').removeClass('alert-error').addClass('alert-success');
              console.log('success!');
            } else {
              $('#success').text(data).removeClass('hidden').removeClass('alert-success').addClass('alert-error');
            }
            console.log(data);
          }).fail(function(err){
            console.log(err);
          });
        }
      });
      var liveHandler = StripeCheckout.configure({
        key:liveKey,
        token: function(token,args){
          console.log('token: ',token,'args: ',args);
          var amount = $am.val();
          var strAmount = parseFloat(amount);
          amount = strAmount.toFixed(2);
          amount = parseInt(amount.split('.').join(''),10);
          $.ajax({
            url:'/manager/pay',
            data:{
              token:token.id,
              amount:amount
            }
          }).done(function(data){
            if(data.success){
              //put up the thanks div and show them the trx id
              $('#success').html(data.trnId?'Captured!<br>The transaction ID is '+data.trnId:'Captured!').removeClass('hidden');
              console.log('success!');
            }
            console.log(data);
          }).fail(function(err){
            console.log(err);
          });
        }
      });
      $am.on('keyup',function(e){
        try{
          var amount = $am.val();
          var strAmount = parseFloat(amount);
          amount = strAmount.toFixed(2);
          amount = parseInt(amount.split('.').join(''),10);
          if(amount){
            $e.addClass('hidden');
            $p.prop('disabled',false);
          }
        } catch(err){
          $p.prop('disabled',true);
        }
      });
      $p.on('click',function(e){
        $e.addClass('hidden');
        var amount = $am.val();
        var strAmount = parseFloat(amount);
        amount = strAmount.toFixed(2);
        amount = parseInt(amount.split('.').join(''),10);
        if(amount){
          var args = {
            name:'stephanieandgreg.us',
            description:'Manual capture!',
            amount:amount
          };
          console.log(args);
          if(!$('#test').length || $('#test').is(':checked')){
            testHandler.open(args);
          } else {
            liveHandler.open(args);
          }
        } else {
          $e.html('<span class="alert alert-error">Please make sure to enter a valid amount!</span>');
          $e.removeClass('hidden');
        }
        e.preventDefault();
      });
    }
  };
}());

define(['jquery', 'stripe', 'webfonts', 'bootstrap', 'filedrop', 'manager'],
function   ($,StripeCheckout) {
    //jQuery, canvas and the app/sub module are all
    //loaded and can be used here now.
    //$('#loading').addClass('hide');
    if($('#paybutton').length){
      modules.registry.init($,StripeCheckout);
    }
});
