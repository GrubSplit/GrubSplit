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