import { Router } from 'express'
import {
  getMyListings, createListing, updateListing, deleteListing,
  uploadImages, removeImage,
  getSellerOrders, getSellerOrder, updateOrderStatus,
  getEarnings,
} from '../controllers/seller.controller.js'
import { bulkImportListings } from '../controllers/bulkImport.controller.js'
import { downloadListingsTemplate } from '../controllers/template.controller.js'
import { verifyToken } from '../middleware/auth.js'
import { requireRoles } from '../middleware/requireRoles.js'
import { validate } from '../middleware/validate.js'
import { uploadMiddleware, uploadDocx } from '../middleware/upload.js'
import { createProductSchema, updateProductSchema } from '../schemas/product.schema.js'
import { updateOrderStatusSchema } from '../schemas/order.schema.js'

const router = Router()

router.use(verifyToken)
router.use(requireRoles('seller'))

// ── Listings ──────────────────────────────────────────────────────────────────
router.get('/listings',                      getMyListings)
router.get('/listings/template',             downloadListingsTemplate)
router.post('/listings/bulk-import',         uploadDocx('file'), bulkImportListings)
router.post('/listings',                     validate(createProductSchema), createListing)
router.put('/listings/:id',                  validate(updateProductSchema), updateListing)
router.delete('/listings/:id',               deleteListing)
router.post('/listings/:id/images',          uploadMiddleware('products', 5), uploadImages)
router.delete('/listings/:id/images/:index', removeImage)

// ── Orders ────────────────────────────────────────────────────────────────────
router.get('/orders',              getSellerOrders)
router.get('/orders/:id',          getSellerOrder)
router.patch('/orders/:id/status', validate(updateOrderStatusSchema), updateOrderStatus)

// ── Earnings ──────────────────────────────────────────────────────────────────
router.get('/earnings', getEarnings)

export default router
