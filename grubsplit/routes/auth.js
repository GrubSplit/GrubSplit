var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  var query = req.query;
  // TODO: Store query.code token in user's database
  console.log('QUERY: ' + query.code);
  res.redirect('/');
});

module.exports = router;