import api from './api';

export const authApi = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  getStudentProfile: async () => {
    const response = await api.get('/students/me');
    return response.data;
  },

  updateStudentProfile: async (data) => {
    const response = await api.put('/students/me', data);
    return response.data;
  },
};
