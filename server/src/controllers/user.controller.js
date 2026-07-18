import { User } from '../models/User.js'
import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { uploadSingle } from '../middleware/upload.js'
import { uploadFile } from '../services/upload.service.js'

// GET /api/users/me
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.userId).select('-passwordHash -__v')
  if (!user) throw ApiError.notFound('User not found')
  res.json({ success: true, data: user })
})

// PUT /api/users/me
export const updateMe = asyncHandler(async (req, res) => {
  const { name, phone } = req.body
  const user = await User.findByIdAndUpdate(
    req.user.userId,
    { $set: { name, phone } },
    { new: true, runValidators: true }
  ).select('-passwordHash -__v')
  res.json({ success: true, data: user })
})

// POST /api/users/me/become-seller
export const becomeSeller = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.userId)
  if (!user) throw ApiError.notFound('User not found')
  if (user.roles.includes('seller')) throw ApiError.conflict('Already a seller')
  user.roles.push('seller')
  await user.save()
  res.json({ success: true, data: user.toPublicJSON() })
})

// POST /api/users/me/addresses
export const addAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.userId)
  if (!user) throw ApiError.notFound('User not found')
  // If new address is default, unset others
  if (req.body.isDefault) {
    user.addresses.forEach((a) => { a.isDefault = false })
  }
  user.addresses.push(req.body)
  await user.save()
  res.status(201).json({ success: true, data: user.toPublicJSON() })
})

// PUT /api/users/me/addresses/:addressId
export const updateAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.userId)
  if (!user) throw ApiError.notFound('User not found')
  const addr = user.addresses.id(req.params.addressId)
  if (!addr) throw ApiError.notFound('Address not found')
  if (req.body.isDefault) {
    user.addresses.forEach((a) => { a.isDefault = false })
  }
  Object.assign(addr, req.body)
  await user.save()
  res.json({ success: true, data: user.toPublicJSON() })
})

// DELETE /api/users/me/addresses/:addressId
export const deleteAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.userId)
  if (!user) throw ApiError.notFound('User not found')
  user.addresses = user.addresses.filter(
    (a) => a._id.toString() !== req.params.addressId
  )
  await user.save()
  res.json({ success: true, data: user.toPublicJSON() })
})
