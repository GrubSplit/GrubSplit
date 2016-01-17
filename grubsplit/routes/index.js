var express = require('express');
var router = express.Router();
var Delivery = require('../libraries/Delivery');

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.session.redirect_grub) {
    var redirect_grub = req.session.redirect_grub;
    req.session.redirect_grub = null;
    return res.redirect(redirect_grub);
  }
  res.render('index');
});

/* POST home page. */
router.post('/', function(req, res, next) {
  req.assert('address', 'Address must not be empty.').len(1);
  var errors = req.validationErrors();
  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/');
  }

  var coords;
  try {
    coords = JSON.parse(req.body.address);
    if (!coords.latitude || !coords.longitude) {
      coords = {};
    }
  } catch (e) {
    coords = {};
  }

  Delivery.searchNearbyRestaurants(req.body.address, coords, function(err, restaurants) {
    if (err) {
      req.flash('errors', err);
      return res.redirect('/');
    }
    restaurants = restaurants || [];
    res.render('index', {
      'restaurants': restaurants,
      'address': req.body.address
    });
  });
});

module.exports = router;