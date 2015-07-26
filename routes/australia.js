var config = require('../modules/config')
  , app = config.app
  , mongoose = config.mongoose
  , models = require('../models')
  , aus = models.Australia
  ;
  
app.get('/australia',function(req,res){
            res.render('australia',{
            name:'stephanieandgreg.us - Australia Pictures',
            errordiv:'hidden',
            thanksdiv:'hidden',
            items: aus
        });
});