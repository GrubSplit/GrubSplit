var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Delivery = require('../libraries/Delivery');

router.get('/', function(req, res, next) {
  if (req.user.token && req.user.refresh_token) return res.redirect('/');
  var query = req.query;
  console.log('QUERY: ' + query.code);
  console.log(req.user.id);

  Delivery.requestTokenURL(query.code, function(error, response) {
    User.update({
      _id: req.user.id
    }, {
      $set: {
        token: response.access_token,
        refresh_token: response.refresh_token
      },
    }, function(err) {
      if (!err) {
        res.redirect('/');
      } else {
        console.log(err);
        res.redirect(Delivery.authorizeAccountURL());
      }
    });
  });
});

module.exports = router;