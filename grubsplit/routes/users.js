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
var Delivery = require('../libraries/Delivery');
var User = require('../models/User');
var Grub = require('../models/Grub');
var SubGrub = require('../models/SubGrub');


/**
 * GET /users/login
 * Login page.
 */
router.get('/login', function(req, res) {
  if (req.user) {
    if (req.user.token && req.user.refresh_token) {
      return res.redirect('/');
    }
    return res.redirect(Delivery.authorizeAccountURL());
  }
  res.render('users/login', {
    title: 'Login'
  });
});

/**
 * POST /users/login
 * Sign in using email and password.
 */
router.post('/login', passport.authenticate('local', {
  successRedirect: Delivery.authorizeAccountURL(),
  failureRedirect: '/users/login',
  failureFlash: true
}));

/**
 * GET /users/logout
 * Log out.
 */
router.get('/logout', function(req, res) {
  if (!req.user) return res.redirect('/users/login');
  User.deleteTokens(req.user.id, function (err) {
    if (err) {
      req.flash('errors', { msg: err.msg });
    }
    req.logout();
    res.redirect('/users/login');
  });
});

/**
 * GET /users/signup
 * Signup page.
 */
router.get('/signup', function(req, res) {
  if (req.user) {
    if (req.user.token && req.user.refresh_token) {
      return res.redirect('/');
    }
    return res.redirect(Delivery.authorizeAccountURL());
  }
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
  req.assert('name', 'Name is required').len(1);
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/users/signup');
  }

  User.register(new User({
    email: req.body.email,
    name: req.body.name
  }), req.body.password, function(err, user) {
    if (err) {
      req.flash('errors', {
        msg: err.message
      });
      return res.redirect('/users/signup');
    }

    passport.authenticate('local')(req, res, function() {
      req.session.save(function(err) {
        if (err) {
          req.flash('errors', {
            msg: err.message
          });
          return next(err);
        }
        res.redirect(Delivery.createAccountURL());
      });
    });
  });
});

/**
 * GET /profile
 * Profile page.
 */
router.get('/profile', function(req, res) {
  if (req.user) {
    if (!(req.user.token && req.user.refresh_token)) {
      return res.redirect(Delivery.authorizeAccountURL());
    }
  } else {
    return res.redirect('/users/login');
  }
  SubGrub.findUserGrubs(req.user._id,
    function (err, open_grubs, past_grubs) {
      if (err) {
        req.flash('errors', err);
        return res.redirect('/');
      }
      res.render('users/profile', {
          'open_grubs': open_grubs,
          'past_grubs': past_grubs
      });
  });
});

module.exports = router;