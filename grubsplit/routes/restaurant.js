var express = require('express');
var router = express.Router();
var Restaurant = require('../models/Restaurant');
var utils = require('../utils/utils');

/*
  Require ownership whenever accessing a particular grub
  This means that the client accessing the resource must be logged in
  as the user that originally created the grub. Clients who are not owners 
  of this particular resource will receive a 404.
  Why 404? We don't want to distinguish between grubs that don't exist at all
  and grubs that exist but don't belong to the client. This way a malicious client
  that is brute-forcing urls should not gain any information.
*/
var requireOwnership = function(req, res, next) {
  // TODO: Does user need to be pulled from db (refreshed?)
  if ( req.user.open_grubs.indexOf(req.grub._id) === -1  || req.user.past_grubs.indexOf(req.grub._id) === -1) {
    utils.sendErrResponse(res, 404, 'Resource not found.');
  } else {
    next();
  }
};

/*
  Grab a restaurant from the store whenever one is referenced with an ID in the
  request path (any routes defined with :restaurant as a paramter).
*/
router.param('restaurant', function(req, res, next, restaurantIdStr) {
  var restaurantId = new ObjectID(restaurantIdStr);
  // TODO: Implement this function
  Restaurant.getRestaurant(restaurantId, function(err, restaurant) {
    if (restaurant) {
      req.restaurant = restaurant;
      next();
    } else {
      utils.sendErrResponse(res, 404, 'Resource not found.');
    }
  });
});

// Require ownership
router.all('/:restaurant', requireOwnership);

/**
 * GET /restaurant/:restaurant
 * Restaurant page.
 */
router.get('/:restaurant', function(req, res) {
  if (!req.user) return res.redirect('/login');
  res.render('restaurant', { restaurant: req.restaurant });
});


module.exports = router;