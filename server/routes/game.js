import express from 'express';
import { auth } from '../middleware/auth.js';
import {
  createGameSession,
  generateStory,
  getGameSession,
  getUserGameSessions,
  generateImage
} from '../controllers/gameController.js';

const router = express.Router();

// Game routes
router.post('/sessions', auth, createGameSession);
router.post('/generate-story', auth, generateStory);
router.get('/sessions/:id', auth, getGameSession);
router.get('/sessions', auth, getUserGameSessions);
router.post('/generate-image', auth, generateImage);

export default router;
