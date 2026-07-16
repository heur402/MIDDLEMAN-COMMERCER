import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { ApiError } from '../utils/ApiError.js'
import { cloudinaryEnabled } from '../config/cloudinary.js'

// ── Allowed MIME types ────────────────────────────────────────────────────────
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB

function fileFilter(_req, file, cb) {
  if (ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(ApiError.badRequest('Only JPG, PNG, and WEBP images are allowed'), false)
  }
}

// ── Storage: memory (for Cloudinary upload) ───────────────────────────────────
const memoryStorage = multer.memoryStorage()

// ── Storage: disk (local fallback) ───────────────────────────────────────────
function diskStorage(folder) {
  const uploadPath = path.join(process.cwd(), 'uploads', folder)
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true })
  }
  return multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadPath),
    filename: (_req, file, cb) => {
      const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
      cb(null, `${unique}${path.extname(file.originalname)}`)
    },
  })
}

/**
 * Create a multer middleware for a specific upload folder.
 * Uses memory storage when Cloudinary is configured,
 * disk storage otherwise.
 *
 * @param {string} folder  e.g. 'products', 'avatars', 'evidence'
 * @param {number} maxFiles  Maximum number of files per request
 */
export function uploadMiddleware(folder = 'misc', maxFiles = 5) {
  const storage = cloudinaryEnabled ? memoryStorage : diskStorage(folder)
  return multer({
    storage,
    fileFilter,
    limits: { fileSize: MAX_SIZE_BYTES },
  }).array('images', maxFiles)
}

/** Single-file upload middleware (e.g. avatar) */
export function uploadSingle(folder = 'misc', fieldName = 'image') {
  const storage = cloudinaryEnabled ? memoryStorage : diskStorage(folder)
  return multer({
    storage,
    fileFilter,
    limits: { fileSize: MAX_SIZE_BYTES },
  }).single(fieldName)
}
