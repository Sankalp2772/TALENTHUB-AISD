import api from './api';

export const interviewsApi = {
  getInterviews: async () => {
    const response = await api.get('/interviews');
    return response.data;
  },

  createInterview: async (interviewData) => {
    const response = await api.post('/interviews', interviewData);
    return response.data;
  },

  updateInterview: async (interviewId, updateData) => {
    const response = await api.put(`/interviews/${interviewId}`, updateData);
    return response.data;
  },
};
