import api from './axiosInstance'

export const categoriesApi = {
  // Public
  list: () => api.get('/categories'),

  // Admin Only
  listAll: () => api.get('/categories/all'),
  create:  (data) => api.post('/categories', data),
  update:  (id, data) => api.put(`/categories/${id}`, data),
  remove:  (id) => api.delete(`/categories/${id}`),
}
