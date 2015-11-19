var express = require('express');
var router = express.Router();
var SubGrub = require('../models/SubGrub');

/**
 * GET /grubs/:id
 * SubGrub page.
 */
router.get('/:id', function(req, res) {
  if (!req.user) return res.redirect('/login');
  // TODO pull subgrub from db
  // get user from session -> pass to db

  // create the subgrub in the database
  res.render('/subgrubs', { subgrub: subgrub});
});

/**
 * POST /grubs/:id
 * SubGrub page.
  Request body:
  	- grubID: id of the current grub
    - item: the item to be added
    - quantity: how many items to be added
  Response:
    - success: true if the server succeeded in recording the user's freet
    - err: on failure, an error message
 */
router.post('/:id', function(req, res) {
  if (!req.user) return res.redirect('/login');

  // TODO add subgrub to grub 
  // TODO: find user from session
  // SubGrub.addItem(user, req.grubID, req.item, req.quantity, function(subgrub) {
  // 	res.render('/subgrubs', { subgrub: subgrub});
  // })

  // TODO pull grub from db

  // res.render('/grubs', { grub: res.grub});
});


module.exports = router;