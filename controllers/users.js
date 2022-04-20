const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
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
    const redirectUrl = req.session.returnTo || '/modules';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.loggout = (req, res) => {
    req.logout();
    req.flash('success', "Goodbye!");
    res.redirect('/modules');
}

module.exports.showProfile = (req, res) => {
    res.render('users/profile')
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