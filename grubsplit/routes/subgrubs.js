var express = require('express');
var router = express.Router();
var SubGrub = require('../models/SubGrub');
var utils = require('../utils/utils');

/*
  Require ownership whenever accessing a particular subgrub
  This means that the client accessing the resource must be logged in
  as the user that originally created the subgrub. Clients who are not owners 
  of this particular resource will receive a 404.
  Why 404? We don't want to distinguish between grubs that don't exist at all
  and grubs that exist but don't belong to the client. This way a malicious client
  that is brute-forcing urls should not gain any information.
*/
var requireOwnership = function(req, res, next) {
  // TODO: Does user need to be pulled from db (refreshed?)
  // if ( req.user.subgrubs.indexOf(req.subgrub._id) === -1) {
  //   utils.sendErrResponse(res, 404, 'Resource not found.');
  // } else {
    next();
  // }
};

/*
  Grab subgrub from the store whenever one is referenced with an ID in the
  request path (any routes defined with :subgrub as a paramter).
*/
router.param('subgrub', function(req, res, next, subgrubIdStr) {
  if (subgrubIdStr === "0") {
    req.subgrub = [];
    next();
  } else {
  var subgrubId = new ObjectID(subgrubIdStr);
  // TODO: Implement this
  Subgrub.getSubgrub(subgrubId, function(err, subgrub) {
    if (subgrub) {
      req.subgrub = subgrub;
      next();
    } else {
      utils.sendErrResponse(res, 404, 'Resource not found.');
    }
  });
}
});

// Require ownership
router.all('/:subgrub', requireOwnership);

/**
 * GET /subgrubs/:id
 * SubGrub page.
 */
router.get('/:subgrub', function(req, res) {
  // TODO pull subgrub from db
  // get user from session -> pass to db
  var tempSubGrub = {user:"Jorrie", items:[], id:33, cost:6.90, menu:{children:[{type:"menu"}]}}
  // create the subgrub in the database
  res.render('subgrubs', { subgrub: tempSubGrub});
});

/**
 * POST /subgrubs/:id
 * SubGrub page.
  Request body:
  	- grubID: id of the current grub
    - item: the item to be added
    - quantity: how many items to be added
  Response:
    - success: true if the server succeeded adding item to subgrub
    - err: on failure, an error message
 */
router.post('/:subgrub', function(req, res) {
  console.log('in subgrub route')
  // console.log('the id of the grub is: ', req.body)
  // TODO add subgrub to grub 
  // TODO: find user from session
  // SubGrub.addItem(user, req.grubID, req.item, req.quantity, function(subgrub) {
  // 	res.render('/subgrubs', { subgrub: subgrub});
  // })

  // TODO pull grub from db

  // res.render('subgrubs', { subgrub: res.subgrub});
});

/**
 * DELETE /subgrubs/:id
 * SubGrub page.
  Request body:
    - grubID: id of the current grub
  Response:
    - success: true if the server succeeded in deleting subgrub
    - err: on failure, an error message
 */
 router.delete('/:subgrub', function(req, res) {
  if (!req.user) return res.redirect('/login');
 
  // TODO: find user from session
  // TODO: remove subgrub from db

  // res.render('grubs', { grubID: req.grubID});
});


module.exports = router;