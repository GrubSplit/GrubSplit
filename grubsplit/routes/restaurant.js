var express = require('express');
var router = express.Router();
var Restaurant = require('../models/Restaurant');

/**
 * GET /restaurant/:id
 * Profile page.
 */
router.get('/:id', function(req, res) {
  if (!req.user) return res.redirect('/login');
  // TODO pull restaurant info
  res.render('restaurant', { restaurant: restaurant });
});


module.exports = router;