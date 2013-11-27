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
        svg: '../js/svg.min',
        'gallery-min': 'blueimp-gallery/js/jquery.blueimp-gallery.min',
        gallery: 'blueimp-gallery/js/jquery.blueimp-gallery',
        raphael: '../js/raphael.min',
        mygallery: '../js/gallery'
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
    'bootstrap'
    ], function ($,gallery,mygallery) {
    'use strict';
    //jQuery, canvas and the app/sub module are all
    //loaded and can be used here now.
    //$('#loading').addClass('hide');
    if($('#mapframe').length){
      $('#mapframe').show();
      $('#smalltext').show();
    }
});
