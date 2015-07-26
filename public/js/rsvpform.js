define(['jquery'],function($){
  'use strict';
  $('#rsvpform').on('click','input[type="radio"]',function(e){
    if($(e).val() === 'Accept with pleasure'){
      $('#yesoption').show();
    } else {
      $('#nooption').show();
    }
    $('#submit').show();
  });
});
