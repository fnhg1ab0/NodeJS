const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
const mongoose = require('mongoose');

const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg')
        cb(null, true);
    else cb(null, false);
}

const app = express();

app.use(bodyParser.json()); // application/json
app.use(multer({storage: storage, fileFilter: fileFilter}).single('image'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // http://localhost:8080/uploads/images/abc.jpg

// CORS error handling
app.use((req, res, next) => {
    // Allow access from any client
    // if you want to limit access to specific clients, you can replace the * with a specific domain
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Allow these headers
    // if you want to limit access to specific headers, you can replace the * with a specific header
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    // Allow these methods
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    next();
});

app.use('/auth', authRoutes);
app.use('/feed', feedRoutes);

app.use((error, req, res, next) => {
   console.log(error);
   const status = error.statusCode || 500;
   const mess = error.message;
    const data = error.data;
    res.status(status).json({message: mess, data: data});
});

mongoose.connect('mongodb://localhost:27017/messages?retryWrites=true&w=majority')
    .then(result => {
        app.listen(8080);
    })
    .catch(err => console.log(err));

// npm install --save jsonwebtoken

