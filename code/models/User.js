const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cart: {
        items: [{
            productId: {type: Schema.Types.ObjectId, ref: 'Product', required: true},
            quantity: {type: Number, required: true}
        }]
    }
});

userSchema.methods.addToCart = function (product) {
    const cartProductIndex = this.cart.items.findIndex(item =>
        item.productId.toString() === product._id.toString());
    let newQty = 1;
    const updatedCartItems = [...this.cart.items];
    if (cartProductIndex >= 0) {
        newQty = this.cart.items[cartProductIndex].quantity + 1;
        updatedCartItems[cartProductIndex].quantity = newQty;
    } else {
        updatedCartItems.push({productId: product._id, quantity: newQty});
    }
    this.cart = {
        items: updatedCartItems
    };
    return this.save();
}

userSchema.methods.removeFromCart = function (productId) {
    const updatedCartItems = this.cart.items.filter(item =>
        item.productId.toString() !== productId.toString()
    );

    this.cart.items = updatedCartItems;

    return this.save();
}

userSchema.methods.clearCart = function () {
    this.cart.items = [];
    return this.save();
}

module.exports = mongoose.model('User', userSchema);

// const mongodb = require('mongodb');
// // const {getDB} = require('../utils/database');
//
// module.exports = class User {
//
//     constructor(username, email, cart, id) {
//         this.username = username;
//         this.email = email;
//         this.cart = cart ? cart : {items: []};
//         this._id = id ? new mongodb.ObjectId(id) : null;
//     }
//
//     save() {
//         const db = getDB();
//         const collection = db.collection('users');
//         if (this._id) {
//             return collection.updateOne({_id: this._id}, {$set: this})
//                 .then(result => console.log(result))
//                 .catch(err => console.log(err));
//         } else {
//             return collection.insertOne(this)
//                 .then(result => console.log(result))
//                 .catch(err => console.log(err));
//         }
//     }
//
//     addToCart(product) {
//         const cartProductIndex = this.cart.items.findIndex(item =>
//             item.productId.toString() === product._id.toString());
//         let newQty = 1;
//         const updatedCartItems = [...this.cart.items];
//         if (cartProductIndex >= 0) {
//             newQty = this.cart.items[cartProductIndex].quantity + 1;
//             updatedCartItems[cartProductIndex].quantity = newQty;
//         } else {
//             updatedCartItems.push({productId: new mongodb.ObjectId(product._id), quantity: newQty});
//         }
//         const db = getDB();
//         const collection = db.collection('users');
//         return collection.updateOne({_id: this._id}, {$set: {cart: {items: updatedCartItems}}})
//             .then(result => console.log(result))
//             .catch(err => console.log(err));
//     }
//
//     getCart() {
//         const db = getDB();
//         const collection = db.collection('products');
//         const productIds = this.cart.items.map(item => item.productId);
//         return collection.find({_id: {$in: productIds}}).toArray()
//             .then(product => {
//                 return product.map(p => {
//                     return {
//                         ...p,
//                         quantity: this.cart.items.find(item => item.productId.toString() === p._id.toString()).quantity,
//                     }
//                 })
//
//             })
//             .catch(err => console.log(err));
//     }
//
//     deleteItemFromCart(productId) {
//         const updatedCartItems = this.cart.items.filter(item => item.productId.toString() !== productId.toString());
//         const db = getDB();
//         const collection = db.collection('users');
//         return collection.updateOne({_id: this._id}, {$set: {cart: {items: updatedCartItems}}})
//             .then(result => console.log(result))
//             .catch(err => console.log(err));
//     }
//
//     addOrder() {
//         const db = getDB();
//         let collection = db.collection('orders');
//         return this.getCart()
//             .then(products => {
//                 const order = {
//                     items: products,
//                     user: {
//                         _id: this._id,
//                     }
//                 }
//                 return collection.insertOne(order)
//             })
//             .then(() => {
//                 this.cart = {items: []};
//                 collection = db.collection('users');
//                 return collection.updateOne({_id: this._id}, {$set: {cart: {items: []}}})
//             })
//             .catch(err => console.log(err));
//     }
//
//     getOrders() {
//         const db = getDB();
//         const collection = db.collection('orders');
//         return collection.find({'user._id': this._id}).toArray()
//             .then(orders => orders)
//             .catch(err => console.log(err));
//     }
//
//     static findById(userId) {
//         const db = getDB();
//         const collection = db.collection('users');
//         return collection.findOne({_id: new mongodb.ObjectId(userId)})
//             .then(user => user)
//             .catch(err => console.log(err));
//     }
// }