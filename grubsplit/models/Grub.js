/**
 * Represents an item on a menu
 * Contains attributes
 *   leader (user)
 *   restaurant
 *   list of subgrubs
 *	 tax 
 *   tip
 *   delivery fee
 *
 * Author: aezhou
 */


var mongoose = require('mongoose');
var ObjectID = mongoose.Schema.Types.ObjectId;
var User = require('../models/User');

var grubSchema = new mongoose.Schema({
  owner: { 
    type: ObjectID, 
    ref: "User", 
    required: true 
  },
  subGrubs: [{
    type: ObjectID,
    ref: "SubGrub"
  }],
  restaurantID: Number,
  restaurant_name: String,
  tax: Number,
  tip: Number,
  delivery_fee: Number,
  time_created: Date,
  time_ordered: Date // if no time_ordered... then order is still open
});


/*
  given a grubID, return the grub, with all subgrubs populated
  @param: userID = mongoID of userID
  @param: restaurantID = mongo ObjectID of restaurant
  @param: callback(err, grub)
*/
grubSchema.statics.createNewGrub = function(userID, restaurantID, restaurantName, callback) {
  var now = new Date();
  Grub.create({
    owner: userID,
    restaurantID: restaurantID,
    restaurant_name: restaurantName,
    time_created: now
  }, function(err, grub) {
    callback(err, grub);
  });
}

/*
  given a grubID, return the grub, with all subgrubs populated
  @param: grubID = string of grub id
  @param: callback(err, grub)
*/
grubSchema.statics.getGrub = function(grubID, callback) {
  Grub.findOne({_id: grubID}).populate(['owner', 'subGrubs']).exec(function(err, grub) {
    if (grub) {
      Grub.populate(grub, {
        path: 'subGrubs.owner',
        model: 'User'
      }, function (err, grub) {
        if (grub) {
          callback(null, grub);
        } else {
          callback(err);
        }
      });
    } else {
      callback({msg: 'could not find grub'});
    }
  });
}

/*
  given a grub ID, update the tax, and return the grub or error message
  @param: grubID = id of the grub
  @param: tax = tax amount
  @param: callback(err, grub)
*/
grubSchema.statics.updateTax = function(grubID, tax, callback) {
  Grub.findOneAndUpdate({_id: grubID}, {$set: {tax: tax}}, {new: true}, function(err, grub) {
    if (grub) {
      callback(null, grub);
    } else {
      callback({msg: "could not find grub to update tax"});
    }
  });
}


/*
  given a grub ID, update the delivery amount, and return the grub or error message
  @param: grubID = id of the grub
  @param: delivery = delivery fee
  @param: callback(err, grub)
*/
grubSchema.statics.updateDelivery = function(grubID, delivery, callback) {
  Grub.findOneAndUpdate({_id: grubID}, {$set: {delivery_fee: delivery}}, {new: true}, function(err, grub) {
    if (grub) {
      callback(null, grub);
    } else {
      callback({msg: "could not find grub to update delivery fee"});
    }
  });
}

/*
  given a grub ID, update the tip, and return the grub or error message
  @param: grubID = id of the grub
  @param: tip = tip amount
  @param: callback(err, grub)
*/
grubSchema.statics.updateTip = function(grubID, tip, callback) {
  Grub.findOneAndUpdate({_id: grubID}, {$set: {tip: tip}}, {new: true}, function(err, grub) {
    if (grub) {
      callback(null, grub);
    } else {
      callback({msg: "could not find grub to update tip"});
    }
  });
}

/*
  given a grub ID, delete it
  @param: grubID = id of the grub
  @param: callback(err)
*/
grubSchema.statics.deleteGrub = function(grubID, callback) {
  Grub.remove({_id: grubID}, function(err, grub) {
    if (err) {
      callback({msg: 'could not delete grub'});
    } else {
      callback(null);
    }
  });
}


var Grub = mongoose.model('Grub', grubSchema);
module.exports = mongoose.model('Grub', grubSchema);