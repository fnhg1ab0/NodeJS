// const Cart = require("./Cart");
// const db = require('../utils/database');
//
// module.exports = class Product {
//     constructor(id, title, imageUrl, description, price) {
//         this.id = id;
//         this.title = title;
//         this.imageUrl = imageUrl;
//         this.description = description;
//         this.price = price;
//     }
//
//     /**
//      * Save product to file
//      * @return {Query}
//      */
//     save() {
//         if (this.id) {
//             return db.execute('UPDATE products SET title = ?, price = ?, description = ?, imageUrl = ? WHERE products.id = ?', [this.title, this.price, this.description, this.imageUrl, this.id]);
//         }
//         return db.execute('INSERT INTO products (title, price, description, imageUrl) VALUES (?, ?, ?, ?)', [this.title, this.price, this.description, this.imageUrl]);
//     }
//
//     /**
//      * Find all products in file
//      * @return {Query}
//      */
//     static fetchAll() {
//         return db.execute('SELECT * FROM products');
//     }
//
//     /**
//      * Find product by id
//      * @constructor
//      * @param {string} id - product id
//      * @return {Query}
//      */
//     static findById(id) {
//         return db.execute('SELECT * FROM products WHERE products.id = ?', [id]);
//     }
//
//     /**
//      * Delete product by id
//      * @constructor
//      * @param {string} id - product id
//      * @return {Query}
//      */
//     static deleteById(id) {
//         return db.execute('DELETE FROM products WHERE products.id = ?', [id]);
//     }
// }


const Sequelize = require('sequelize');
const sql = require('../utils/database');

const Product = sql.define('product', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    price: {
        type: Sequelize.DOUBLE,
        allowNull: false,
    },
    imageUrl: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false,
    }
});

module.exports = Product;