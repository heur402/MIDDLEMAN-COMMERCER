import api from './axiosInstance'

export const sellerApi = {
  getStorefront: (sellerId) => api.get(`/storefront/${sellerId}`),
}
