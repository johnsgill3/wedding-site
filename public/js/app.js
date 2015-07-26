/*jslint browser:true,devel:true*/
/*global requirejs:false,ga:false,define:false*/
requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: '/components',
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
        'gallery-min': 'blueimp-gallery/js/jquery.blueimp-gallery.min',
        gallery: 'blueimp-gallery/js/jquery.blueimp-gallery',
        mygallery: '../js/gallery',
        coinbase: 'https://coinbase.com/assets/button',
        froogaloop: 'https://f.vimeocdn.com/js/froogaloop2.min',
        stripe: 'https://checkout.stripe.com/checkout'
    },
    shim: {
        bootstrap: ['jquery'],
        stripe: {
          exports:'StripeCheckout'
        },
        froogaloop: ['jquery']
    },
    map: {
        'gallery': {
          'blueimp-helper':'blueimp-gallery/js/blueimp-helper',
          'blueimp-gallery':'blueimp-gallery/js/blueimp-gallery'
        },
        'gallery-min': {
          'blueimp-helper':'blueimp-gallery/js/blueimp-helper'
        }
    },
    waitSeconds: 0
});

var modules = {};

modules.rsvp = (function(){
  'use strict';
  return {
    init: function($){
      var mealcache = null;
      $('#rsvpform').show('fast');
      $('#rsvpform').on('click','input[type="radio"][name="attending"]',function(e){
        var $target = $(e.target);
        if($target.val() === 'Accept with pleasure'){
          if(mealcache){
            $('#yesoption').prepend(mealcache);
            mealcache = null;
          }
          $('#yesoption').css('visibility','visible');
          $('#yesoption').show('fast');
          $('#nooption').hide('fast');
        } else {
          mealcache = $('#mealgroup').detach();
          $('#nooption').css('visibility','visible');
          $('#nooption').show('fast');
          $('#yesoption').hide('fast');
        }
        $('#submit').css('visibility','visible');
        $('#submit').show('fast');
      });
      $('#rsvpform').on('submit',function(e){
        var att = $('#attending').is(':checked');
        e.preventDefault();
        //submit via ajax
        $.ajax('/rsvp',{
          type:'POST',
          data:{
            firstName:$('#rsvpform input[name="First Name"]').val(),
            lastName :$('#rsvpform input[name="Last Name"]').val(),
            attending:att,
            meal     :$('#rsvpform input[name="meal"]:checked').val(),
            song     :$('#songchoice').val(),
            message  :$('#wellwishes').val()
          }
        }).success(function(data){
          $('#rsvpform').hide('fast');
          $('#thanks').css('visibility','visible');
          $('#thanks').show('fast');
          if(data.thanks){
            $('#thanks .thanksmsg').html(data.thanks);
          }
          if(!att){
            $('#thanks .thanksmsg').html('Your RSVP was successful. We will miss you.');
          }
          if(data.another===false || !att){
            $('#thanks .anothermsg').hide();
          }
          $('#thanks .anothermsg').off('click').on('click',function(e){
            e.preventDefault();
            $('#thanks, #nooption, #yesoption, #submit').hide();
            $('#rsvpform')[0].reset();
            $('#rsvpform').show('fast');
            return false;
          });
        });
        return false;
      });
    }
  };
}());

modules.registry = (function(){
  'use strict';
  return {
    init: function($,StripeCheckout){
      ga('require', 'ecommerce', 'ecommerce.js');
      var $am = $('#amount');
      var $p = $('#paybutton');
      $p.prop('disabled',false);
      var $e = $('#error');
      var handler = StripeCheckout.configure({
        key:'pk_live_iTVGtXXgh2brN1TClnllC6kb',
        token: function(token,args){
          var amount = $am.val();
          var strAmount = parseFloat(amount);
          amount = strAmount.toFixed(2);
          amount = parseInt(amount.split('.').join(''),10);
          //ga('send','event','Payments','Auth');
          ga('ecommerce:addTransaction',{'id':token,'revenue':amount/100});
          $.ajax({
            url:'/registry/pay',
            data:{
              token:token.id,
              amount:amount
            }
          }).done(function(data){
            if(data.success){
            ga('send','event','Payments','Captured',(data.charge.amount/100).toFixed(2));
            ga('ecommerce:send');
              //put up the thanks div and show them the trx id
              $('#thanks').html(data.trnId?'Thanks for sponsoring our honeymoon!<br>Your transaction ID is '+data.trnId:'Thanks for sponsoring our honeymoon!').removeClass('hidden');
              console.log('success!');
            }
            console.log(data);
          }).fail(function(err){
            console.log(err);
          });
        },
        opened: function(){
          ga('send','event','Payments','Open',(this.amount/100).toFixed(2));
        },
        closed: function(){
          ga('send','event','Payments','Closed',(this.amount/100).toFixed(2));
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
            description:'Contribute to our honeyfund!',
            panelLabel: 'Make a gift of ',
            amount:amount
          };
          handler.open(args);
        } else {
          $e.html('<span class="alert alert-error">Please make sure to enter a valid amount!</span>');
          $e.removeClass('hidden');
        }
        e.preventDefault();
      });
    }
  };
}());

modules.video = (function(){
  'use strict';
  return {
    init: function($,$f){
      var iframe = $('#player')[0];
      var player = $f(iframe);
      
      player.addEvent('ready',function(){
        ga('send','event','Video','Ready');
        player.addEvent('play', ga.bind(null,'send','event','Video','Play'));
        player.addEvent('pause', ga.bind(null,'send','event','Video','Pause'));
        player.addEvent('finish', ga.bind(null,'send','event','Video','Finish'));
        player.addEvent('seek', function(obj){
          ga('send','event','Video','Seek',(obj.percent*100)+'%');
        });
      });
    }
  };
}());

define('app',[
    'jquery',
    'gallery',
    'mygallery',
    'stripe',
    'froogaloop',
    'webfonts',
    'bootstrap',
    'coinbase'
    ], function ($,gallery,mygallery,StripeCheckout) {
    'use strict';
    //jQuery, canvas and the app/sub module are all
    //loaded and can be used here now.
    //$('#loading').addClass('hide');
    if($('#mapframe').length){
      $('#mapframe').show('fast');
      $('#smalltext').show('fast');
    }
    var kkeys = [], konami = '38,38,40,40,37,39,37,39,66,65', initiated = 0, dlgId = '132021c44bfebd77e2c12592ea9632e5';
    $(document).keydown(function(e){
      //something of a state machine...
      kkeys.push(e.keyCode);
      kkeys = kkeys.slice(-10);
      if(kkeys.toString() === konami){
        if(initiated){
          //frames['coinbase_modal_iframe_'+dlgId].postMessage('show modal|'+dlgId,'https://coinbase.com');
          alert("you need to refresh the page or go to a different page to get this to work again, coinbase's API has a bug...");
        } else {
          $(document).trigger('coinbase_show_modal',dlgId);
        }
        initiated++;
        console.log('congratulations, you found me!');
      }
    });
    $(document).on('coinbase_payment_complete', function(event,code){
      console.log('coinbase payment completed for button %s',code);
      window.location('/registry_thanks?konami=true');
    });
    if($('#rsvpform').length){
      modules.rsvp.init($);
    }
    if($('#paybutton').length){
      modules.registry.init($,StripeCheckout);
    }
    if($('iframe').length){
      /*global Froogaloop:false*/
      require(['froogaloop'],function(){
        modules.video.init($,Froogaloop);
      });
    }
});
