/**
* Represents the User, also deals with authentication
*
* Author: marcosp
*/

var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
  email: { type: String, unique: true, lowercase: true, required: true },
  // tokens: Array,
  // profile: {
  //   name: { type: String, default: '' },
  //   picture: { type: String, default: '' }
  // }
  // resetPasswordToken: String,
  // resetPasswordExpires: Date
});

userSchema.plugin(passportLocalMongoose, {
  'usernameField': 'email',
  'usernameUnique': true,
  'usernameLowerCase': true
});

module.exports = mongoose.model('User', userSchema);