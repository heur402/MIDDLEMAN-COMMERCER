import api from './axiosInstance'

export const disputesApi = {
  raise: (data) => api.post('/disputes', data),
  getMyDisputes: (params) => api.get('/disputes', { params }),
  getById: (id) => api.get(`/disputes/${id}`),
  getByOrder: (orderId) => api.get(`/disputes/order/${orderId}`),
  addEvidence: (id, formData) =>
    api.post(`/disputes/${id}/evidence`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
}
