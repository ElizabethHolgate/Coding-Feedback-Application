const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const users = require('../controllers/users');
const { isLoggedIn, isLecturer } = require('../middleware');

router.get('/register', users.renderRegister);

router.post('/register', catchAsync(users.createUser));

router.get('/login', users.renderLogin);

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login);

router.get('/logout', users.loggout);

router.get('/profile', isLoggedIn, users.renderProfile);

router.put('/profile/lecturer', isLoggedIn, isLecturer, catchAsync(users.addLecturer));

router.get('/profile/delete', isLoggedIn, users.renderDelete);

router.delete('/profile/delete', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.deleteAccount);

module.exports = router;