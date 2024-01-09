const User = require('../models/user')

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuth: req.session.isLoggedIn
    })
}

exports.postLogin = (req, res, next) => {
    // res.setHeader('Set-Cookie', 'loggedIn=true; HttpOnly');
    User.findById('6566ea89bddf3e67f3bfcee9')
        .then(user => {
            req.session.isLoggedIn = true;
            req.session.user = user;
            res.session.save((err) => { // ensure session is saved in database before redirect
                console.log(err);
                res.redirect('/');
            })
        })
        .catch(err => console.log(err));
}

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    });
}