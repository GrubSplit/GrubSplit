var express = require('express');
var router = express.Router();
var Delivery = require('../libraries/Delivery');

/* GET home page. */
router.get('/', function(req, res, next) {
  // console.log(res);
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

    Delivery.searchNearbyRestaurants(req.body.address, function(err, restaurants) {
      if (err) {
        console.log(err);
        req.flash('errors', err);
        return res.redirect('/');
      }
      restaurants = restaurants || [];
      console.log(restaurants);
      res.render('index', { 'restaurants': restaurants });
    });
});

module.exports = router;
