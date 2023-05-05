const User = require('../models/user');
const passport = require('passport');

module.exports.renderSignup = (req, res) => {
    res.render('users/signup');
}

module.exports.signup = async (req, res, next) => {
    try {
        const { fullName, email, phone, username, password } = req.body;
        const user = new User({ fullName, email, phone, username });
        const newUser = await User.register(user, password);
        console.log(newUser);
        req.login(newUser, (err) => {
            if(err) return next(err);
            req.flash('success', 'Signed up successfully! Welcome to Adoptify');
            res.redirect('/animals');
        });
    } catch(e) {
        req.flash('error', e.message);
        res.redirect('/signup');
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

module.exports.login = (req, res) => {
    req.flash('success', 'Logged in successfully! Welcome back to Adoptify');
    const redirectUrl = res.locals.returnTo || '/animals';
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) return next(err);
        req.flash('success', 'Logged you out! Goodbye');
        res.redirect('/animals');
    });
}