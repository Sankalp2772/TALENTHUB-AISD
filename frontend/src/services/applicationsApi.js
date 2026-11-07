import api from './api';

export const applicationsApi = {
  getApplications: async () => {
    const response = await api.get('/applications');
    return response.data;
  },

  getApplicationById: async (applicationId) => {
    const response = await api.get(`/applications/${applicationId}`);
    return response.data;
  },

  applyForJob: async (jobId) => {
    const response = await api.post('/applications', { job_id: jobId });
    return response.data;
  },

  updateStatus: async (applicationId, status) => {
    const response = await api.patch(`/applications/${applicationId}/status`, { status });
    return response.data;
  },
};
