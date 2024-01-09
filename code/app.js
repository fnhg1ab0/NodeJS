const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const pathRoot = require("./utils/path");
const path = require("path");
const errorController = require('./controllers/errors');
// const {mongoConnect} = require('./utils/database');

const User = require('./models/User');

// create an express application
const app = express();

// --------------------------------------------------
// using ejs template engine
app.set('view engine', 'ejs');
app.set('views', 'views');

// --------------------------------------------------
// parse incoming request bodies in a middleware before your handlers, available under the req.body property
app.use(bodyParser.urlencoded({extended: false}));
// app.use(bodyParser.json());

// --------------------------------------------------
// serve static files
app.use(express.static(path.join(pathRoot, 'public')));

// --------------------------------------------------
// using middleware to forward to the next adjacent middleware from top to bottom
// store the user in the request
app.use((req, res, next) => {
    User.findById('6566ea89bddf3e67f3bfcee9')
        .then(user => {
            // req.user = new User(user.username, user.email, user.cart, user._id);
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
// create a server and listen on port 3000 and connect to mongodb
// mongoConnect(() => {
//     app.listen(3000);
// });

mongoose.connect('mongodb://localhost:27017/nodejs')
    .then(res => {
        User.findOne().then(user => {
            if (!user) {
                const user = new User({
                    name: 'Tuan',
                    email: 'songgio@gmail.com',
                    cart: {
                        items: []
                    }
                })
            }
        }).catch(err => {
            console.log(err)
        })
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
// install mongoose: npm install --save mongoose