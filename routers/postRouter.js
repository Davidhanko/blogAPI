const express = require('express');

const postRouter = express.Router();

const JWTDecoder = require("../modules/decodeJWT")
const postController = require('../controllers/postController');
const passport = require("../modules/passport");

postRouter.get('/', postController.getAllPosts);

postRouter.get('/:id', postController.getPost)

postRouter.post('/', passport.authenticate('jwt', {session: false}), JWTDecoder, postController.createPost);

postRouter.put("/", passport.authenticate('jwt', {session: false}), JWTDecoder, postController.updatePost)

postRouter.delete("/", passport.authenticate('jwt', {session: false}), JWTDecoder, postController.deletePost)

module.exports = postRouter
