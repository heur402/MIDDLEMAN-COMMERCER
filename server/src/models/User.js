import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const addressSchema = new mongoose.Schema(
  {
    label:     { type: String, default: 'Home' },
    street:    { type: String, required: true },
    city:      { type: String, required: true },
    state:     { type: String, default: '' },
    zip:       { type: String, default: '' },
    country:   { type: String, required: true },
    isDefault: { type: Boolean, default: false },
  },
  { _id: true }
)

const userSchema = new mongoose.Schema(
  {
    name:         { type: String, required: true, trim: true, minlength: 2, maxlength: 60 },
    email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    roles:        { type: [String], enum: ['buyer', 'seller', 'admin'], default: ['buyer'] },
    avatar:       { type: String, default: null },
    phone:        { type: String, default: null },
    addresses:    { type: [addressSchema], default: [] },
    isVerified:   { type: Boolean, default: false },
    isBanned:     { type: Boolean, default: false },
    rating:       { type: Number, default: 0, min: 0, max: 5 },
    reviewCount:  { type: Number, default: 0 },
  },
  { timestamps: true }
)

// ── Indexes ───────────────────────────────────────────────────────────────────
userSchema.index({ email: 1 }, { unique: true })

// ── Instance helpers ──────────────────────────────────────────────────────────
userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.passwordHash)
}

/** Strip sensitive fields before returning to client */
userSchema.methods.toPublicJSON = function () {
  const obj = this.toObject()
  delete obj.passwordHash
  delete obj.__v
  return obj
}

export const User = mongoose.model('User', userSchema)
