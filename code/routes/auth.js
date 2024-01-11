const express = require('express');
const {check, body} = require('express-validator');

const router = express.Router();

const authController = require('../controllers/auth');
const User = require("../models/user");

router.get('/login', authController.getLogin);

router.post(
    '/login',
    [
        body('email')
            .isEmail()
            .withMessage('Please enter a valid email address.'),
        body('password', 'Password has to be valid.')
            .isLength({min: 5})
            .isAlphanumeric()
    ],
    authController.postLogin
);

router.post('/logout', authController.postLogout);

router.get('/signup', authController.getSignup);

router.post(
    '/signup',
    [
        check('email')
            .isEmail()
            .withMessage('Please enter a valid email.')
            .custom((value, {req}) => {
                // if (value === 'test@gmail.com') throw new Error('This email address is forbidden.');
                // return true;

                // in custom validator, we can return a promise, a true/false value, or throw an error
                // if we return a promise, express-validator will wait for the promise to resolve or reject before continuing to the next validation and  the value in the reject will be the error message
                // if we return a true/false value, express-validator will continue immediately
                // if we throw an error, express-validator will stop immediately and return the error message
                return User.findOne({email: value})
                    .then(user => {
                        if (user) {
                            return Promise.reject('Email already exists!');
                        }
                    });
            }),
        //     check the password field in the request body (not header, not params, not query)
        body('password')
            .isLength({min: 5})
            .withMessage('Please enter a password with at least 5 characters.')
            .isAlphanumeric()
            .withMessage('Please enter a password with only numbers and text.'),
        body('confirmPassword')
            .custom((value, {req}) => {
                if (value !== req.body.password) throw new Error('Passwords have to match!');
                return true;
            })
    ],
    authController.postSignup
);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

module.exports = router;