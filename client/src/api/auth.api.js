import api from './axiosInstance'

export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  refresh: () => api.post('/auth/refresh'),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/users/me'),
  updateMe: (data) => api.put('/users/me', data),
  uploadAvatar: (formData) => api.post('/users/me/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  becomeSeller: () => api.post('/users/me/become-seller'),
  getNotifications: () => api.get('/users/me/notifications'),
  markNotificationRead: (id) => api.patch(`/users/me/notifications/${id}/read`),
}
