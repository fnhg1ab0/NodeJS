const Product = require("../models/Product");

exports.getAddProd = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false,
    });
};

exports.postAddProd = (req, res, next) => {
    // const product = new Product(null, req.body.title, req.body.imageUrl, req.body.description, req.body.price);
    // product.save()
    //     .then(() => res.redirect('/admin/products'))
    //     .catch(err => console.log(err));

    // Product.create({
    //     title: req.body.title,
    //     price: req.body.price,
    //     imageUrl: req.body.imageUrl,
    //     description: req.body.description,
    // })
    //     .then(() => res.redirect('/admin/products'))
    //     .catch(err => console.log(err));

//     create a row with the relation to the user
//     createProduct is a magic method from sequelize to create a row with the relation to the user
    req.user
        .createProduct({
            title: req.body.title,
            price: req.body.price,
            imageUrl: req.body.imageUrl,
            description: req.body.description,
        })
        .then(() => res.redirect('/admin/products'))
        .catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
    // Product.fetchAll()
    //     .then(([data, characteristic]) => {
    //         res.render('admin/products', {
    //             pageTitle: 'All Products',
    //             path: '/admin/products',
    //             prods: data,
    //         })
    //     })
    //     .catch(err => console.log(err));

    // Product.findAll()
    req.user
        .getProducts()
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
    // Product.findById(prodId)
    //     .then(([data, characteristic]) => {
    //         res.render('admin/edit-product', {
    //             pageTitle: 'Edit Product',
    //             path: '/admin/edit-product',
    //             editing: editMode,
    //             product: data[0],
    //         });
    //     })
    //     .catch(err => console.log(err));

    // Product.findByPk(prodId)
    req.user
        .getProducts({where: {id: prodId}})
        .then((datas) => {
            const data = datas[0];
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
    // const product = new Product(prodId, updatedTitle, updatedImageUrl, updatedDescription, updatedPrice);
    // product.save()
    //     .then(() => res.redirect('/admin/products'))
    //     .catch(err => console.log(err));

    Product.findByPk(prodId)
        .then((product) => {
            product.title = updatedTitle;
            product.imageUrl = updatedImageUrl;
            product.description = updatedDescription;
            product.price = updatedPrice;
            return product.save();
        })
        .then(() => res.redirect('/admin/products'))
        .catch(err => console.log(err));
}

exports.postDeleteProd = (req, res, next) => {
    const prodId = req.body.productId;
    // Product.deleteById(prodId)
    //     .then(() => res.redirect('/admin/products'))
    //     .catch(err => console.log(err));

    Product.findByPk(prodId)
        .then((product) => {
            return product.destroy();
        })
        .then(() => res.redirect('/admin/products'))
        .catch(err => console.log(err));
}
