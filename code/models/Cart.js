// const path = require("path");
// const pathRoot = require("../utils/path");
// const fs = require("fs");
// const p = path.join(
//     pathRoot,
//     'data',
//     'cart.json'
// );
// module.exports = class Cart {
//     /**
//      * Add product to cart
//      * @constructor
//      * @param {string} id - product id
//      * @param {number} productPrice - product price
//      * @return {void}
//      */
//     static addProduct(id, productPrice) {
//         fs.readFile(p, (err, fileContent) => {
//             let cart = {
//                 products: [],
//                 totalPrice: 0,
//             };
//             if (!err) {
//                 try {
//                     cart = JSON.parse(fileContent);
//                 } catch (err) {
//                     console.log(err);
//                 }
//             } else return;
//             const existId = cart.products.findIndex(p => p.id === id);
//             const existProduct = cart.products[existId];
//             let updatedProduct;
//             if (existProduct) {
//                 updatedProduct = {
//                     ...existProduct
//                 };
//                 updatedProduct.qty += 1;
//                 cart.products = [...cart.products];
//                 cart.products[existId] = updatedProduct;
//             } else {
//                 updatedProduct = {
//                     id: id,
//                     qty: 1,
//                 };
//                 cart.products = [...cart.products, updatedProduct];
//             }
//             cart.totalPrice += +productPrice;
//             fs.writeFile(p, JSON.stringify(cart), (err) => {
//                 console.log(err);
//             });
//         });
//     };
//
//     /**
//      * Delete product in cart
//      * @constructor
//      * @param {string} id - product id
//      * @param {number} price - product price
//      * @return {void}
//      */
//     static deleteCartProduct(id, price) {
//         fs.readFile(p, (err, fileContent) => {
//             if (err) return;
//             const updatedCart = {...JSON.parse(fileContent)};
//             const product = updatedCart.products.find(p => p.id === id);
//             if (!product) return;
//             updatedCart.products = updatedCart.products.filter(p => p.id !== id);
//             const productQty = product.qty;
//             updatedCart.totalPrice -= price * productQty;
//             fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
//                 console.log(err);
//             });
//         });
//     }
//
//     /**
//      * Get all cart
//      * @constructor
//      * @param {function} cb - callback function
//      * @return {void}
//      */
//     static getCart(cb) {
//         fs.readFile(p, (err, fileContent) => {
//             if (err) return cb(null);
//             const cart = JSON.parse(fileContent);
//             cb(cart);
//         });
//     }
// }

const Sequelize = require('sequelize');
const sql = require('../utils/database');

const Cart = sql.define('cart', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    }
});

module.exports = Cart;