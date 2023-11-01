const express = require('express');
const path = require('path');
const pathRoot = require('../utils/path');
const adminData = require('./admin');

const router = express.Router();

// get() is a method to handle incoming requests to a specific absolute path.js
// use() is a method to handle incoming requests to a specific relative path.js
router.get('/', (req, res, next) => {
    console.log('In the middleware!');
    next(); // forward to the next middleware
});

router.get('/', (req, res, next) => {
    // console.log(adminData.products);
    // res.sendFile(path.join(pathRoot, 'views', 'shop.html')); // send response and the middleware will not forward to the next middleware

    // render when using template engine
    res.render('shop', {prods: adminData.products, docTitle: 'Shop'});
});

module.exports = router;