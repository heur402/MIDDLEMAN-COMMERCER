import { Router } from 'express'
import {
  listUsers, getUser, banUser, updateUser, deleteUser, notifyUser,
  listAllListings, deactivateListing,
  listAllDisputes, updateDispute,
  getAnalytics, listSentNotifications,
} from '../controllers/admin.controller.js'
import { bulkImportCategories } from '../controllers/bulkImport.controller.js'
import { downloadCategoriesTemplate } from '../controllers/template.controller.js'
import { verifyToken } from '../middleware/auth.js'
import { requireRoles } from '../middleware/requireRoles.js'
import { validate } from '../middleware/validate.js'
import { uploadDocx } from '../middleware/upload.js'
import { updateDisputeSchema } from '../schemas/dispute.schema.js'
import { adminUpdateUserSchema } from '../schemas/user.schema.js'

const router = Router()

router.use(verifyToken)
router.use(requireRoles('admin'))

// Users
router.get('/users',              listUsers)
router.get('/users/:id',          getUser)
router.patch('/users/:id',        validate(adminUpdateUserSchema), updateUser)
router.delete('/users/:id',       deleteUser)
router.patch('/users/:id/ban',    banUser)
router.post('/users/:id/notify',  notifyUser)
router.get('/notifications',     listSentNotifications)

// Listings
router.get('/listings',                  listAllListings)
router.patch('/listings/:id/deactivate', deactivateListing)

// Disputes
router.get('/disputes',       listAllDisputes)
router.patch('/disputes/:id', validate(updateDisputeSchema), updateDispute)

// Analytics
router.get('/analytics', getAnalytics)

// Categories bulk import + template
router.get('/categories/template',     downloadCategoriesTemplate)
router.post('/categories/bulk-import', uploadDocx('file'), bulkImportCategories)

export default router
