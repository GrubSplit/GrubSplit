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
      req.flash('errors', {
        msg: err.msg
      });
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
  res.render('grubs', {
    grub: req.grub,
    isOwner: isOwner
  });
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
  SubGrub.createNewSubGrub(req.user._id, req.grub._id, function(err, subgrub) {
    if (err) {
      req.flash('errors', err);
      return;
    }
    res.redirect('/subgrubs/' + subgrub._id);
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
  if (req.grub.time_ordered) {
    return res.redirect('/grubs/' + req.grub._id);
  }
  var location_id, cc_id, tip;
  var order = [];
  req.grub.subGrubs.forEach(function(subgrub) {
    subgrub.items.forEach(function(item) {
      order.push(item);
    });
  });
  Delivery.createCart(req.grub.restaurantID, order, req.user.token, function(err, body) {
    if (err) {
      req.flash('errors', err);
      res.redirect('/grubs/' + req.grub._id + '/checkout');
      return;
    }
    location_id = req.body._location_id;
    cc_id = req.body._cc_id;
    tip = req.body._tip;
    subtotal = body.subtotal;
    discount = body.discount;
    tax = body.tax;
    total = body.total;
    delivery_fee = body.fees.delivery_fee || 0;
    // return;  // ******** UNCOMMENT THIS TO AVOID PLACING ORDER WHEN TESTING ********
    Delivery.placeOrder(req.grub.restaurantID, location_id, cc_id, tip, req.user.token, function(error, body) {
      if (error) {
        req.flash('errors', error);
        res.redirect('/grubs/' + req.grub._id + '/checkout');
        return;
      } else {
        Grub.completeGrub(req.grub._id, subtotal, tax, tip, delivery_fee, discount, total, function(err) {
          if (err) {
            req.flash('errors', err);
            res.redirect('/grubs/' + req.grub._id + '/checkout');
            return;
          }
          res.redirect('/grubs/' + req.grub._id);
        });
      }
    });
  });
});

router.get('/:grub/checkout', function(req, res) {
  if (req.grub.time_ordered) {
    return res.redirect('/grubs/' + req.grub._id);
  }
  var locations, paymentOptions;

  Delivery.getAddresses(req.user.token, function(error, addresses) {
    if (error) {
      req.flash('errors', error);
    } else {
      locations = addresses;
      Delivery.getPaymentMethods(req.user.token, function(error, creditCards) {
        if (error) {
          req.flash('errors', error);
        } else {
          paymentOptions = creditCards;
          console.log(req.grub);
          res.render('checkout', {
            locations: locations,
            paymentOptions: paymentOptions,
            token: req.user.token,
            grubId: req.grub._id,
            grub: req.grub
          });
        }
      });
    }
  });
});

router.post('/:grub/checkout', function(req, res) {
  if (req.grub.time_ordered) {
    return res.redirect('/grubs/' + req.grub._id);
  }
  Delivery.addAddress(req.body, req.user.token, function(error, location_id) {
    if (error) {
      req.flash('errors', error);
    }
    res.redirect('/grubs/' + req.grub._id + '/checkout');
  });
});

router.delete('/:grub', function(req, res) {
  Grub.deleteGrub(req.params.grub, function(err) {
    if (err) {
      req.flash('errors', err);
    } else {
      res.redirect('/');
    }
  });
});


module.exports = router;