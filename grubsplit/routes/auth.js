var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Delivery = require('../libraries/Delivery');

router.get('/', function(req, res, next) {
  if (req.user.token && req.user.refresh_token) return res.redirect('/');
  var query = req.query;
  console.log('QUERY: ' + query.code);
  console.log(req.user.id);

  Delivery.requestTokenURL(query.code, function(response) {
    console.log('RESPONSE: ' + JSON.stringify(response));
    User.update({
      _id: req.user.id
    }, {
      $set: {
        token: response.access_token,
        refresh_token: response.refresh_token
      },
    }, function(err) {
      if (!err) {
        console.log('UPDATED TOKEN: ' + response.access_token);
        res.redirect('/');
      } else {
        console.log(err);
        res.redirect(Delivery.authorizeAccountURL());
      }
    });
  });
});

module.exports = router;