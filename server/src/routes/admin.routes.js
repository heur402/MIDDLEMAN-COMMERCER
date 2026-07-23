import { Router } from 'express'
import {
  listUsers, getUser, banUser, updateUser, deleteUser,
  listAllListings, deactivateListing,
  listAllDisputes, updateDispute,
  getAnalytics,
} from '../controllers/admin.controller.js'
import { verifyToken } from '../middleware/auth.js'
import { requireRoles } from '../middleware/requireRoles.js'
import { validate } from '../middleware/validate.js'
import { updateDisputeSchema } from '../schemas/dispute.schema.js'
import { adminUpdateUserSchema } from '../schemas/user.schema.js'

const router = Router()

// All admin routes require auth + admin role
router.use(verifyToken)
router.use(requireRoles('admin'))

// Users
router.get('/users',             listUsers)
router.get('/users/:id',         getUser)
router.patch('/users/:id',       validate(adminUpdateUserSchema), updateUser)
router.delete('/users/:id',      deleteUser)
router.patch('/users/:id/ban',   banUser)

// Listings
router.get('/listings',                    listAllListings)
router.patch('/listings/:id/deactivate',   deactivateListing)

// Disputes
router.get('/disputes',      listAllDisputes)
router.patch('/disputes/:id', validate(updateDisputeSchema), updateDispute)

// Analytics
router.get('/analytics', getAnalytics)

export default router
