const bcrypt = require('bcryptjs');

const User = require('../models/user')

exports.getLogin = (req, res, next) => {
    let mess = req.flash('error');
    if (mess.length > 0) mess = mess[0];
    else mess = null;
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errMess: mess
    })
}

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const pass = req.body.password;
    // res.setHeader('Set-Cookie', 'loggedIn=true; HttpOnly');
    User.findOne({email: email})
        .then(user => {
            if (!user) {
                req.flash('error', 'Email does not exist!');
                return res.redirect('/login');
            }
            bcrypt.compare(pass, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        return req.session.save((err) => { // ensure session is saved in database before redirect
                            res.redirect('/');
                        });
                    }
                    req.flash('error', 'Wrong password!');
                    res.redirect('/login');
                })
        })
        .catch(err => {
            res.redirect('/login');
        });
}

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        res.redirect('/');
    });
}

exports.getSignup = (req, res, next) => {
    let mess = req.flash('error');
    if (mess.length > 0) mess = mess[0];
    else mess = null;
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        errMess: mess
    });
};

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const pass = req.body.password;
    const confirm = req.body.confirmPassword;

    User.findOne({email: email})
        .then(user => {
            if (user) {
                req.flash('error', 'Email already exists!');
                return res.redirect('/signup');
            }
            return bcrypt.hash(pass, 12)
                .then((hashPass) => {
                    const newUser = new User({
                        email: email,
                        password: hashPass,
                        cart: {items: []}
                    });
                    return newUser.save();
                })
                .then(user => res.redirect('/login'));
        })
        .catch(err => console.log(err));
};