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
  tax: Number,
  tip: Number,
  delivery_fee: Number,
  time_created: Date,
  time_ordered: Date // if no time_ordered... then order is still open
});


/*
  given a grubID, return the grub, with all subgrubs populated
  @param: currentUserEmail = email of currently logged in user (aka grubLeader)
  @param: restaurantID = mongo ObjectID of restaurant
  @param: callback(err, grub)
*/
grubSchema.statics.createNewGrub = function(currentUserEmail, restaurantID, callback) {
  var now = new Date();
  User.findOne({email: currentUserEmail}, function(err, user) {
    if (user) {
      Grub.create({
        owner: user._id,
        restaurantID: restaurantID,
        time_created: now
      });
    } else {
      callback({msg: 'could not find user'});
    }
  });
}

/*
  given a grubID, return the grub, with all subgrubs populated
  @param: grubID = mongo ObjectID of grub
  @param: callback(err, grub)
*/
grubSchema.statics.getGrub = function(grubID, callback) {
  Grub.findOne({_id: mongoose.Schema.Types.ObjectId(grubID)}).populate(['subGrubs']).exec(function(err, grub) {
    if (grub) {
        callback(null, grub);
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
};


/*
  given a grub ID, update the delivery amount, and return the grub or error message
  @param: grubID = id of the grub
  @param: delivery = delivery fee
  @param: callback(err, grub)
*/
grubSchema.statics.updateDelivery = function(grubID, delivery, callback) {
  Grub.findOneAndUpdate({_id: grubID}, {$set: {delivery: delivery}}, {new: true}, function(err, grub) {
    if (grub) {
      callback(null, grub);
    } else {
      callback({msg: "could not find grub to update delivery fee"});
    }
  });
};

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
};

var Grub = mongoose.model('Grub', grubSchema);
module.exports = mongoose.model('Grub', grubSchema);

// var Grub = function (user, restaurant) {
//   var that = Object.create(Grub.prototype);

//   var subgrubs = [];
//   var tax;
//   var tip;
//   var deliveryFee;

//   that.getLeader = function() {
//   	return user;
//   } 

//   that.getRestaurant = function() {
//   	return restaurant;
//   }

//   var setFees = function() {
//   	tax = restaurant.getTax();
//   	deliveryFee = restaurant.getDeliveryFee();
//   }

//   setFees();

//   that.getTip = function() {
//   	return tip;
//   }

//   that.setTip = function(amt) {
//   	tip = amt;
//   }

//   that.getOrder = function() {
//   	order = [];
//   	subgrubs.forEach(function(subgrub) {
//   		order.push(subgrub.getOrder());
//   	})

//   	return order;
//   }

//   Object.freeze(that);
//   return that;
// };