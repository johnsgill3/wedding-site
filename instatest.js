var ig = require('instagram-node').instagram();
ig.use({
  client_id:process.env.INSTAGRAM_ID,
  client_secret:process.env.INSTAGRAM_SECRET
});
