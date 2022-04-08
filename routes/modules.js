const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAdmin, validateModule, isLecturer } = require('../middleware');
const modules = require('../controllers/modules');

router.get('/new', isLoggedIn, isLecturer, modules.renderNew);
router.post('/', isLoggedIn, validateModule, catchAsync(modules.createModule));
router.get('/', catchAsync(modules.index));
router.get('/:id', catchAsync(modules.renderModule));
router.get('/:id/edit', isLoggedIn, isAdmin, catchAsync(modules.renderEdit));
router.put('/:id', validateModule, catchAsync(modules.updateModule));
router.delete('/:id', catchAsync(modules.deleteModule));

module.exports = router;