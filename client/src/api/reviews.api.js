import api from './axiosInstance'

export const reviewsApi = {
  create: (data) => api.post('/reviews', data),
  forSeller: (sellerId, params) => api.get(`/reviews/seller/${sellerId}`, { params }),
  forProduct: (productId, params) => api.get(`/reviews/product/${productId}`, { params }),
}
