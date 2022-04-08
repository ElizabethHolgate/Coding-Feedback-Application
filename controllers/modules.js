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
    res.redirect(`/modules/${module._id}`)
}

module.exports.updateModule = async (req, res) => {
    const { id } = req.params;
    const module = await Module.findByIdAndUpdate(id, { ...req.body.module });
    req.flash('success', 'Successfully updated module!');
    res.redirect(`/modules/${module._id}`);
}

module.exports.addAdmin = async (req, res) => {
    const { id } = req.params;
    const module = await Module.findById(id);
    const user = await User.findOne({ username: req.body.admin });
    module.admins.push(user._id);
    await module.save();
    req.flash('success', 'Successfully added admin!');
    res.redirect(`/modules/${module._id}/edit`);
}

module.exports.addStudent = async (req, res) => {
    const { id } = req.params;
    const module = await Module.findById(id);
    const user = await User.findOne({ username: req.body.student });
    module.students.push(user._id);
    await module.save();
    req.flash('success', 'Successfully added student!');
    res.redirect(`/modules/${module._id}/edit`);
}

module.exports.deleteModule = async (req, res) => {
    const { id } = req.params;
    await Module.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted module!');
    res.redirect('/modules');
}