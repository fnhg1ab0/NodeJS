const path = require('path');
const fs = require('fs');

const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const mongoose = require('mongoose');
const session = require('express-session');
const sessionStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const helmet = require('helmet');
const compression = require('compression');

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();


const store = new sessionStore({
    url: process.env.MONGODB_URI,
    collection: 'sessions'
});

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        // the first param is the error, if any error occurs, we can pass it to the cb function and multer will handle it
        // if we don't want to handle the error, we can pass null as the first param
        // the second param is the folder that multer will store the file in
        fs.mkdir('./uploads/', (err) => {
            cb(null, './uploads/');
        });
    },
    filename: function (req, file, cb) {
        // the first param is the error, if any error occurs, we can pass it to the cb function and multer will handle it
        // if we don't want to handle the error, we can pass null as the first param
        // the second param is the file name that multer will store the file in
        cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    // cb(null, true) means we accept the file
    // cb(null, false) means we don't accept the file
    // cb(new Error('message')) means we don't accept the file and we throw an error
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg')
        cb(null, true);
    else
        cb(null, false);

}

const csrfProtect = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

//  helmet is a package that helps us to secure our app by setting various http headers
app.use(helmet());

//  compression is a package that helps us to compress our response body
app.use(compression());

app.use(bodyParser.urlencoded({extended: false}));
// use to parse the data that in not the text type
// dest: 'images' is the folder that multer will store the file in
// storage: fileStorage is the storage that multer will use to store the file
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(session({secret: 'nccm8&zc%', resave: false, saveUninitialized: false, store: store}));
app.use(csrfProtect);
app.use(flash());

//  tell expressjs the data that should be included in every rendered view
app.use((req, res, next) => {
    res.locals.isAuth = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
})
app.use((req, res, next) => {
    if (!req.session.user) return next();
    User.findById(req.session.user._id)
        .then(user => {
            if (!user) return next();
            req.user = user;
            next();
        })
        .catch(err => next(new Error(err)));
});


app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get('/500', errorController.get500);
app.use(errorController.get404);

// error handling middleware with 4 params: err, req, res, next
// with synchronous code, we can throw an error and it will be caught by this middleware
// with asynchronous code, we need to call next(err) to pass the error to this middleware
// to avoid loop, we need to render a page instead of redirecting to a page
app.use((err, req, res, next) => {
    // res.redirect('/500');
//     res.status(err.httpStatusCode).render(...);
    res.status(500).render('errors/500', {
        pageTitle: 'Error!',
        path: '/500',
    });
});

mongoose
    .connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(result => {
        app.listen(process.env.PORT || 3000);
    })
    .catch(err => {
        console.log(err);
    });

// npm install --save multer
// npm install --save pdfkit
// npm install --save stripe