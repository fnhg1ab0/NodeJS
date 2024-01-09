const Product = require("../models/Product");
const Order = require("../models/Order");

exports.getIndex = (req, res, next) => {
    // Product.fetchAll()
    Product.find()
        .then((data) => {
            res.render('shop/index', {
                pageTitle: 'Shop',
                path: '/',
                prods: data,
            });
        })
        .catch(err => console.log(err));
}

exports.getProds = (req, res, next) => {
    // Product.fetchAll()
    Product.find()
        .then((data) => {
            res.render('shop/product-list', {
                pageTitle: 'List of Products',
                path: '/products',
                prods: data,
            })
        })
        .catch(err => console.log(err));
}

exports.getDetail = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then((data) => {
            res.render('shop/product-detail', {
                pageTitle: 'Product Detail',
                path: '/products',
                product: data,
            })
        })
        .catch(err => console.log(err));
}

exports.getCart = (req, res, next) => {
    req.user
        // .getCart()
        .populate('cart.items.productId')
        .then((user) => {
            const products = user.cart.items
            res.render('shop/cart', {
                pageTitle: 'Your Cart',
                path: '/cart',
                products: products,
            })
        })
        .catch(err => console.log(err));
}

exports.postCart = (req, res, next) => {
    const id = req.body.productId;
    Product.findById(id)
        .then((product) => {
            return req.user.addToCart(product);
        })
        .then(() => res.redirect('/cart'))
        .catch(err => console.log(err));
}

exports.postCartDeleteProduct = (req, res, next) => {
    const id = req.body.productId;
    req.user.removeFromCart(id)
        .then(() => res.redirect('/cart'))
        .catch(err => console.log(err));
}

exports.postOrder = (req, res, next) => {
    // req.user
    //     .addOrder()
    //     .then(() => {
    //         res.redirect('/orders');
    //     })
    //     .catch(err => console.log(err));
    req.user.populate('cart.items.productId')
        .then(user => {
            const products = user.cart.items.map(i => {
                return {quantity: i.quantity, product: {...i.productId._doc}}
            });
            const order = new Order({
                user: {
                    name: req.user.name,
                    userId: req.user
                },
                products: products
            })

            return order.save();
        })
        .then(res => req.user.clearCart())
        .then(() => res.redirect('/orders'))
        .catch(err => console.log(err))
}

exports.getOrders = (req, res, next) => {
    // req.user
    //     .getOrders()
    Order.find({'user.userId': req.user._id})
        .then((orders) => {
            res.render('shop/orders', {
                pageTitle: 'Your Orders',
                path: '/orders',
                orders: orders
            });
        })
        .catch(err => console.log(err));
}

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: '/checkout',
    });
}
