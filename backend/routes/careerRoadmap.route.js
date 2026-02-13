// backend/routes/careerRoadmap.route.js
import express from 'express';
import {
    generateRoadmap,
    getTrendingCareers,
    getRoadmapHistory
} from '../controllers/careerRoadmap.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';

const router = express.Router();

// Public routes
router.get('/trending', getTrendingCareers);

// Protected routes (require authentication)
router.post('/generate', isAuthenticated, generateRoadmap);
router.get('/history', isAuthenticated, getRoadmapHistory);

export default router;