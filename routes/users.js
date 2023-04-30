const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const { storeReturnTo } = require('../middleware');
const users = require('../controllers/users');
const passport = require('passport');

router.route('/signup')
    .get(users.renderSignup)
    .post(wrapAsync(users.signup))

router.route('/login')
    .get(users.renderLogin)
    .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login)

router.get('/logout', users.logout); 

module.exports = router;