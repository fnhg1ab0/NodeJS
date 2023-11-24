const express = require('express');
const bodyParser = require('body-parser');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const pathRoot = require("./utils/path");
const path = require("path");
const errorController = require('./controllers/errors');
const sql = require('./utils/database');
const Product = require('./models/Product');
const User = require('./models/User');
const Cart = require('./models/Cart');
const CartItem = require('./models/CartItem');
const Order = require('./models/Order');
const OrderItem = require('./models/OrderItem');

// create an express application
const app = express();

// --------------------------------------------------
// using ejs template engine
app.set('view engine', 'ejs');
app.set('views', 'views');

// --------------------------------------------------
// parse incoming request bodies in a middleware before your handlers, available under the req.body property
app.use(bodyParser.urlencoded({extended: false}));

// --------------------------------------------------
// serve static files
app.use(express.static(path.join(pathRoot, 'public')));

// --------------------------------------------------
// using middleware to forward to the next adjacent middleware from top to bottom
// store the user in the request
app.use((req, res, next) => {
    User.findByPk(1)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});

app.use('/admin', adminRoutes.routes);
app.use(shopRoutes);

// add a 404 page
app.use(errorController.showError404);

// --------------------------------------------------
// create a relationship between models
// belongsTo is a relationship of one-to-one
Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
// hasMany is a relationship of one-to-many
User.hasMany(Product);

// hasOne is a relationship of one-to-one
User.hasOne(Cart);
// belongsTo is a relationship of one-to-one
Cart.belongsTo(User);

// belongsToMany is a relationship of many-to-many
Cart.belongsToMany(Product, {through: CartItem});
Product.belongsToMany(Cart, {through: CartItem});

Order.belongsTo(User);
User.hasMany(Order);

Order.belongsToMany(Product, {through: OrderItem});

// connect to database if exist or create a new one
// if create a new one, the tables will be created automatically and pluralized by sequelize
// force: true will drop the table if it already exists
sql
    // .sync({force: true})
    .sync()
    .then(() => {
        return User.findByPk(1);
    })
    .then(user => {
        if (!user) return User.create({name: 'Tuan', email: 'ttt123@gmail.com'});
        return user;
    })
    .then(user => {
        return user.createCart();
    })
    .then(() => {
        app.listen(3000);
    })
    .catch(err => console.log(err));

// install express: npm install --save express
// install body-parser: npm install --save body-parser
// install nodemon: npm install --save-dev nodemon
// install ejs: npm install --save ejs
// install express-handlebars: npm install --save express-handlebars
// install pug: npm install --save pug
// install mysql: npm install --save mysql2
// install sequelize: npm install --save sequelize
// install mongodb: npm install --save mongodb