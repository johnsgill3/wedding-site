'use strict';
/*global define:false*/
define('mygallery',[
'jquery',
'gallery'
], function($,gallery){
  /*jslint browser:true*/
  /*global ga:false*/
  $('#blueimp-gallery')
  .on('open', function(event){
    console.log(arguments);
    ga('send','event','Photos','Open');
  })
  .on('opened',function(event){
    console.log(arguments);
  })
  .on('slide', function(e,i,s){
    console.log(arguments);
  })
  .on('slideend', function(e,i,s){
    console.log(arguments);
  })
  .on('slidecomplete', function(e,i,s){
    ga('send','event','Photos','View',s.firstChild.src,i);
    console.log(arguments);
  })
  .on('close', function(event){
    console.log(arguments);
    ga('send','event','Photos','Close');
  })
  .on('closed', function(event){
    console.log(arguments);
  });
});
