const Product = require("../models/Product");
const Cart = require("../models/Cart");

exports.getIndex = (req, res, next) => {
    // Product.fetchAll()
    //     .then(([data, characteristic]) => {
    //         res.render('shop/index', {
    //             pageTitle: 'Shop',
    //             path: '/',
    //             prods: data,
    //         });
    //     })
    //     .catch(err => console.log(err));

    Product.findAll()
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
    //     .then(([data, characteristic]) => {
    //         res.render('shop/product-list', {
    //             pageTitle: 'List of Products',
    //             path: '/products',
    //             prods: data,
    //         })
    //     })
    //     .catch(err => console.log(err));

    Product.findAll()
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
    // Product.findById(prodId)
    //     .then(([data, characteristic]) => {
    //         res.render('shop/product-detail', {
    //             pageTitle: 'Product Detail',
    //             path: '/products',
    //             product: data[0],
    //         })
    //     })
    //     .catch(err => console.log(err));

    Product.findByPk(prodId)
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
    // Cart.getCart((cartData) => {
    // Product.fetchAll()
    //     .then(([data, characteristic]) => {
    //         const cartProducts = [];
    //         for (product of data) {
    //             const cartProductData = cartData.products.find(prod => prod.id === product.id);
    //             if (cartProductData) {
    //                 cartProducts.push({
    //                     productData: product,
    //                     qty: cartProductData.qty,
    //                 });
    //             }
    //         }
    //         res.render('shop/cart', {
    //             pageTitle: 'Your Cart',
    //             path: '/cart',
    //             products: cartProducts,
    //         });
    //     })
    //     .catch(err => console.log(err));

    // Product.findAll()
    //     .then((data) => {
    //         const cartProducts = [];
    //         for (product of data) {
    //             const cartProductData = cartData.products.find(prod => prod.id === product.id);
    //             if (cartProductData) {
    //                 cartProducts.push({
    //                     productData: product,
    //                     qty: cartProductData.qty,
    //                 });
    //             }
    //         }
    //         res.render('shop/cart', {
    //             pageTitle: 'Your Cart',
    //             path: '/cart',
    //             products: cartProducts,
    //         });
    //     })
    //     .catch(err => console.log(err));
// });

    req.user
        .getCart()
        .then((cart) => {
            return cart
                .getProducts()
                .then((products) => {
                    res.render('shop/cart', {
                        pageTitle: 'Your Cart',
                        path: '/cart',
                        products: products,
                    })
                })
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
}

exports.postCart = (req, res, next) => {
    const id = req.body.productId;
    // Product.findById(id)
    //     .then(([data, characteristic]) => {
    //         Cart.addProduct(id, data[0].price);
    //         res.redirect('/cart');
    //     })
    //     .catch(err => console.log(err));

    // Product.findByPk(id)
    //     .then((data) => {
    //         Cart.addProduct(id, data.price);
    //         res.redirect('/cart');
    //     })
    //     .catch(err => console.log(err));

    let fetchedCart;
    let newQty = 1;
    req.user
        .getCart()
        .then((cart) => {
            fetchedCart = cart;
            return cart
                .getProducts({where: {id: id}})
                .then((products) => {
                    let product;
                    if (products.length > 0) {
                        product = products[0];
                    }
                    if (product) {
                        let oldQty = product.cartItem.quantity;
                        newQty = oldQty + 1;
                        return product;
                    }
                    return Product.findByPk(id);
                })
                .then((product) => {
                    return fetchedCart.addProduct(product, {
                        through: {quantity: newQty},
                    });
                })
                .then(() => {
                    res.redirect('/cart');
                })
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
}

exports.postCartDeleteProduct = (req, res, next) => {
    const id = req.body.productId;
    // Product.findById(id)
    //     .then(([data, characteristic]) => {
    //         Cart.deleteCartProduct(id, data[0].price);
    //         res.redirect('/cart');
    //     })
    //     .catch(err => console.log(err));

    // Product.findByPk(id)
    //     .then((data) => {
    //         Cart.deleteCartProduct(id, data.price);
    //         res.redirect('/cart');
    //     })
    //     .catch(err => console.log(err));

    req.user
        .getCart()
        .then((cart) => {
            return cart
                .getProducts({where: {id: id}})
                .then((products) => {
                    const product = products[0];
                    return product.cartItem.destroy();
                })
                .then(() => {
                    res.redirect('/cart');
                })
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
}

exports.postOrder = (req, res, next) => {
    let fetchedCart;
    req.user
        .getCart()
        .then((cart) => {
            fetchedCart = cart
            return cart.getProducts()
        })
        .then((products) => {
            return req.user
                .createOrder()
                .then((order) => {
                    return order.addProducts(products.map((product) => {
                        product.orderItem = {quantity: product.cartItem.quantity};
                        return product;
                    }))
                })
                .catch(err => console.log(err));
        })
        .then(() => {
            return fetchedCart.setProducts(null);
        })
        .then(() => {
            res.redirect('/orders');
        })
        .catch(err => console.log(err));
}

exports.getOrders = (req, res, next) => {
    req.user
        .getOrders({include: ['products']})
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
