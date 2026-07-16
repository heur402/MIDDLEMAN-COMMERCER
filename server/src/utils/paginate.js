/**
 * Build a Mongoose query with pagination and return the response shape.
 *
 * @param {import('mongoose').Model} Model
 * @param {object} query        Mongoose filter object
 * @param {object} options
 * @param {number} options.page      1-indexed page number (default 1)
 * @param {number} options.limit     Items per page (default 20, max 100)
 * @param {object} options.sort      Mongoose sort object  e.g. { createdAt: -1 }
 * @param {string|object} options.populate  Mongoose populate arg (optional)
 * @param {string} options.select   Fields to include/exclude (optional)
 * @returns {{ data: any[], pagination: object }}
 */
export async function paginate(Model, query = {}, options = {}) {
  const page  = Math.max(1, parseInt(options.page)  || 1)
  const limit = Math.min(100, Math.max(1, parseInt(options.limit) || 20))
  const skip  = (page - 1) * limit
  const sort  = options.sort  || { createdAt: -1 }

  let q = Model.find(query).sort(sort).skip(skip).limit(limit)
  if (options.select)   q = q.select(options.select)
  if (options.populate) q = q.populate(options.populate)

  const [data, total] = await Promise.all([q.lean(), Model.countDocuments(query)])

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    },
  }
}
