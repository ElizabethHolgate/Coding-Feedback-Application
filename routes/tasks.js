const express = require('express');
const router = express.Router({ mergeParams: true });

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/EpressError');

const Module = require('../models/module');
const Task = require('../models/task');
const { taskValidation } = require('../validationSchemas');

const validateTask = (req, res, next) => {
    const { error } = taskValidation.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.post('/', validateTask, catchAsync(async (req, res) => {
    const module = await Module.findById(req.params.id);
    const task = new Task(req.body.task);
    module.tasks.push(task);
    await task.save();
    await module.save();
    req.flash('success', 'Successfully made a new task!');
    res.redirect(`/modules/${module._id}`);
}));

// app.put('/modules/:id/tasks/:taskId', validateTask, catchAsync(async (req, res) => {
//     const { id } = req.params;
//     await Module.findById(id);
//     await Task.findByIdAndUpdate(taskId, { ...req.body.module });
//     res.redirect(`/modules/${id}`);
// }));

router.delete('/:taskId', catchAsync(async (req, res) => {
    const { id, taskId } = req.params;
    await Module.findByIdAndUpdate(id, { $pull: { tasks: taskId } });
    await Task.findByIdAndDelete(taskId);
    req.flash('success', 'Successfully deleted task!');
    res.redirect(`/modules/${id}`);
}));

module.exports = router;