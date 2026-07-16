import { v2 as cloudinary } from 'cloudinary'
import { env } from './env.js'

export const cloudinaryEnabled =
  !!env.CLOUDINARY_CLOUD_NAME &&
  !!env.CLOUDINARY_API_KEY &&
  !!env.CLOUDINARY_API_SECRET

if (cloudinaryEnabled) {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
  })
  console.log('☁️   Cloudinary configured')
} else {
  console.log('📁  Cloudinary not configured – using local /uploads fallback')
}

export { cloudinary }
