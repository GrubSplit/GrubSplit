/**
* Routes for user login/signup/logout 
*
* Author: marcosp
*         Also, used some boilerplate code from 
*         https://github.com/sahat/hackathon-starter/blob/master/controllers/user.js
*/
var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/User');

/**
 * GET /users/login
 * Login page.
 */
router.get('/login', function(req, res) {
  if (req.user) return res.redirect('/');
  res.render('users/login', {
    title: 'Login'
  });
});

/**
 * POST /users/login
 * Sign in using email and password.
 */
router.post('/login', passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/users/login',
                                   failureFlash: 'Invalid username or password.' })); //FIXME: failureFlash not working?

/**
 * GET /users/logout
 * Log out.
 */
router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

/**
 * GET /users/signup
 * Signup page.
 */
router.get('/signup', function(req, res) {
  if (req.user) return res.redirect('/');
  res.render('users/signup', {
    title: 'Create Account'
  });
});

/**
 * POST /users/signup
 * Create a new local account.
 */
router.post('/signup', function(req, res, next) {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/users/signup');
  }

  User.register(new User({ email : req.body.email }), req.body.password, function(err, user) {
      if (err) {
          console.log(err);
          req.flash('errors', { msg: err.message });
          return res.redirect('/users/signup');
      }

      passport.authenticate('local')(req, res, function () {
        req.session.save(function (err) {
            if (err) {
                console.log(err);
                req.flash('errors', { msg: err.message });
                return next(err);
            }
            res.redirect('/');
      });
    });
  });
});

module.exports = router;