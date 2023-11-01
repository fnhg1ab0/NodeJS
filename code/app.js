const express = require('express');
const bodyParser = require('body-parser');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
// const path = require("path");
const pathRoot = require("./utils/path");
const path = require("path");

const app = express();

app.use(bodyParser.urlencoded({extended: false}));

// serve static files
app.use(express.static(path.join(pathRoot, 'public')));

// using middleware to forward to the next adjacent middleware from top to bottom

app.use('/admin', adminRoutes);

app.use(shopRoutes);

// add a 404 page
app.use((req, res, next) => {
    res.status(404).sendFile(path.join(pathRoot, 'views', '404.html'));
});

app.listen(3000);

// install express: npm install --save express
//install body-parser: npm install --save body-parser