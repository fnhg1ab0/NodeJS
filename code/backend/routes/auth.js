const express = require('express');
const { body } = require('express-validator');
const isAuth = require('../middleware/isAuth');
const User = require('../models/user');

const router = express.Router();

const authController = require('../controllers/auth');

router.put(
    '/signup',
    [
        body('email')
            .isEmail()
            .withMessage('Please enter a valid email.')
            .custom((value, {req}) => {
                return User.findOne({email:value}).then(doc => {
                    if(doc) return Promise.reject('Email address already exists.');
                })
            })
            .normalizeEmail(),
        body('password')
            .trim()
            .isLength({min: 5}),
        body('name')
            .trim()
            .not()
            .isEmpty()
    ],
    authController.signup
);

router.post('/login', authController.login);

router.get('/status', isAuth, authController.getUserStatus);

router.patch(
    '/status',
    isAuth,
    [
        body('status')
            .trim()
            .not()
            .isEmpty()
    ],
    authController.updateUserStatus
);

module.exports = router;