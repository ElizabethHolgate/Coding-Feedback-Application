const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAdmin, validateTask } = require('../middleware');
const tasks = require('../controllers/tasks');


router.post('/', validateTask, catchAsync(tasks.createTask));
router.delete('/:taskId', catchAsync(tasks.deleteTask));

// app.put('/modules/:id/tasks/:taskId', validateTask, catchAsync(async (req, res) => {
//     const { id } = req.params;
//     await Module.findById(id);
//     await Task.findByIdAndUpdate(taskId, { ...req.body.module });
//     res.redirect(`/modules/${id}`);
// }));

module.exports = router;