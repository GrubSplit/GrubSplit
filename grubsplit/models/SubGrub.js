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
 var Grub = require('./Grub');

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
 	grubID: {
 		type: ObjectID,
 		ref: "Grub",
 		required: true
 	},
 	items: [itemSchema]
 });

subGrubSchema.statics.deleteSubGrub = function(subgrub, callback) {
	var subgrubID = subgrub._id
	var grubID = subgrub.grubID;
	SubGrub.remove({_id: subgrubID}, function(err) {
		if (err) {
			callback({msg: 'could not delete subgrub'});
		} else {
			Grub.findOneAndUpdate({ _id: grubID }, {$pull: { subGrubs: subgrubID }}, function(err){
		        if (err) {
		        	callback({msg: 'could not delete subgrub ref from grub'});
		        }
		    });
		}
	});
}

var SubGrub = mongoose.model('SubGrub', subGrubSchema);
module.exports = mongoose.model('SubGrub', subGrubSchema);
