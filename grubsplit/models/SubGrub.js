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
 var ObjectId = mongoose.Types.ObjectId;
 var Grub = require('./Grub');

 var itemSchema = new mongoose.Schema({
  id: String,
  name: String,
 	price: Number,
 	quantity: {type: Number, default: 1},
 	instructions: {type: String, default: ''}
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
 	items: [itemSchema],
  paid: Boolean,
  totalAmount: Number
 });


/*
  create SubGrub and add reference to its parent Grub
  @param: userID = ObjectId of User doc
  @param: grubID = ObjectId of Grub doc
  @param: callback(err, subGrub)
*/
subGrubSchema.statics.createNewSubGrub = function(userID, grubID, callback) {
  Grub.findOne({_id: grubID}).populate(['owner']).exec(function(err, grub) {
    if (err) {
      callback({msg: 'could not find Grub'});
    } else {
      var grubOwnerID = grub.owner._id;
      SubGrub.create({
          owner: userID,
          grubID: grubID,
          paid: grubOwnerID.equals(userID)
      }, function(err, subGrub) {
        if (err) {
          callback({msg: 'could not create subgrub'});
        } else {
          grub.subGrubs.push(subGrub._id);
          grub.save(function(err) {
            if (err) {
              callback({msg: 'could not add subgrub id to grub'});
            } else {
              callback(null, subGrub);
            }
          });
        }
      });
    }
  });
}

/*
  Add items to subgrub with given id
  @param: grubID = ObjectId of Grub doc
  @param: callback(err, subGrub)
*/
subGrubSchema.statics.addItems = function(subgrubID, newItems, totalCost, callback) {
  SubGrub.findOneAndUpdate({ _id: subgrubID }, { $set: { items: newItems, totalAmount: totalCost } }, {'new': true},function(err, subGrub) {
  	if (err) {
  		callback({msg: 'could not update subgrub with given items'});
  	} else {
  		callback(null, subGrub)
  	}
  });
}

/*
  given a subGrubID, return the subGrub, with the user and grub populated
  @param: subGrubID = string of subGrub id
  @param: callback(err, subGrub)
*/
subGrubSchema.statics.getSubGrub = function(subGrubID, callback) {
  SubGrub.findOne({_id: subGrubID}).populate(['owner', 'grubID']).exec(function(err, subGrub) {
    if (subGrub) {
        callback(null, subGrub);
    } else {
      callback({msg: 'could not find subGrub'});
    }
  });
}

 /*
  RemoveSubGrub doc, remove it from SubGrub collection and 
  remove reference from parent Grub
  @param: subgrubID = id of subgrub
  @param: grubID = id of grub 
  @param: callback(err)
*/
subGrubSchema.statics.deleteSubGrub = function(subgrubID, grubID, callback) {
	SubGrub.remove({_id: subgrubID}, function(err) {
		if (err) {
			callback({msg: 'could not delete subgrub'});
		} else {
			Grub.findOneAndUpdate({ _id: grubID }, {$pull: { subGrubs: subgrubID }}, function(err){
		        if (err) {
		        	callback({msg: 'could not delete subgrub ref from grub'});
		        } else {
		        	callback(null);
		        }
		    });
		}
	});
}

 /*
  Changes payment status of subgrub
  @param: subgrubID = id of subgrub
  @param: paidStatus = new payment status (boolean)
  @param: callback(err, subgrub)
*/
subGrubSchema.statics.togglePayment = function(subgrubID, paidStatus, callback) {
  SubGrub.findOneAndUpdate({_id: subgrubID}, { $set: { paid: paidStatus }}, {'new': true}, function(err, subGrub) {
    if (subGrub) {
      callback(null, subGrub);
    } else {
      callback({msg: 'could not update subGrub'});
    }
  });
}

/*
  Find all Grubs where User is ordering, or has ordered in.
  @param: userID = ObjectId of current user 
  @param: callback(err, open_grubs, past_grubs)
*/
subGrubSchema.statics.findUserGrubs = function(userID, callback) {
  SubGrub.find({ owner: userID })
         .select('-_id grubID')
         .exec(function (err, grubIDs) {
    if (err) {
      return callback({msg: 'could not find grubs for user'});
    }
    grubIDs = grubIDs.map(function(elm) {return elm.grubID;});
    Grub.find({})
        .or([{ owner: userID }, { _id: { $in: grubIDs } }])
        .populate('owner')
        .select('restaurant_name owner time_ordered')
        .exec(function (err, grubs) {
          if (err) {
            return callback(err);
          }
          var open_grubs = [];
          var past_grubs = [];
          grubs.forEach(function (grub) {
            if (grub.time_ordered) {
              past_grubs.push(grub);
            } else {
              open_grubs.push(grub);
            }
          });
          return callback(null, open_grubs, past_grubs);
        });
  });
}

var SubGrub = mongoose.model('SubGrub', subGrubSchema);
module.exports = mongoose.model('SubGrub', subGrubSchema);
