var express = require('express');
var router = express.Router();
var Restaurant = require('../models/Restaurant');
var utils = require('../utils/utils');

/*
  Grab a restaurant from the store whenever one is referenced with an ID in the
  request path (any routes defined with :restaurant as a paramter).
*/
router.param('restaurant', function(req, res, next, restaurantIdStr) {
  Delivery.getRestaurant(restaurantIdStr, function(err, restaurant) {
    if (restaurant) {
      req.restaurant = restaurant;
      next();
    } else {
      utils.sendErrResponse(res, 404, 'Resource not found.');
    }
  });
});

// Require ownership
// router.all('/:restaurant', requireOwnership);

/**
 * GET /restaurant/:restaurant
 * Restaurant page.
 */
router.get('/:restaurant', function(req, res) {
  res.render('restaurant', {
    restaurant: req.restaurant
  });
});


module.exports = router;