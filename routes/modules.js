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

router.route('/:id/edit/admin')
    .put(catchAsync(modules.addAdmin))
    .delete(catchAsync(modules.deleteAdmin));

router.route('/:id/edit/student')
    .put(catchAsync(modules.addStudent))
    .delete(catchAsync(modules.deleteStudent));

module.exports = router;