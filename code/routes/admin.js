const productsController = require('../controllers/products');
const express = require('express');
const router = express.Router();

router.get('/add-product', productsController.getAddProd);

router.post('/add-product', productsController.postAddProd);

exports.routes = router;
