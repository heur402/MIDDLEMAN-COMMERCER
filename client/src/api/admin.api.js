import api from './axiosInstance'

export const adminApi = {
  // Users
  getUsers:     (params) => api.get('/admin/users', { params }),
  getUserById:  (id)     => api.get(`/admin/users/${id}`),
  banUser:      (id, data) => api.patch(`/admin/users/${id}/ban`, data),
  updateUser:   (id, data) => api.patch(`/admin/users/${id}`, data),
  deleteUser:   (id)       => api.delete(`/admin/users/${id}`),

  // Listings
  getListings:      (params) => api.get('/admin/listings', { params }),
  deactivateListing:(id)     => api.patch(`/admin/listings/${id}/deactivate`),

  // Disputes
  getDisputes:    (params) => api.get('/admin/disputes', { params }),
  updateDispute:  (id, data) => api.patch(`/admin/disputes/${id}`, data),

  // Analytics
  getAnalytics: () => api.get('/admin/analytics'),
}
