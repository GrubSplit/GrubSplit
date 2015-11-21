var express = require('express');
var router = express.Router();
var User = require('../models/User');

router.get('/', function(req, res, next) {
  var query = req.query;
  // TODO: Store query.code token in user's database
  User.update({
    _id: req.user.id
  }, {
    $set: {
      token: query.code
    },
  }, function (err) {
    if (!err) {
      console.log('UPDATED TOKEN');
    }
    // TODO: handle error
  });
  console.log('QUERY: ' + query.code);
  console.log(req.user.id);
  res.redirect('/');
});

module.exports = router;