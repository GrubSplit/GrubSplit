/**
* Boilerplate code from https://github.com/sahat/hackathon-starter/blob/master/controllers/user.js
*/

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
};

/**
 * POST /users/login
 * Sign in using email and password.
 */
router.post('/login', function(req, res, next) {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password cannot be blank').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('users/login');
  }

  passport.authenticate('local', function(err, user, info) {
    if (err) return next(err);
    if (!user) {
      req.flash('errors', { msg: info.message });
      return res.redirect('users/login');
    }
    req.logIn(user, function(err) {
      if (err) return next(err);
      req.flash('success', { msg: 'Success! You are logged in.' });
      res.redirect(req.session.returnTo || '/');
    });
  })(req, res, next);
};

/**
 * GET /users/logout
 * Log out.
 */
router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
};

/**
 * GET /users/signup
 * Signup page.
 */
router.get('/signup', function(req, res) {
  if (req.user) return res.redirect('/');
  res.render('users/signup', {
    title: 'Create Account'
  });
};

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

  var user = new User({
    email: req.body.email,
    password: req.body.password
  });

  User.findOne({ email: req.body.email }, function(err, existingUser) {
    if (existingUser) {
      req.flash('errors', { msg: 'Account with that email address already exists.' });
      return res.redirect('/users/signup');
    }
    user.save(function(err) {
      if (err) return next(err);
      req.logIn(user, function(err) {
        if (err) return next(err);
        res.redirect('/');
      });
    });
  });
};