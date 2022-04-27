const Module = require('../models/module');
const User = require('../models/user');

module.exports.index = async(req, res) => {
    const modules = await Module.find({});
    res.render('modules/index', { modules });
}

module.exports.renderModule = async(req, res) => {
    const module = await Module.findById(req.params.id).populate('tasks').populate('admins');
    if(!module){
        req.flash('error', 'Cannot find that module!');
        return res.redirect('/modules');
    }
    res.render('modules/show', { module });
}

module.exports.renderEdit = async (req, res) => {
    const module = await Module.findById(req.params.id).populate('admins').populate('students');

    if(!module){
        req.flash('error', 'Cannot find that module!');
        return res.redirect('/modules');
    }
    res.render('modules/edit', { module });
}

module.exports.renderNew = (req, res) => {
    res.render('modules/new');
}

module.exports.createModule = async (req, res) => {
    const module = new Module(req.body.module);
    module.admins.push(req.user._id);
    await module.save();
    req.flash('success', 'Successfully made a new module!');
    res.redirect(`/modules/${module._id}`);
}

module.exports.updateModule = async (req, res) => {
    const { id } = req.params;
    await Module.findByIdAndUpdate(id, { ...req.body.module });
    req.flash('success', 'Successfully updated module!');
    res.redirect(`/modules/${id}`);
}

module.exports.addAdmin = async (req, res) => {
    const { id } = req.params;
    const module = await Module.findById(id);
    const user = await User.findOne({ username: req.body.admin });
    if(!user){
        req.flash('error', 'User not found! Please check the username is spelt correctly!');
    }
    else if(module.admins.includes(user._id)){
        req.flash('error', user.username + ' is already admin on this module!');
    } else {
        module.admins.push(user._id);
        await module.save();
        req.flash('success', 'Successfully added ' + user.username + ' as an admin!');
    }
    res.redirect(`/modules/${id}/edit`);
}

module.exports.addStudent = async (req, res) => {
    const { id } = req.params;
    const module = await Module.findById(id);
    const user = await User.findOne({ username: req.body.student });
    if(module.students.includes(user._id)){
        req.flash('error', 'Student already enrolled on module!');
    } else if(user.lecturer) {
        req.flash('error', user.username + ' is a lecturer and cannot be added as a student!');
    } else {
        module.students.push(user._id);
        await module.save();
        req.flash('success', 'Successfully added student!');
    }
    res.redirect(`/modules/${id}/edit`);
}

module.exports.deleteModule = async (req, res) => {
    const { id } = req.params;
    await Module.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted module!');
    res.redirect('/modules');
}

module.exports.deleteAdmin = async (req, res) => {
    const { id } = req.params;
    await Module.findByIdAndUpdate(id, { $pull: { admins: req.body.adminDelete } });
    res.redirect(`/modules/${id}/edit`);
}

module.exports.deleteStudent = async (req, res) => {
    const { id } = req.params;
    await Module.findByIdAndUpdate(id, { $pull: { students: req.body.studentDelete } });
    res.redirect(`/modules/${id}/edit`);
}