const express = require('express');
const bodyParser = require('body-parser');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const pathRoot = require("./utils/path");
const path = require("path");
const errorController = require('./controllers/errors');

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
app.use('/admin', adminRoutes.routes);
app.use(shopRoutes);

// add a 404 page
app.use(errorController.showError404);

app.listen(3000);

// install express: npm install --save express
// install body-parser: npm install --save body-parser
// install nodemon: npm install --save-dev nodemon
// install ejs: npm install --save ejs
// install express-handlebars: npm install --save express-handlebars
// install pug: npm install --save pug