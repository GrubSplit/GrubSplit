var express = require('express');
var router = express.Router();
var Grub = require('../models/Grub');
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
  // if ( req.user.open_grubs.indexOf(req.grub._id) === -1  || req.user.past_grubs.indexOf(req.grub._id) === -1) {
  //   utils.sendErrResponse(res, 404, 'Resource not found.');
  // } else {
    next();
  // }
};

/*
  Grab a grub from the store whenever one is referenced with an ID in the
  request path (any routes defined with :grub as a paramter).
*/
router.param('grub', function(req, res, next, grubIdStr) {
  // if (grubIdStr === "0") { // temporary bypass logic -> remove this when grub id's are real
  //   req.grub = [];
  //   next();
  // } else {
  Grub.getGrub(grubIdStr, function(err, grub) {
    if (grub) {
      req.grub = grub;
      next();
    } else {
      utils.sendErrResponse(res, 404, 'Resource not found.');
    }
  });
// }
});

// Require ownership
router.all('/:grub', requireOwnership);

/*
  POST /grubs
  Request body: 
    - restaurantID : TODO how to put here?
  Response:
*/
router.post('/', function(req, res) {
  req.restaurantID = '70706' //TODO FIX THIS SO IT'S REAL PLEASE
  Grub.createNewGrub(req.session.passport.user, req.restaurantID, function(err, grub) {
    if (err) {
      //TODO
    } else {
      // GET /grubs/grub._Id
    }
  });
});

/**
 * GET /grubs/:grub
 * Grub page.
 */
router.get('/:grub', function(req, res) {
  res.render('grubs', { currentUser: req.session.passport.user, grub: req.grub});
});

/**
 * POST /grubs/:grub
 * Grub page.
  Request body:
  	- grubID: id of the current grub
    - subgrub: the subgrub to be added
  Response:
    - success: true if the server succeeded in recording the user's freet
    - err: on failure, an error message
 */
router.post('/:grub', function(req, res) {
  // TODO add subgrub to grub 
  // Grub.addSubgrub(req.grubID, req.subgrub, function(grub) {
  // 	res.render('/grubs', { grub: grub});
  // })

  // TODO pull grub from db

  // res.render('/grubs', { grub: res.grub});
});


module.exports = router;