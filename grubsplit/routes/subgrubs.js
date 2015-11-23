var express = require('express');
var router = express.Router();
var Delivery = require('../libraries/Delivery');
var Grub = require('../models/Grub');
var SubGrub = require('../models/SubGrub');
var utils = require('../utils/utils');



/*
  Grab subgrub from the store whenever one is referenced with an ID in the
  request path (any routes defined with :subgrub as a paramter).
*/
router.param('subgrub', function(req, res, next, subGrubIdStr) {
  SubGrub.getSubGrub(subGrubIdStr, function(err, subgrub) {
    if (subgrub && subgrub.owner._id.equals(req.user._id)) {
      req.subgrub = subgrub;
      next();
    } else {
      utils.sendErrResponse(res, 404, 'Resource not found.');
    }
  });
});

/**
 * GET /subgrubs/:id
 * SubGrub page.
 */
router.get('/:subgrub', function(req, res) {
  var grubID = req.subgrub.grubID;
  Grub.getGrub(grubID, function (err, grub) {
    if (err) {
      req.flash('errors', err);
      return res.redirect('/grubs/'+grubID);
    }
    var restaurantID = grub.restaurantID;
    Delivery.getRestaurant(restaurantID, function(err, restaurant) {
      if (err) {
        req.flash('errors', err);
        return res.redirect('/grubs/'+grubID);      
      }
      res.render('subgrubs', { 'subgrub': req.subgrub, 'restaurant' : restaurant });
    });
  });
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
  var items = req.body.items || [];
  SubGrub.addItems(req.subgrub.grubID, items, function (err, subgrub) {
    if (err) {
      req.flash('errors', err);
      return;
    }
    res.redirect('/grubs/'+req.grub.grubID);
  });
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
  SubGrub.deleteSubGrub(req.subgrub, function (err) {
    if (err) {
      req.flash('errors', err);
    }
    res.render('grubs', { grubID: req.subgrub.grubID});
  });

});


module.exports = router;