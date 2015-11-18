/**
* Boilerplate code from https://github.com/sahat/hackathon-starter/blob/master/models/User.js
*/

// var bcrypt = require('bcrypt');
var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
  email: { type: String, unique: true, lowercase: true, required: true },
  // password: { type: String, required: true }
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

// /**
//  * Password hash middleware.
//  */
// userSchema.pre('save', function(next) {
//   var user = this;
//   if (!user.isModified('password')) return next();
//   bcrypt.genSalt(10, function(err, salt) {
//     if (err) return next(err);
//     bcrypt.hash(user.password, salt, function(err, hash) {
//       if (err) return next(err);
//       user.password = hash;
//       next();
//     });
//   });
// });

/**
 * Helper method for validating user's password.
 */
// userSchema.methods.comparePassword = function(candidatePassword, cb) {
//   bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
//     if (err) return cb(err);
//     cb(null, isMatch);
//   });
// };


module.exports = mongoose.model('User', userSchema);