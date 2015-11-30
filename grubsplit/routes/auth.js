var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Delivery = require('../libraries/Delivery');

router.get('/', function(req, res, next) {
  var query = req.query;

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
        console.log('TOKEN: ' + response.access_token);
        res.redirect('/');
      } else {
        res.redirect(Delivery.authorizeAccountURL());
      }
    });
  });
});

module.exports = router;