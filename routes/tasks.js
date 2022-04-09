const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAdmin, isEnrolled, validateTask } = require('../middleware');
const tasks = require('../controllers/tasks');


router.post('/', validateTask, catchAsync(tasks.createTask));
router.get('/:taskId/edit', isLoggedIn, isAdmin, catchAsync(tasks.renderEdit));
router.route('/:taskId')
    .get(isLoggedIn, isEnrolled, catchAsync(tasks.renderSubmit))
    .put(validateTask, catchAsync(tasks.updateTask))
    .delete(catchAsync(tasks.deleteTask));
router.put('/:taskId/submit', catchAsync(tasks.submitAnswer));

module.exports = router;