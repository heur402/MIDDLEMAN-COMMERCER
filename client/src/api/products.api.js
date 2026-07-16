import api from './axiosInstance'

export const productsApi = {
  // Public
  list: (params) => api.get('/products', { params }),
  search: (params) => api.get('/products/search', { params }),
  getById: (id) => api.get(`/products/${id}`),

  // Seller CRUD
  getMyListings: (params) => api.get('/seller/listings', { params }),
  create: (data) => api.post('/seller/listings', data),
  update: (id, data) => api.put(`/seller/listings/${id}`, data),
  remove: (id) => api.delete(`/seller/listings/${id}`),
  uploadImages: (id, formData) =>
    api.post(`/seller/listings/${id}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  removeImage: (id, imageIndex) =>
    api.delete(`/seller/listings/${id}/images/${imageIndex}`),
}
