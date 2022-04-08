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
    req.flash('success', 'welcome back!');
    const redirectUrl = req.session.returnTo || '/modules';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.loggout = (req, res) => {
    req.logout();
    req.flash('success', "Goodbye!");
    res.redirect('/modules');
}