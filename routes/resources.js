const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validateResource, isLecturer } = require('../middleware');
const resources = require('../controllers/resources');

router.route('/')
    .get(catchAsync(resources.indexRes))
    .post(isLoggedIn, validateResource, catchAsync(resources.createRes));

router.get('/new', isLoggedIn, isLecturer, (resources.renderNewRes));

router.get('/:resId/edit', isLoggedIn, isLecturer, (resources.renderEditRes));

router.put('/:resId', isLoggedIn, validateResource, catchAsync(resources.updateRes));

module.exports = router;