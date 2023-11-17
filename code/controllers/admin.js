const Product = require("../models/Product");

exports.getAddProd = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false,
    });
};

exports.postAddProd = (req, res, next) => {
    const product = new Product(null, req.body.title, req.body.imageUrl, req.body.description, req.body.price);
    product.save();
    res.redirect('/');
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('admin/products', {
            pageTitle: 'All Products',
            path: '/admin/products',
            hasProducts: products.length > 0,
            prods: products,
        });
    });
}

exports.getEditProd = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) return res.redirect('/');
    const prodId = req.params.productId;
    Product.findById(prodId, (product) => {
        res.render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            editing: editMode,
            product: product,
        });
    });
}

exports.postEditProd = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDescription = req.body.description;
    const updatedPrice = req.body.price;
    const product = new Product(prodId, updatedTitle, updatedImageUrl, updatedDescription, updatedPrice);
    product.save();
    res.redirect('/admin/products');
}

exports.postDeleteProd = (req, res, next) => {
    const prodId = req.body.productId;
    Product.deleteById(prodId);
    res.redirect('/admin/products');
}
