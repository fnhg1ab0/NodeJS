const Product = require("../models/Product");

exports.getAddProd = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false,
    });
};

exports.postAddProd = (req, res, next) => {
    const product = new Product(req.body.title, req.body.price, req.body.description, req.body.imageUrl, null, req.user._id);
    product.save()
        .then(() => res.redirect('/'))
        .catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
        .then((data) => {
            res.render('admin/products', {
                pageTitle: 'All Products',
                path: '/admin/products',
                prods: data,
            })
        })
        .catch(err => console.log(err));
}

exports.getEditProd = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) return res.redirect('/');
    const prodId = req.params.productId;

    Product.findById(prodId)
        .then((data) => {
            if (!data) return res.redirect('/');
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/admin/edit-product',
                editing: editMode,
                product: data,
            });
        })
        .catch(err => console.log(err));
}

exports.postEditProd = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDescription = req.body.description;
    const updatedPrice = req.body.price;

    const product = new Product(updatedTitle, updatedPrice, updatedDescription, updatedImageUrl, prodId)
    product.save()
        .then(() => res.redirect('/admin/products'))
        .catch(err => console.log(err));
}

exports.postDeleteProd = (req, res, next) => {
    const prodId = req.body.productId;

    Product.deleteById(prodId)
        .then(() => {
            req.user.deleteItemFromCart(prodId);
        })
        .then(() => res.redirect('/admin/products'))
        .catch(err => console.log(err));
}
