var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Delivery = require('../libraries/Delivery');

router.get('/', function(req, res, next) {
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
      } else {
        console.log(err);
      }
    });
  });
  res.redirect('/');
});

// router.get('/token', function(req, res, next) {
//   var query = req.query;
//   console.log('TOKEN: ' + query.access_token);
//   User.update({
//     _id: req.user.id
//   }, {
//     $set: {
//       token: query.access_token
//     },
//   }, function(err) {
//     if (!err) {
//       console.log('UPDATED TOKEN');
//     } else {
//       // TODO: handle error
//     }
//   });
//   res.redirect('/');
// });

module.exports = router;