var mongoose = require('mongoose')
  , registrySchema = new mongoose.Schema({
    name:String,
    desc:String,
    price:Number,
    img:{
        src:String,
        location:String,
        title:String
    }
  })
  , Registry = mongoose.model('Registry',registrySchema)
  , mediaSchema = new mongoose.Schema({
        src:String,
        location:String,
        title:String
  })
  , Media = mongoose.model('Media',mediaSchema)
  , photoSchema = new mongoose.Schema({
        src:String,
        location:String,
        title:String,
        subtitle:String,
        category:String,
        order:Number,
        shown:Boolean,
        thmbloc:String,
        thmbsrc:String,
        lrgloc:String,
        lrgsrc:String,
        medloc:String,
        medsrc:String
  })
  , Photo = mongoose.model('Photo',photoSchema)
  , transactionSchema = new mongoose.Schema({
    time:Date,
    amount:Number,
    _items:[mongoose.Schema.Types.ObjectId]
  })
  , Transaction = mongoose.model('Transaction',transactionSchema)
  , rsvpSchema = new mongoose.Schema({
firstName:String,
lastName:String,
attending:Boolean,
meal:String,
song:String,
message:String,
notes:String,
timestamp:{type:Date,default: Date.now}
})
  , Rsvp = mongoose.model('Rsvp',rsvpSchema)
  ;

mongoose.createConnection('mongodb://localhost/test');
module.exports = { //ALL_CAPS represent static values, lowercase_stuff are dynamically required resources
  mongoose: mongoose,
  Registry: Registry,
  Media: Media,
  Photo: Photo,
  Transaction: Transaction,
  Rsvp: Rsvp
};
