var express = require('express');
var router = express.Router();
var Grub = require('../models/Grub');

/**
 * GET /grubs/:id
 * Grub page.
 */
router.get('/:id', function(req, res) {
  if (!req.user) return res.redirect('/login');
  // TODO pull grub from db
  res.render('/grubs', { grub: grub});
});


module.exports = router;