var express = require('express');
var router = express.Router();
var Delivery = require('../libraries/Delivery');
var Grub = require('../models/Grub');
var SubGrub = require('../models/SubGrub');
var utils = require('../utils/utils');
// var publicSubGrub = require('../public/javascripts/subgrub');



/*
  Grab subgrub from the store whenever one is referenced with an ID in the
  request path (any routes defined with :subgrub as a paramter).
*/
router.param('subgrub', function(req, res, next, subGrubIdStr) {
  SubGrub.getSubGrub(subGrubIdStr, function(err, subgrub) {
    if (subgrub) { // && (subgrub.owner._id.equals(req.user._id) || subgrub.grubID.owner._id.equals(req.user._id))) {
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
  var restaurantID = req.subgrub.grubID.restaurantID;
  Delivery.getRestaurant(restaurantID, function(err, restaurant) {
    if (err) {
      req.flash('errors', err);
      return res.redirect('/grubs/'+req.subgrub.grubID._id);
    }
    res.render('subgrubs', { 'subgrub': req.subgrub, 'restaurant' : restaurant });
  });
});

/**
 * GET /subgrubs/items/:id
 * SubGrub page.
 */
router.get('/items/:subgrub', function(req, res) {
  res.send(req.subgrub.items);
});

/**
 * GET /subgrubs/items/:id
 * SubGrub page.
 */
 router.get('/menu/:subgrub', function(req, res) {
  console.log('menu call was made');
  var restaurantID = req.subgrub.grubID.restaurantID;
  Delivery.getRestaurant(restaurantID, function(err, restaurant) {
    if (err) {
      req.flash('errors', err);
      return res.redirect('/grubs/'+req.subgrub.grubID._id);
    }
    res.send(restaurant.menu);
  });
 });

/**
 * POST /subgrubs/:id
 * SubGrub page.
  Request body:
    - subgrub: subgrub to be deleted
    - items: the items to be added
    - totalCost: the total cost of all items
  Response:
    - success: true if the server succeeded adding item to subgrub
    - err: on failure, an error message
 */
router.post('/:subgrub', function(req, res) {
  var items = JSON.parse(req.body.items) || [];
  console.log(items);
  SubGrub.addItems(req.subgrub._id, items, req.body.totalCost, function (err, subgrub) {
    if (err) {
      req.flash('errors', err);
      return;
    }
    var redirect_url = req.protocol + '://' + req.get('host') + '/grubs/' + req.subgrub.grubID._id;
    res.send(redirect_url);
  });
});

/**
 * POST /subgrubs/payment/:id
 * SubGrub page.
  Request body:
    - subgrub: subgrub to be deleted
    - markAsPaid: boolean of if we are marking as paid or unpaid
  Response:
    - success: true if the server succeeded adding item to subgrub
    - err: on failure, an error message
 */
router.post('/payment/:subgrub', function(req, res) {
  SubGrub.togglePayment(req.subgrub._id, req.body.markAsPaid, function (err, subgrub) {
    if (err) {
      req.flash('errors', err);
      return;
    } else {
      res.send(subgrub);
    }
  });
});

/**
 * DELETE /subgrubs/:id
 * SubGrub page.
  Request body:
    - subgrub: subgrub to be deleted
  Response:
    - success: true if the server succeeded in deleting subgrub
    - err: on failure, an error message
 */
 router.delete('/:subgrub', function(req, res) {
  SubGrub.deleteSubGrub(req.subgrub._id, req.subgrub.grubID._id, function (err) {
    if (err) {
      req.flash('errors', err);
    }
    res.redirect('/grubs/'+req.subgrub.grubID._id);
  });
});


module.exports = router;