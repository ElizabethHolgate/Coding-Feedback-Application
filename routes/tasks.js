const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAdmin, validateTask } = require('../middleware');
const tasks = require('../controllers/tasks');


router.post('/', validateTask, catchAsync(tasks.createTask));

router.route('/:taskId')
    .get(catchAsync(tasks.renderEdit))
    .put(validateTask, catchAsync(tasks.updateTask))
    .delete(catchAsync(tasks.deleteTask));

module.exports = router;