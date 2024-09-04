const express = require('express');

const router = express.Router();

const postController = require('../controllers/postController');
const passport = require("../modules/passport");

router.get('/', postController.getAllPosts);

router.get('/:id', postController.getPost)

router.post('/', passport.authenticate('jwt', {session: false}), postController.createPost);

router.put("/", passport.authenticate('jwt', {session: false}), postController.updatePost)

router.delete("/", passport.authenticate('jwt', {session: false}), postController.deletePost)

module.exports = router
