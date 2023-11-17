const productsController = require('../controllers/admin');
const express = require('express');
const router = express.Router();

router.get('/add-product', productsController.getAddProd);

router.post('/add-product', productsController.postAddProd);

router.get('/products', productsController.getProducts);

router.get('/edit-product/:productId', productsController.getEditProd);

router.post('/edit-product', productsController.postEditProd);

router.post('/delete-product', productsController.postDeleteProd);

exports.routes = router;
