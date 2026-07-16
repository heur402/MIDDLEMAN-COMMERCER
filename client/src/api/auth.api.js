import api from './axiosInstance'

export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  refresh: () => api.post('/auth/refresh'),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/users/me'),
  updateMe: (data) => api.put('/users/me', data),
  becomeSeller: () => api.post('/users/me/become-seller'),
}
