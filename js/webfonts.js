var matches = {};
WebFontConfig = {
  google: { families: [ 'Caudex::latin', 'Josefin+Sans::latin', 'Quando::latin', 'Molengo::latin', 'Metrophobic::latin', 'Marvel::latin', 'Pontano+Sans::latin', 'Quattrocento::latin', 'Quattrocento+Sans::latin', 'Fjord+One::latin' ] },
  loading: function(){
    console.log('font loading');
  },
  fontloading: function(fontFamily,fontDescription){
    console.log(fontFamily+' loading description: '+fontDescription);
  },
/*  fontactive: function(fontFamily, fontDescription){
    var regex = new RegExp('Fjord','i');
    if(regex.test(fontFamily)){
      matches = matches || {};
      matches.fjord = true;
    }
    regex = new RegExp('Josefin','i');
    if(regex.test(fontFamily)){
      matches = matches || {};
      matches.josefin = true;
    }
    if(matches.fjord && matches.josefin){
      //$('#loading').fadeOut(250);
    }
  }*/
  active: function(){
    $('#loading').fadeOut(250);
  }
};
(function() {
var wf = document.createElement('script');
wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
  '://ajax.googleapis.com/ajax/libs/webfont/1.4.2/webfont.js';
wf.type = 'text/javascript';
wf.async = 'true';
var s = document.getElementsByTagName('script')[0];
s.parentNode.insertBefore(wf, s);
})();
