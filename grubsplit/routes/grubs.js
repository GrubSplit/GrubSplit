var express = require('express');
var router = express.Router();
var SubGrub = require('../models/SubGrub');
var Grub = require('../models/Grub');
var utils = require('../utils/utils');
var Delivery = require('../libraries/Delivery');

/*
  Grab a grub from the store whenever one is referenced with an ID in the
  request path (any routes defined with :grub as a paramter).
*/
router.param('grub', function(req, res, next, grubIdStr) {
  Grub.getGrub(grubIdStr, function(err, grub) {
    if (grub) {
      req.grub = grub;
      next();
    } else {
      utils.sendErrResponse(res, 404, 'Resource not found.');
    }
  });
});

/*
  POST /grubs
  Request body: 
    - restaurantID : TODO how to put here?
  Response:
*/
router.post('/', function(req, res) {
  Grub.createNewGrub(req.user._id, req.query.restaurantID, req.query.restaurantName, function(err, grub) {
    if (err) {
      req.flash('errors', { msg: err.msg });
    } else {
      res.redirect('/grubs/' + grub._id);
    }
  });
});

/**
 * GET /grubs/:grub
 * Grub page.
 */
router.get('/:grub', function(req, res) {
  var isOwner = req.user._id.equals(req.grub.owner._id);
  res.render('grubs', { grub: req.grub, isOwner: isOwner });
});

/**
 * POST /grubs/:grub
 * Grub page.
  Request body:
  	- grubID: id of the current grub
  Response:
    - success: true if the server succeeded in creating new subgrub and adding ref in grub
    - err: on failure, an error message
 */
router.post('/:grub', function(req, res) {
  SubGrub.createNewSubGrub(req.user._id, req.grub._id, function (err, subgrub) {
    if (err) {
      req.flash('errors', err);
      return;
    }
    res.redirect('/subgrubs/'+subgrub._id);
  });
});

/**
 * POST /grubs/:grub/order
 * Grub page.
  Request body:
    - grubID: id of the current grub
  Response:
    - success: true if the server succeeded in creating new subgrub and adding ref in grub
    - err: on failure, an error message
 */
router.post('/:grub/order', function(req, res) {
  var order = [];
  req.grub.subGrubs.forEach(function (subgrub) {
    subgrub.items.forEach(function (item) {
      order.push(item);
    });
  });
  // TODO: Implement Delivery.placeOrder
  Delivery.placeOrder(order, function (err) {
    if (err) {
      console.log(err);
      req.flash('dcomerrors', err);
      return;
    }
    Grub.completeGrub(req.grub._id, function (err) {
      if (err) {
        console.log(err);
        req.flash('errors', err);
        return;
      }
      res.redirect('/grubs/'+req.grub._id);
    });
  });
});

router.delete('/:grub', function(req, res) {
  Grub.deleteGrub(req.params.grub, function(err) {
    if (err) {
      req.flash('errors', {msg: err.msg});
    } else {
      res.redirect('/');
    }
  });
});


module.exports = router;