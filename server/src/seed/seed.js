/**
 * Seed script — populates the DB with demo users, products, and orders.
 * Run with:  npm run seed
 */
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import { env } from '../config/env.js'
import { User } from '../models/User.js'
import { Category } from '../models/Category.js'
import { Product } from '../models/Product.js'
import { Order } from '../models/Order.js'

const SALT_ROUNDS = 10

async function seed() {
  await mongoose.connect(env.MONGO_URI)
  console.log('✅  Connected to MongoDB')

  // Clear existing seed data
  await Promise.all([
    User.deleteMany({ email: /@seed\.middleman\.com$/ }),
    Category.deleteMany({}),
    Product.deleteMany({ tags: 'seed' }),
    Order.deleteMany({ 'items.0.title': /Seed/ }),
  ])
  console.log('🧹  Cleared previous seed data')

  // ── Users ──────────────────────────────────────────────────────────────────
  const passwordHash = await bcrypt.hash('Password123!', SALT_ROUNDS)

  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@seed.middleman.com',
    passwordHash,
    roles: ['admin', 'buyer'],
    isVerified: true,
  })

  const seller1 = await User.create({
    name: 'Alice Seller',
    email: 'alice@seed.middleman.com',
    passwordHash,
    roles: ['seller', 'buyer'],
    isVerified: true,
    rating: 4.7,
    reviewCount: 12,
  })

  const seller2 = await User.create({
    name: 'Bob Seller',
    email: 'bob@seed.middleman.com',
    passwordHash,
    roles: ['seller', 'buyer'],
    isVerified: true,
    rating: 4.2,
    reviewCount: 8,
  })

  const buyer = await User.create({
    name: 'Charlie Buyer',
    email: 'charlie@seed.middleman.com',
    passwordHash,
    roles: ['buyer'],
    isVerified: true,
  })

  console.log('👤  Created 4 seed users')

  // ── Categories ─────────────────────────────────────────────────────────────
  const categoriesData = [
    { name: 'Electronics', slug: 'electronics', description: 'Gadgets, phones, computers, and accessories', createdBy: admin._id },
    { name: 'Clothing', slug: 'clothing', description: 'Men\'s, women\'s, and children\'s apparel', createdBy: admin._id },
    { name: 'Home & Garden', slug: 'home', description: 'Furniture, decor, kitchen, and outdoor products', createdBy: admin._id },
    { name: 'Beauty & Health', slug: 'beauty', description: 'Cosmetics, skincare, and personal care', createdBy: admin._id },
    { name: 'Sports & Outdoors', slug: 'sports', description: 'Fitness gear, outdoor equipment, and activewear', createdBy: admin._id },
    { name: 'Books', slug: 'books', description: 'Novels, textbooks, and guides', createdBy: admin._id },
  ]
  const seededCats = await Category.insertMany(categoriesData)
  console.log(`🏷️  Created ${seededCats.length} seed categories`)

  const catMap = {}
  seededCats.forEach((cat) => {
    catMap[cat.slug] = cat._id
  })

  // ── Products ───────────────────────────────────────────────────────────────
  const productData = [
    // Alice's products
    { sellerId: seller1._id, title: 'Wireless Bluetooth Headphones', description: 'Premium noise-cancelling headphones with 30-hour battery life and foldable design.', price: 49.99, originalPrice: 79.99, category: catMap['electronics'], condition: 'new', stock: 15, tags: ['seed', 'audio', 'wireless'] },
    { sellerId: seller1._id, title: 'Women\'s Casual Sundress', description: 'Lightweight floral sundress perfect for summer. Available in multiple colours.', price: 28.50, originalPrice: 45.00, category: catMap['clothing'], condition: 'new', stock: 30, tags: ['seed', 'fashion', 'summer'] },
    { sellerId: seller1._id, title: 'Stainless Steel Water Bottle 1L', description: 'Double-walled insulated bottle keeps drinks cold 24h or hot 12h.', price: 18.99, category: catMap['home'], condition: 'new', stock: 50, tags: ['seed', 'hydration'] },
    { sellerId: seller1._id, title: 'Portable Phone Stand', description: 'Adjustable aluminium phone stand for desk use. Compatible with all smartphones.', price: 12.00, category: catMap['electronics'], condition: 'new', stock: 40, tags: ['seed', 'accessories'] },
    { sellerId: seller1._id, title: 'Leather Wallet Slim', description: 'Genuine leather bifold wallet with RFID blocking. Holds up to 8 cards.', price: 22.00, category: catMap['clothing'], condition: 'new', stock: 20, tags: ['seed', 'accessories'] },
    // Bob's products
    { sellerId: seller2._id, title: 'Gaming Mouse RGB', description: 'High-precision 16000 DPI gaming mouse with programmable buttons and RGB lighting.', price: 35.00, category: catMap['electronics'], condition: 'new', stock: 25, tags: ['seed', 'gaming', 'peripherals'] },
    { sellerId: seller2._id, title: 'Yoga Mat Non-Slip', description: 'Extra-thick 6mm eco-friendly yoga mat with alignment lines and carrying strap.', price: 24.99, originalPrice: 39.99, category: catMap['sports'], condition: 'new', stock: 18, tags: ['seed', 'yoga', 'fitness'] },
    { sellerId: seller2._id, title: 'LED Desk Lamp', description: 'Touch-controlled LED desk lamp with 5 colour modes and USB charging port.', price: 29.95, category: catMap['home'], condition: 'new', stock: 12, tags: ['seed', 'lighting'] },
    { sellerId: seller2._id, title: 'Running Shoes Men\'s Size 42', description: 'Lightweight breathable running shoes. Good condition, worn 3 times.', price: 40.00, category: catMap['sports'], condition: 'like_new', stock: 1, tags: ['seed', 'running', 'shoes'] },
    { sellerId: seller2._id, title: 'Python Programming Book', description: 'Python Crash Course 3rd Edition — brand new, never opened.', price: 15.00, category: catMap['books'], condition: 'new', stock: 5, tags: ['seed', 'programming', 'python'] },
  ]

  const products = await Product.insertMany(productData)
  console.log(`📦  Created ${products.length} seed products`)

  // ── Orders ─────────────────────────────────────────────────────────────────
  const p1 = products[0] // Headphones — Alice
  const p6 = products[5] // Gaming Mouse — Bob

  const order1 = await Order.create({
    buyerId:  buyer._id,
    sellerId: seller1._id,
    items: [{
      productId: p1._id,
      sellerId:  seller1._id,
      title:     p1.title,
      price:     p1.price,
      image:     p1.images?.[0] ?? null,
      qty:       1,
    }],
    shippingAddress: { street: '123 Main St', city: 'Kigali', state: '', zip: '', country: 'Rwanda' },
    totalAmount:  p1.price,
    paymentStatus: 'unpaid',
    status:        'confirmed',
    timeline: [
      { status: 'pending',   timestamp: new Date(Date.now() - 86400000 * 3), note: 'Order placed'    },
      { status: 'confirmed', timestamp: new Date(Date.now() - 86400000 * 2), note: 'Seller confirmed' },
    ],
  })

  const order2 = await Order.create({
    buyerId:  buyer._id,
    sellerId: seller2._id,
    items: [{
      productId: p6._id,
      sellerId:  seller2._id,
      title:     p6.title,
      price:     p6.price,
      image:     p6.images?.[0] ?? null,
      qty:       1,
    }],
    shippingAddress: { street: '456 Hill Rd', city: 'Nairobi', state: '', zip: '', country: 'Kenya' },
    totalAmount:  p6.price,
    paymentStatus: 'unpaid',
    status:        'shipped',
    trackingNumber: 'DEMO1234567890',
    timeline: [
      { status: 'pending',   timestamp: new Date(Date.now() - 86400000 * 5), note: 'Order placed'    },
      { status: 'confirmed', timestamp: new Date(Date.now() - 86400000 * 4), note: 'Seller confirmed' },
      { status: 'shipped',   timestamp: new Date(Date.now() - 86400000 * 2), note: 'Tracking: DEMO1234567890' },
    ],
  })

  console.log(`🛒  Created 2 sample orders`)

  // ── Summary ────────────────────────────────────────────────────────────────
  console.log('\n🌱  Seed complete!')
  console.log('─'.repeat(50))
  console.log('Demo accounts (password: Password123!):')
  console.log(`  Admin:  admin@seed.middleman.com`)
  console.log(`  Seller: alice@seed.middleman.com`)
  console.log(`  Seller: bob@seed.middleman.com`)
  console.log(`  Buyer:  charlie@seed.middleman.com`)
  console.log('─'.repeat(50))

  await mongoose.disconnect()
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌  Seed failed:', err)
  process.exit(1)
})
