const {body} = require('express-validator');
const express = require('express');
const isAuth = require('../middleware/isAuth');

const router = express.Router();
const feedController = require('../controllers/feed');

router.get('/posts', isAuth, feedController.getPosts);

router.post(
    '/post',
    isAuth,
    [
        body('title').trim().isLength({min: 5}),
        body('content').trim().isLength({min: 5})
    ],
    feedController.createPost
);

router.get('/post/:postId', feedController.getPost);

router.put(
    '/post/:postId',
    isAuth,
    [
        body('title').trim().isLength({min: 5}),
        body('content').trim().isLength({min: 5})
    ],
    feedController.updatePost
);

router.delete('/post/:postId', isAuth, feedController.deletePost);

module.exports = router;