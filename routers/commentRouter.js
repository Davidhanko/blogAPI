const express = require('express')

const commentRouter = express.Router()
const JWTDecoder = require("../modules/decodeJWT")
const commentController = require("../controllers/commentController")
const passport = require("../modules/passport");

commentRouter.get('/:postId', commentController.getComments)

commentRouter.post('/:postId', passport.authenticate('jwt', {session: false}), JWTDecoder, commentController.createComment)

commentRouter.post('/:postId/:commentId', passport.authenticate('jwt', {session: false}), JWTDecoder, commentController.replyComment)

commentRouter.put('/', passport.authenticate('jwt', {session: false}), JWTDecoder, commentController.editComment)

commentRouter.delete('/', passport.authenticate('jwt', {session: false}), JWTDecoder, commentController.deleteComment)

module.exports = commentRouter
