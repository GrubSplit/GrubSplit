/**
 * Represents a SubGrub which has a single user's individual order.
 * Attributes include:
 *   user - owner of the subgrub
 *   restaurant - the restaurant being ordered from
 *   items - the user's selection
 *   grubID - id of original grub
 *   price - subtotal of the menu items, without tax, tip, or delivery charge
 *
 * Author: jorrieb
 */

 var mongoose = require('mongoose');
 var ObjectID = mongoose.Schema.Types.ObjectId;

 var itemSchema = new mongoose.Schema({
 	price: Number,
 	id: String,
 	quantity: Number,
 	instructions: String
 });

 var subGrubSchema = new mongoose.Schema({
 	owner:{ 
    	type: ObjectID, 
    	ref: "User", 
    	required: true 
  	},
 	grubID: String,
 	items: [itemSchema]
 });



module.exports = mongoose.model('SubGrub', subGrubSchema);

 var SubGrub = function (user, grubID) {
 	var that = Object.create(SubGrub.prototype)

 	var data = {'owner' : user,
                'grubID' : grubID,
                'items' : [] };
    var subgrub = new model(data);
    subgrub.save();
 	
 	that.getUser = function(){
 		return user;
 	}

 	that.getRestaurant = function(){
 		return restaurant;
 	}

 	that.getItems = function(){
 		return items;
 	}

 	that.getID = function(){
 		return grubID;
 	}

 	that.getPrice = function(){
 		return price;
 	}

 	/**
 		Adds quantity a given item to the SubGrub
 		Params:
 	*/
 	that.addItem = function(itemID, quantity, description, price){
 		
 	}

 	/**
		Removes quantity of a given item up to the number that exist in the subgrub

 	*/
 	that.removeItem = function(item, quantity){

 	}

 	/**
		Allows user to submit their subgrub to the main grub
 	*/
 	that.submitSubGrub = function() {

 	}

	Object.freeze(that);
	return that;
 };