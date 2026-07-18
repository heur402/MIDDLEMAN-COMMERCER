// server/src/routes/product.routes.js
import { Router } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getSellerProducts,
  searchProducts,
  getProductsByCategory,
  getProductsByCondition,
  updateProductStatus,
  addProductImages,
  deleteProductImage,
} from '../controllers/product.controller.js';
import { verifyToken } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  createProductSchema,
  updateProductSchema,
  updateProductStatusSchema,
  searchProductsSchema,
} from '../schemas/product.schema.js';
import { upload } from '../middleware/upload.js';

const router = Router();

// ==========================
// Public routes (no auth required)
// ==========================
router.get('/', getProducts);
router.get('/search', validate(searchProductsSchema), searchProducts);
router.get('/category/:category', getProductsByCategory);
router.get('/condition/:condition', getProductsByCondition);
router.get('/:id', getProductById);

// ==========================
// Protected routes (auth required)
// ==========================
router.use(verifyToken); // All routes below this require authentication

// Seller routes
router.post('/', validate(createProductSchema), createProduct);
router.put('/:id', validate(updateProductSchema), updateProduct);
router.delete('/:id', deleteProduct);
router.patch('/:id/status', validate(updateProductStatusSchema), updateProductStatus);
router.post('/:id/images', upload.array('images', 5), addProductImages);
router.delete('/:id/images/:imageIndex', deleteProductImage);

// Get all products for the authenticated seller
router.get('/seller/me', getSellerProducts);

export default router;