const Module = require('../models/module');
const Task = require('../models/task');
const User = require('../models/user');
const Diff = require('diff');

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
    res.render('modules/tasks/editTask', { module, task });
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
    res.render('modules/tasks/submit', { module, task });
}

module.exports.submitAnswer = async (req, res) => {
    const { id, taskId } = req.params;
    const task = await Task.findById(taskId);
    const module = await Module.findById(id);
    const student = await User.findById(req.user._id);
    const answer = req.body.answer;
    // if(!task.studentAnswers.some(s => student._id )){
    //     task.studentAnswers.push({ student, answer });
    //     await task.save();
    //     this.renderAutoFeedback(answer, module, task);
    // } else {
    //     req.flash('error', 'You have already submitted an answer!');
    //     res.redirect(`/modules/${id}`);
    // }

    const regex = /^[A-Za-z0-9 ]+$/;
    const diff = Diff.diffWords(answer, task.modelAnswer);
    const diffChar = Diff.diffChars(answer, task.modelAnswer);
    const lastChar = task.modelAnswer.slice(-1)
    let feedback = '';

    if(lastChar != regex){
        if(answer.slice(-1) != lastChar){
            feedback = "You missed something off the end of your code!";
        }
    }
    let same = 0;
    let total = 0;
    diffChar.forEach(d => {
        if(d.removed){
            total += d.count;
        } else if(!d.added){
            same += d.count;
            total+= d.count;
        } else if(d.added){
            same -= d.count;
        }
    });
    const similarity = Math.round((same/total)*100);
    const percent = 'Your answer shares ' + similarity +'% similarity with the model answer!';

    task.studentAnswers.push({ student, answer, similarity });
    await task.save();
    req.flash('success', 'Successfully submitted answer!');
    res.render('modules/tasks/autoFeedback', { diff, answer, task, feedback, module, percent });
}

module.exports.renderAnswers = async (req, res) => {
    const task = await Task.findById(req.params.taskId).populate('studentAnswers.student');
    const module = await Module.findById(req.params.id);
    if(!task){
        req.flash('error', 'Cannot find that task!');
        return res.redirect(`/modules/${module._id}`);
    } 
    // console.log(task.studentAnswers[0]._id);
    res.render('modules/tasks/showAnswers', { task, module });
}

module.exports.renderComment = async (req, res) => {
    const { id, taskId, answerId } = req.params;
    const module = await Module.findById(id);
    let answer = {};
    const task = await Task.findById(taskId).populate('studentAnswers.student');
    task.studentAnswers.forEach(a => {
        if(a._id == answerId){
            answer = a;
        }
    });
    res.render('modules/tasks/submitComment', { module, task, answer });
}

module.exports.submitComment = async (req, res) => {
    const { id, taskId, answerId } = req.params;
    const task = await Task.findById(taskId);
    const comment = { username: req.user.username, comment: req.body.comment }
    if(!task){
        req.flash('error', 'Cannot find that task!');
        return res.redirect(`/modules/${id}/tasks/${taskId}/answers`);
    }
    task.studentAnswers.forEach(a => {
        if(a._id == answerId){
            a.comments.push(comment);
        }
    });
    await task.save();
    return res.redirect(`/modules/${id}/tasks/${taskId}/answers/${answerId}`);
}