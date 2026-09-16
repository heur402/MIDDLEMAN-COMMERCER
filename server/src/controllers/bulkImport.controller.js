import mammoth from 'mammoth'
import { Product } from '../models/Product.js'
import { Category } from '../models/Category.js'
import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'

/**
 * Parse an HTML table (from mammoth) into an array of row objects.
 * First <tr> is treated as the header row.
 */
function parseHtmlTable(html) {
  const tableMatch = html.match(/<table[\s\S]*?<\/table>/i)
  if (!tableMatch) return null

  const rows = [...tableMatch[0].matchAll(/<tr[\s\S]*?<\/tr>/gi)]
  if (rows.length < 2) return null

  const headers = [...rows[0][0].matchAll(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/gi)]
    .map((m) => m[1].replace(/<[^>]+>/g, '').trim().toLowerCase())

  return rows.slice(1).map((row) => {
    const cells = [...row[0].matchAll(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/gi)]
      .map((m) => m[1].replace(/<[^>]+>/g, '').trim())
    return Object.fromEntries(headers.map((h, i) => [h, cells[i] ?? '']))
  }).filter((r) => Object.values(r).some(Boolean)) // skip blank rows
}

// ── POST /api/seller/listings/bulk-import ─────────────────────────────────────
export const bulkImportListings = asyncHandler(async (req, res) => {
  if (!req.file) throw ApiError.badRequest('No .docx file uploaded')

  const { value: html } = await mammoth.convertToHtml({ buffer: req.file.buffer })
  const rows = parseHtmlTable(html)
  if (!rows || rows.length === 0) throw ApiError.badRequest('No table data found in document')

  // Load all active categories for name→_id lookup
  const allCats = await Category.find({ isActive: true }).lean()
  const catMap = Object.fromEntries(allCats.map((c) => [c.name.toLowerCase(), c._id]))

  const CONDITIONS = ['new', 'like_new', 'good', 'fair', 'poor']
  const created = []
  const errors  = []

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    const rowNum = i + 2 // 1-indexed, +1 for header

    const title     = row['title'] || row['product name'] || row['name'] || ''
    const priceRaw  = row['price'] || ''
    const stockRaw  = row['stock'] || row['quantity'] || '1'
    const catName   = (row['category'] || '').toLowerCase()
    const condition = (row['condition'] || 'new').toLowerCase().replace(/\s+/g, '_')
    const desc      = row['description'] || row['desc'] || ''
    const status    = (row['status'] || 'draft').toLowerCase()
    const tagsRaw   = row['tags'] || ''

    if (!title) { errors.push(`Row ${rowNum}: title is required`); continue }

    const price = parseFloat(priceRaw)
    if (isNaN(price) || price < 0) { errors.push(`Row ${rowNum}: invalid price "${priceRaw}"`); continue }

    const stock = parseInt(stockRaw)
    if (isNaN(stock) || stock < 0) { errors.push(`Row ${rowNum}: invalid stock "${stockRaw}"`); continue }

    const categoryId = catMap[catName]
    if (!categoryId) { errors.push(`Row ${rowNum}: unknown category "${catName}"`); continue }

    const finalCondition = CONDITIONS.includes(condition) ? condition : 'new'
    const finalStatus    = ['published', 'draft'].includes(status) ? status : 'draft'
    const tags = tagsRaw ? tagsRaw.split(',').map((t) => t.trim()).filter(Boolean) : []

    try {
      const product = await Product.create({
        sellerId:    req.user.userId,
        title,
        description: desc,
        price,
        stock,
        category:    categoryId,
        condition:   finalCondition,
        status:      finalStatus,
        tags,
        images:      [],
      })
      created.push(product._id)
    } catch (err) {
      errors.push(`Row ${rowNum}: ${err.message}`)
    }
  }

  res.status(201).json({
    success: true,
    message: `${created.length} listing(s) created, ${errors.length} skipped`,
    data: { created: created.length, errors },
  })
})

// ── POST /api/admin/categories/bulk-import ────────────────────────────────────
export const bulkImportCategories = asyncHandler(async (req, res) => {
  if (!req.file) throw ApiError.badRequest('No .docx file uploaded')

  const { value: html } = await mammoth.convertToHtml({ buffer: req.file.buffer })
  const rows = parseHtmlTable(html)
  if (!rows || rows.length === 0) throw ApiError.badRequest('No table data found in document')

  function slugify(str) {
    return str.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  }

  const created = []
  const errors  = []

  for (let i = 0; i < rows.length; i++) {
    const row    = rows[i]
    const rowNum = i + 2

    const name = row['name'] || row['category name'] || row['category'] || ''
    const desc = row['description'] || row['desc'] || ''
    const icon = row['icon'] || row['emoji'] || null
    const isActiveRaw = (row['active'] || row['status'] || 'true').toLowerCase()
    const isActive = !['false', 'no', '0', 'inactive'].includes(isActiveRaw)

    if (!name) { errors.push(`Row ${rowNum}: name is required`); continue }

    const slug = slugify(name)
    const existing = await Category.findOne({ slug })
    if (existing) { errors.push(`Row ${rowNum}: category "${name}" already exists`); continue }

    try {
      const cat = await Category.create({
        name,
        slug,
        description: desc,
        icon:        icon || null,
        isActive,
        createdBy:   req.user.userId,
      })
      created.push(cat._id)
    } catch (err) {
      errors.push(`Row ${rowNum}: ${err.message}`)
    }
  }

  res.status(201).json({
    success: true,
    message: `${created.length} categor${created.length === 1 ? 'y' : 'ies'} created, ${errors.length} skipped`,
    data: { created: created.length, errors },
  })
})
