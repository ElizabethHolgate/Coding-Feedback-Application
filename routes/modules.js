const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAdmin, validateModule, isLecturer } = require('../middleware');
const modules = require('../controllers/modules');

router.get('/new', isLoggedIn, isLecturer, modules.renderNew);

router.route('/')
    .get(catchAsync(modules.index))
    .post(isLoggedIn, validateModule, catchAsync(modules.createModule));

router.route('/:id')
    .get(catchAsync(modules.renderModule))
    .put(validateModule, catchAsync(modules.updateModule))
    .delete(catchAsync(modules.deleteModule));

router.get('/:id/edit', isLoggedIn, isAdmin, catchAsync(modules.renderEdit));

router.put('/:id/edit/admin', catchAsync(modules.addAdmin));

router.put('/:id/edit/student/student', catchAsync(modules.addStudent));

module.exports = router;