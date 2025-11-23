const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

router.post('/posts', postController.createPost);
router.put('/posts/:id', postController.updatePost);
router.delete('/posts/:id', postController.deletePost);
router.get('/posts', postController.getAllPosts);
router.get('/posts/:id', postController.getPostById);

module.exports = router;