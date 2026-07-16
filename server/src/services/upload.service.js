import { cloudinary, cloudinaryEnabled } from '../config/cloudinary.js'
import { env } from '../config/env.js'
import path from 'path'

/**
 * Upload a single file buffer (from multer memoryStorage) to Cloudinary,
 * or return the local disk path when Cloudinary is not configured.
 *
 * @param {Express.Multer.File} file    Multer file object
 * @param {string} folder              Cloudinary folder / local subfolder
 * @returns {Promise<string>}          Public URL or local path
 */
export async function uploadFile(file, folder = 'misc') {
  if (cloudinaryEnabled) {
    return uploadToCloudinary(file.buffer, folder, file.mimetype)
  }
  // Local disk fallback — file is already saved by diskStorage middleware
  return localUrl(file.filename, folder)
}

/**
 * Upload multiple files.
 * @param {Express.Multer.File[]} files
 * @param {string} folder
 * @returns {Promise<string[]>}
 */
export async function uploadFiles(files = [], folder = 'misc') {
  return Promise.all(files.map((f) => uploadFile(f, folder)))
}

/**
 * Delete a file from Cloudinary by its public_id, or no-op for local.
 * @param {string} url  Full Cloudinary URL or local path
 */
export async function deleteFile(url) {
  if (!cloudinaryEnabled || !url) return
  try {
    // Extract public_id from URL:  .../folder/filename.ext  →  folder/filename
    const parts = url.split('/')
    const filename = parts[parts.length - 1].split('.')[0]
    const folder = parts[parts.length - 2]
    const publicId = `${folder}/${filename}`
    await cloudinary.uploader.destroy(publicId)
  } catch (err) {
    console.warn('Could not delete Cloudinary asset:', err.message)
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

async function uploadToCloudinary(buffer, folder, mimetype) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [{ width: 1200, crop: 'limit', quality: 'auto' }],
      },
      (error, result) => {
        if (error) return reject(error)
        resolve(result.secure_url)
      }
    )
    stream.end(buffer)
  })
}

function localUrl(filename, folder) {
  const base = env.CLIENT_ORIGIN ?? 'http://localhost:5000'
  return `/uploads/${folder}/${filename}`
}
