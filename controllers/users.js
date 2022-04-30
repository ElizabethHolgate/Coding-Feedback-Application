const User = require('../models/user');
const Module = require('../models/module');
const Task = require('../models/task');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

module.exports.renderProfile = async(req, res) => {
    const user = await User.findById(req.user._id)
    const student = await Module.find({ students: user._id });
    const admin = await Module.find({ admins: user._id });
    res.render('users/profile', { student, admin });
}

module.exports.renderDelete = (req, res) => {
    res.render('users/delete');
}

module.exports.createUser = async(req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        user.lecturer = false;
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Code Feedback!');
            res.redirect('/modules');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = req.session.returnTo || '/profile';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.loggout = (req, res) => {
    req.logout();
    req.flash('success', "Goodbye!");
    res.redirect('/');
}

module.exports.addLecturer = async(req, res) => {
    const lecturer = await User.findOne({ username: req.body.lecturer });
    if(lecturer.lecturer){
        req.flash('error', lecturer.username + ' is already a lecturer!');
    } else {
        lecturer.lecturer = true;
        await lecturer.save();
        req.flash('success', lecturer.username + ' is now a lecturer!');
    }
    res.redirect(`/profile`);
}

module.exports.deleteAccount = async(req, res) => {
    const user = await User.findOne({ username: req.body.username });
    const modules = await Module.find({ admins: user._id }).populate('admins');
    
    // delete user id from array then delete modules that have no admins
    await Module.updateMany({ admins: user._id },{ $pull: { admins: user._id } });
    await Module.deleteMany( { admins: { $size: 0} });

    if(!user.lecturer){
        await Module.updateMany( { students: user._id }, { $pull: { students: user._id } });
        await Task.updateMany( { studentAnswers: user._id }, { $pull: { studentAnswers: user._id } });
    } else {
        // if lecturer and they are the only admin on a module who is a lecturer delete module
        const toDelete = [];
        modules.forEach(m => {
            d = true;
            m.admins.forEach(a => {
                if(a.username != user.username){
                    if(a.lecturer){
                        d = false;
                    }
                    
                } 
            });
            if(d){
                toDelete.push(m._id);
            }
        });
        await Module.deleteMany( { _id: toDelete } );
    }
    
    await User.findByIdAndDelete(user._id);
    req.flash('success', "We're sorry to see you go " + user.username + "! Your account and data has been deleted!");
    res.redirect(`/`);
}