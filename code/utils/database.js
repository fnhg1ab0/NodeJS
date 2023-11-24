// const database = require('mysql2');
//
// const pool = database.createPool({
//     host: 'localhost',
//     user: 'root',
//     password: 'root123',
//     database: 'nodejs_tutorial',
// });
//
// module.exports = pool.promise();

const Sequelize = require('sequelize');

const sql = new Sequelize('nodejs_tutorial', 'root', 'root123', {
    dialect: 'mysql',
    host: 'localhost',
});

module.exports = sql;
