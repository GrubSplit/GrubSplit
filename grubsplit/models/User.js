/**
* Represents the User, also deals with authentication
*
* Author: marcosp
*/

var mongoose = require('mongoose');
var ObjectID = mongoose.Schema.Types.ObjectId;
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
  email: { type: String, unique: true, lowercase: true, required: true },
  name: { type: String, required: true },
  token: { type: String },
  refresh_token: { type: String}
});

userSchema.plugin(passportLocalMongoose, {
  'usernameField': 'email',
  'usernameUnique': true,
  'usernameLowerCase': true
});


/*
  Set delivery.com access/refresh tokens for given user
  @param: userID
  @param: access_token
  @param: refresh_token
  @param: callback(err)
*/
userSchema.statics.setTokens = function (userID, access_token, refresh_token, callback) {
  User.update({
    _id: userID
  }, {
    $set: {
      token: access_token,
      refresh_token: refresh_token
    },
  }, function(err) {
    if (err) {
      return callback(err);
    }
    callback(null);
  });
}

/*
  Delete delivery.com access/refresh tokens for given user
  @param: userID
  @param: access_token
  @param: refresh_token
  @param: callback(err)
*/
userSchema.statics.deleteTokens = function (userID, callback) {
  User.update({
    _id: userID
  }, {
    $set: {
      token: null,
      refresh_token: null
    },
  }, function(err) {
    if (err) {
    	return callback(err);
    }
    return callback(null);
  });
}

var User = mongoose.model('User', userSchema);
module.exports = mongoose.model('User', userSchema);