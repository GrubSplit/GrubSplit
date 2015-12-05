var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Delivery = require('../libraries/Delivery');

router.get('/', function(req, res, next) {
  var query = req.query;

  Delivery.requestTokenURL(query.code, function(error, response) {
    User.setTokens(req.user.id, response.access_token, response.refresh_token, function (err) {
      if (err || error) {
        return res.redirect(Delivery.authorizeAccountURL());
      }
      console.log('TOKEN: ' + response.access_token);
      res.redirect('/');
    });
  });
});

module.exports = router;