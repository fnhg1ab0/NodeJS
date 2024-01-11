const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');
const {validationResult} = require('express-validator');

const User = require('../models/user')

const transporter = nodemailer.createTransport(sendGridTransport({
    auth: {
        api_key: ''
    }
}));

exports.getLogin = (req, res, next) => {
    let mess = req.flash('error');
    if (mess.length > 0) mess = mess[0];
    else mess = null;
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errMess: mess,
        oldInput: {email: '', password: ''},
        validationErrors: []
    })
}

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const pass = req.body.password;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('auth/login', {
            path: '/login',
            pageTitle: 'Login',
            errMess: errors.array()[0].msg,
            oldInput: {email: email, password: pass},
            validationErrors: errors.array()
        });
    }

    // res.setHeader('Set-Cookie', 'loggedIn=true; HttpOnly');
    User.findOne({email: email})
        .then(user => {
            if (!user) {
                return res.status(422).render('auth/login', {
                    path: '/login',
                    pageTitle: 'Login',
                    errMess: 'Invalid email or password.',
                    oldInput: {email: email, password: pass},
                    validationErrors: []
                });
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
                    return res.status(422).render('auth/login', {
                        path: '/login',
                        pageTitle: 'Login',
                        errMess: 'Invalid email or password.',
                        oldInput: {email: email, password: pass},
                        validationErrors: []
                    });
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
        errMess: mess,
        oldInput: {email: '', password: '', confirmPassword: ''},
        validationErrors: []
    });
};

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const pass = req.body.password;
    const confirm = req.body.confirmPassword;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('auth/signup', {
            path: '/signup',
            pageTitle: 'Signup',
            errMess: errors.array()[0].msg,
            oldInput: {email: email, password: pass, confirmPassword: confirm},
            validationErrors: errors.array()
        });
    }

    bcrypt.hash(pass, 12)
        .then((hashPass) => {
            const newUser = new User({
                email: email,
                password: hashPass,
                cart: {items: []}
            });
            return newUser.save();
        })
        .then(user => {
            res.redirect('/login')
            return transporter.sendMail({
                to: email,
                from: 'serviceTTT@gmail.com',
                subject: 'Signup succeeded!',
                html: '<h1>You successfully signed up!</h1>'
            }).catch(err => {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(err);
            });
        });
};

exports.getReset = (req, res, next) => {
    let mess = req.flash('error');
    if (mess.length > 0) mess = mess[0];
    else mess = null;
    res.render('auth/reset', {
        path: '/reset',
        pageTitle: 'Reset Password',
        errMess: mess
    });
};

exports.postReset = (req, res, next) => {
    const email = req.body.email;
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            req.flash('error', 'Something went wrong!');
            return res.redirect('/reset');
        }
        const token = buffer.toString('hex');
        User.findOne({email: email})
            .then(user => {
                if (!user) {
                    req.flash('error', 'No account with that email found!');
                    return res.redirect('/reset');
                }
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000;
                return user.save();
            })
            .then(result => {
                res.redirect('/login');
                transporter.sendMail({
                    to: req.body.email,
                    from: 'serviceTTT@gmail.com',
                    subject: 'Password reset',
                    html: `
                        <p>You requested a password reset</p>
                        <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password</p>
                    `
                })
                    .catch(err => {
                        const error = new Error(err);
                        error.httpStatusCode = 500;
                        return next(err);
                    });
            });
    });
};

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;
    User.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}})
        .then(user => {
            let mess = req.flash('error');
            if (mess.length > 0) mess = mess[0];
            else mess = null;
            res.render('auth/new-pass', {
                path: '/new-password',
                pageTitle: 'New Password',
                errMess: mess,
                userId: user._id.toString(),
                passwordToken: token
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(err);
        });
}

exports.postNewPassword = (req, res, next) => {
    const userId = req.body.userId;
    const token = req.body.passwordToken;
    const pass = req.body.password;
    User.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}, _id: userId})
        .then(user => {
            if (!user) {
                req.flash('error', 'Something went wrong!');
                return res.redirect('/reset');
            }
            return bcrypt.hash(pass, 12)
                .then(hashPass => {
                    user.password = hashPass;
                    user.resetToken = undefined;
                    user.resetTokenExpiration = undefined;
                    return user.save();
                })
                .then(result => {
                    res.redirect('/login');
                });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(err);
        });
}