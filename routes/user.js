const express = require('express');
const router = express.Router();
const passport = require('passport');
const wrapAsync = require('../utils/wrapAsync');
const { saveReturnTo } = require('../middleware');
const userController = require('../controllers/user');

// Signup
router.route('/signup')
  .get(userController.renderSignupForm)
  .post(wrapAsync(userController.signup));

// Login
router.route('/login')
  .get(userController.renderLoginForm)
  .post(
    saveReturnTo,
    passport.authenticate('local', {
      failureRedirect: '/login',
      failureFlash: true,
    }),
    userController.login
  );

// Logout
router.get('/logout', userController.logout);

module.exports = router;