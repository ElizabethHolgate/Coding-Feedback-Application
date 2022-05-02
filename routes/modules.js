const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAdmin, validateModule, isLecturer } = require('../middleware');
const modules = require('../controllers/modules');

router.get('/new', isLoggedIn, isLecturer, modules.renderNew);

router.route('/')
    .get(isLoggedIn, catchAsync(modules.index))
    .post(isLoggedIn, validateModule, catchAsync(modules.createModule));

router.route('/:id')
    .get(isLoggedIn, catchAsync(modules.renderModule))
    .put(validateModule, catchAsync(modules.updateModule))
    .delete(catchAsync(modules.deleteModule));

router.get('/:id/edit', isLoggedIn, isAdmin, catchAsync(modules.renderEdit));

router.route('/:id/edit/admin')
    .put(isAdmin, isLecturer, catchAsync(modules.addAdmin))
    .delete(isAdmin, isLecturer, catchAsync(modules.deleteAdmin));

router.route('/:id/edit/student')
    .put(isAdmin, isLecturer, catchAsync(modules.addStudent))
    .delete(isAdmin, isLecturer, catchAsync(modules.deleteStudent));

module.exports = router;