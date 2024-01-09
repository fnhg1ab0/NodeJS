const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const sessionStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

const errorController = require('./controllers/error');
const User = require('./models/user');

const MongoDbUrl = 'mongodb://localhost:27017/nodejs';

const app = express();

const store = new sessionStore({
    url: MongoDbUrl,
    collection: 'sessions'
})

const csrfProtect = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'nccm8&zc%', resave: false, saveUninitialized: false, store: store}));
app.use(csrfProtect);
app.use(flash());
app.use((req, res, next) => {
    if (!req.session.user) return next();
    User.findById(req.session.user._id)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});

//  tell expressjs the data that should be included in every rendered view
app.use((req, res, next) => {
    res.locals.isAuth = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
    .connect(
        MongoDbUrl
    )
    .then(result => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });

// npm install --save express-session
// npm install --save connect-mongodb-session
// npm install --save bcryptjs
// npm install --save csurf
// npm install --save connect-flash