module.exports = function(req,res,next){
  console.log('got request, %s',req.path);
  next();
};
