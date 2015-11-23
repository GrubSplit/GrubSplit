var express = require('express');
var router = express.Router();
var Grub = require('../models/Grub');
var SubGrub = require('../models/SubGrub');
var utils = require('../utils/utils');


/*
  Grab subgrub from the store whenever one is referenced with an ID in the
  request path (any routes defined with :subgrub as a paramter).
*/
router.param('subgrub', function(req, res, next, subGrubIdStr) {
  if (subGrubIdStr === "0") {
    req.subgrub = {user:"Jorrie", items:[], id:33, cost:6.90, menu:{children:[{type:"menu"};
    next();
  } else {
    var subGrubId = new ObjectID(subGrubIdStr);
    SubGrub.find({ _id: subGrubId}, function(err, subgrub) {
      if (subgrub && subgrub.owner.equals(req.user._id)) {
        req.subgrub = subgrub;
        next();
      } else {
        utils.sendErrResponse(res, 404, 'Resource not found.');
      }
    });
  }
});

/**
 * GET /subgrubs/:id
 * SubGrub page.
 */
router.get('/:subgrub', function(req, res) {
  res.render('subgrubs', { subgrub: req.subgrub });
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
  // TODO add subgrub to grub 
  SubGrub.create({owner: user, grubID: req.subgrub.grubID, 

  }user, req.grubID, req.item, req.quantity, function(subgrub) {
  	res.render('/subgrubs', { subgrub: subgrub});
  })

  res.redirect('/grubs/'+req.grub.grubID);
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