import { Router } from 'express'
import {
  listCategories, listAllCategories,
  createCategory, updateCategory, deleteCategory,
} from '../controllers/category.controller.js'
import { verifyToken } from '../middleware/auth.js'
import { requireRoles } from '../middleware/requireRoles.js'
import { validate } from '../middleware/validate.js'
import { createCategorySchema, updateCategorySchema } from '../schemas/category.schema.js'

const router = Router()

// ── Public ────────────────────────────────────────────────────────────────────
router.get('/', listCategories)

// ── Admin only ────────────────────────────────────────────────────────────────
router.get('/all',    verifyToken, requireRoles('admin'), listAllCategories)
router.post('/',      verifyToken, requireRoles('admin'), validate(createCategorySchema), createCategory)
router.put('/:id',    verifyToken, requireRoles('admin'), validate(updateCategorySchema), updateCategory)
router.delete('/:id', verifyToken, requireRoles('admin'), deleteCategory)

export default router
