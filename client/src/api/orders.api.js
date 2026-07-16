import api from './axiosInstance'

export const ordersApi = {
  // Buyer
  place: (data) => api.post('/orders', data),
  getMyOrders: (params) => api.get('/orders', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  markDelivered: (id) => api.patch(`/orders/${id}/deliver`),

  // Seller
  getSellerOrders: (params) => api.get('/seller/orders', { params }),
  getSellerOrderById: (id) => api.get(`/seller/orders/${id}`),
  updateStatus: (id, data) => api.patch(`/seller/orders/${id}/status`, data),
  getEarnings: () => api.get('/seller/earnings'),
}
