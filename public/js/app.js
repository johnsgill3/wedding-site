/*jslint browser:true,devel:true*/
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
        svg: '../js/svg.min',
        'gallery-min': 'blueimp-gallery/js/jquery.blueimp-gallery.min',
        gallery: 'blueimp-gallery/js/jquery.blueimp-gallery',
        raphael: '../js/raphael.min',
        mygallery: '../js/gallery',
        coinbase: 'https://coinbase.com/assets/button'
    },
    shim: {
        bootstrap: ['jquery'],
        //gallery: ['jquery','bootstrap'],
        raphael: ['svg']
    },
    map: {
        'gallery': {
          'blueimp-helper':'blueimp-gallery/js/blueimp-helper',
          'blueimp-gallery':'blueimp-gallery/js/blueimp-gallery'
        },
        'gallery-min': {
          'blueimp-helper':'blueimp-gallery/js/blueimp-helper'
        }
    }
});


define([
    'jquery',
    'gallery',
    'mygallery',
    'raphael',
    'webfonts',
    'bootstrap',
    'coinbase'
    ], function ($,gallery,mygallery) {
    'use strict';
    //jQuery, canvas and the app/sub module are all
    //loaded and can be used here now.
    //$('#loading').addClass('hide');
    if($('#mapframe').length){
      $('#mapframe').show();
      $('#smalltext').show();
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
});
