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

/**
 * POST /grubs/:id
 * Grub page.
  Request body:
  	- grubID: id of the current grub
    - subgrub: the subgrub to be added
  Response:
    - success: true if the server succeeded in recording the user's freet
    - err: on failure, an error message
 */
router.post('/:id', function(req, res) {
  if (!req.user) return res.redirect('/login');

  // TODO add subgrub to grub 
  // Grub.addSubgrub(req.grubID, req.subgrub, function(grub) {
  // 	res.render('/grubs', { grub: grub});
  // })

  // TODO pull grub from db

  // res.render('/grubs', { grub: res.grub});
});


module.exports = router;