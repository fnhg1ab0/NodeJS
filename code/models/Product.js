const {getDB} = require('../utils/database');
const mongodb = require('mongodb');

module.exports = class Product {

    constructor(title, price, description, imageUrl, id, userId) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        this._id = id ? new mongodb.ObjectId(id) : null;
        this.userId = userId;
    }

    save() {
        const db = getDB();
        const collection = db.collection('products');
        if (this._id) {
            return collection.updateOne({_id: this._id}, {$set: this})
                .then(result => console.log(result))
                .catch(err => console.log(err));
        } else {
            return collection.insertOne(this)
                .then(result => console.log(result))
                .catch(err => console.log(err));
        }
    }

    static fetchAll() {
        const db = getDB();
        const collection = db.collection('products');
        return collection.find().toArray()
            .then(products => products)
            .catch(err => console.log(err));
    }

    static findById(prodId) {
        const db = getDB();
        const collection = db.collection('products');
        return collection.findOne({_id: new mongodb.ObjectId(prodId)})
            .then(product => product)
            .catch(err => console.log(err));
    }

    static deleteById(prodId) {
        const db = getDB();
        const collection = db.collection('products');
        return collection.deleteOne({_id: new mongodb.ObjectId(prodId)})
            .then(result => {
                console.log(result);
            })
            .catch(err => console.log(err));
    }
}