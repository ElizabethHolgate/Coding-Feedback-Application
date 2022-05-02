const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAdmin, isEnrolled, validateTask } = require('../middleware');
const tasks = require('../controllers/tasks');


router.post('/', validateTask, catchAsync(tasks.createTask));

router.route('/:taskId')
    .get(isLoggedIn, isEnrolled, catchAsync(tasks.renderSubmit))
    .put(validateTask, catchAsync(tasks.updateTask))
    .delete(catchAsync(tasks.deleteTask));

router.get('/:taskId/edit', isAdmin, catchAsync(tasks.renderEdit));

router.put('/:taskId/submit', isLoggedIn, isEnrolled, catchAsync(tasks.submitAnswer));

router.get('/:taskId/answers', isLoggedIn, isAdmin, catchAsync(tasks.renderAnswers));

router.route('/:taskId/answers/:answerId')
    .get(isLoggedIn, isAdmin, catchAsync(tasks.renderComment))
    .post(isLoggedIn, isAdmin, catchAsync(tasks.submitComment));

module.exports = router;