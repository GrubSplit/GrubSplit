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
  refresh_token: { type: String},
  subgrubs: { type: [ObjectID], default: []},
  grub_invites: { type: [ObjectID], default: []},
  open_grubs: { type: [ObjectID], default: []},
  past_grubs: { type: [ObjectID], default: []}
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