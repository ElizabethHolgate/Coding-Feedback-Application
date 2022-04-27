const Module = require('../models/module');
const Task = require('../models/task');
const User = require('../models/user');
const Diff = require('diff');
const { count } = require('../models/user');

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
    const student = await User.findById(req.user._id);
    const answer = req.body.answer;
    const regex = /^[A-Za-z0-9 ]+$/;
    const diff = Diff.diffWords(answer, task.modelAnswer);
    const lastChar = task.modelAnswer.slice(-1)
    let feedback = '';
    let percent = '';
    
        if(lastChar != regex){
            if(answer.slice(-1) != lastChar){
                feedback = "You missed something off the end of your code!";
            }
        }
        let same = 0;
        let total = 0;
        diff.forEach(d => {
            if(d.removed){
                total += d.count;
            } else if(!d.added){
                same += d.count;
                total+= d.count;
            }
        });
        percent = 'Your answer shares ' + Math.round((same/total)*100) +'% similarity with the model answer!';

    // if(!task.studentAnswers.some(student => student._id )){
        
    // } else {
    //     req.flash('error', 'You have already submitted an answer!');
    // }
    task.studentAnswers.push({ student, answer });
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
    res.render('modules/tasks/showAnswers', { task, module });
}

module.exports.renderAutoFeedback = async(req, res) => {
    const regex = /^[A-Za-z0-9 ]+$/;
    const { id, taskId } = req.params;
    const answer = req.body.answer;
    const module = await Module.findById(id);
    const task = await Task.findById(taskId);
    const diff = Diff.diffWords(answer, task.modelAnswer);
    const lastChar = task.modelAnswer.slice(-1)
    let feedback = '';

    if(lastChar != regex){
        if(answer.slice(-1) != lastChar){
            feedback = "You missed something off the end of your code!";
        }
    }
    let same = 0;
    let total = 0;
    diff.forEach(d => {
        if(d.removed){
            total += d.count;
        } else if(!d.added){
            same += d.count;
            total+= d.count;
        }
    });
    let percent = 'Your answer shares ' + Math.round((same/total)*100) +'% similarity with the model answer!';

    res.render('modules/tasks/autoFeedback', { diff, answer, task, feedback, module, percent });
}