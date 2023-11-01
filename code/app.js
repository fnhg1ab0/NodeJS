const express = require('express');
const bodyParser = require('body-parser');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
// const path = require("path");
const pathRoot = require("./utils/path");
const path = require("path");

// create an express application
const app = express();

// set view engine
app.set('view engine', 'pug');

// set views directory
// default: views, if default, no need to set
app.set('views', 'views');

// parse incoming request bodies in a middleware before your handlers, available under the req.body property
app.use(bodyParser.urlencoded({extended: false}));

// serve static files
app.use(express.static(path.join(pathRoot, 'public')));


// using middleware to forward to the next adjacent middleware from top to bottom
app.use('/admin', adminRoutes.routes);
app.use(shopRoutes);

// add a 404 page
app.use((req, res, next) => {
    res.status(404).sendFile(path.join(pathRoot, 'views', '404.html'));
});

app.listen(3000);

// install express: npm install --save express
// install body-parser: npm install --save body-parser
// install nodemon: npm install --save-dev nodemon
// install ejs: npm install --save ejs
// install express-handlebars: npm install --save express-handlebars
// install pug: npm install --save pug