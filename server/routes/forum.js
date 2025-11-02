import express from 'express';
import { auth } from '../middleware/auth.js';
import {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  likePost,
  getComments,
  createComment,
  deleteComment,
  likeComment
} from '../controllers/forumController.js';

const router = express.Router();

// Post routes
router.post('/posts', auth, createPost);
router.get('/posts', getPosts);
router.get('/posts/:id', getPost);
router.put('/posts/:id', auth, updatePost);
router.delete('/posts/:id', auth, deletePost);
router.post('/posts/:id/like', auth, likePost);

// Comment routes
router.get('/posts/:id/comments', getComments);
router.post('/posts/:id/comments', auth, createComment);
router.delete('/posts/:id/comments/:commentId', auth, deleteComment);
router.post('/posts/:id/comments/:commentId/like', auth, likeComment);

export default router;
