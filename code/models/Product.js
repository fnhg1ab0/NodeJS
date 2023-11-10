const fs = require('fs');
const path = require('path');
const pathRoot = require("../utils/path");

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
        prods(JSON.parse(fileContent));
    });
}

module.exports = class Product {
    constructor(title) {
        this.title = title;
    }

    save() {
        getProductsFromFile(products => {
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), (err) => {
                console.log(err);
            });
        });
    }

    static fetchAll(prods) {
        getProductsFromFile(prods);
    }
}