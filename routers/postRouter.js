const express = require('express');

const router = express.Router();

const postController = require('../controllers/postController');

router.get('/all', postController.getAllPosts);

router.get('/', postController.getPost)

router.post('/', postController.createPost);

router.put("/", postController.updatePost)

router.delete("/", postController.deletePost)

module.exports = router
