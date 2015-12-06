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
  subtotal: Number,
  tax: Number,
  tip: Number,
  delivery_fee: Number,
  discount: Number,
  total: Number,
  time_created: Date,
  time_ordered: Date // if no time_ordered... then order is still open
});


/*
  Create a new Grub, given a userID, and restaurant information
  @param: userID = mongoID of userID
  @param: restaurantID = mongo ObjectID of restaurant
  @param: restaurantName = name of restaurant (string)
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
  given a grub ID, delete it
  @param: grubID = id of the grub
  @param: callback(err)
*/
grubSchema.statics.deleteGrub = function(grubID, callback) {
  Grub.remove({_id: grubID}, function(err) {
    if (err) {
      callback({msg: 'could not delete grub'});
    } else {
      callback(null);
    }
  });
}

/*
  given a grub ID, set time_ordered to current time,
  and set subtotal, tax, delivery_fee, discount, and total
  @param: grubID = id of the grub
  @param: callback(err)
*/
grubSchema.statics.completeGrub = function(grubID, subtotal, tax, tip, delivery_fee, discount, total, callback) {
  var update = {
    'time_ordered': new Date(),
    'subtotal': subtotal,
    'tax': tax,
    'tip': tip,
    'delivery_fee': delivery_fee,
    'discount': discount,
    'total': total
  }
  Grub.findOneAndUpdate({_id: grubID }, {$set: update}, {new: true}, function(err, grub) {
    if (err) {
      callback({msg: 'could not mark grub as completed'});
    } else {
      callback(null, grub);
    }
  });
}

var Grub = mongoose.model('Grub', grubSchema);
module.exports = mongoose.model('Grub', grubSchema);