const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAdmin, isLecturer } = require('../middleware');
const resources = require('../controllers/resources');

router.route('/')
    .get(catchAsync(resources.indexRes))
    .post(isLoggedIn, catchAsync(resources.createResource));

module.exports = router;