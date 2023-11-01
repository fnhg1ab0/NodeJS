const express = require('express');
const path = require('path');
const pathRoot = require('../utils/path');

const router = express.Router();
const products = [];

router.get('/add-product', (req, res, next) => {
    res.sendFile(path.join(pathRoot, 'views', 'add-product.html'));
});

router.post('/product', (req, res, next) => {
    products.push({title: req.body.title});
    res.redirect('/');
});

exports.routes = router;
exports.products = products;