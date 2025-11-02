import express from 'express';
import { getResources, refreshResources, getVideos, addResource, deleteResource } from '../controllers/resourceController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/resources', getResources);
router.get('/videos', getVideos);

// Protected routes (require authentication)
router.post('/resources/refresh', auth, refreshResources);
router.post('/resources', auth, addResource);
router.delete('/resources/:id', auth, deleteResource);

export default router;
