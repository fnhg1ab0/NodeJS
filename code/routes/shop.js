const express = require('express');
const path = require('path');
const pathRoot = require('../utils/path');

const router = express.Router();

// get() is a method to handle incoming requests to a specific absolute path.js
// use() is a method to handle incoming requests to a specific relative path.js
router.get('/', (req, res, next) => {
    console.log('In the middleware!');
    next(); // forward to the next middleware
});

router.get('/', (req, res, next) => {
    console.log('In another middleware!');
    res.sendFile(path.join(pathRoot, 'views', 'shop.html')); // send response and the middleware will not forward to the next middleware
});

module.exports = router;