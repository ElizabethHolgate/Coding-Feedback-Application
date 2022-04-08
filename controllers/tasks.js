const Module = require('../models/module');
const Task = require('../models/task');

module.exports.createTask = async (req, res) => {
    const module = await Module.findById(req.params.id);
    const task = new Task(req.body.task);
    module.tasks.push(task);
    await task.save();
    await module.save();
    req.flash('success', 'Successfully made a new task!');
    res.redirect(`/modules/${module._id}`);
}

module.exports.renderEdit = async(req, res) => {
    const module = await Module.findById(req.params.id);
    const task = await Task.findById(req.params.taskId);
    if(!task){
        req.flash('error', 'Cannot find that task!');
        return res.redirect(`/modules/${module._id}`);
    }
    res.render('modules/editTask', { module, task });
}

module.exports.updateTask = async(req, res) => {
    const { id, taskId } = req.params;
    await Task.findByIdAndUpdate(taskId, { ...req.body.task });
    req.flash('success', 'Successfully updated task!');
    res.redirect(`/modules/${id}`);
}

module.exports.deleteTask = async (req, res) => {
    const { id, taskId } = req.params;
    await Module.findByIdAndUpdate(id, { $pull: { tasks: taskId } });
    await Task.findByIdAndDelete(taskId);
    req.flash('success', 'Successfully deleted task!');
    res.redirect(`/modules/${id}`);
}

module.exports.renderSubmit = async (req, res) => {
    const module = await Module.findById(req.params.id);
    const task = await Task.findById(req.params.taskId);
    if(!task){
        req.flash('error', 'Cannot find that task!');
        return res.redirect(`/modules/${module._id}`);
    }
    res.render('modules/submit', { module, task });
}

module.exports.submitAnswer = async (req, res) => {
    const { id, taskId } = req.params;
    const task = await Task.findById(taskId);
    const student = req.user._id;
    const answer = req.body.answer;
    task.studentAnswers.push({ student, answer });
    await task.save();
    req.flash('success', 'Successfully submitted answer!');
    res.redirect(`/modules/${id}`);
}