import { Router } from 'express';
import {
  createShortUrl,
  getUserUrls,
  getUrlById,
  updateUrl,
  deleteUrl,
  getDashboardStats,
} from '../controllers/urlController.js';
import { protect, optionalAuth } from '../middleware/auth.js';

const router = Router();

// Public — create short URL (optionally authenticated)
router.post('/', optionalAuth, createShortUrl);

// Protected routes
router.use(protect);
router.get('/stats', getDashboardStats);
router.get('/', getUserUrls);
router.get('/:id', getUrlById);
router.patch('/:id', updateUrl);
router.delete('/:id', deleteUrl);

export default router;
