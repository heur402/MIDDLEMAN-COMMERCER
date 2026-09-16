import api from './axiosInstance'

export const sellerApi = {
  getStorefront: (sellerId) => api.get(`/storefront/${sellerId}`),

  downloadListingsTemplate: () =>
    api.get('/seller/listings/template', { responseType: 'blob' }),

  bulkImportListings: (formData) =>
    api.post('/seller/listings/bulk-import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  downloadCategoriesTemplate: () =>
    api.get('/admin/categories/template', { responseType: 'blob' }),

  bulkImportCategories: (formData) =>
    api.post('/admin/categories/bulk-import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
}
