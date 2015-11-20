var express = require('express');
var router = express.Router();
var Delivery = require('../libraries/Delivery');

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(res);
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

  	// TODO: Implement this
	// var restaurants = Delivery.nearbyRestaurants(req.body.address);
	var restaurants = [];
	res.render('index', { 'restaurants': restaurants });
});

router.get('/auth', function(req, res, next) {
  var query = req.query;
  res.render('index');
});

module.exports = router;
