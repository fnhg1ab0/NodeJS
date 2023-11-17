const express = require('express');
const productsController = require('../controllers/shop');

const router = express.Router();

router.get('/', productsController.getIndex);

router.get('/products', productsController.getProds);

router.get('/products/:productId', productsController.getDetail);

router.get('/cart', productsController.getCart);

router.post('/cart', productsController.postCart);

router.post('/cart-delete-item', productsController.postCartDeleteProduct);

router.get('/orders', productsController.getOrders);

router.get('/checkout', productsController.getCheckout);


module.exports = router;