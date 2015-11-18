var express = require('express');
var router = express.Router();
var User = require('../models/User');

/**
 * GET /profile
 * Profile page.
 */
router.get('/profile', function(req, res) {
  if (!req.user) return res.redirect('/login');
  res.render('profile');
});


module.exports = router;