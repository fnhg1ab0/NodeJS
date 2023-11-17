const fs = require('fs');
const path = require('path');
const pathRoot = require("../utils/path");
const Cart = require("./Cart");

const p = path.join(
    pathRoot,
    'data',
    'products.json'
);

const getProductsFromFile = prods => {
    fs.readFile(p, (err, fileContent) => {
        if (err) {
            return prods([]);
        }
        try {
            prods(JSON.parse(fileContent));
        } catch (err) {
            prods([]);
        }
    });
}

module.exports = class Product {
    constructor(id, title, imageUrl, description, price) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    /**
     * Save product to file
     * @return {void}
     */
    save() {
        if (this.id) {
            getProductsFromFile(products => {
                const existId = products.findIndex(p => p.id === this.id);
                const updatedProducts = [...products];
                updatedProducts[existId] = this;
                fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
                    console.log(err);
                });
            });
            return;
        }
        getProductsFromFile(products => {
            this.id = Math.random().toString();
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), (err) => {
                console.log(err);
            });
        });
    }

    /**
     * Find all products in file
     * @constructor
     * @param {function} prods - callback function
     * @return {void}
     */
    static fetchAll(prods) {
        getProductsFromFile(prods);
    }

    /**
     * Find product by id
     * @constructor
     * @param {string} id - product id
     * @param {function} prods - callback function
     * @return {void}
     */
    static findById(id, prods) {
        getProductsFromFile(products => {
            const product = products.find(p => p.id === id);
            prods(product);
        });
    }

    /**
     * Delete product by id
     * @constructor
     * @param {string} id - product id
     * @return {void}
     */
    static deleteById(id) {
        getProductsFromFile(products => {
            const product = products.find(p => p.id === id);
            const updatedProducts = products.filter(p => p.id !== id);
            fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
                console.log(err);
                if (!err) Cart.deleteCartProduct(id, product.price);
            });
        });
    }
}