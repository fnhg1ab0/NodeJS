const Product = require("../models/Product");

exports.getAddProd = (req, res, next) => {
    res.render('add-product', {
        docTitle: 'Add Product',
        path: '/admin/add-product',
        activeAddProduct: true,
        formsCSS: true,
        productCSS: true
    });
};

exports.postAddProd = (req, res, next) => {
    const product = new Product(req.body.title);
    product.save();
    res.redirect('/');
};

exports.getProds = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('shop', {
            docTitle: 'Shop',
            path: '/',
            hasProducts: products.length > 0,
            prods: products,
            activeShop: true,
            productCSS: true
        });
    });
}