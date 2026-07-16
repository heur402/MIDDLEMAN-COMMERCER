import api from './axiosInstance'

export const conversationsApi = {
  list: () => api.get('/conversations'),
  start: (data) => api.post('/conversations', data),
  getById: (id) => api.get(`/conversations/${id}`),
  sendMessage: (id, data) => api.post(`/conversations/${id}/messages`, data),
}
