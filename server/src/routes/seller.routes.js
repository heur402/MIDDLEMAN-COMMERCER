// server/src/routes/seller.routes.js
import { Router } from 'express';
import {
  getSellerDashboard,
  getSellerProducts,
  getSellerOrders,
  updateSellerProfile,
  getSellerAnalytics,
  updateSellerSettings,
  getSellerReviews,
  respondToReview,
} from '../controllers/seller.controller.js';
import { verifyToken } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  updateSellerProfileSchema,
  updateSellerSettingsSchema,
  reviewResponseSchema,
} from '../schemas/seller.schema.js';

const router = Router();

// All seller routes require authentication
router.use(verifyToken);

// Dashboard & Analytics
router.get('/dashboard', getSellerDashboard);
router.get('/analytics', getSellerAnalytics);

// Product management
router.get('/products', getSellerProducts);

// Order management
router.get('/orders', getSellerOrders);

// Profile & Settings
router.put('/profile', validate(updateSellerProfileSchema), updateSellerProfile);
router.put('/settings', validate(updateSellerSettingsSchema), updateSellerSettings);

// Reviews
router.get('/reviews', getSellerReviews);
router.post('/reviews/:reviewId/respond', validate(reviewResponseSchema), respondToReview);

export default router;