var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Delivery = require('../libraries/Delivery');
var request = require('request');

router.get('/', function(req, res, next) {
  var query = req.query;

  if (query.state) {
    console.log(query.state);
    return res.redirect(query.state);
  }

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

/* Redirect to the secure Delivery.com page to add a payment option */
router.get('/addPayment', function(req, res, next) {
  var url, path, split;
  url = req.headers.referer;
  split = url.split(/\/+/g);
  path = '/' + split.slice(split.length - 3, split.length).join('/');
  res.redirect(Delivery.addPaymentMethodURL(path));
});

module.exports = router;