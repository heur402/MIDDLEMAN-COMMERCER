import api from './axiosInstance'

export const ordersApi = {
  // ── Guest + authenticated ──────────────────────────────────────────────────
  // guestBuyer: { name, email, phone } — required when not logged in
  place: (data) => api.post('/orders', data),

  // Track a guest order by orderId + email (no auth)
  trackGuest: (orderId, email) =>
    api.get('/orders/track', { params: { orderId, email } }),

  // Mark delivered — guest passes email as query param
  markDelivered: (id, email) =>
    api.patch(`/orders/${id}/deliver`, null, email ? { params: { email } } : {}),

  // ── Authenticated buyers only ──────────────────────────────────────────────
  getMyOrders: (params) => api.get('/orders', { params }),
  getById:     (id)     => api.get(`/orders/${id}`),

  // ── Seller ─────────────────────────────────────────────────────────────────
  getSellerOrders:    (params) => api.get('/seller/orders', { params }),
  getSellerOrderById: (id)     => api.get(`/seller/orders/${id}`),
  updateStatus:       (id, data) => api.patch(`/seller/orders/${id}/status`, data),
  getEarnings:        ()       => api.get('/seller/earnings'),
}
