const Sequelize = require('sequelize');
const sql = require('../utils/database');

const Order = sql.define('order', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
});

module.exports = Order;