const { moduleValidation, taskValidation, resourceValidation } = require('./validationSchemas');
const ExpressError = require('./utils/ExpressError');
const Module = require('./models/module');
const User = require('./models/user');
const Task = require('./models/task');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateModule = (req, res, next) => {
    const { error } = moduleValidation.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.isLecturer = async(req, res, next) => {
    const user = await User.findById(req.user._id);
    console.log(user);
    if(user.lecturer === false) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/modules`);
    }
    next();
}

module.exports.isAdmin = async (req, res, next) => {
    const { id } = req.params;
    const module = await Module.findById(id);
    if(!module.admins.includes(req.user._id)){
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/modules/${id}`);
    }
    next();
}

module.exports.isEnrolled = async (req, res, next) => {
    const { id } = req.params;
    const module = await Module.findById(id);
    if(!module.students.includes(req.user._id)){
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/modules/${id}`);
    }
    next();
}

module.exports.validateTask = (req, res, next) => {
    const { error } = taskValidation.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.validateResource = (req, res, next) => {
    const { error } = resourceValidation.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}